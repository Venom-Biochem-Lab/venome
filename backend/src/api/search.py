from fastapi import APIRouter
from fastapi.exceptions import HTTPException
import logging as log
from ..db import Database
from ..api_types import CamelModel, ProteinEntry

router = APIRouter()
DEFAULT_LIMIT = 1_000


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
    limit = body.limit if body.limit is not None else DEFAULT_LIMIT
    limit = min(limit, DEFAULT_LIMIT)
    title_query = sanitize_query(body.query)
    with Database() as db:
        try:
            total_count_query = """SELECT count(*) FROM proteins 
                             WHERE proteins.name ILIKE %s;"""
            entries_query = """SELECT proteins.name, proteins.length, proteins.mass, species.name as species_name FROM proteins 
                       JOIN species ON species.id = proteins.species_id 
                       WHERE proteins.name ILIKE %s
                       LIMIT %s;"""
            entries_result = db.execute_return(
                entries_query, [f"%{title_query}%", limit]
            )
            total_count_result = db.execute_return(
                total_count_query, [f"%{title_query}%"]
            )
            if entries_result is not None and total_count_result is not None:
                return SearchProteinsResults(
                    protein_entries=[
                        ProteinEntry(
                            name=name,
                            length=length,
                            mass=mass,
                            species_name=species_name,
                        )
                        for name, length, mass, species_name in entries_result
                    ],
                    total_found=total_count_result[0][0],
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
