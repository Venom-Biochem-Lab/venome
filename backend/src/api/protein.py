"""Adds API routes for protein management"""

import logging as log
import os
from base64 import b64decode
from io import StringIO
from io import BytesIO
import re

from Bio.PDB import PDBParser
from Bio.SeqUtils import molecular_weight, seq1
from fastapi.exceptions import HTTPException
from fastapi import APIRouter
from fastapi.responses import FileResponse, StreamingResponse
from fastapi.requests import Request

from src.db import Database, DatabaseException, bytea_to_str, str_to_bytea
from src.tmalign import tm_align_return
from src.auth import requires_authentication

from src.protein_types import (
    ProteinEntry,
    ProteinUploadBody,
    ProteinEditBody,
    UploadPNGBody,
    TMAlignInfo
)
from src.request_types import (
    RequestBody,
    RequestStatus,
    RequestStatusEdit,
    FullProteinInfo,
)
from src.user_types import (
    UserEntry,
    UserAuthType
)

router = APIRouter()


class PDB:
    """Class to parse and handle PDB files"""
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
        """Returns the number of amino acids in the protein"""
        return len(self.amino_acids())

    @property
    def mass_daltons(self):
        """Returns the mass of the protein in daltons"""
        return molecular_weight(
            seq="".join(self.amino_acids()),
            seq_type="protein"
        )

    @property
    def num_atoms(self) -> int:
        """Returns the number of atoms in the protein"""
        count = 0
        for _ in self.atoms():
            count += 1
        return count

    def amino_acids(self, one_letter_code=True):
        """Returns a list of amino acids in the protein"""
        return [
            seq1(residue.resname) if one_letter_code else residue.resname
            for residue in self.structure.get_residues()
        ]

    def atoms(self):
        """Returns a list of atoms in the protein"""
        return self.structure.get_atoms()


def decode_base64(b64_header_and_data: str):
    """Converts a base64 string to bytes"""
    # only decode after the header (data:application/octet-stream;base64,)
    end_of_header = b64_header_and_data.index(",")
    b64_data_only = b64_header_and_data[end_of_header:]
    return b64decode(b64_data_only).decode("utf-8")


def stored_pdb_file_name(protein_name: str):
    """Returns the path to the stored PDB file"""
    return os.path.join("src/data/stored_proteins", protein_name) + ".pdb"


def parse_protein_pdb(name: str, file_contents: str = "", encoding="str"):
    """Parses a PDB file and returns a PDB object"""
    if encoding == "str":
        return PDB(file_contents, name)
    elif encoding == "b64":
        return PDB(decode_base64(file_contents), name)
    elif encoding == "file":
        return PDB(
            open(
                stored_pdb_file_name(name),
                "r",
                encoding="utf-8"
            ).read(),
            name
        )
    else:
        raise ValueError(f"Invalid encoding: {encoding}")


def format_protein_name(name: str):
    """Replaces spaces in the protein name with underscores"""
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

        except DatabaseException:
            return False


def pdb_to_fasta(pdb: PDB):
    """Converts a PDB object to a FASTA string"""
    return f">{pdb.name}\n{"".join(pdb.amino_acids())}"


def str_as_file_stream(input_str: str, filename_as: str) -> StreamingResponse:
    """Converts a string to a file stream for download"""
    return StreamingResponse(
        BytesIO(input_str.encode()),
        media_type="text/plain",
        headers={"Content-Disposition": f"attachment; filename={filename_as}"},
    )


def get_residue_bfactors(pdb: PDB):
    """Returns a dictionary of residue b-factors for
    each chain in the protein
    """
    chains = {}
    for chain in pdb.structure.get_chains():
        chains[chain.get_id()] = []
        for r in chain.get_residues():
            for a in r.get_atoms():
                chains[chain.get_id()].append(a.bfactor)
                break
    return chains


