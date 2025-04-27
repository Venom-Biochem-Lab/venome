"""Search related data models."""

from src.util import CamelModel
from src.protein_types import ProteinEntry


class SimilarProtein(CamelModel):
    """Data model for a similar protein."""
    name: str
    prob: float
    evalue: float
    description: str = ""
    qstart: int
    qend: int
    alntmscore: int


class RangeFilter(CamelModel):
    """Data model for a range filter."""
    min: int | float
    max: int | float


class SearchProteinsBody(CamelModel):
    """Request body for searching proteins."""
    query: str
    species_filter: str | None = None
    length_filter: RangeFilter | None = None
    mass_filter: RangeFilter | None = None
    atoms_filter: RangeFilter | None = None
    proteinsPerPage: int | None = None
    page: int | None = None
    sortBy: str | None = None


class SearchProteinsResults(CamelModel):
    """Response body for search results."""
    total_found: int
    protein_entries: list[ProteinEntry]
