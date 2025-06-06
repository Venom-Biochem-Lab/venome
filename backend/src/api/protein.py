import logging as log
import os
from base64 import b64decode
from io import StringIO
from Bio.PDB import PDBParser
from Bio.SeqUtils import molecular_weight, seq1
from ..db import Database, bytea_to_str, str_to_bytea
from fastapi.exceptions import HTTPException

from ..api_types import (
    ProteinEntry,
    ProteinBody,
    UploadError,
    EditBody,
    CamelModel,
    UploadBody,
    RequestBody,
    AuthType,
    RequestStatus,
    FullProteinInfo,
    RequestBodyEdit,
    UserResponse,
)
from ..tmalign import tm_align_return
from ..auth import requires_authentication
from io import BytesIO
from fastapi import APIRouter, File, Form, UploadFile
from fastapi.responses import FileResponse, StreamingResponse
from fastapi.requests import Request
import re

router = APIRouter()


class PDB:
    def __init__(self, file_contents, name=""):
        self.name = name
        self.file_contents = file_contents

        try:
            self.parser = PDBParser()
            self.structure = self.parser.get_structure(
                id=name, file=StringIO(file_contents)
            )
        except Exception as e:
            raise e  # raise to the user who calls this PDB class

    @property
    def num_amino_acids(self) -> int:
        return len(self.amino_acids())

    @property
    def mass_daltons(self):
        return molecular_weight(seq="".join(self.amino_acids()), seq_type="protein")

    @property
    def num_atoms(self) -> int:
        count = 0
        for atom in self.atoms():
            count += 1
        return count

    def amino_acids(self, one_letter_code=True):
        return [
            seq1(residue.resname) if one_letter_code else residue.resname
            for residue in self.structure.get_residues()
        ]

    def atoms(self):
        return self.structure.get_atoms()


def decode_base64(b64_header_and_data: str):
    """Converts a base64 string to bytes"""
    # only decode after the header (data:application/octet-stream;base64,)
    end_of_header = b64_header_and_data.index(",")
    b64_data_only = b64_header_and_data[end_of_header:]
    return b64decode(b64_data_only).decode("utf-8")


def stored_pdb_file_name(protein_name: str):
    return os.path.join("src/data/stored_proteins", protein_name) + ".pdb"


def stored_af3_file_name(protein_name: str):
    return os.path.join("src/data/stored_proteins/af3", protein_name) + ".cif"


def parse_protein_pdb(
    name: str, file_contents: str = "", encoding="str", file_type="pdb"
):
    if encoding == "str":
        return PDB(file_contents, name)
    elif encoding == "b64":
        return PDB(decode_base64(file_contents), name)
    elif encoding == "file":
        if file_type == "pdb":
            return PDB(open(stored_pdb_file_name(name), "r").read(), name)
        elif file_type == "cif":
            return PDB(open(stored_af3_file_name(name), "r").read(), name)
    else:
        raise ValueError(f"Invalid encoding: {encoding}")


def format_protein_name(name: str):
    name = name.replace(" ", "_")
    return name


def protein_name_found(name: str):
    """Checks if a protein name already exists in the database
    Returns: True if exists | False if not exists
    """
    with Database() as db:
        try:
            entry_sql = db.execute_return(
                """SELECT name FROM proteins
                    WHERE name = %s""",
                [name],
            )

            # if we got a result back
            return entry_sql is not None and len(entry_sql) != 0

        except Exception:
            return False


def pdb_to_fasta(pdb: PDB):
    return ">{}\n{}".format(pdb.name, "".join(pdb.amino_acids()))


def str_as_file_stream(input_str: str, filename_as: str) -> StreamingResponse:
    return StreamingResponse(
        BytesIO(input_str.encode()),
        media_type="text/plain",
        headers={"Content-Disposition": f"attachment; filename={filename_as}"},
    )


def get_residue_bfactors(pdb: PDB):
    chains = {}
    for chain in pdb.structure.get_chains():
        chains[chain.get_id()] = []
        for r in chain.get_residues():
            for a in r.get_atoms():
                chains[chain.get_id()].append(a.bfactor)
                break
    return chains