@router.get(
    "/protein/pLDDT/{protein_name:str}",
    response_model=dict[str, list[float]],
    status_code=200
)
def get_plddt_given_protein(protein_name: str):
    """Returns the pLDDT values for a given protein"""
    if protein_name_found(protein_name):
        pdb = parse_protein_pdb(protein_name, encoding="file")
        return get_residue_bfactors(pdb)
    return {}


@router.get("/protein/pdb/{protein_name:str}", status_code=200)
def get_pdb_file(protein_name: str):
    """Returns the PDB file for a given protein"""
    if protein_name_found(protein_name):
        return FileResponse(
            stored_pdb_file_name(protein_name), filename=protein_name + ".pdb"
        )


@router.get("/protein/fasta/{protein_name:str}", status_code=200)
def get_fasta_file(protein_name: str):
    """Returns the FASTA file for a given protein"""
    if protein_name_found(protein_name):
        pdb = parse_protein_pdb(protein_name, encoding="file")
        fasta = pdb_to_fasta(pdb)
        return StreamingResponse(
            BytesIO(fasta.encode()),
            media_type="text/plain",
            headers={
                "Content-Disposition":
                f"attachment; filename={protein_name}.fasta"
            },
        )


@router.get(
    "/protein/entry/{protein_name:str}",
    response_model=ProteinEntry
)
def get_protein_entry(protein_name: str):
    """Get a single protein entry by its id
    Returns: ProteinEntry if found
    """
    with Database() as db:
        try:
            query = """
                    SELECT proteins.name,
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
                    WHERE proteins.name = %s;
                    """
            entry_sql = db.execute_return(query, [protein_name])
        except DatabaseException as e:
            log.error(e)
            raise HTTPException(
                status_code=500,
                detail=(
                    "Database error occurred while fetching protein entry: {e}"
                )
            ) from e

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
        else:
            raise HTTPException(
                status_code=404,
                detail="Protein entry not found"
            )


@router.get(
    "/protein/entry/{protein_name:str}/user",
    response_model=UserEntry,
    status_code=200
)
def get_protein_entry_user(protein_name: str):
    """Get the user who created a protein entry
    Args:
        protein_name (str): The name of the protein
    Returns:
        UserEntry: The user who created the protein entry
    """
    with Database() as db:
        try:
            query = """
                    SELECT
                    users.id,
                    users.username,
                    users.email,
                    users.admin
                    FROM users
                    JOIN requests ON requests.user_id = users.id
                    JOIN proteins ON proteins.id = requests.protein_id
                    WHERE proteins.name = %s;
                    """
            user_sql = db.execute_return(query, [protein_name])
        except DatabaseException as e:
            log.error(e)
            raise HTTPException(
                status_code=500,
                detail=(
                    f"Database error occurred while fetching "
                    f"protein entry user: {e}"
                )
            ) from e
        if user_sql is not None and len(user_sql) != 0:
            user = user_sql[0]
            return UserEntry(
                id=user[0], username=user[1], email=user[2], admin=user[3]
            )


@router.delete(
    "/protein/entry/{protein_name:str}",
    response_model=None,
    status_code=200
)
def delete_protein_entry(protein_name: str, req: Request):
    """Deletes a protein entry by its name
    Args:
        protein_name (str): The name of the protein
    """
    requires_authentication(UserAuthType.ADMIN, req)
    with Database() as db:
        # remove protein
        try:
            db.execute(
                """
                DELETE FROM proteins
                WHERE name = %s;
                """,
                [protein_name],
            )
            # delete the file from the data/ folder
            os.remove(stored_pdb_file_name(protein_name))
        except DatabaseException as e:
            log.error(e)
            raise HTTPException(
                status_code=500,
                detail=(
                    f"Database error occurred while deleting "
                    f"protein entry: {e}"
                )
            ) from e


