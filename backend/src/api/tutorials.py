from fastapi import APIRouter
from ..api_types import CamelModel
from ..db import Database
import logging as log

router = APIRouter()


class Link(CamelModel):
    url: str
    title: str

class Tutorial(CamelModel):
    header: str | None = None
    title: str | None = None
    description: str | None = None
    # links: list[Link] | None = None

class MultipleTutorials(CamelModel):
    tutorials: list[Tutorial] | None = None





@router.get("/tutorials", response_model=list[Tutorial])
def get_all_tutorials():
    with Database() as db:
        try:
            query = """SELECT header, title, description FROM tutorials"""
            entries = db.execute_return(query)
            if entries:
                tutorials = [Tutorial(**entry) for entry in entries]
                return tutorials
        except Exception as e:
            log.error(e)

