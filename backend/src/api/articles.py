from fastapi import APIRouter
from ..api_types import CamelModel
from ..db import Database, bytea_to_str, str_to_bytea
from fastapi.exceptions import HTTPException
from ..auth import requires_authentication
from fastapi.requests import Request
import logging as log

router = APIRouter()


class ArticleUpload(CamelModel):
    title: str
    description: str | None = None


@router.post("/article/upload")
def upload_article(body: ArticleUpload, req: Request):
    with Database() as db:
        try:
            query = """INSERT INTO articles_v2 (title, description) VALUES (%s, %s);"""
            db.execute(query, [body.title, body.description])
        except Exception as e:
            raise HTTPException(500, detail=str(e))


class ArticleImageComponent(CamelModel):
    id: int
    component_type: str = "image"
    component_order: int
    src: str
    width: int | None = None
    height: int | None = None


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
    image_components: list[ArticleImageComponent]


def get_text_components_v2(db: Database, title: str):
    query = """SELECT components.id, components.component_order, text_components.markdown FROM components
               JOIN text_components ON text_components.component_id = components.id
               WHERE components.article_id = (SELECT id FROM articles_v2 WHERE title = %s);
                """
    res = db.execute_return(query, [title])
    if res is not None:
        return [
            ArticleTextComponent(id=i, component_order=c, markdown=m)
            for [i, c, m] in res
        ]
    return []


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
            text_components = get_text_components_v2(db, title)
            # protein_components = get_protein_components(db, title)
            # image_components = get_image_components(db, title)
            return Article(
                title=title,
                text_components=text_components,
                protein_components=[],
                image_components=[],
            )
        except Exception as e:
            HTTPException(500, detail=str(e))


@router.delete("/article/component/{component_id:int}")
def delete_article_component(component_id: int):
    with Database() as db:
        try:
            query = """DELETE FROM components WHERE id=%s;"""
            db.execute(query, [component_id])
        except Exception as e:
            raise HTTPException(500, detail=str(e))


class UploadArticleTextComponent(CamelModel):
    for_article_title: str
    component_order: int
    markdown: str


def get_last_component_order(db: Database, article_title: str):
    out = db.execute_return(
        """SELECT coalesce(max(components.component_order) + 1, 0) FROM components
           WHERE article_id=(SELECT id FROM articles_v2 WHERE title = %s)""",
        [article_title],
    )
    if out is not None:
        return out[0][0]
    else:
        return -1


def get_component_id_from_order(db: Database, article_title: str, component_order: int):
    out = db.execute_return(
        """SELECT id FROM components WHERE article_id = (SELECT id FROM articles_v2 WHERE title = %s) AND component_order = %s;""",
        [article_title, component_order],
    )
    if out is not None:
        return out[0][0]
    else:
        return None


def insert_component(db: Database, article_title: str):
    last_component_order = get_last_component_order(db, article_title)
    query = """INSERT INTO components (article_id, component_order) 
               VALUES ((SELECT id FROM articles_v2 WHERE title = %s), %s);"""
    db.execute(query, [article_title, last_component_order])
    return get_component_id_from_order(db, article_title, last_component_order)


@router.post("/article/component/text")
def upload_article_text_component(body: UploadArticleTextComponent):
    with Database() as db:
        try:
            component_id = insert_component(db, body.for_article_title)
            query = """INSERT INTO text_components (component_id, markdown) 
                    VALUES (%s, %s);"""
            db.execute(query, [component_id, body.markdown])
        except Exception as e:
            raise HTTPException(500, detail=str(e))


class EditArticleTextComponent(CamelModel):
    component_id: int
    new_markdown: str


@router.put("/article/component/text")
def edit_article_text_component(body: EditArticleTextComponent):
    with Database() as db:
        try:
            query = """UPDATE text_components SET markdown=%s WHERE component_id=%s;"""
            db.execute(query, [body.new_markdown, body.component_id])
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


class UploadArticleImageComponent(CamelModel):
    for_article_title: str
    component_order: int
    src: str
    width: int | None = None
    height: int | None = None


@router.post("/article/component/image")
def upload_article_image_component(body: UploadArticleImageComponent):
    with Database() as db:
        try:
            query = """INSERT INTO article_image_components (article_id, component_order, src, width, height) VALUES ((SELECT id FROM articles WHERE title=%s), %s, %s, %s, %s);"""
            db.execute(
                query,
                [
                    body.for_article_title,
                    body.component_order,
                    str_to_bytea(body.src),
                    body.width,
                    body.height,
                ],
            )
        except Exception as e:
            raise HTTPException(500, detail=str(e))


class EditArticleImageComponent(CamelModel):
    image_component_id: int
    new_src: str | None = None
    new_height: int | None = None
    new_width: int | None = None


@router.put("/article/component/image")
def edit_article_image_component(body: EditArticleImageComponent):
    with Database() as db:
        try:
            if body.new_src is not None:
                db.execute(
                    """UPDATE article_image_components SET src=%s WHERE id=%s;""",
                    [body.new_src, body.image_component_id],
                )

            db.execute(
                """UPDATE article_image_components SET width=%s, height=%s WHERE id=%s;""",
                [body.new_width, body.new_height, body.image_component_id],
            )

        except Exception as e:
            raise HTTPException(500, detail=str(e))


@router.delete("/article/component/image/{component_id:int}")
def delete_article_image_component(component_id: int):
    with Database() as db:
        try:
            query = """DELETE FROM article_image_components WHERE id=%s;"""
            db.execute(query, [component_id])
        except Exception as e:
            raise HTTPException(500, detail=str(e))