@router.get(
    "/protein/entries",
    response_model=list[ProteinEntry],
    status_code=200
)
def get_all_protein_entries():
    """Get all protein entries
    Returns: List of ProteinEntry objects
    """
    with Database() as db:
        try:
            query = """
                    SELECT
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
                    );
                    """
            entries_sql = db.execute_return(query)
        except DatabaseException as e:
            log.error(e)
            raise HTTPException(
                status_code=500,
                detail=(
                    f"Database error occurred while fetching "
                    f"protein entries: {e}"
                )
            ) from e
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
            raise HTTPException(
                status_code=404,
                detail="No protein entries found"
            )


@router.get(
    "/protein/entries/pending",
    response_model=list[ProteinEntry],
    status_code=200
)
def get_all_pending_protein_entries(req: Request):
    """Get all protein entries that are pending approval
    Returns: List of ProteinEntry objects
    """
    requires_authentication(UserAuthType.ADMIN, req)
    with Database() as db:
        try:
            query = """
                    SELECT
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
                    );
                    """
            entries_sql = db.execute_return(query)
        except DatabaseException as e:
            log.error(e)
            raise HTTPException(
                status_code=500,
                detail=(
                    f"Database error occurred while fetching "
                    f"pending protein entries: {e}"
                )
            ) from e
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
            raise HTTPException(
                status_code=404,
                detail="No pending protein entries found"
            )


@router.get(
    "/protein/entries/denied",
    response_model=list[ProteinEntry],
    status_code=200
)
def get_all_denied_protein_entries(req: Request):
    """Get all protein entries that are denied
    Returns: List of ProteinEntry objects
    """
    requires_authentication(UserAuthType.ADMIN, req)
    with Database() as db:
        try:
            query = """
                    SELECT
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
                    );
                    """
            entries_sql = db.execute_return(query)
        except DatabaseException as e:
            log.error(e)
            raise HTTPException(
                status_code=500,
                detail=(
                    f"Database error occurred while fetching "
                    f"denied protein entries: {e}"
                )
            ) from e
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
            raise HTTPException(
                status_code=404,
                detail="No denied protein entries found"
            )


@router.post("/protein/upload/png", status_code=200)
def upload_protein_png(body: UploadPNGBody, req: Request):
    """Uploads a protein thumbnail image to the database
    Args:
        body (UploadPNGBody): The request containing the protein image
        req (Request): The request object
    """
    requires_authentication(UserAuthType.USER, req)
    with Database() as db:
        try:
            query = """
                    UPDATE proteins
                    SET thumbnail = %s
                    WHERE name = %s;
                    """
            db.execute(
                query,
                [str_to_bytea(body.base64_encoding), body.protein_name]
            )
        except DatabaseException as e:
            log.error(e)
            raise HTTPException(
                status_code=500,
                detail=(
                    f"Database error occurred while uploading "
                    f"protein thumbnail: {e}"
                )
            ) from e


# None return means success
@router.post("/protein/add", status_code=200)
def add_protein_entry(body: ProteinUploadBody, req: Request):
    """Adds a protein entry to the database
    Args:
        body (ProteinUploadBody): The protein body
        req (Request): The request object
    """
    requires_authentication(UserAuthType.USER, req)
    body.name = format_protein_name(body.name)
    # check that the name is not already taken in the DB
    if protein_name_found(body.name):
        raise HTTPException(
            status_code=400,
            detail="Protein name already exists in the database"
        )

    # if name is unique, save the pdb file and add the entry to the database
    try:
        # TODO: consider somehow sending the file as a stream instead of a
        # b64 string or send as regular string
        pdb = parse_protein_pdb(body.name, body.pdb_file_str)
    except ValueError as e:
        log.warning("Failed to parse PDB file")
        log.error(e)
        raise HTTPException(
            status_code=400,
            detail="Failed to parse PDB file"
        ) from e
    try:
        # write to file to data/ folder
        with open(stored_pdb_file_name(pdb.name), "w", encoding="utf-8") as f:
            f.write(pdb.file_contents)
    except Exception as e:
        log.warning("Failed to write to file")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to write PDB file to disk: {e}"
        ) from e

    # save to db
    with Database() as db:
        try:
            # first add the species if it doesn't exist
            db.execute(
                """
                INSERT INTO species (name)
                VALUES (%s) ON CONFLICT DO NOTHING;
                """,
                [body.species_name],
            )
        except DatabaseException as e:
            log.warning("Failed to insert into species table")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to insert species into database: {e}"
            ) from e

        try:
            # add the protein itself
            query = """
                    INSERT INTO proteins (
                        name,
                        description,
                        length,
                        mass,
                        atoms,
                        content,
                        refs,
                        species_id
                    )
                    VALUES (
                        %s,
                        %s,
                        %s,
                        %s,
                        %s,
                        %s,
                        %s,
                        (SELECT id FROM species WHERE name = %s)
                    );
                    """
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
        except DatabaseException as e:
            log.warning("Failed to insert into proteins table")
            log.error(e)
            raise HTTPException(
                status_code=500,
                detail=f"Failed to insert protein into database: {e}"
            ) from e


