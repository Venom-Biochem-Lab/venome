"""Adds API routes for searching proteins and species."""

import logging as log

from fastapi import APIRouter
from fastapi.exceptions import HTTPException

from src.db import Database, DatabaseException, bytea_to_str
from src.foldseek import easy_search
from src.api.protein import stored_pdb_file_name

from src.search_types import (
    SearchProteinsBody,
    SearchProteinsResults,
    RangeFilter,
    SimilarProtein,
)
from src.protein_types import ProteinEntry


router = APIRouter()


def sanitize_query(query: str) -> str:
    """
    Sanitize the query string to prevent SQL injection attacks.
    This is a placeholder function and should be replaced with a proper
    sanitization method.
    """
    log.warning(
        "Todo: sanitize query so we don't get sql injected in search.py")
    return query


def range_where_clause(
    column_name: str,
    range_filter: RangeFilter | None = None
) -> str:
    """
    Generate a SQL WHERE clause for a range filter.
    """
    if range_filter is None:
        return ""
    return f"{column_name} BETWEEN {range_filter.min} AND {range_filter.max}"


def category_where_clause(
    column_name: str,
    category_filter: str | None = None
) -> str:
    """
    Generate a SQL WHERE clause for a category filter.
    """
    if category_filter is None:
        return ""
    return f"{column_name} = '{category_filter}'"


def combine_where_clauses(clauses: list[str]) -> str:
    """
    Combine multiple WHERE clauses into a single string.
    """
    result = ""
    for i, c in enumerate(clauses):
        if c != "":
            result += c
            if i < len(clauses) - 1:
                result += " AND "
    return result


def get_descriptions(protein_names: list[str]):
    """
    Get protein descriptions from the database based on protein names.
    """
    if len(protein_names) > 0:
        with Database() as db:
            list_names = str(protein_names)[
                1:-1
            ]  # parse out the [] brackets and keep everything inside
            query = f"""
                    SELECT description
                    FROM proteins
                    WHERE name in ({list_names});
                    """
            entry_sql = db.execute_return(query)
            if entry_sql is not None:
                return [d[0] for d in entry_sql]
    return None


def gen_sql_filters(
    species_table: str,
    proteins_table: str,
    species_filter: str | None,
    length_filter: RangeFilter | None = None,
    mass_filter: RangeFilter | None = None,
    atoms_filter: RangeFilter | None = None,
) -> str:
    """Generate SQL WHERE clauses for various filters.
    Args:
        species_table (str): The name of the species table.
        proteins_table (str): The name of the proteins table.
        species_filter (str | None): The species filter.
        length_filter (RangeFilter | None): The length filter.
        mass_filter (RangeFilter | None): The mass filter.
        atoms_filter (RangeFilter | None): The atoms filter.
    Returns:
        str: The combined WHERE clause for the filters.
    """
    filters = [
        category_where_clause(f"{species_table}.name", species_filter),
        range_where_clause(f"{proteins_table}.length", length_filter),
        range_where_clause(f"{proteins_table}.mass", mass_filter),
        range_where_clause(f"{proteins_table}.atoms", atoms_filter),
    ]
    return " AND " + combine_where_clauses(filters) if any(filters) else ""


