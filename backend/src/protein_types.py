"""Protein-related data models for API requests and responses."""

from src.util import CamelModel


class ProteinEntry(CamelModel):
    """Model for protein entry in the database."""
    name: str
    length: int
    mass: float
    atoms: int
    species_name: str
    content: str | None = None
    refs: str | None = None
    thumbnail: str | None = None
    description: str | None = None
    date_published: str | None = None
    pdb_file_str: str | None = None


class ProteinUploadBody(CamelModel):
    """Model for the protein upload request body."""
    name: str
    description: str
    species_name: str
    content: str  # markdown content from user
    refs: str  # references used in content (bibtex form)
    pdb_file_str: str
    user_id: int


# class ProteinUploadError(str, enum.Enum):
#     """Enum for protein upload errors."""
#     NAME_NOT_UNIQUE = "NAME_NOT_UNIQUE"
#     PARSE_ERROR = "PARSE_ERROR"
#     WRITE_ERROR = "WRITE_ERROR"
#     QUERY_ERROR = "QUERY_ERROR"


class ProteinEditBody(CamelModel):
    """Model for the protein edit request body."""
    old_name: str  # so we can identify the exact row we need to change
    new_name: str
    old_species_name: str  # so we can identify the exact row we need to change
    new_species_name: str
    new_content: str | None = None
    new_refs: str | None = None
    new_description: str | None = None


# class ProteinEditResponse(CamelModel):
#     edited_name: str


class CompareProteinBody(CamelModel):
    """Model for comparing two proteins."""
    protein_a: str
    protein_b: str


class CompareProteinResponse(CamelModel):
    """Response model for protein comparison."""
    file: list[str]


class UploadPNGBody(CamelModel):
    """Model for uploading PNG files to proteins."""
    protein_name: str
    base64_encoding: str


class TMAlignInfo(CamelModel):
    """Model for TM-align information."""
    aligned_length: str | None
    rmsd: str | None
    seq_id: str | None
    chain1_tm_score: str | None
    chain2_tm_score: str | None
    alignment_string: str