@router.post("/protein/upload", status_code=200)
def upload_protein_entry(body: ProteinUploadBody, req: Request):
    """Wrapper that adds a protein entry then creates an approved request"""
    requires_authentication(UserAuthType.USER, req)
    try:
        add_protein_entry(body, req)
    except HTTPException as e:
        raise e

    with Database() as db:
        try:
            query = """
                    INSERT INTO requests (
                        user_id,
                        protein_id,
                        status_type,
                        comment
                    )
                    VALUES (
                        %s,
                        (SELECT id FROM proteins WHERE name = %s),
                        'Approved',
                        'Added by admin'
                    );
                    """
            db.execute(query, [body.user_id, body.name])
        except DatabaseException as e:
            log.error(e)
            raise HTTPException(
                status_code=500,
                detail=f"Failed to insert request into database: {e}"
            ) from e


@router.get(
    "/protein/{protein_name}/request",
    response_model=RequestStatus,
    status_code=200
)
def get_protein_status(protein_name: str):
    """Get the status of a protein request
    Args:
        protein_name (str): The name of the protein
        req (Request): The request object
    Returns:
        RequestStatus: The status of the protein request
    """
    with Database() as db:
        try:
            query = """
                    SELECT status_type
                    FROM requests
                    WHERE protein_id =
                    (SELECT id FROM proteins WHERE name = %s);
                    """
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
        except DatabaseException as e:
            log.error(e)
            return RequestStatus.PENDING


@router.post("/protein/request")
def request_protein_entry(body: RequestBody, req: Request):
    """Wrapper that adds a protein entry then creates a request"""
    requires_authentication(UserAuthType.USER, req)
    try:
        add_protein_entry(body.protein, req)
    except HTTPException as e:
        raise e

    with Database() as db:
        try:
            query = """
                    INSERT INTO requests (
                        user_id,
                        protein_id,
                        status_type,
                        comment
                    )
                    VALUES (
                        %s,
                        (SELECT id FROM proteins WHERE name = %s),
                        'Approved',
                        'Added by admin'
                    );
                    """
            db.execute(query, [body.user_id, body.protein.name])
        except DatabaseException as e:
            log.error(e)
            raise HTTPException(
                status_code=500,
                detail=f"Failed to insert request into database: {e}"
            ) from e


@router.put("/protein/request/", status_code=200)
def edit_request_status(body: RequestStatusEdit, req: Request):
    """Edit the status of a protein request
    Args:
        body (RequestStatusEdit): The request body
        req (Request): The request object
    """
    requires_authentication(UserAuthType.ADMIN, req)
    with Database() as db:
        try:
            query = """
            UPDATE requests
            SET status_type = %s
            WHERE id = %s;
            """
            db.execute(query, [body.status, body.request_id])
        except DatabaseException as e:
            log.error(e)
            raise HTTPException(
                status_code=500,
                detail=f"Failed to update request status in database: {e}"
            ) from e