@router.post(
    "/search/proteins",
    response_model=SearchProteinsResults,
    status_code=200,
)
def search_proteins(body: SearchProteinsBody):
    """
    Search for proteins in the database based on various filters.
    Args:
        body (SearchProteinsBody): The request body containing parameters.
    Returns:
        SearchProteinsResults: The search results containing protein entries.
    """
    text_query = sanitize_query(body.query)
    limit = 10000  # Limit defaulted to exceed the number of entries in
    # db to grab whole thing.
    offset = 0
    with Database() as db:
        try:
            # If both the number requested and the page number are
            # present in the request, the limit and offset are set.
            # Otherwise, defaults to entire database.
            if body.proteinsPerPage is not None and body.page is not None:
                limit = body.proteinsPerPage
                offset = limit * body.page

            filter_clauses = gen_sql_filters(
                "species",
                "proteins_scores",
                body.species_filter,
                body.length_filter,
                body.mass_filter,
                body.atoms_filter,
            )
            threshold = 0
            score_filter = (
                f"""(proteins_scores.name_score >= {threshold}
                OR proteins_scores.desc_score >= {threshold}
                OR  proteins_scores.content_score >= {threshold})
                """  # show only the scores > 0
                if len(text_query) > 0
                else "TRUE"  # show all scores
            )

            # creating search by query insertion
            sort_clause = """(proteins_scores.name_score*4
                            + proteins_scores.desc_score*2
                            + proteins_scores.content_score)
                            DESC
                            """

            # If sortBy is set, override the default sort
            if body.sortBy == "lengthAsc":
                sort_clause = "proteins_scores.length ASC"
            elif body.sortBy == "lengthDesc":
                sort_clause = "proteins_scores.length DESC"
            elif body.sortBy == "massAsc":
                sort_clause = "proteins_scores.mass ASC"
            elif body.sortBy == "massDesc":
                sort_clause = "proteins_scores.mass DESC"
            elif body.sortBy == "atomsAsc":
                sort_clause = "proteins_scores.atoms ASC"
            elif body.sortBy == "atomsDesc":
                sort_clause = "proteins_scores.atoms DESC"

            # note that we have a sub query since
            # postgres can't do where clauses on aliased tables
            entries_query = f"""
                SELECT
                    proteins_scores.name,
                    proteins_scores.description,
                    proteins_scores.length,
                    proteins_scores.mass,
                    proteins_scores.atoms,
                    species.name,
                    proteins_scores.thumbnail
                FROM (
                    SELECT *,
                        similarity(name, %s) as name_score,
                        similarity(description, %s) as desc_score,
                        similarity(content, %s) as content_score
                    FROM proteins WHERE EXISTS (
                            SELECT 1
                            FROM requests
                            WHERE protein_id = proteins.id
                            AND status_type = 'Approved'
                        )
                ) as proteins_scores
                JOIN species ON species.id = proteins_scores.species_id
                WHERE {score_filter} {filter_clauses}
                ORDER BY {sort_clause}
                LIMIT {limit}
                OFFSET {offset};
            """
            entries_result = db.execute_return(
                sanitize_query(entries_query),
                [text_query, text_query, text_query],
            )
        except DatabaseException as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error executing query: {e}",
            ) from e
        if entries_result is not None:
            return SearchProteinsResults(
                protein_entries=[
                    ProteinEntry(
                        name=name,
                        length=length,
                        mass=mass,
                        atoms=atoms,
                        species_name=species_name,
                        thumbnail=bytea_to_str(thumbnail_bytes)
                        if thumbnail_bytes is not None
                        else None,
                        description=description,
                    )
                    for name,
                    description,
                    length,
                    mass,
                    atoms,
                    species_name,
                    thumbnail_bytes in entries_result
                ],
                total_found=len(entries_result),
            )
        else:
            raise HTTPException(
                status_code=404,
                detail="No entries found",
            )


@router.get(
    "/search/range/length",
    response_model=RangeFilter,
    status_code=200,
)
def search_range_length():
    """Get the range of protein lengths in the database.
    Returns:
        RangeFilter: The minimum and maximum protein lengths.
    """
    try:
        with Database() as db:
            query = """
                    SELECT min(length), max(length)
                    FROM proteins
                    WHERE EXISTS (
                            SELECT 1
                            FROM requests
                            WHERE protein_id = proteins.id
                            AND status_type = 'Approved'
                        );
                    """
            entry_sql = db.execute_return(query)
    except DatabaseException as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error executing query: {e}",
        ) from e
    if entry_sql is not None:
        return RangeFilter(min=entry_sql[0][0], max=entry_sql[0][1])
    else:
        raise HTTPException(
            status_code=404,
            detail="No length range found",
        )


@router.get(
    "/search/range/mass",
    response_model=RangeFilter,
    status_code=200
)
def search_range_mass():
    """Get the range of protein masses in the database.
    Returns:
        RangeFilter: The minimum and maximum protein masses.
    """
    try:
        with Database() as db:
            query = """
                    SELECT min(mass), max(mass)
                    FROM proteins
                    WHERE EXISTS (
                            SELECT 1
                            FROM requests
                            WHERE protein_id = proteins.id
                            AND status_type = 'Approved'
                        );
                    """
            entry_sql = db.execute_return(query)
    except DatabaseException as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error executing query: {e}",
        ) from e
    if entry_sql is not None:
        return RangeFilter(min=entry_sql[0][0], max=entry_sql[0][1])
    else:
        raise HTTPException(
            status_code=404,
            detail="No mass range found",
        )


