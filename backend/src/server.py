from .setup import init_fastapi_app, disable_cors
from .api_types import ProteinEntry, UploadBody, UploadStatus, UploadError
from .db import Database
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
                """SELECT id, name, length, mass FROM proteins"""
            )
            log.warn(entries_sql)

            # if we got a result back
            if entries_sql is not None:
                return [
                    ProteinEntry(
                        id=str(entry[0]),
                        name=entry[1],
                        length=entry[2],
                        mass=entry[3],
                    )
                    for entry in entries_sql
                ]
        except Exception as e:
            log.error(e)


@app.get("/protein-entry/{protein_id:str}", response_model=ProteinEntry | None)
def get_protein_entry(protein_id: str):
    """Get a single protein entry by its id
    Returns: ProteinEntry if found | None if not found
    """
    with Database() as db:
        try:
            entry_sql = db.execute_return(
                """SELECT id, name, length, mass FROM proteins
                    WHERE id = %s""",
                [protein_id],
            )
            log.warn(entry_sql)

            # if we got a result back
            if entry_sql is not None and len(entry_sql) != 0:
                # return the only entry
                return ProteinEntry(
                    id=str(entry_sql[0][0]),
                    name=entry_sql[0][1],
                    length=entry_sql[0][2],
                    mass=entry_sql[0][3],
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
        pdb = Protein.parse_pdb(body.name, body.pdb_file_base64, encoding="b64")
    except Exception:
        return UploadError.PARSE_ERROR

    # Save to data/ folder and db
    try:
        Protein.save(pdb)
    except Exception:
        return UploadError.WRITE_ERROR


def export_app_for_docker():
    """Needed for the [docker-compose.yml](../../docker-compose.yml)
    Example: `uvicorn src.server:export_app_for_docker --reload --host 0.0.0.0`
    """
    return app