"""
    ENDPOINTS TODO: add the other protein types here instead of in api_types.py
"""


@router.get("/protein/pLDDT/{protein_name:str}", response_model=dict[str, list[float]])
def get_pLDDT_given_protein(protein_name: str):
    if protein_name_found(protein_name):
        pdb = parse_protein_pdb(protein_name, encoding="file")
        return get_residue_bfactors(pdb)
    return {}


class UploadPNGBody(CamelModel):
    protein_name: str
    base64_encoding: str


@router.get("/protein/pdb/{protein_name:str}")
def get_pdb_file(protein_name: str):
    if protein_name_found(protein_name):
        return FileResponse(
            stored_pdb_file_name(protein_name), filename=protein_name + ".pdb"
        )


@router.get("/protein/fasta/{protein_name:str}")
def get_fasta_file(protein_name: str):
    if protein_name_found(protein_name):
        pdb = parse_protein_pdb(protein_name, encoding="file")
        fasta = pdb_to_fasta(pdb)
        return StreamingResponse(
            BytesIO(fasta.encode()),
            media_type="text/plain",
            headers={
                "Content-Disposition": f"attachment; filename={protein_name}.fasta"
            },
        )


@router.get("/protein/entry/{protein_name:str}", response_model=ProteinEntry | None)
def get_protein_entry(protein_name: str):
    """Get a single protein entry by its id
    Returns: ProteinEntry if found | None if not found
    """
    with Database() as db:
        try:
            query = """SELECT proteins.name, 
                              proteins.description,
                              proteins.length, 
                              proteins.mass, 
                              proteins.atoms,
                              proteins.content, 
                              proteins.refs, 
                              species.name,
                              proteins.thumbnail,
                              proteins.date_published
                       FROM proteins
                       JOIN species ON species.id = proteins.species_id
                       WHERE proteins.name = %s;"""
            entry_sql = db.execute_return(query, [protein_name])

            # if we got a result back
            if entry_sql is not None and len(entry_sql) != 0:
                # return the only entry
                only_returned_entry = entry_sql[0]
                (
                    name,
                    description,
                    length,
                    mass,
                    atoms,
                    content,
                    refs,
                    species_name,
                    thumbnail,
                    date_published,
                ) = only_returned_entry

                if thumbnail is not None:
                    # if byte arrays are present, decode them into a string
                    thumbnail = bytea_to_str(thumbnail)

                if date_published is not None:
                    # forces the datetime object into a linux utc string
                    date_published = str(date_published)

                return ProteinEntry(
                    name=name,
                    description=description,
                    length=length,
                    mass=mass,
                    atoms=atoms,
                    content=content,
                    refs=refs,
                    species_name=species_name,
                    thumbnail=thumbnail,
                    date_published=date_published,
                )

        except Exception as e:
            log.error(e)


@router.get("/protein/entry/{protein_name:str}/user", response_model=UserResponse)
def get_protein_entry_user(protein_name: str):
    with Database() as db:
        try:
            query = """SELECT users.id, users.username, users.email, users.admin
                       FROM users
                       JOIN requests ON requests.user_id = users.id
                       JOIN proteins ON proteins.id = requests.protein_id
                       WHERE proteins.name = %s;"""
            user_sql = db.execute_return(query, [protein_name])

            if user_sql is not None and len(user_sql) != 0:
                user = user_sql[0]
                return UserResponse(
                    id=user[0], username=user[1], email=user[2], admin=user[3]
                )
        except Exception as e:
            log.error(e)


# TODO: add permissions so only the creator can delete not just anyone
@router.delete("/protein/entry/{protein_name:str}", response_model=None)
def delete_protein_entry(protein_name: str, req: Request):
    requires_authentication(AuthType.ADMIN, req)
    # Todo, have a meaningful error if the delete fails
    with Database() as db:
        # remove protein
        try:
            db.execute(
                """DELETE FROM proteins
                    WHERE name = %s""",
                [protein_name],
            )
            # delete the file from the data/ folder
            os.remove(stored_pdb_file_name(protein_name))
        except Exception as e:
            log.error(e)


