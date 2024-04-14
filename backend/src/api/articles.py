from fastapi import APIRouter
from ..api_types import CamelModel
from ..db import Database
from fastapi.exceptions import HTTPException
from ..auth import requires_authentication
from fastapi.requests import Request

router = APIRouter()


class ArticleUpload(CamelModel):
    title: str


@router.post("/article/upload")
def upload_article(body: ArticleUpload, req: Request):
    requires_authentication(req)
    with Database() as db:
        try:
            query = """INSERT INTO articles (title) VALUES (%s);"""
            db.execute(query, [body.title])
        except Exception as e:
            raise HTTPException(500, detail=str(e))


class ArticleTextComponent(CamelModel):
    id: int
    component_type: str = "text"
    component_order: int
    markdown: str


class ArticleProteinComponent(CamelModel):
    id: int
    component_type: str = "protein"
    component_order: int
    name: str
    aligned_with_name: str | None = None


class Article(CamelModel):
    title: str
    text_components: list[ArticleTextComponent]
    protein_components: list[ArticleProteinComponent]


def get_text_components(db: Database, title: str):
    query = """SELECT id, component_order, markdown FROM article_text_components
                WHERE article_id=(SELECT id FROM articles WHERE title=%s);"""
    res = db.execute_return(query, [title])
    if res is not None:
        return [
            ArticleTextComponent(id=i, component_order=c, markdown=m)
            for [i, c, m] in res
        ]
    return []


def get_protein_components(db: Database, title: str):
    query = """SELECT id, component_order, name, aligned_with_name FROM article_protein_components
                WHERE article_id=(SELECT id FROM articles WHERE title=%s);"""
    res = db.execute_return(query, [title])
    if res is not None:
        return [
            ArticleProteinComponent(
                id=i, component_order=c, name=n, aligned_with_name=a
            )
            for [i, c, n, a] in res
        ]
    return []


@router.get("/article/{title:str}", response_model=Article)
def get_article(title: str):
    with Database() as db:
        try:
            text_components = get_text_components(db, title)
            protein_components = get_protein_components(db, title)
        except Exception as e:
            HTTPException(500, detail=str(e))

        return Article(
            title=title,
            text_components=text_components,
            protein_components=protein_components,
        )


class UploadArticleTextComponent(CamelModel):
    for_article_title: str
    component_order: int
    markdown: str


@router.post("/article/component/text")
def upload_article_text_component(body: UploadArticleTextComponent):
    with Database() as db:
        try:
            query = """INSERT INTO article_text_components (article_id, component_order, markdown) VALUES ((SELECT id FROM articles WHERE title=%s), %s, %s);"""
            db.execute(
                query, [body.for_article_title, body.component_order, body.markdown]
            )
        except Exception as e:
            raise HTTPException(500, detail=str(e))


@router.delete("/article/component/text/{component_id:int}")
def delete_article_text_component(component_id: int):
    with Database() as db:
        try:
            query = """DELETE FROM article_text_components WHERE id=%s;"""
            db.execute(query, [component_id])
        except Exception as e:
            raise HTTPException(500, detail=str(e))


class EditArticleTextComponent(CamelModel):
    text_component_id: int
    new_markdown: str


@router.put("/article/component/text")
def edit_article_text_component(body: EditArticleTextComponent):
    with Database() as db:
        try:
            query = """UPDATE article_text_components SET markdown=%s WHERE id=%s;"""
            db.execute(query, [body.new_markdown, body.text_component_id])
        except Exception as e:
            raise HTTPException(500, detail=str(e))


class UploadArticleProteinComponent(CamelModel):
    for_article_title: str
    component_order: int
    name: str
    aligned_with_name: str | None = None


@router.post("/article/component/protein")
def upload_article_protein_component(body: UploadArticleProteinComponent):
    with Database() as db:
        try:
            query = """INSERT INTO article_protein_components (article_id, component_order, name, aligned_with_name) VALUES ((SELECT id FROM articles WHERE title=%s), %s, %s, %s);"""
            db.execute(
                query,
                [
                    body.for_article_title,
                    body.component_order,
                    body.name,
                    body.aligned_with_name,
                ],
            )
        except Exception as e:
            raise HTTPException(500, detail=str(e))


@router.delete("/article/component/protein/{component_id:int}")
def delete_article_protein_component(component_id: int):
    with Database() as db:
        try:
            query = """DELETE FROM article_protein_components WHERE id=%s;"""
            db.execute(query, [component_id])
        except Exception as e:
            raise HTTPException(500, detail=str(e))


class EditArticleProteinComponent(CamelModel):
    protein_component_id: int
    new_name: str | None = None
    new_aligned_with_name: str | None = None


@router.put("/article/component/protein")
def edit_article_protein_component(body: EditArticleProteinComponent):
    with Database() as db:
        try:
            query = """UPDATE article_protein_components SET name=%s, aligned_with_name=%s WHERE id=%s;"""
            db.execute(
                query,
                [body.new_name, body.new_aligned_with_name, body.protein_component_id],
            )
        except Exception as e:
            raise HTTPException(500, detail=str(e))
