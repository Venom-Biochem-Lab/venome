from fastapi import APIRouter
from ..api_types import CamelModel
from ..db import Database
import logging as log

router = APIRouter()


class Tutorial(CamelModel):
    title: str | None = None
    description: str | None = None


@router.get("/tutorials", response_model=list[Tutorial])
def get_all_tutorials():
    with Database() as db:
        try:
            query = """SELECT title, description FROM tutorials"""
            entries = db.execute_return(query)
            if entries:
                return [
                    Tutorial(title=title, description=description)
                    for title, description in entries
                ]
        except Exception as e:
            log.error(e)


@router.get("/tutorial/{title: str}", response_model=Tutorial)
def get_tutorial(title: str):
    with Database() as db:
        try:
            query = """SELECT title, description FROM tutorials WHERE title=%s"""
            tutorial = db.execute_return(query, [title])
            if tutorial:
                [title, description] = tutorial[0]
                return Tutorial(title=title, description=description)
        except Exception as e:
            log.error(e)