@router.get("/protein/entries", response_model=list[ProteinEntry])
def get_all_protein_entries():
    """Get all protein entries
    Returns: List of ProteinEntry objects
    """
    with Database() as db:
        try:
            query = """SELECT
                        proteins.name,
                        proteins.description,
                        proteins.length,
                        proteins.mass,
                        proteins.atoms,
                        proteins.content,
                        proteins.refs,
                        species.name,
                        proteins.thumbnail,
                        proteins.date_published
                        FROM proteins
                        JOIN species ON species.id = proteins.species_id
                        WHERE EXISTS (
                            SELECT 1
                            FROM requests
                            WHERE protein_id = proteins.id
                            AND status_type = 'Approved'
                        );"""
            entries_sql = db.execute_return(query)

            # if we got a result back
            if entries_sql is not None and len(entries_sql) != 0:
                entries = []
                for entry in entries_sql:
                    (
                        name,
                        description,
                        length,
                        mass,
                        atoms,
                        content,
                        refs,
                        species_name,
                        thumbnail,
                        date_published,
                    ) = entry

                    if thumbnail is not None:
                        # if byte arrays are present, decode them into a string
                        thumbnail = bytea_to_str(thumbnail)

                    if date_published is not None:
                        # forces the datetime object into a linux utc string
                        date_published = str(date_published)

                    entries.append(
                        ProteinEntry(
                            name=name,
                            description=description,
                            length=length,
                            mass=mass,
                            atoms=atoms,
                            content=content,
                            refs=refs,
                            species_name=species_name,
                            thumbnail=thumbnail,
                            date_published=date_published,
                        )
                    )
                return entries
            else:
                return []

        except Exception as e:
            log.error(e)


@router.get("/protein/entries/pending", response_model=list[ProteinEntry])
def get_all_pending_protein_entries(req: Request):
    requires_authentication(AuthType.ADMIN, req)
    with Database() as db:
        try:
            query = """SELECT
                        proteins.name,
                        proteins.description,
                        proteins.length,
                        proteins.mass,
                        proteins.atoms,
                        proteins.content,
                        proteins.refs,
                        species.name,
                        proteins.thumbnail,
                        proteins.date_published
                        FROM proteins
                        JOIN species ON species.id = proteins.species_id
                        WHERE EXISTS (
                            SELECT 1
                            FROM requests
                            WHERE protein_id = proteins.id
                            AND status_type = 'Pending'
                        );"""
            entries_sql = db.execute_return(query)

            # if we got a result back
            if entries_sql is not None and len(entries_sql) != 0:
                entries = []
                for entry in entries_sql:
                    (
                        name,
                        description,
                        length,
                        mass,
                        atoms,
                        content,
                        refs,
                        species_name,
                        thumbnail,
                        date_published,
                    ) = entry

                    if thumbnail is not None:
                        # if byte arrays are present, decode them into a string
                        thumbnail = bytea_to_str(thumbnail)

                    if date_published is not None:
                        # forces the datetime object into a linux utc string
                        date_published = str(date_published)

                    entries.append(
                        ProteinEntry(
                            name=name,
                            description=description,
                            length=length,
                            mass=mass,
                            atoms=atoms,
                            content=content,
                            refs=refs,
                            species_name=species_name,
                            thumbnail=thumbnail,
                            date_published=date_published,
                        )
                    )
                return entries
            else:
                return []

        except Exception as e:
            log.error(e)
            return []


