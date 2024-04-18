from fastapi import APIRouter
from ..api_types import CamelModel
from ..db import Database, bytea_to_str, str_to_bytea
from fastapi.exceptions import HTTPException
from ..auth import requires_authentication
from fastapi.requests import Request

router = APIRouter()


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
    id: int
    title: str
    description: str | None = None
    date_published: str | None = None
    ordered_components: list[
        ArticleTextComponent | ArticleProteinComponent | ArticleImageComponent
    ]


def get_text_components(db: Database, title: str):
    query = """SELECT components.id, components.component_order, text_components.markdown FROM components
               JOIN text_components ON text_components.component_id = components.id
               WHERE components.article_id = (SELECT id FROM articles WHERE title = %s);
                """
    res = db.execute_return(query, [title])
    if res is not None:
        return [
            ArticleTextComponent(id=i, component_order=c, markdown=m)
            for [i, c, m] in res
        ]
    return []


def get_protein_components(db: Database, title: str):
    query = """SELECT components.id, components.component_order, protein_components.name, protein_components.aligned_with_name FROM components
               JOIN protein_components ON protein_components.component_id = components.id
               WHERE components.article_id = (SELECT id FROM articles WHERE title = %s);
                """
    res = db.execute_return(query, [title])
    if res is not None:
        return [
            ArticleProteinComponent(
                id=i, component_order=c, name=n, aligned_with_name=a
            )
            for [i, c, n, a] in res
        ]
    return []


def get_image_components(db: Database, title: str):
    query = """SELECT components.id, components.component_order, image_components.src, image_components.width, image_components.height FROM components
               JOIN image_components ON image_components.component_id = components.id
               WHERE components.article_id = (SELECT id FROM articles WHERE title = %s);
                """
    res = db.execute_return(query, [title])
    if res is not None:
        return [
            ArticleImageComponent(
                id=i,
                component_order=c,
                src=bytea_to_str(src_bytes),
                width=width,
                height=height,
            )
            for [i, c, src_bytes, width, height] in res
        ]
    return []


def get_article_metadata(db: Database, title: str) -> tuple[int, str, str]:
    query = """SELECT id, description, date_published FROM articles WHERE title = %s;"""
    out = db.execute_return(query, [title])
    if out is not None:
        [id, description, date_published] = out[0]
        return id, description, str(date_published)
    else:
        raise Exception("Nothing returned")


@router.get("/article/meta/{title:str}", response_model=Article)
def get_article(title: str):
    """get_article

    Args:
        title (str): title of the article

    Raises:
        HTTPException: status 404 if the article is not found by the given title
        HTTPException: status 500 if any other errors occur

    Returns:
        Article
    """

    with Database() as db:
        try:
            # this will fail if the article title does not exist
            id, description, date_published = get_article_metadata(db, title)
        except Exception as e:
            raise HTTPException(404, detail=str(e))

        try:
            text_components = get_text_components(db, title)
            protein_components = get_protein_components(db, title)
            image_components = get_image_components(db, title)
            ordered_components = sorted(
                [*text_components, *protein_components, *image_components],
                key=lambda x: x.component_order,
            )
        except Exception as e:
            raise HTTPException(500, detail=str(e))

        return Article(
            id=id,
            title=title,
            ordered_components=ordered_components,
            description=description,
            date_published=date_published,
        )


class ArticleUpload(CamelModel):
    title: str
    description: str | None = None


@router.post("/article/meta/upload")
def upload_article(body: ArticleUpload, req: Request):
    requires_authentication(req)
    with Database() as db:
        try:
            query = """INSERT INTO articles (title, description) VALUES (%s, %s);"""
            db.execute(query, [body.title, body.description])
        except Exception as e:
            raise HTTPException(500, detail=str(e))


@router.delete("/article/meta/{title:str}")
def delete_article(title: str, req: Request):
    requires_authentication(req)
    with Database() as db:
        try:
            query = """DELETE FROM articles WHERE title=%s;"""
            db.execute(query, [title])
        except Exception as e:
            raise HTTPException(500, detail=str(e))


class EditArticle(CamelModel):
    article_title: str
    new_article_title: str | None = None
    new_description: str | None = None


@router.put("/article/meta")
def edit_article(body: EditArticle, req: Request):
    requires_authentication(req)
    with Database() as db:
        try:
            if (
                body.new_article_title is not None
                and body.new_article_title != body.article_title
            ):
                db.execute(
                    """UPDATE articles SET title = %s WHERE title = %s;""",
                    [body.new_article_title, body.article_title],
                )
                # for the other queries later
                body.article_title = body.new_article_title

            db.execute(
                """UPDATE articles SET description = %s WHERE title = %s;""",
                [body.new_description, body.article_title],
            )
        except Exception:
            raise HTTPException(501, detail="Article not unique")


