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
    component_order: int
    markdown: str


class Article(CamelModel):
    title: str
    text_components: list[ArticleTextComponent]


@router.get("/article/{title:str}", response_model=Article)
def get_article(title: str):
    print("hit")
    with Database() as db:
        try:
            query = """SELECT id, component_order, markdown FROM article_text_components
                       WHERE article_id=(SELECT id FROM articles WHERE title=%s);"""
            res = db.execute_return(query, [title])
            if res is not None:
                return Article(
                    title=title,
                    text_components=[
                        ArticleTextComponent(id=i, component_order=c, markdown=m)
                        for [i, c, m] in res
                    ],
                )
        except Exception as e:
            raise HTTPException(500, detail=str(e))


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
    pass


@router.get("/articles", response_model=list[str])
def get_all_articles():
    return ["test", "what?"]
