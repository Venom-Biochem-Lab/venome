from .setup import init_fastapi_app, disable_cors
from .api_types import ProteinEntry, UploadBody, UploadError
from .db import Database, str_to_bytea, bytea_to_str
from .protein import Protein
import logging as log
from fastapi.staticfiles import StaticFiles


app = init_fastapi_app()
disable_cors(app, origins=["http://0.0.0.0:5173", "http://localhost:5173"])
# mount the data directory so we can easily access files through the url
app.mount("/data", StaticFiles(directory="src/data"), name="data")


# important to note the return type (response_mode) so frontend can generate that type through `./run.sh api`
@app.get("/all-entries", response_model=list[ProteinEntry] | None)
def get_all_entries():
    """Gets all protein entries from the database
    Returns: list[ProteinEntry] if found | None if not found
    """
    with Database() as db:
        try:
            entries_sql = db.execute_return(
                """SELECT name, length, mass FROM proteins"""
            )
            log.warn(entries_sql)

            # if we got a result back
            if entries_sql is not None:
                return [
                    ProteinEntry(name=name, length=length, mass=mass)
                    for name, length, mass in entries_sql
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
            entry_sql = db.execute_return(
                """SELECT name, length, mass, content FROM proteins
                    WHERE name = %s""",
                [protein_name],
            )
            log.warn(entry_sql)

            # if we got a result back
            if entry_sql is not None and len(entry_sql) != 0:
                # return the only entry
                only_returned_entry = entry_sql[0]
                name, length, mass, content = only_returned_entry
                # if bytes are present, decode them into a string
                if content is not None:
                    content = bytea_to_str(content)

                return ProteinEntry(
                    name=name, length=length, mass=mass, content=content
                )

        except Exception as e:
            log.error(e)


# None return means success
@app.post("/protein-upload", response_model=UploadError | None)
def upload_protein_entry(body: UploadBody):
    body.name = body.name.replace(" ", "_")

    # check that the name is not already taken in the DB
    if Protein.name_taken(body.name):
        return UploadError.NAME_NOT_UNIQUE

    # if name is unique, save the pdb file and add the entry to the database
    try:
        # TODO: consider somehow sending the file as a stream instead of a b64 string or send as regular string
        pdb = Protein.parse_pdb(body.name, body.pdb_file_base64, encoding="b64")
    except Exception:
        return UploadError.PARSE_ERROR

    try:
        # write to file to data/ folder
        with open(pdb.pdb_file_name, "w") as f:
            f.write(pdb.file_contents)

        # save to db
        with Database() as db:
            db.execute(
                """INSERT INTO proteins (name, length, mass, content) VALUES (%s, %s, %s, %s);""",
                [
                    pdb.name,
                    pdb.num_amino_acids,
                    pdb.mass_daltons,
                    str_to_bytea(body.content),
                ],
            )
    except Exception:
        return UploadError.WRITE_ERROR


def export_app_for_docker():
    """Needed for the [docker-compose.yml](../../docker-compose.yml)
    Example: `uvicorn src.server:export_app_for_docker --reload --host 0.0.0.0`
    """
    return app
