from fastapi import APIRouter
from ..api_types import CamelModel, AuthType
from ..db import Database, bytea_to_str, str_to_bytea
from fastapi.exceptions import HTTPException
from ..auth import requires_authentication
from fastapi.requests import Request
from .protein import format_protein_name
from typing import Literal

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
    refs: str | None = None
    ordered_components: list[
        ArticleTextComponent | ArticleProteinComponent | ArticleImageComponent
    ]


def get_text_components(db: Database, article_id: int):
    query = """SELECT components.id, components.component_order, text_components.markdown FROM components
               JOIN text_components ON text_components.component_id = components.id
               WHERE components.article_id = %s;
                """
    res = db.execute_return(query, [article_id])
    if res is not None:
        return [
            ArticleTextComponent(id=i, component_order=c, markdown=m)
            for [i, c, m] in res
        ]
    return []


def get_protein_components(db: Database, article_id: int):
    query = """SELECT components.id, components.component_order, protein_components.name, protein_components.aligned_with_name FROM components
               JOIN protein_components ON protein_components.component_id = components.id
               WHERE components.article_id = %s;
                """
    res = db.execute_return(query, [article_id])
    if res is not None:
        return [
            ArticleProteinComponent(
                id=i, component_order=c, name=n, aligned_with_name=a
            )
            for [i, c, n, a] in res
        ]
    return []


def get_image_components(db: Database, article_id: int):
    query = """SELECT components.id, components.component_order, image_components.src, image_components.width, image_components.height FROM components
               JOIN image_components ON image_components.component_id = components.id
               WHERE components.article_id = %s;
                """
    res = db.execute_return(query, [article_id])
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


def get_article_metadata(db: Database, article_id: int) -> tuple[str, str, str, str]:
    query = """SELECT title, description, date_published, refs FROM articles WHERE id = %s;"""
    out = db.execute_return(query, [article_id])
    if out is not None:
        [title, description, date_published, refs] = out[0]
        return title, description, str(date_published), refs
    else:
        raise Exception("Nothing returned")


@router.get("/article/meta/{article_id:int}", response_model=Article)
def get_article(article_id: int):
    """get_article

    Args:
        id (int): ID of the article

    Raises:
        HTTPException: status 404 if the article is not found by the given ID
        HTTPException: status 500 if any other errors occur

    Returns:
        Article
    """

    with Database() as db:
        try:
            # this will fail if the article id does not exist
            title, description, date_published, refs = get_article_metadata(
                db, article_id
            )
        except Exception as e:
            raise HTTPException(404, detail=str(e))

        try:
            text_components = get_text_components(db, article_id)
            protein_components = get_protein_components(db, article_id)
            image_components = get_image_components(db, article_id)
            ordered_components = sorted(
                [*text_components, *protein_components, *image_components],
                key=lambda x: x.component_order,
            )
        except Exception as e:
            raise HTTPException(500, detail=str(e))

        return Article(
            id=article_id,
            title=title,
            ordered_components=ordered_components,
            description=description,
            date_published=date_published,
            refs=refs,
        )


@router.get("/article/all/meta", response_model=list[Article])
def get_all_articles_metadata():
    with Database() as db:
        try:
            res = db.execute_return(
                """SELECT id, title, description, date_published FROM articles
                   ORDER BY date_published ASC;"""
            )
            if res is not None:
                return [
                    Article(
                        id=id,
                        title=title,
                        description=description,
                        date_published=str(date_published),
                        ordered_components=[],
                    )
                    for [id, title, description, date_published] in res
                ]
            return []
        except Exception:
            raise HTTPException(500, "Error in with selecting articles")


class ArticleUpload(CamelModel):
    title: str
    description: str | None = None


@router.post("/article/meta/upload")
def upload_article(body: ArticleUpload, req: Request):
    requires_authentication(AuthType.ADMIN, req)
    with Database() as db:
        try:
            query = """INSERT INTO articles (title, description) VALUES (%s, %s);"""
            db.execute(query, [body.title, body.description])
        except Exception as e:
            raise HTTPException(500, detail=str(e))


@router.delete("/article/meta/{article_id:int}")
def delete_article(article_id: int, req: Request):
    requires_authentication(AuthType.ADMIN, req)
    with Database() as db:
        try:
            query = """DELETE FROM articles WHERE id=%s;"""
            db.execute(query, [article_id])
        except Exception as e:
            raise HTTPException(500, detail=str(e))


class EditArticleMetadata(CamelModel):
    article_title: str
    new_article_title: str | None = None
    new_description: str | None = None
    new_refs: str | None = None


@router.put("/article/meta")
def edit_article_metadata(body: EditArticleMetadata, req: Request):
    requires_authentication(AuthType.ADMIN, req)
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
            db.execute(
                """UPDATE articles SET refs = %s WHERE title = %s;""",
                [body.new_refs, body.article_title],
            )
        except Exception:
            raise HTTPException(501, detail="Article not unique")


def dec_order(db: Database, article_id: int, component_order: int):
    # I want to dec components >= component_order at the article_id
    db.execute(
        """UPDATE components set component_order = component_order - 1 
           WHERE article_id = %s AND component_order >= %s;""",
        [article_id, component_order],
    )


@router.delete("/article/{article_id:int}/component/{component_id:int}")
def delete_article_component(article_id: int, component_id: int, req: Request):
    requires_authentication(AuthType.ADMIN, req)
    with Database() as db:
        try:
            order = get_order_from_component_id(db, component_id)
            query = """DELETE FROM components WHERE id=%s;"""
            db.execute(query, [component_id])
            dec_order(db, article_id, order)
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