@router.get("/protein/entries/denied", response_model=list[ProteinEntry])
def get_all_denied_protein_entries(req: Request):
    requires_authentication(AuthType.ADMIN, req)
    with Database() as db:
        try:
            query = """SELECT 
                        proteins.name, 
                        proteins.description, 
                        proteins.length, 
                        proteins.mass, 
                        proteins.atoms,
                        proteins.content, 
                        proteins.refs, 
                        species.name,
                        proteins.thumbnail,
                        proteins.date_published
                        FROM proteins
                        JOIN species ON species.id = proteins.species_id
                        WHERE EXISTS (
                            SELECT 1
                            FROM requests
                            WHERE protein_id = proteins.id
                            AND status_type = 'Denied'
                        );"""
            entries_sql = db.execute_return(query)

            # if we got a result back
            if entries_sql is not None and len(entries_sql) != 0:
                entries = []
                for entry in entries_sql:
                    (
                        name,
                        description,
                        length,
                        mass,
                        atoms,
                        content,
                        refs,
                        species_name,
                        thumbnail,
                        date_published,
                    ) = entry

                    if thumbnail is not None:
                        # if byte arrays are present, decode them into a string
                        thumbnail = bytea_to_str(thumbnail)

                    if date_published is not None:
                        # forces the datetime object into a linux utc string
                        date_published = str(date_published)

                    entries.append(
                        ProteinEntry(
                            name=name,
                            description=description,
                            length=length,
                            mass=mass,
                            atoms=atoms,
                            content=content,
                            refs=refs,
                            species_name=species_name,
                            thumbnail=thumbnail,
                            date_published=date_published,
                        )
                    )
                return entries
            else:
                return []

        except Exception as e:
            log.error(e)
            return []


@router.post("/protein/upload/png", response_model=None)
def upload_protein_png(body: UploadPNGBody, req: Request):
    requires_authentication(AuthType.USER, req)
    with Database() as db:
        try:
            query = """UPDATE proteins SET thumbnail = %s WHERE name = %s"""
            db.execute(query, [str_to_bytea(body.base64_encoding), body.protein_name])
        except Exception as e:
            log.error(e)


# None return means success
@router.post("/protein/add", response_model=UploadError | None)
def add_protein_entry(body: ProteinBody, req: Request):
    requires_authentication(AuthType.USER, req)

    body.name = format_protein_name(body.name)
    # check that the name is not already taken in the DB
    if protein_name_found(body.name):
        return UploadError.NAME_NOT_UNIQUE

    # if name is unique, save the pdb file and add the entry to the database
    try:
        # TODO: consider somehow sending the file as a stream instead of a b64 string or send as regular string
        pdb = parse_protein_pdb(body.name, body.pdb_file_str)
    except Exception:
        return UploadError.PARSE_ERROR
    try:
        # write to file to data/ folder
        with open(stored_pdb_file_name(pdb.name), "w") as f:
            f.write(pdb.file_contents)
    except Exception:
        log.warn("Failed to write to file")
        return UploadError.WRITE_ERROR

    # save to db
    with Database() as db:
        try:
            # first add the species if it doesn't exist
            db.execute(
                """INSERT INTO species (name) VALUES (%s) ON CONFLICT DO NOTHING;""",
                [body.species_name],
            )
        except Exception:
            log.warn("Failed to insert into species table")
            return UploadError.QUERY_ERROR

        try:
            # add the protein itself
            query = """INSERT INTO proteins (name, description, length, mass, atoms, content, refs, species_id) 
                       VALUES (%s, %s, %s, %s, %s, %s, %s, (SELECT id FROM species WHERE name = %s));"""
            db.execute(
                query,
                [
                    pdb.name,
                    body.description,
                    pdb.num_amino_acids,
                    pdb.mass_daltons,
                    pdb.num_atoms,
                    body.content,
                    body.refs,
                    body.species_name,
                ],
            )
        except Exception as e:
            log.warn("Failed to insert into proteins table")
            log.error(e)
            return UploadError.QUERY_ERROR


@router.post("/protein/upload", response_model=UploadError | None)
def upload_protein_entry(body: UploadBody, req: Request):
    # Wrapper that adds a protein entry then creates an approved request
    requires_authentication(AuthType.USER, req)
    error = add_protein_entry(body, req)
    if error is None:
        with Database() as db:
            try:
                query = """INSERT INTO requests (user_id, protein_id, status_type, comment) 
                           VALUES (%s, (SELECT id FROM proteins WHERE name = %s), 'Approved', 'Added by admin');"""
                db.execute(query, [body.user_id, body.name])
            except Exception as e:
                log.error(e)
                return UploadError.QUERY_ERROR
    return error


