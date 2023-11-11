from .setup import init_fastapi_app, disable_cors
from .api_types import ProteinEntry
from .db import Database
import logging as log


app = init_fastapi_app()
disable_cors(app, origins=["http://0.0.0.0:5173", "http://localhost:5173"])


# important to note the return type (response_mode) so frontend can generate that type through `make api`
@app.get("/all-entries", response_model=list[ProteinEntry] | None)
def get_all_entries():
    """Gets all protein entries from the database
    Returns: list[ProteinEntry] if found | None if not found
    """
    with Database() as db:
        try:
            entries_sql = db.execute_return("""SELECT id, name FROM proteins""")
            log.warn(entries_sql)

            # if we got a result back
            if entries_sql is not None:
                return [
                    ProteinEntry(id=str(entry[0]), name=entry[1])
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
                """SELECT id, name FROM proteins
                    WHERE id = %s""",
                [protein_id],
            )
            log.warn(entry_sql)

            # if we got a result back
            if entry_sql is not None and len(entry_sql) != 0:
                # return the only entry
                return ProteinEntry(id=str(entry_sql[0][0]), name=entry_sql[0][1])

        except Exception as e:
            log.error(e)


def export_app_for_docker():
    """Needed for the [docker-compose.yml](../../docker-compose.yml)
    Example: `uvicorn src.server:export_app_for_docker --reload --host 0.0.0.0`
    """
    return app
