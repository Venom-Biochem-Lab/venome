from pydantic import BaseModel, ConfigDict
import enum


# https://github.com/zeno-ml/zeno-hub/blob/9d2f8b5841d99aeba9ec405b0bc6a5b1272b276f/backend/zeno_backend/classes/base.py#L20
def to_camel(string: str) -> str:
    """Converter for variables from snake_case to camelCase.

    Args:
        string (str): the variable to convert to camelCase.

    Returns:
        str: camelCase representation of the variable.
    """
    components = string.split("_")
    return components[0] + "".join(x.title() for x in components[1:])


# https://github.com/zeno-ml/zeno-hub/blob/9d2f8b5841d99aeba9ec405b0bc6a5b1272b276f/backend/zeno_backend/classes/base.py#L20
class CamelModel(BaseModel):
    """Converting snake_case pydantic models to camelCase models."""

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)  # type: ignore


class ProteinEntry(CamelModel):
    name: str
    length: int
    mass: float
    content: str | None = None
    refs: str | None = None


class AllEntries(CamelModel):
    protein_entries: list[ProteinEntry]


class UploadBody(CamelModel):
    name: str
    content: str  # markdown content from user
    refs: str  # references used in content (bibtex form)
    pdb_file_base64: str


class UploadError(str, enum.Enum):
    NAME_NOT_UNIQUE = "NAME_NOT_UNIQUE"
    PARSE_ERROR = "PARSE_ERROR"
    WRITE_ERROR = "WRITE_ERROR"
    QUERY_ERROR = "QUERY_ERROR"


class UploadStatus(CamelModel):
    status: UploadError


class EditBody(CamelModel):
    old_name: str  # so we can identify the exact row we need to change
    new_name: str
    new_content: str | None = None
    new_refs: str | None = None