@router.get("/protein/{protein_name}/request", response_model=RequestStatus)
def get_protein_status(protein_name: str, req: Request):
    with Database() as db:
        try:
            query = """SELECT status_type FROM requests WHERE protein_id = (SELECT id FROM proteins WHERE name = %s);"""
            status_sql = db.execute_return(query, [protein_name])

            if status_sql is not None and len(status_sql) != 0:
                if status_sql[0][0] == "Approved":
                    return RequestStatus.APPROVED
                elif status_sql[0][0] == "Pending":
                    return RequestStatus.PENDING
                elif status_sql[0][0] == "Denied":
                    return RequestStatus.DENIED
            else:
                return RequestStatus.PENDING
        except Exception as e:
            log.error(e)
            return RequestStatus.PENDING


@router.post("/protein/request", response_model=UploadError | None)
def request_protein_entry(body: RequestBody, req: Request):
    requires_authentication(AuthType.USER, req)
    error = add_protein_entry(body.protein, req)
    if error is None:
        with Database() as db:
            try:
                query = """
                        INSERT INTO requests
                        (
                            user_id,
                            protein_id,
                            status_type,
                            comment
                        )
                        VALUES
                        (
                            %s,
                            (SELECT id FROM proteins WHERE name = %s),
                            'Pending',
                            %s
                        );
                        """
                db.execute(query, [body.user_id, body.protein.name, body.comment])
            except Exception as e:
                log.error(e)
                return UploadError.QUERY_ERROR
    return error


@router.put("/protein/request/", response_model=UploadError | None)
def edit_request_status(body: RequestBodyEdit, req: Request):
    requires_authentication(AuthType.ADMIN, req)
    with Database() as db:
        try:
            query = """UPDATE requests SET status_type = %s WHERE id = %s"""
            db.execute(query, [body.status, body.request_id])
        except Exception as e:
            log.error(e)
            return UploadError.QUERY_ERROR

    return None


@router.get("/protein/request/entries", response_model=list[FullProteinInfo])
def get_all_request_entries(req: Request):
    requires_authentication(AuthType.ADMIN, req)
    with Database() as db:
        try:
            query = """SELECT * FROM full_protein_info ORDER BY "request_date" desc, "request_id";"""
            entries_sql = db.execute_return(query)

            # if we got a result back
            if entries_sql is not None and len(entries_sql) != 0:
                entries = []
                for entry in entries_sql:
                    (
                        protein_id,
                        protein_name,
                        protein_content,
                        species,
                        request_id,
                        user_id,
                        username,
                        request_date,
                        request_status,
                        comment,
                    ) = entry

                    if comment is None:
                        comment = ""

                    if request_date is None:
                        request_date = ""

                    entries.append(
                        FullProteinInfo(
                            protein_id=protein_id,
                            protein_name=protein_name,
                            protein_content=protein_content,
                            request_id=request_id,
                            species=species,
                            user_id=user_id,
                            username=username,
                            request_date=str(request_date),
                            request_status=request_status,
                            comment=comment,
                        )
                    )
                return entries
            else:
                return []

        except Exception as e:
            log.error(e)
            return []


class ProteinEditSuccess(CamelModel):
    edited_name: str