@router.delete("/article/component/{component_id:int}")
def delete_article_component(component_id: int, req: Request):
    requires_authentication(req)
    with Database() as db:
        try:
            query = """DELETE FROM components WHERE id=%s;"""
            db.execute(query, [component_id])
        except Exception as e:
            raise HTTPException(500, detail=str(e))


def get_last_component_order(db: Database, article_id: int):
    out = db.execute_return(
        """SELECT coalesce(max(components.component_order) + 1, 0) FROM components
           WHERE article_id=%s""",
        [article_id],
    )
    if out is not None:
        return out[0][0]
    else:
        raise Exception("Not found")


def get_component_id_from_order(db: Database, article_id: int, component_order: int):
    out = db.execute_return(
        """SELECT id FROM components WHERE article_id = %s AND component_order = %s;""",
        [article_id, component_order],
    )
    if out is not None:
        return out[0][0]
    else:
        raise Exception("Not found")


def insert_component(db: Database, article_id: int):
    last_component_order = get_last_component_order(db, article_id)
    query = """INSERT INTO components (article_id, component_order) 
               VALUES (%s, %s);"""
    db.execute(query, [article_id, last_component_order])
    return get_component_id_from_order(db, article_id, last_component_order)


class UploadArticleTextComponent(CamelModel):
    article_id: int
    markdown: str


@router.post("/article/component/text")
def upload_article_text_component(body: UploadArticleTextComponent, req: Request):
    requires_authentication(req)
    with Database() as db:
        try:
            component_id = insert_component(db, body.article_id)
            query = """INSERT INTO text_components (component_id, markdown) 
                    VALUES (%s, %s);"""
            db.execute(query, [component_id, body.markdown])
        except Exception as e:
            raise HTTPException(500, detail=str(e))


class EditArticleTextComponent(CamelModel):
    component_id: int
    new_markdown: str


@router.put("/article/component/text")
def edit_article_text_component(body: EditArticleTextComponent, req: Request):
    requires_authentication(req)
    with Database() as db:
        try:
            query = """UPDATE text_components SET markdown=%s WHERE component_id=%s;"""
            db.execute(query, [body.new_markdown, body.component_id])
        except Exception as e:
            raise HTTPException(500, detail=str(e))


class UploadArticleProteinComponent(CamelModel):
    article_id: int
    name: str
    aligned_with_name: str | None = None


@router.post("/article/component/protein")
def upload_article_protein_component(body: UploadArticleProteinComponent, req: Request):
    requires_authentication(req)
    with Database() as db:
        try:
            component_id = insert_component(db, body.article_id)
            query = """INSERT INTO protein_components (component_id, name, aligned_with_name) 
                    VALUES (%s, %s, %s);"""
            db.execute(query, [component_id, body.name, body.aligned_with_name])
        except Exception as e:
            raise HTTPException(500, detail=str(e))


class EditArticleProteinComponent(CamelModel):
    component_id: int
    new_name: str | None = None
    new_aligned_with_name: str | None = None


@router.put("/article/component/protein")
def edit_article_protein_component(body: EditArticleProteinComponent, req: Request):
    requires_authentication(req)
    with Database() as db:
        try:
            query = """UPDATE protein_components SET name=%s, aligned_with_name=%s WHERE component_id=%s;"""
            db.execute(
                query,
                [body.new_name, body.new_aligned_with_name, body.component_id],
            )
        except Exception as e:
            raise HTTPException(500, detail=str(e))


class UploadArticleImageComponent(CamelModel):
    article_id: int
    src: str
    width: int | None = None
    height: int | None = None


@router.post("/article/component/image")
def upload_article_image_component(body: UploadArticleImageComponent, req: Request):
    requires_authentication(req)
    with Database() as db:
        try:
            component_id = insert_component(db, body.article_id)
            query = """INSERT INTO image_components (component_id, src, height, width) 
                    VALUES (%s, %s, %s, %s);"""
            db.execute(
                query,
                [
                    component_id,
                    str_to_bytea(body.src),
                    body.width,
                    body.height,
                ],
            )
        except Exception as e:
            raise HTTPException(500, detail=str(e))


class EditArticleImageComponent(CamelModel):
    component_id: int
    new_src: str | None = None
    new_height: int | None = None
    new_width: int | None = None


@router.put("/article/component/image")
def edit_article_image_component(body: EditArticleImageComponent, req: Request):
    requires_authentication(req)
    with Database() as db:
        try:
            if body.new_src is not None:
                db.execute(
                    """UPDATE image_components SET src=%s WHERE component_id=%s;""",
                    [body.new_src, body.component_id],
                )

            db.execute(
                """UPDATE image_components SET width=%s, height=%s WHERE component_id=%s;""",
                [body.new_width, body.new_height, body.component_id],
            )

        except Exception as e:
            raise HTTPException(500, detail=str(e))
