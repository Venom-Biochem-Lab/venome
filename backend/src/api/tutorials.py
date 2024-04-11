from fastapi import APIRouter
from ..api_types import CamelModel
from ..db import Database
from fastapi.exceptions import HTTPException
from ..auth import requires_authentication
from fastapi.requests import Request

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


@router.post("/tutorial")
def upload_tutorial(body: TutorialUpload, req: Request):
    requires_authentication(req)
    with Database() as db:
        try:
            query = """INSERT INTO tutorials(title, description, content, refs) VALUES(%s, %s, %s, %s);"""
            db.execute(query, [body.title, body.description, body.content, body.refs])
        except Exception as e:
            raise HTTPException(404, detail=str(e))


class TutorialEdit(CamelModel):
    title: str  # used to id the tutorial
    # potential changes
    new_title: str | None = None
    new_description: str | None = None
    new_content: str | None = None
    new_refs: str | None = None


@router.put("/tutorial", response_model=None)
def edit_tutorial(body: TutorialEdit, req: Request):
    requires_authentication(req)
    with Database() as db:
        try:
            if body.new_title is not None:
                db.execute(
                    """UPDATE tutorials SET title = %s WHERE title = %s""",
                    [body.new_title, body.title],
                )
                # then for the remaining queries, use the new title
                body.title = body.new_title

            if body.new_description is not None:
                db.execute(
                    """UPDATE tutorials SET description = %s WHERE title = %s""",
                    [body.new_description, body.title],
                )

            if body.new_content is not None:
                db.execute(
                    """UPDATE tutorials SET content = %s WHERE title = %s""",
                    [body.new_content, body.title],
                )

            if body.new_refs is not None:
                db.execute(
                    """UPDATE tutorials SET refs = %s WHERE title = %s""",
                    [body.new_refs, body.title],
                )

        except Exception as e:
            raise HTTPException(404, detail=str(e))


@router.delete("/tutorial/{title: str}", response_model=None)
def delete_tutorial(title: str, req: Request):
    requires_authentication(req)
    with Database() as db:
        try:
            db.execute("""DELETE FROM tutorials WHERE title=%s""", [title])
        except Exception as e:
            raise HTTPException(404, detail=str(e))