@router.get(
    "/protein/request/entries",
    response_model=list[FullProteinInfo],
    status_code=200
)
def get_all_request_entries(req: Request):
    """Get all protein request entries
    Returns: List of FullProteinInfo objects
    """
    requires_authentication(UserAuthType.ADMIN, req)
    with Database() as db:
        try:
            query = """
                    SELECT * FROM full_protein_info
                    ORDER BY "request_date" DESC, "request_id";
                    """
            entries_sql = db.execute_return(query)
        except DatabaseException as e:
            log.error(e)
            raise HTTPException(
                status_code=500,
                detail=f"Failed to fetch request entries from database: {e}"
            ) from e
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
            raise HTTPException(
                status_code=404,
                detail="No protein request entries found"
            )


@router.put("/protein/edit", status_code=200)
def edit_protein_entry(body: ProteinEditBody, req: Request):
    """Edits a protein entry in the database
    Args:
        body (ProteinEditBody): The request body
        req (Request): The request object
    Returns:
        ProteinEditSuccess: The response containing the edited protein name
    """
    # check that the name is not already taken in the DB
    # TODO: check if permission so we don't have people
    # overriding other people's names
    requires_authentication(UserAuthType.ADMIN, req)
    try:
        # replace spaces in the name with underscores
        body.old_name = format_protein_name(body.old_name)
        body.new_name = format_protein_name(body.new_name)
        if body.new_name != body.old_name:
            os.rename(
                stored_pdb_file_name(body.old_name),
                stored_pdb_file_name(body.new_name)
            )
        with Database() as db:
            name_changed = False
            if body.new_name != body.old_name:
                db.execute(
                    """
                    UPDATE proteins
                    SET name = %s
                    WHERE name = %s;
                    """,
                    [
                        body.new_name,
                        body.old_name,
                    ],
                )
                name_changed = True

            if body.new_species_name != body.old_species_name:
                db.execute(
                    """
                    UPDATE proteins
                    SET species_id =
                    (SELECT id FROM species WHERE name = %s)
                    WHERE name = %s;
                    """,
                    [
                        body.new_species_name,
                        body.old_name if not name_changed else body.new_name,
                    ],
                )

            if body.new_content is not None:
                db.execute(
                    """
                    UPDATE proteins
                    SET content = %s
                    WHERE name = %s;
                    """,
                    [
                        body.new_content,
                        body.old_name if not name_changed else body.new_name,
                    ],
                )

            if body.new_refs is not None:
                db.execute(
                    """
                    UPDATE proteins
                    SET refs = %s
                    WHERE name = %s;
                    """,
                    [
                        body.new_refs,
                        body.old_name if not name_changed else body.new_name,
                    ],
                )

            if body.new_description is not None:
                db.execute(
                    """
                    UPDATE proteins
                    SET description = %s
                    WHERE name = %s;
                    """,
                    [
                        body.new_description,
                        body.old_name if not name_changed else body.new_name,
                    ],
                )
    except DatabaseException as e:
        log.error(e)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to update protein entry in database: {e}"
        ) from e


# /pdb with two attributes returns both PDBs, superimposed and
# with different colors.
@router.get(
    "/protein/pdb/{proteinA:str}/{proteinB:str}",
    response_model=str,
    status_code=200
)
def align_proteins(protein_a: str, protein_b: str):
    """Returns the aligned PDB file for two proteins
    Args:
        protein_a (str): The name of the first protein
        protein_b (str): The name of the second protein
    Returns:
        StreamingResponse: The aligned PDB file
    """
    if not protein_name_found(protein_a) or not protein_name_found(protein_b):
        raise HTTPException(
            status_code=404,
            detail="One of the proteins provided is not found in DB"
        )

    try:
        filepath_pdb_a = stored_pdb_file_name(protein_a)
        filepath_pdb_b = stored_pdb_file_name(protein_b)
        superimposed_pdb = tm_align_return(filepath_pdb_a, filepath_pdb_b)
        return str_as_file_stream(
            superimposed_pdb,
            f"{protein_a}_{protein_b}.pdb"
        )
    except DatabaseException as e:
        log.error(e)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to superimpose PDBs {e}"
        ) from e


