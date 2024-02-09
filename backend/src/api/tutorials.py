from fastapi import APIRouter
from ..api_types import CamelModel

router = APIRouter()


class Tutorial(CamelModel):
    title: str


@router.get("/tutorials", response_model=list[Tutorial])
def get_all_tutorials():
    return [
        Tutorial(title="Tutorial 1"),
        Tutorial(title="Tutorial 2"),
        Tutorial(title="Tutorial 3"),
        Tutorial(title="Tutorial 4"),
    ]
