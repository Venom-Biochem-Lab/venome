from fastapi import APIRouter
from fastapi.exceptions import HTTPException
import logging as log
from ..db import Database
from ..api_types import CamelModel, ProteinEntry

router = APIRouter()


class SearchProteinsBody(CamelModel):
    query: str
    limit: int | None = None


class SearchProteinsResults(CamelModel):
    total_found: int
    protein_entries: list[ProteinEntry]


def sanitize_query(query: str) -> str:
    log.warn("todo: sanitize query so we don't get sql injectioned in search.py")
    return query


@router.post("/search/proteins", response_model=SearchProteinsResults)
def search_proteins(body: SearchProteinsBody):
    with Database() as db:
        try:
            query = """SELECT proteins.name, proteins.length, proteins.mass, species.name as species_name FROM proteins 
                       JOIN species ON species.id = proteins.species_id 
                       WHERE proteins.name ILIKE %s;"""
            entries_sql = db.execute_return(query, [f"%{sanitize_query(body.query)}%"])
            if entries_sql is not None:
                return SearchProteinsResults(
                    protein_entries=[
                        ProteinEntry(
                            name=name,
                            length=length,
                            mass=mass,
                            species_name=species_name,
                        )
                        for name, length, mass, species_name in entries_sql
                    ],
                    total_found=len(entries_sql),
                )
            else:
                raise HTTPException(status_code=500)
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))


@router.get("/search/species", response_model=list[str] | None)
def search_species():
    try:
        with Database() as db:
            query = """SELECT name as species_name FROM species"""
            entry_sql = db.execute_return(query)
            if entry_sql is not None:
                return [d[0] for d in entry_sql]
    except Exception:
        return