@router.put("/protein/edit", response_model=ProteinEditSuccess)
def edit_protein_entry(body: EditBody, req: Request):
    """edit_protein_entry
    Returns: On successful edit, will return an object with editedName
    If not successful will through an HTTP status 500
    """

    # check that the name is not already taken in the DB
    # TODO: check if permission so we don't have people overriding other people's names
    requires_authentication(AuthType.ADMIN, req)
    try:
        # replace spaces in the name with underscores
        body.old_name = format_protein_name(body.old_name)
        body.new_name = format_protein_name(body.new_name)
        if body.new_name != body.old_name:
            os.rename(
                stored_pdb_file_name(body.old_name), stored_pdb_file_name(body.new_name)
            )
        with Database() as db:
            name_changed = False
            if body.new_name != body.old_name:
                db.execute(
                    """UPDATE proteins SET name = %s WHERE name = %s""",
                    [
                        body.new_name,
                        body.old_name,
                    ],
                )
                name_changed = True

            if body.new_species_name != body.old_species_name:
                db.execute(
                    """UPDATE proteins SET species_id = (SELECT id FROM species WHERE name = %s) WHERE name = %s""",
                    [
                        body.new_species_name,
                        body.old_name if not name_changed else body.new_name,
                    ],
                )

            if body.new_content is not None:
                db.execute(
                    """UPDATE proteins SET content = %s WHERE name = %s""",
                    [
                        body.new_content,
                        body.old_name if not name_changed else body.new_name,
                    ],
                )

            if body.new_refs is not None:
                db.execute(
                    """UPDATE proteins SET refs = %s WHERE name = %s""",
                    [
                        body.new_refs,
                        body.old_name if not name_changed else body.new_name,
                    ],
                )

            if body.new_description is not None:
                db.execute(
                    """UPDATE proteins SET description = %s WHERE name = %s""",
                    [
                        body.new_description,
                        body.old_name if not name_changed else body.new_name,
                    ],
                )
            return ProteinEditSuccess(edited_name=body.new_name)
    except Exception:
        raise HTTPException(500, "Edit failed, git gud")


# /pdb with two attributes returns both PDBs, superimposed and with different colors.
@router.get("/protein/pdb/{proteinA:str}/{proteinB:str}", response_model=str)
def align_proteins(proteinA: str, proteinB: str):
    if not protein_name_found(proteinA) or not protein_name_found(proteinB):
        raise HTTPException(
            status_code=404, detail="One of the proteins provided is not found in DB"
        )

    try:
        filepath_pdbA = stored_pdb_file_name(proteinA)
        filepath_pdbB = stored_pdb_file_name(proteinB)
        superimposed_pdb = tm_align_return(filepath_pdbA, filepath_pdbB)
        return str_as_file_stream(superimposed_pdb, f"{proteinA}_{proteinB}.pdb")
    except Exception as e:
        log.error(e)
        raise HTTPException(status_code=500, detail=str(e))


class TMAlignInfo(CamelModel):
    aligned_length: str | None
    rmsd: str | None
    seq_id: str | None
    chain1_tm_score: str | None
    chain2_tm_score: str | None
    alignment_string: str


# Returns the alignment string info from TM Align's console log.
@router.get(
    "/protein/tmalign/{proteinA:str}/{proteinB:str}", response_model=TMAlignInfo
)
def get_tm_info(proteinA: str, proteinB: str):
    if not protein_name_found(proteinA) or not protein_name_found(proteinB):
        raise HTTPException(
            status_code=404, detail="One of the proteins provided is not found in DB"
        )
    try:
        filepath_pdbA = stored_pdb_file_name(proteinA)
        filepath_pdbB = stored_pdb_file_name(proteinB)
        tmalign_output = tm_align_return(filepath_pdbA, filepath_pdbB, 1)

        log.warn("TM Align Output follows:")
        # Split TMAlign data into an array format
        tmalign_output_list = tmalign_output.splitlines()
        log.warn(tmalign_output)

        # Grab aligned length, RMSD, and Seq ID
        tmalign_tri = tmalign_output_list[12].split(", ")
        # Note: \d+?.\d* means "match 1 or more numbers, 0 or 1 decimal points, and 0 or more numbers" in regex
        aligned_length = re.search("\d+?.\d*", tmalign_tri[0]).group()
        rmsd = re.search("\d+.?\d*", tmalign_tri[1]).group()
        seq_id = re.search("\d+.?\d*", tmalign_tri[2]).group()

        # Grabs both TM scores
        # NOTE: This is ONLY grabbing the TM-Score from the file. It's leaving out the LN and d0 stats.
        chain1_normalized_tm_score = re.search(
            "\d+.?\d*", tmalign_output_list[13]
        ).group()
        chain2_normalized_tm_score = re.search(
            "\d+.?\d*", tmalign_output_list[14]
        ).group()

        # Grabs TM Alignment String
        tmalign_string = "\n".join(tmalign_output_list[18:21])
        log.warn(tmalign_string)

        return TMAlignInfo(
            aligned_length=aligned_length,
            rmsd=rmsd,
            seq_id=seq_id,
            chain1_tm_score=chain1_normalized_tm_score,
            chain2_tm_score=chain2_normalized_tm_score,
            alignment_string=tmalign_string,
        )
    except Exception as e:
        log.error(e)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/protein/random", response_model=ProteinEntry)
