from fastapi import APIRouter
from ..api_types import CamelModel
from ..db import Database
import logging as log
from fastapi.exceptions import HTTPException

router = APIRouter()


class Tutorial(CamelModel):
    title: str
    description: str | None = None
    content: str | None = None
    refs: str | None = None


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
            raise HTTPException(404, detail=str(e))


@router.get("/tutorial/{title: str}", response_model=Tutorial)
def get_tutorial(title: str):
    with Database() as db:
        try:
            query = """SELECT title, description, content, refs FROM tutorials WHERE title=%s"""
            tutorial = db.execute_return(query, [title])
            if tutorial:
                [title, description, content, refs] = tutorial[0]
                return Tutorial(
                    title=title, description=description, content=content, refs=refs
                )
        except Exception as e:
            raise HTTPException(404, detail=str(e))


class TutorialUpload(CamelModel):
    title: str
    description: str | None = None
    content: str | None = None
    refs: str | None = None


@router.post("/tutorial/upload")
def upload_tutorial(body: TutorialUpload):
    with Database() as db:
        try:
            query = """INSERT INTO tutorials(title, description, content, refs) VALUES(%s, %s, %s, %s);"""
            db.execute(query, [body.title, body.description, body.content, body.refs])
        except Exception as e:
            raise HTTPException(404, detail=str(e))
