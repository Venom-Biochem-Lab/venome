"""User-related data models for API requests and responses."""

import enum

from src.util import CamelModel


class UserSignupBody(CamelModel):
    """Data model for user signup request."""
    username: str
    email: str
    password: str


class UserLoginBody(CamelModel):
    """Data model for user login request."""
    email: str
    password: str


class UserLoginResponse(CamelModel):
    """Data model for user login response."""
    token: str
    user_id: int


class UserEntry(CamelModel):
    """Data model for a single user in the database."""
    id: int
    username: str
    email: str
    admin: bool


class UserIDResponse(CamelModel):
    """Data model for user ID response."""
    id: int


class UserEditBody(CamelModel):
    """Data model for user edit request."""
    id: int
    username: str | None = None
    email: str | None = None
    admin: bool | None = None
    password: str | None = None


class UserProteinResponse(CamelModel):
    """Data model for user protein response."""
    proteins: list[str]


class UserAuthType(str, enum.Enum):
    """Enum for user roles for authentication."""
    ADMIN = "ADMIN"
    USER = "USER"
