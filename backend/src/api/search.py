from fastapi import APIRouter
from fastapi.exceptions import HTTPException
import logging as log
from ..db import Database
from ..api_types import CamelModel, ProteinEntry

router = APIRouter()


class RangeFilter(CamelModel):
    min: int | float
    max: int | float


class SearchProteinsBody(CamelModel):
    query: str
    species_filter: str | None = None
    length_filter: RangeFilter | None = None


class SearchProteinsResults(CamelModel):
    total_found: int
    protein_entries: list[ProteinEntry]


def sanitize_query(query: str) -> str:
    log.warn("todo: sanitize query so we don't get sql injectioned in search.py")
    return query


def gen_sql_filters(
    species_filter: str | None, length_filter: RangeFilter | None = None
) -> str:
    filter_query = """"""
    if species_filter:
        filter_query += f" AND species.name = '{species_filter}'"
    if length_filter:
        filter_query += (
            f" AND proteins.length BETWEEN {length_filter.min} AND {length_filter.max}"
        )
    return sanitize_query(filter_query)


@router.post("/search/proteins", response_model=SearchProteinsResults)
def search_proteins(body: SearchProteinsBody):
    title_query = sanitize_query(body.query)
    with Database() as db:
        try:
            entries_query = """SELECT proteins.name, proteins.length, proteins.mass, species.name as species_name FROM proteins 
                       JOIN species ON species.id = proteins.species_id 
                       WHERE proteins.name ILIKE %s""" + gen_sql_filters(
                body.species_filter, body.length_filter
            )

            entries_result = db.execute_return(
                entries_query,
                [
                    f"%{title_query}%",
                ],
            )
            if entries_result is not None:
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
                    total_found=len(entries_result),
                )
            else:
                raise HTTPException(status_code=500)
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))


@router.get("/search/range/length")
def search_range_length():
    try:
        with Database() as db:
            query = """SELECT min(length), max(length) FROM proteins"""
            entry_sql = db.execute_return(query)
            if entry_sql is not None:
                return RangeFilter(min=entry_sql[0][0], max=entry_sql[0][1])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/search/range/mass")
def search_range_mass():
    try:
        with Database() as db:
            query = """SELECT min(mass), max(mass) FROM proteins"""
            entry_sql = db.execute_return(query)
            if entry_sql is not None:
                return RangeFilter(min=entry_sql[0][0], max=entry_sql[0][1])
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
