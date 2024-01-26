import logging as log
import os
from io import BytesIO
from fastapi.responses import FileResponse, StreamingResponse
from .api_types import ProteinEntry, UploadBody, UploadError, EditBody
from .db import Database, bytea_to_str, str_to_bytea
from .protein import parse_protein_pdb, pdb_file_name, protein_name_found, pdb_to_fasta
from .setup import disable_cors, init_fastapi_app
from fastapi import APIRouter


app = init_fastapi_app()
disable_cors(app, origins=[os.environ["PUBLIC_FRONTEND_URL"]])

# Allow routing



@app.get("/pdb/{protein_name:str}")
def get_pdb_file(protein_name: str):
    if protein_name_found(protein_name):
        return FileResponse(pdb_file_name(protein_name), filename=protein_name + ".pdb")


@app.get("/fasta/{protein_name:str}")
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


# important to note the return type (response_mode) so frontend can generate that type through `./run.sh api`
@app.get("/all-entries", response_model=list[ProteinEntry] | None)
def get_all_entries():
    """Gets all protein entries from the database
    Returns: list[ProteinEntry] if found | None if not found
    """
    with Database() as db:
        try:
            query = """SELECT proteins.name, proteins.length, proteins.mass, species.name as species_name FROM species_proteins 
                       JOIN proteins ON species_proteins.protein_id = proteins.id
                       JOIN species ON species_proteins.species_id = species.id;"""
            entries_sql = db.execute_return(query)
            log.warn(entries_sql)

            # if we got a result back
            if entries_sql is not None:
                return [
                    ProteinEntry(
                        name=name, length=length, mass=mass, species_name=species_name
                    )
                    for name, length, mass, species_name in entries_sql
                ]
        except Exception as e:
            log.error(e)


@app.get("/search-entries/{protein_name:str}", response_model=list[ProteinEntry] | None)
def search_entries(protein_name: str):
    """Gets a list of protein entries by a search string
    Returns: list[ProteinEntry] if found | None if not found
    """
    with Database() as db:
        try:
            query = """SELECT proteins.name, proteins.length, proteins.mass, species.name as species_name FROM species_proteins 
                       JOIN proteins ON species_proteins.protein_id = proteins.id
                       JOIN species ON species_proteins.species_id = species.id
                       WHERE proteins.name ILIKE %s;"""
            entries_sql = db.execute_return(query, [f"%{protein_name}%"])
            log.warn(entries_sql)

            # if we got a result back
            if entries_sql is not None:
                return [
                    ProteinEntry(
                        name=name, length=length, mass=mass, species_name=species_name
                    )
                    for name, length, mass, species_name in entries_sql
                ]
        except Exception as e:
            log.error(e)


@app.get("/protein-entry/{protein_name:str}", response_model=ProteinEntry | None)
def get_protein_entry(protein_name: str):
    """Get a single protein entry by its id
    Returns: ProteinEntry if found | None if not found
    """
    with Database() as db:
        try:
            query = """SELECT proteins.name, proteins.length, proteins.mass, proteins.content, proteins.refs, species.name as species_name FROM species_proteins 
                       JOIN proteins ON species_proteins.protein_id = proteins.id
                       JOIN species ON species_proteins.species_id = species.id
                       WHERE proteins.name = %s;"""
            entry_sql = db.execute_return(query, [protein_name])
            log.warn(entry_sql)

            # if we got a result back
            if entry_sql is not None and len(entry_sql) != 0:
                # return the only entry
                only_returned_entry = entry_sql[0]
                name, length, mass, content, refs, species_name = only_returned_entry

                # if byte arrays are present, decode them into a string
                if content is not None:
                    content = bytea_to_str(content)
                if refs is not None:
                    refs = bytea_to_str(refs)

                return ProteinEntry(
                    name=name,
                    length=length,
                    mass=mass,
                    content=content,
                    refs=refs,
                    species_name=species_name,
                )

        except Exception as e:
            log.error(e)


# TODO: add permissions so only the creator can delete not just anyone
@app.delete("/protein-entry/{protein_name:str}", response_model=None)
def delete_protein_entry(protein_name: str):
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
            os.remove(pdb_file_name(protein_name))
        except Exception as e:
            log.error(e)


# None return means success
@app.post("/protein-upload", response_model=UploadError | None)
def upload_protein_entry(body: UploadBody):
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
        with open(pdb_file_name(pdb.name), "w") as f:
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
            db.execute(
                """INSERT INTO proteins (name, length, mass, content, refs) VALUES (%s, %s, %s, %s, %s);""",
                [
                    pdb.name,
                    pdb.num_amino_acids,
                    pdb.mass_daltons,
                    str_to_bytea(body.content),
                    str_to_bytea(body.refs),
                ],
            )
        except Exception:
            log.warn("Failed to insert into proteins table")
            return UploadError.QUERY_ERROR

        try:
            # connect them with the intermediate table
            db.execute(
                """INSERT INTO species_proteins (species_id, protein_id)
                    VALUES ((SELECT id FROM species WHERE name = %s),
                            (SELECT id FROM proteins WHERE name = %s));""",
                [body.species_name, body.name],
            )
        except Exception:
            log.warn("Failed to insert into join table")
            return UploadError.QUERY_ERROR


# TODO: add more edits, now only does name and content edits
@app.put("/protein-edit", response_model=UploadError | None)
def edit_protein_entry(body: EditBody):
    # check that the name is not already taken in the DB
    # TODO: check if permission so we don't have people overriding other people's names

    try:
        if body.new_name != body.old_name:
            os.rename(pdb_file_name(body.old_name), pdb_file_name(body.new_name))

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
                    """UPDATE species_proteins SET species_id = (SELECT id FROM species WHERE name = %s) WHERE protein_id = (SELECT id FROM proteins WHERE name = %s)""",
                    [
                        body.new_species_name,
                        body.old_name if not name_changed else body.new_name,
                    ],
                )

            if body.new_content is not None:
                db.execute(
                    """UPDATE proteins SET content = %s WHERE name = %s""",
                    [
                        str_to_bytea(body.new_content),
                        body.old_name if not name_changed else body.new_name,
                    ],
                )

            if body.new_refs is not None:
                db.execute(
                    """UPDATE proteins SET refs = %s WHERE name = %s""",
                    [
                        str_to_bytea(body.new_refs),
                        body.old_name if not name_changed else body.new_name,
                    ],
                )

    except Exception:
        return UploadError.WRITE_ERROR


@app.get("/all-species", response_model=list[str] | None)
def get_all_species():
    try:
        with Database() as db:
            query = """SELECT name as species_name FROM species"""
            entry_sql = db.execute_return(query)
            if entry_sql is not None:
                return [d[0] for d in entry_sql]
    except Exception:
        return
    

def export_app_for_docker():
    """Needed for the [docker-compose.yml](../../docker-compose.yml)
    Example: `uvicorn src.server:export_app_for_docker --reload --host 0.0.0.0`
    """
    return app
