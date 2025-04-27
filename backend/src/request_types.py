"""Request-related data models for API requests and responses."""

import enum

from src.util import CamelModel
from src.protein_types import ProteinUploadBody


class RequestStatus(str, enum.Enum):
    """Enum for request status."""
    PENDING = "Pending"
    APPROVED = "Approved"
    DENIED = "Denied"


class RequestBody(CamelModel):
    """Request body for protein upload."""
    user_id: int
    comment: str
    status: RequestStatus
    protein: ProteinUploadBody


class RequestStatusEdit(CamelModel):
    """Request body for editing request status."""
    request_id: int
    status: RequestStatus


class FullProteinInfo(CamelModel):
    """Full protein information for the request page."""
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
