from fastapi import APIRouter
from ..db import Database

router = APIRouter()


@router.get("/all-species", response_model=list[str] | None)
def get_all_species():
    try:
        with Database() as db:
            query = """SELECT name as species_name FROM species"""
            entry_sql = db.execute_return(query)
            if entry_sql is not None:
                return [d[0] for d in entry_sql]
    except Exception:
        return