def insert_component(db: Database, article_id: int, component_order: int):
    query = """INSERT INTO components (article_id, component_order) 
               VALUES (%s, %s);"""
    db.execute(query, [article_id, component_order])
    return get_component_id_from_order(db, article_id, component_order)


def insert_component_to_end(db: Database, article_id: int):
    last = get_last_component_order(db, article_id)
    return insert_component(db, article_id, last)


class UploadArticleTextComponent(CamelModel):
    article_id: int
    markdown: str


@router.post("/article/component/text")
def upload_article_text_component(body: UploadArticleTextComponent, req: Request):
    requires_authentication(AuthType.ADMIN, req)
    with Database() as db:
        try:
            component_id = insert_component_to_end(db, body.article_id)
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
    requires_authentication(AuthType.ADMIN, req)
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
    requires_authentication(AuthType.ADMIN, req)

    # replaces spaces with underscore, which is how proteins are stored in the DB
    body.name = format_protein_name(body.name)
    if body.aligned_with_name is not None:
        body.aligned_with_name = format_protein_name(body.aligned_with_name)

    with Database() as db:
        try:
            component_id = insert_component_to_end(db, body.article_id)
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
    requires_authentication(AuthType.ADMIN, req)

    # replaces spaces with underscore, which is how proteins are stored in the DB
    if body.new_name is not None:
        body.new_name = format_protein_name(body.new_name)
    if body.new_aligned_with_name is not None:
        body.new_aligned_with_name = format_protein_name(body.new_aligned_with_name)

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
    requires_authentication(AuthType.ADMIN, req)
    with Database() as db:
        try:
            component_id = insert_component_to_end(db, body.article_id)
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
    requires_authentication(AuthType.ADMIN, req)
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


def inc_order(db: Database, article_id: int, component_order: int):
    # I want to increment all components >= component_order at the article_id
    db.execute(
        """UPDATE components set component_order = component_order + 1 
           WHERE article_id = %s AND component_order >= %s;""",
        [article_id, component_order],
    )


def get_order_from_component_id(db: Database, component_id: int):
    res = db.execute_return(
        """SELECT component_order FROM components WHERE id=%s;""", [component_id]
    )
    if res is not None:
        return res[0][0]
    else:
        raise Exception("Couldn't find component")


def insert_component_and_shift_rest_down(
    db: Database, article_id: int, component_id: int
):
    order = get_order_from_component_id(db, component_id)
    # shift all the other ones down
    inc_order(db, article_id, order)
    # then insert at the old place
    return insert_component(db, article_id, order)


ComponentType = Literal["text", "image", "protein"]


def insert_blank_component(
    db: Database, component_id: int, component_type: ComponentType
):
    if component_type == "text":
        db.execute(
            "INSERT INTO text_components (component_id, markdown) VALUES (%s, %s);",
            [component_id, ""],
        )
    elif component_type == "protein":
        db.execute(
            """INSERT INTO protein_components (component_id, name) VALUES (%s, %s);""",
            [component_id, ""],
        )
    elif component_type == "image":
        db.execute(
            """INSERT INTO image_components (component_id, src) VALUES (%s, %s);""",
            [component_id, str_to_bytea("")],
        )


class InsertComponent(CamelModel):
    article_id: int
    component_id: int
    component_type: ComponentType = "text"


@router.post("/article/component/insert/above")
def insert_component_above(body: InsertComponent, req: Request):
    requires_authentication(AuthType.ADMIN, req)
    with Database() as db:
        try:
            id = insert_component_and_shift_rest_down(
                db, body.article_id, body.component_id
            )
            insert_blank_component(db, id, body.component_type)

        except Exception:
            raise HTTPException(500, "order shift failed")


class InsertBlankComponentEnd(CamelModel):
    article_id: int
    component_type: ComponentType = "text"


@router.post("/article/component/insert/blank")
def insert_blank_component_end(body: InsertBlankComponentEnd):
    with Database() as db:
        try:
            id = insert_component_to_end(db, body.article_id)
            insert_blank_component(db, id, body.component_type)
        except Exception:
            raise HTTPException(500, "order shift failed")


def article_length(db: Database, article_id: int):
    res = db.execute_return(
        """SELECT count(*) FROM components WHERE article_id=%s""", [article_id]
    )
    if res is not None:
        return res[0][0]
    else:
        raise Exception("fail db length")


class MoveComponent(CamelModel):
    article_id: int
    component_id: int
    direction: Literal["up", "down"]


@router.put("/article/component/move")
def move_component(body: MoveComponent, req: Request):
    requires_authentication(AuthType.ADMIN, req)
    with Database() as db:
        try:
            cur_order = get_order_from_component_id(db, body.component_id)
            new_order = cur_order + (1 if body.direction == "down" else -1)
            if new_order < 0 or new_order >= article_length(db, body.article_id):
                raise Exception("cant move out of bounds, so don't swap at all")

            # update the other component with the current one
            db.execute(
                """UPDATE components SET component_order=%s WHERE article_id=%s AND component_order=%s""",
                [cur_order, body.article_id, new_order],
            )
            db.execute(
                """UPDATE components SET component_order=%s WHERE id=%s""",
                [new_order, body.component_id],
            )
        except Exception:
            raise HTTPException(500, "order shift failed")