# Returns the alignment string info from TM Align's console log.
@router.get(
    "/protein/tmalign/{proteinA:str}/{proteinB:str}",
    response_model=TMAlignInfo,
    status_code=200
)
def get_tm_info(protein_a: str, protein_b: str):
    """Returns the TM Align info for two proteins
    Args:
        protein_a (str): The name of the first protein
        protein_b (str): The name of the second protein
    Returns:
        TMAlignInfo: The TM Align info
    """

    if not protein_name_found(protein_a) or not protein_name_found(protein_b):
        raise HTTPException(
            status_code=404,
            detail="One of the proteins provided is not found in DB"
        )
    try:
        filepath_pdb_a = stored_pdb_file_name(protein_a)
        filepath_pdb_b = stored_pdb_file_name(protein_b)
        tmalign_output = tm_align_return(filepath_pdb_a, filepath_pdb_b, True)

        log.warning("TM Align Output follows:")
        # Split TMAlign data into an array format
        tmalign_output_list = tmalign_output.splitlines()
        log.warning(tmalign_output)

        # Grab aligned length, RMSD, and Seq ID
        tmalign_tri = tmalign_output_list[12].split(", ")
        # Note: \d+?.\d* means "match 1 or more numbers, 0 or 1 decimal points,
        # and 0 or more numbers" in regex
        aligned_length = re.search(r"\d+?.\d*", tmalign_tri[0])
        assert aligned_length is not None
        aligned_length = aligned_length.group()
        rmsd = re.search(r"\d+.?\d*", tmalign_tri[1])
        assert rmsd is not None
        rmsd = rmsd.group()
        seq_id = re.search(r"\d+.?\d*", tmalign_tri[2])
        assert seq_id is not None
        seq_id = seq_id.group()

        # Grabs both TM scores
        # NOTE: This is ONLY grabbing the TM-Score from the file.
        # It's leaving out the LN and d0 stats.
        chain1_normalized_tm_score = re.search(
            r"\d+.?\d*", tmalign_output_list[13]
        )
        assert chain1_normalized_tm_score is not None
        chain1_normalized_tm_score = chain1_normalized_tm_score.group()
        chain2_normalized_tm_score = re.search(
            r"\d+.?\d*", tmalign_output_list[14]
        )
        assert chain2_normalized_tm_score is not None
        chain2_normalized_tm_score = chain2_normalized_tm_score.group()

        # Grabs TM Alignment String
        tmalign_string = "\n".join(tmalign_output_list[18:21])
        log.warning(tmalign_string)

        return TMAlignInfo(
            aligned_length=aligned_length,
            rmsd=rmsd,
            seq_id=seq_id,
            chain1_tm_score=chain1_normalized_tm_score,
            chain2_tm_score=chain2_normalized_tm_score,
            alignment_string=tmalign_string,
        )
    except DatabaseException as e:
        log.error(e)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to get TM Align info: {e}"
        ) from e


@router.get(
    "/protein/random",
    response_model=ProteinEntry,
    status_code=200
)
def get_random_protein():
    """Get a random protein entry from the database
    Returns: ProteinEntry object
    """
    with Database() as db:
        try:
            query = """
                    SELECT
                        proteins.name,
                        proteins.length,
                        proteins.mass,
                        proteins.atoms,
                        proteins.description,
                        species.name as species_name
                    FROM proteins TABLESAMPLE SYSTEM_ROWS(1)
                    JOIN species ON species.id = proteins.species_id;
                    """
            res = db.execute_return(query)
        except DatabaseException as e:
            log.error(e)
            raise HTTPException(
                status_code=500,
                detail=f"Failed to get random protein: {e}"
            ) from e
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
                status_code=501,
                detail="SQL query couldn't execute"
            )