@router.get(
    "/search/range/atoms",
    response_model=RangeFilter,
    status_code=200
)
def search_range_atoms():
    """Get the range of protein atoms in the database.
    Returns:
        RangeFilter: The minimum and maximum protein atoms.
    """
    try:
        with Database() as db:
            query = """
                    SELECT min(atoms), max(atoms)
                    FROM proteins;
                    """
            entry_sql = db.execute_return(query)
    except DatabaseException as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error executing query: {e}",
        ) from e
    if entry_sql is not None:
        return RangeFilter(min=entry_sql[0][0], max=entry_sql[0][1])
    else:
        raise HTTPException(
            status_code=404,
            detail="No atom range found",
        )


@router.get(
    "/search/species",
    response_model=list[str] | None,
    status_code=200
)
def search_species():
    """Get the list of species in the database.
    Returns:
        list[str] | None: The list of species names.
    """
    try:
        with Database() as db:
            query = """
                    SELECT name as species_name
                    FROM species;
                    """
            entry_sql = db.execute_return(query)
    except DatabaseException as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error executing query: {e}",
        ) from e
    if entry_sql is not None:
        return [d[0] for d in entry_sql]
    else:
        raise HTTPException(
            status_code=404,
            detail="No species found",
        )


@router.get(
    "/search/venome/similar/{protein_name:str}",
    response_model=list[SimilarProtein],
    status_code=200,
)
def search_venome_similar(protein_name: str):
    """
    Search for similar proteins in the Venome database.
    Args:
        protein_name (str): The name of the protein to search for.
    Returns:
        list[SimilarProtein]: A list of similar proteins.
    """
    venome_folder = "/app/src/data/stored_proteins/"
    # relative to docker filepath
    # ignore the first since it's itself as the most similar
    try:
        similar = easy_search(
            stored_pdb_file_name(protein_name),
            venome_folder,
            out_format="target,prob,evalue,qstart,qend",
        )  # qend,qstart refer to alignment
        formatted = [
            SimilarProtein(
                name=name.rstrip(".pdb"),
                prob=prob,
                evalue=evalue,
                qstart=qstart,
                qend=qend,
                alntmscore=0,
            )
            for [name, prob, evalue, qstart, qend] in similar
        ]
    except DatabaseException as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error executing query: {e}",
        ) from e

    try:
        # populate protein descriptions for the similar proteins
        descriptions = get_descriptions([s.name for s in formatted])
    except DatabaseException as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error executing query: {e}",
        ) from e
    if descriptions is not None:
        for f, d in zip(formatted, descriptions):
            f.description = d

    return formatted


@router.get(
    "/search/venome/similar/{protein_name:str}/{protein_compare:str}",
    response_model=SimilarProtein,
    status_code=200,
)
def search_venome_similar_compare(protein_name: str, protein_compare: str):
    """
    Search for a specific protein in the Venome database
    and compare it to another protein.
    Args:
        protein_name (str): The name of the protein to search for.
        protein_compare (str): The name of the protein to compare against.
    Returns:
        SimilarProtein: The most similar protein to the specified protein.
    """
    target = stored_pdb_file_name(protein_compare)
    # ignore the first since it's itself as the most similar
    try:
        similar = easy_search(
            stored_pdb_file_name(protein_name),
            target,
            out_format="target,prob,evalue,qstart,qend",
        )  # qend,qstart refer to alignment
        formatted = [
            SimilarProtein(
                name=name.rstrip(".pdb"),
                prob=prob,
                evalue=evalue,
                qstart=qstart,
                qend=qend,
                alntmscore=0,
            )
            for [name, prob, evalue, qstart, qend] in similar
        ]
    except DatabaseException as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error executing query: {e}",
        ) from e

    try:
        # populate protein descriptions for the similar proteins
        descriptions = get_descriptions([s.name for s in formatted])
        if descriptions is not None:
            for f, d in zip(formatted, descriptions):
                f.description = d
    except DatabaseException as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error executing query: {e}",
        ) from e

    return formatted[0]
