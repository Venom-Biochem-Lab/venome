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
    atoms: int
    species_name: str
    content: str | None = None
    refs: str | None = None
    thumbnail: str | None = None
    description: str | None = None
    date_published: str | None = None


class AllEntries(CamelModel):
    protein_entries: list[ProteinEntry]


class ProteinBody(CamelModel):
    name: str
    description: str
    species_name: str
    content: str  # markdown content from user
    refs: str  # references used in content (bibtex form)
    pdb_file_str: str


class UploadBody(CamelModel):
    name: str
    description: str
    species_name: str
    content: str  # markdown content from user
    refs: str  # references used in content (bibtex form)
    pdb_file_str: str
    user_id: int


class UploadError(str, enum.Enum):
    NAME_NOT_UNIQUE = "NAME_NOT_UNIQUE"
    PARSE_ERROR = "PARSE_ERROR"
    WRITE_ERROR = "WRITE_ERROR"
    QUERY_ERROR = "QUERY_ERROR"
    AF2_REQUIRED = "AF2_REQUIRED"  # Add this new error type
    INVALID_FILE = "INVALID_FILE"


class UploadStatus(CamelModel):
    status: UploadError


class EditBody(CamelModel):
    old_name: str  # so we can identify the exact row we need to change
    new_name: str
    old_species_name: str  # so we can identify the exact row we need to change
    new_species_name: str
    new_content: str | None = None
    new_refs: str | None = None
    new_description: str | None = None


class RequestStatus(str, enum.Enum):
    PENDING = "Pending"
    APPROVED = "Approved"
    DENIED = "Denied"


class RequestBody(CamelModel):
    user_id: int
    comment: str
    status: RequestStatus
    protein: ProteinBody


class RequestBodyEdit(CamelModel):
    request_id: int
    status: RequestStatus


class FullProteinInfo(CamelModel):
    protein_id: int
    protein_name: str
    protein_content: str
    species: str
    request_id: int
    user_id: int
    username: str
    request_date: str
    request_status: RequestStatus
    comment: str


class SignupBody(CamelModel):
    username: str
    email: str
    password: str


class SignupResponse(CamelModel):
    error: str


class LoginBody(CamelModel):
    email: str
    password: str


class LoginResponse(CamelModel):
    token: str
    user_id: int
    error: str


class CompareBody(CamelModel):
    proteinA: str
    proteinB: str


class CompareResponse(CamelModel):
    file: list[str]


class UserResponse(CamelModel):
    id: int
    username: str
    email: str
    admin: bool


class UsersResponse(CamelModel):
    users: list[UserResponse]


class UserIDResponse(CamelModel):
    id: int


class UserBody(CamelModel):
    id: int
    username: str | None = None
    email: str | None = None
    admin: bool | None = None
    password: str | None = None


class AuthType(str, enum.Enum):
    ADMIN = "ADMIN"
    USER = "USER"