def get_random_protein():
    with Database() as db:
        try:
            query = """SELECT 
                        proteins.name,
                        proteins.length, 
                        proteins.mass, 
                        proteins.atoms,
                        proteins.description, 
                        species.name as species_name 
                       FROM proteins TABLESAMPLE SYSTEM_ROWS(1)
                       JOIN species ON species.id = proteins.species_id;"""
            res = db.execute_return(query)
            if res is not None:
                name, length, mass, atoms, description, species_name = res[0]
                return ProteinEntry(
                    name=name,
                    length=length,
                    mass=mass,
                    atoms=atoms,
                    description=description,
                    species_name=species_name,
                )
            else:
                raise HTTPException(
                    status_code=501, detail="SQL query couldn't execute"
                )

        except Exception as e:
            log.error(e)
            raise HTTPException(status_code=500, detail=str(e))


# used in protein.svelte to check if af3 file exists for a specific protein
@router.get("/protein/af3/{protein_name:str}")
def get_af3_file(protein_name: str):
    if protein_name_found(protein_name):
        af3_path = stored_af3_file_name(protein_name)
        if os.path.exists(af3_path):
            return FileResponse(af3_path, filename=protein_name + ".cif")
        else:
            raise HTTPException(status_code=404, detail="AF3 file not found")
    else:
        raise HTTPException(status_code=404, detail="Protein not found")


# Upload af3
# mv backend/src/data/stored_proteins/af3/gh_comp10_c1_seq1_model.cif backend/src/data/stored_proteins/af3/Gh_comp10_c1_seq1.cif
@router.post("/protein/upload/af3", response_model=UploadError | None)
async def upload_af3_file(
    req: Request, protein_name: str = Form(...), file: UploadFile = File(...)
):
    """Upload an AF3 file for a protein visualization"""
    # Check for admin
    requires_authentication(AuthType.ADMIN, req)

    try:
        # Check if the protein exists in the database
        if not protein_name_found(protein_name):
            log.warning(f"Protein not found when uploading af3: {protein_name}")
            raise HTTPException(status_code=400, detail=UploadError.NAME_NOT_UNIQUE)
            # have return fail when protein not found ^^

        # check if af3 upload already exists
        file_path = stored_af3_file_name(protein_name)
        if os.path.exists(file_path):
            log.warning(f"AF3 file already exists for protein: {protein_name}")
            raise HTTPException(status_code=400, detail=UploadError.AF3_ALREADY_EXISTS)

        # create af3 storage dir if not already
        af3_dir = os.path.join("src/data/stored_proteins/af3")
        os.makedirs(af3_dir, exist_ok=True)

        # Reset file pointer to beginning
        await file.seek(0)

        # Read file content
        content = await file.read()

        # Write to file with sync operation
        with open(file_path, "wb") as f:
            f.write(content)

        log.info(f"Successfully saved AF3 file for {protein_name}")
        return None

    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        log.error(f"Failed to upload AF3 file: {str(e)}")
        raise HTTPException(status_code=500, detail=UploadError.WRITE_ERROR)


# matching function to delete af3 uplaod
@router.delete("/protein/af3/{protein_name:str}", response_model=None)
async def delete_af3_file(protein_name: str, req: Request):
    """Delete an AF3 file for a protein visualization"""
    requires_authentication(AuthType.ADMIN, req)

    try:
        # Check if the protein exists in the database
        if not protein_name_found(protein_name):
            raise HTTPException(status_code=404, detail="Protein not found")

        # Check if AF3 file exists
        file_path = stored_af3_file_name(protein_name)
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="AF3 file not found")

        # Delete the file
        os.remove(file_path)
        log.info(f"Successfully deleted AF3 file for {protein_name}")
        return None

    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        log.error(f"Failed to delete AF3 file: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete AF3 file")
