"""Adds API routes for article management"""

import logging as log

from fastapi import APIRouter
from fastapi.exceptions import HTTPException
from fastapi.requests import Request

from src.user_types import UserAuthType
from src.db import Database, bytea_to_str, str_to_bytea, DatabaseException
from src.auth import requires_authentication
from src.api.protein import format_protein_name

from src.article_types import (
    ArticleImageComponent,
    ArticleTextComponent,
    ArticleProteinComponent,
    ArticleEntry,
    ArticleUploadBody,
    ArticleMetadataEditBody,
    ArticleTextUploadBody,
    ArticleTextEditBody,
    ArticleProteinUploadBody,
    ArticleProteinEditBody,
    ArticleImageUploadBody,
    ArticleImageEditBody,
    ComponentType,
    InsertComponent,
    InsertBlankComponentEnd,
    MoveComponent
)


router = APIRouter()


@router.get(
    "/article/meta/{article_id:int}/components/text",
    response_model=list[ArticleTextComponent],
    status_code=200
)
def get_text_components(article_id: int):
    """Get all text components for a given article ID.
    Args:
        article_id (int): ID of the article.
    Returns:
        list[ArticleTextComponent]: List of text components for the article.
    """
    with Database() as db:
        query = """
                SELECT
                components.id,
                components.component_order,
                text_components.markdown
                FROM components
                JOIN text_components
                ON text_components.component_id = components.id
                WHERE components.article_id = %s;
                """
        try:
            res = db.execute_return(query, [article_id])
        except DatabaseException as e:
            log.error(e)
            raise HTTPException(
                status_code=500,
                detail=f"Error occurred while fetching text components: {e}"
            ) from e
        if res is not None:
            return [
                ArticleTextComponent(
                    id=i,
                    component_order=c,
                    markdown=m
                ) for [i, c, m] in res
            ]
        else:
            log.warning(
                "No text components found for article ID %s", article_id)
            raise HTTPException(
                status_code=404,
                detail="No text components found for this article."
            )


@router.get(
    "/article/meta/{article_id:int}/components/protein",
    response_model=list[ArticleProteinComponent],
    status_code=200
)
def get_protein_components(article_id: int):
    """Get all protein components for a given article ID.

    Args:
        article_id (int): ID of the article.
    Returns:
        list[ArticleProteinComponent]: List of protein components for the
        article.
    """
    with Database() as db:
        query = """
                SELECT components.id,
                components.component_order,
                protein_components.name,
                protein_components.aligned_with_name
                FROM components
                JOIN protein_components
                ON protein_components.component_id = components.id
                WHERE components.article_id = %s;
                """
        try:
            res = db.execute_return(query, [article_id])
        except DatabaseException as e:
            log.error(e)
            raise HTTPException(
                status_code=500,
                detail=f"Error occurred while fetching protein components: {e}"
            ) from e
        if res is not None:
            return [
                ArticleProteinComponent(
                    id=i,
                    component_order=c,
                    name=n,
                    aligned_with_name=a,
                ) for [i, c, n, a] in res
            ]
        else:
            log.warning(
                "No protein components found for article ID %s", article_id)
            raise HTTPException(
                status_code=404,
                detail="No protein components found for this article."
            )


@router.get(
    "/article/meta/{article_id:int}/components/image",
    response_model=list[ArticleImageComponent],
    status_code=200
)
def get_image_components(article_id: int):
    """Get all image components for a given article ID.
    Args:
        article_id (int): ID of the article.
    Returns:
        list[ArticleImageComponent]: List of image components for the article.
    """
    with Database() as db:
        query = """
                SELECT components.id,
                components.component_order,
                image_components.src,
                image_components.width,
                image_components.height
                FROM components
                JOIN image_components
                ON image_components.component_id = components.id
                WHERE components.article_id = %s;
                """
        try:
            res = db.execute_return(query, [article_id])
        except DatabaseException as e:
            log.error(e)
            raise HTTPException(
                status_code=500,
                detail=f"Error occurred while fetching image components: {e}"
            ) from e
        if res is not None:
            return [
                ArticleImageComponent(
                    id=i,
                    component_order=c,
                    src=bytea_to_str(src_bytes),
                    width=width,
                    height=height
                ) for [i, c, src_bytes, width, height] in res
            ]
        else:
            log.warning(
                "No image components found for article ID %s", article_id)
            raise HTTPException(
                status_code=404,
                detail="No image components found for this article."
            )


@router.get(
    "/article/meta/{article_id:int}/components",
    response_model=tuple[str, str, str, str],
    status_code=200
)
def get_article_metadata(article_id: int):
    """Get metadata for a given article ID.
    Args:
        article_id (int): ID of the article.
    Returns:
        tuple: A tuple containing the title, description, date_published,
        and refs of the article.
    """
    with Database() as db:
        query = """
                SELECT title, description, date_published, refs
                FROM articles
                WHERE id = %s;
                """
        try:
            res = db.execute_return(query, [article_id])
        except DatabaseException as e:
            log.error(e)
            raise HTTPException(
                status_code=500,
                detail=f"Error occurred while fetching article metadata: {e}"
            ) from e
        if res is not None:
            [title, description, date_published, refs] = res[0]
            return (title, description, date_published, refs)
        else:
            log.error(
                "No metadata found for article ID %s", article_id)
            raise HTTPException(
                status_code=404,
                detail="No metadata found for this article."
            )


@router.get(
    "/article/meta/all",
    response_model=list[ArticleEntry],
    status_code=200
)
def get_all_articles_metadata():
    """Get all articles metadata.
    Returns:
        list[ArticleEntry]: List of all articles with their metadata.
    """
    with Database() as db:
        try:
            res = db.execute_return(
                """
                SELECT id, title, description, date_published
                FROM articles
                ORDER BY date_published ASC;
                """
            )
        except DatabaseException as e:
            log.error(e)
            raise HTTPException(
                status_code=500,
                detail=(
                    f"Error occurred while fetching all articles metadata: {e}"
                )
            ) from e
        if res is not None:
            return [
                ArticleEntry(
                    id=id,
                    title=title,
                    description=description,
                    date_published=str(date_published),
                    ordered_components=[],
                ) for [id, title, description, date_published] in res
            ]
        else:
            log.error("No articles found")
            raise HTTPException(
                status_code=404,
                detail="No articles found."
            )


@router.get(
    "/article/meta/{article_id:int}",
    response_model=ArticleEntry,
    status_code=200
)
def get_article(article_id: int):
    """Get article entry by ID.

    Args:
        id (int): ID of the article

    Returns:
        Article: The article object containing the article ID,
        title, description, date published, and ordered components.
    """

    try:
        # this will fail if the article id does not exist
        title, description, date_published, refs = get_article_metadata(
            article_id
        )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid article ID: {e}"
        ) from e

    try:
        text_components = get_text_components(article_id)
        protein_components = get_protein_components(article_id)
        image_components = get_image_components(article_id)
        ordered_components = sorted(
            [*text_components, *protein_components, *image_components],
            key=lambda x: x.component_order,
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error occurred while fetching article components: {e}"
        ) from e

    return ArticleEntry(
        id=article_id,
        title=title,
        ordered_components=ordered_components,
        description=description,
        date_published=date_published,
        refs=refs,
    )


@router.post("/article/meta/upload")
def upload_article(body: ArticleUploadBody, req: Request):
    """Upload an article.
    Args:
        body (ArticleUploadBody): The article upload body
        containing the article title and description.
        req (Request): The request object.
    """
    requires_authentication(UserAuthType.ADMIN, req)
    with Database() as db:
        try:
            query = """
                    INSERT INTO articles (title, description)
                    VALUES (%s, %s);
                    """
            db.execute(query, [body.title, body.description])
        except DatabaseException as e:
            log.error(e)
            raise HTTPException(
                status_code=500,
                detail=f"Error occurred while uploading article: {e}"
            ) from e


@router.delete("/article/meta/{article_id:int}", status_code=200)
def delete_article(article_id: int, req: Request):
    """Deletes an article by ID.
    Args:
        article_id (int): ID of the article to delete.
        req (Request): The request object.
    """
    requires_authentication(UserAuthType.ADMIN, req)
    with Database() as db:
        try:
            query = """DELETE FROM articles WHERE id=%s;"""
            db.execute(query, [article_id])
        except Exception as e:
            log.error(e)
            raise HTTPException(
                status_code=500,
                detail=f"Error occurred while deleting article: {e}"
            ) from e


@router.put("/article/meta", status_code=200)
def edit_article_metadata(body: ArticleMetadataEditBody, req: Request):
    """Edit article metadata.
    Args:
        body (ArticleMetadataEditBody): The article metadata edit body
        containing the article title, new title, new description, and new
        references.
        req (Request): The request object.
    """
    requires_authentication(UserAuthType.ADMIN, req)
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
        except DatabaseException as e:
            log.error(e)
            raise HTTPException(
                status_code=500,
                detail=f"Error occurred while editing article metadata: {e}"
            ) from e


def dec_order(db: Database, article_id: int, component_order: int):
    """Decrement the order of components in the database.
    Args:
        db (Database): Database connection object.
        article_id (int): ID of the article.
        component_order (int): The component order to decrement.
    """
    # We want to dec components >= component_order at the article_id
    db.execute(
        """
        UPDATE components set component_order = component_order - 1
        WHERE article_id = %s AND component_order >= %s;""",
        [article_id, component_order],
    )


@router.delete(
    "/article/{article_id:int}/component/{component_id:int}", status_code=200
)
def delete_article_component(article_id: int, component_id: int, req: Request):
    """Deletes an article component by ID.
    Args:
        article_id (int): ID of the article.
        component_id (int): ID of the component to delete.
        req (Request): The request object.
    """
    requires_authentication(UserAuthType.ADMIN, req)
    with Database() as db:
        try:
            order = get_order_from_component_id(db, component_id)
            query = """
                    DELETE FROM components WHERE id=%s;
                    """
            db.execute(query, [component_id])
            dec_order(db, article_id, order)
        except DatabaseException as e:
            log.error(e)
            raise HTTPException(
                status_code=500,
                detail=f"Error occurred while deleting article component: {e}"
            ) from e


def get_last_component_order(db: Database, article_id: int):
    """Get the last component order for a given article ID.
    Args:
        db (Database): Database connection object.
        article_id (int): ID of the article.
    Returns:
        int: The last component order for the article.
    """
    out = db.execute_return(
        """
        SELECT coalesce(max(components.component_order) + 1, 0)
        FROM components
        WHERE article_id=%s""",
        [article_id],
    )
    if out is not None:
        return out[0][0]
    else:
        raise HTTPException(
            status_code=404,
            detail="Couldn't get last component order",
        )


def get_component_id_from_order(
        db: Database,
        article_id: int,
        component_order: int
):
    """Get the component ID for a given article ID and component order.
    Args:
        db (Database): Database connection object.
        article_id (int): ID of the article.
        component_order (int): The component order.
    Returns:
        int: The component ID.
    """
    out = db.execute_return(
        """
        SELECT id FROM components
        WHERE article_id = %s AND component_order = %s;
        """,
        [article_id, component_order],
    )
    if out is not None:
        return out[0][0]
    else:
        raise HTTPException(
            status_code=404,
            detail="Couldn't get component ID from order",
        )


def insert_component(db: Database, article_id: int, component_order: int):
    """Insert a component into an article.
    Args:
        db (Database): Database connection object.
        article_id (int): ID of the article.
        component_order (int): The component order.
    Returns:
        int: The component ID.
    """
    query = """
            INSERT INTO components (article_id, component_order)
            VALUES (%s, %s);
            """
    db.execute(query, [article_id, component_order])
    return get_component_id_from_order(db, article_id, component_order)


def insert_component_to_end(db: Database, article_id: int):
    """Insert a component at the end of an article.
    Args:
        db (Database): Database connection object.
        article_id (int): ID of the article.
    Returns:
        int: The component ID.
    """
    last = get_last_component_order(db, article_id)
    return insert_component(db, article_id, last)


@router.post("/article/component/text", status_code=200)
def upload_article_text_component(
    body: ArticleTextUploadBody,
    req: Request
):
    """Upload a text component
    Args:
        body (UploadArticleTextComponent): The article text upload body
        containing the article ID and markdown.
        req (Request): The request object.
    """
    requires_authentication(UserAuthType.ADMIN, req)
    with Database() as db:
        try:
            component_id = insert_component_to_end(db, body.article_id)
            query = """
                    INSERT INTO text_components (component_id, markdown)
                    VALUES (%s, %s);
                    """
            db.execute(query, [component_id, body.markdown])
        except DatabaseException as e:
            raise HTTPException(
                status_code=500,
                detail=(
                    (
                        f"Error occurred while uploading article text "
                        f"component: {e}"
                    )
                )
            ) from e


@router.put("/article/component/text", status_code=200)
def edit_article_text_component(body: ArticleTextEditBody, req: Request):
    """Edit a text component
    Args:
        body (ArticleTextEditBody): The article text edit body
        containing the component ID and new markdown.
        req (Request): The request object.
    """
    requires_authentication(UserAuthType.ADMIN, req)
    with Database() as db:
        try:
            query = """
                    UPDATE text_components
                    SET markdown=%s
                    WHERE component_id=%s;
                    """
            db.execute(query, [body.new_markdown, body.component_id])
        except DatabaseException as e:
            raise HTTPException(
                status_code=500,
                detail=(
                    f"Error occurred while editing article text component: {e}"
                )
            ) from e


@router.post("/article/component/protein", status_code=200)
def upload_article_protein_component(
    body: ArticleProteinUploadBody,
    req: Request
):
    """Upload a protein component
    Args:
        body (ArticleProteinUploadBody): The article protein upload body
        containing the article ID, name, and aligned with name.
        req (Request): The request object.
    """
    requires_authentication(UserAuthType.ADMIN, req)

    # replaces spaces with underscore
    body.name = format_protein_name(body.name)
    if body.aligned_with_name is not None:
        body.aligned_with_name = format_protein_name(body.aligned_with_name)

    with Database() as db:
        try:
            component_id = insert_component_to_end(db, body.article_id)
            query = """
                    INSERT INTO protein_components
                    (component_id, name, aligned_with_name)
                    VALUES (%s, %s, %s);
                    """
            db.execute(query, [component_id, body.name,
                       body.aligned_with_name])
        except DatabaseException as e:
            raise HTTPException(
                status_code=500,
                detail=(
                    f"Error occurred while uploading "
                    f"article protein component: {e}"
                )
            ) from e


@router.put("/article/component/protein", status_code=200)
def edit_article_protein_component(
    body: ArticleProteinEditBody,
    req: Request
):
    """Edit a protein component
    Args:
        body (ArticleProteinEditBody): The article protein edit body
        containing the component ID, new name, and new aligned with name.
        req (Request): The request object.
    """
    requires_authentication(UserAuthType.ADMIN, req)

    # replaces spaces with underscore
    if body.new_name is not None:
        body.new_name = format_protein_name(body.new_name)
    if body.new_aligned_with_name is not None:
        body.new_aligned_with_name = format_protein_name(
            body.new_aligned_with_name)

    with Database() as db:
        try:
            query = """
                    UPDATE protein_components
                    SET name=%s, aligned_with_name=%s
                    WHERE component_id=%s;
                    """
            db.execute(
                query,
                [body.new_name, body.new_aligned_with_name, body.component_id],
            )
        except DatabaseException as e:
            raise HTTPException(
                status_code=500,
                detail=(
                    f"Error occurred while editing "
                    f"article protein component: {e}"
                )
            ) from e


@router.post("/article/component/image", status_code=200)
def upload_article_image_component(
    body: ArticleImageUploadBody,
    req: Request
):
    """Upload an image component
    Args:
        body (ArticleImageUploadBody): The article image upload body
        containing the article ID, source, width, and height.
        req (Request): The request object.
    """
    requires_authentication(UserAuthType.ADMIN, req)
    with Database() as db:
        try:
            component_id = insert_component_to_end(db, body.article_id)
            query = """
                    INSERT INTO image_components
                    (component_id, src, height, width)
                    VALUES (%s, %s, %s, %s);
                    """
            db.execute(
                query,
                [
                    component_id,
                    str_to_bytea(body.src),
                    body.width,
                    body.height,
                ],
            )
        except DatabaseException as e:
            raise HTTPException(
                status_code=500,
                detail=(
                    f"Error occurred while uploading "
                    f"article image component: {e}"
                )
            ) from e


@router.put("/article/component/image", status_code=200)
def edit_article_image_component(
    body: ArticleImageEditBody,
    req: Request
):
    """Edit an image component
    Args:
        body (ArticleImageEditBody): The article image edit body
        containing the component ID, new source, new width, and new height.
        req (Request): The request object.
    """
    requires_authentication(UserAuthType.ADMIN, req)
    with Database() as db:
        try:
            if body.new_src is not None:
                db.execute(
                    """
                    UPDATE image_components
                    SET src=%s
                    WHERE component_id=%s;
                    """,
                    [body.new_src, body.component_id],
                )

            db.execute(
                """
                UPDATE image_components
                SET width=%s, height=%s
                WHERE component_id=%s;
                """,
                [body.new_width, body.new_height, body.component_id],
            )

        except DatabaseException as e:
            raise HTTPException(
                status_code=500,
                detail=(
                    f"Error occurred while editing "
                    f"article image component: {e}"
                )
            ) from e


def inc_order(db: Database, article_id: int, component_order: int):
    """Increment the order of components in an article.
    Args:
        db (Database): Database connection object.
        article_id (int): ID of the article.
        component_order (int): The component order to increment.
    """
    # I want to increment all components >= component_order at the article_id
    db.execute(
        """
        UPDATE components set component_order = component_order + 1
        WHERE article_id = %s
        ND component_order >= %s;
        """,
        [article_id, component_order],
    )


def get_order_from_component_id(db: Database, component_id: int):
    """Get the order of a component by its ID.
    Args:
        db (Database): Database connection object.
        component_id (int): ID of the component.
    Returns:
        int: The component order.
    """
    res = db.execute_return(
        """
        SELECT component_order
        FROM components WHERE id=%s;
        """,
        [component_id]
    )
    if res is not None:
        return res[0][0]
    else:
        raise HTTPException(
            status_code=404,
            detail="Couldn't get component order from ID",
        )


def insert_component_and_shift_rest_down(
    db: Database, article_id: int, component_id: int
):
    """Insert a component and shift the rest down.
    Args:
        db (Database): Database connection object.
        article_id (int): ID of the article.
        component_id (int): ID of the component.
    Returns:
        int: The component ID.
    """
    order = get_order_from_component_id(db, component_id)
    # shift all the other ones down
    inc_order(db, article_id, order)
    # then insert at the old place
    return insert_component(db, article_id, order)


def insert_blank_component(
    db: Database, component_id: int, component_type: ComponentType
):
    """Insert a blank component into the database.
    Args:
        db (Database): Database connection object.
        component_id (int): ID of the component.
        component_type (ComponentType): Type of the component.
    """
    if component_type == "text":
        db.execute(
            """
            INSERT INTO text_components (component_id, markdown)
            VALUES (%s, %s);
            """,
            [component_id, ""],
        )
    elif component_type == "protein":
        db.execute(
            """
            INSERT INTO protein_components (component_id, name)
            VALUES (%s, %s);
            """,
            [component_id, ""],
        )
    elif component_type == "image":
        db.execute(
            """
            INSERT INTO image_components (component_id, src)
            VALUES (%s, %s);
            """,
            [component_id, str_to_bytea("")],
        )


@router.post("/article/component/insert/above", status_code=200)
def insert_component_above(body: InsertComponent, req: Request):
    """Insert a component at the top.
    Args:
        body (InsertComponent): The insert component body
        containing the article ID, component ID, and component type.
        req (Request): The request object.
    """
    requires_authentication(UserAuthType.ADMIN, req)
    with Database() as db:
        try:
            component_id = insert_component_and_shift_rest_down(
                db, body.article_id, body.component_id
            )
            insert_blank_component(db, component_id, body.component_type)

        except DatabaseException as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error occurred while inserting component: {e}"
            ) from e


@router.post("/article/component/insert/blank", status_code=200)
def insert_blank_component_end(body: InsertBlankComponentEnd):
    """Insert a blank component at the end.
    Args:
        body (InsertBlankComponentEnd): The insert blank component body
        containing the article ID and component type.
    """
    with Database() as db:
        try:
            component_id = insert_component_to_end(db, body.article_id)
            insert_blank_component(db, component_id, body.component_type)
        except DatabaseException as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error occurred while inserting blank component: {e}"
            ) from e


def article_length(db: Database, article_id: int):
    """Get the length of an article.
    Args:
        db (Database): Database connection object.
        article_id (int): ID of the article.
    Returns:
        int: The length of the article.
    """
    res = db.execute_return(
        """
        SELECT count(*) FROM components
        WHERE article_id=%s;
        """, [article_id]
    )
    if res is not None:
        return res[0][0]
    else:
        raise HTTPException(
            status_code=404,
            detail="Couldn't get article length",
        )


@router.put("/article/component/move", status_code=200)
def move_component(body: MoveComponent, req: Request):
    """Move a component up or down in the article.
    Args:
        body (MoveComponent): The move component body
        containing the article ID, component ID, and direction.
        req (Request): The request object.
    """
    requires_authentication(UserAuthType.ADMIN, req)
    with Database() as db:
        try:
            cur_order = get_order_from_component_id(db, body.component_id)
            new_order = cur_order + (1 if body.direction == "down" else -1)
            if (
                new_order < 0 or
                new_order >= article_length(db, body.article_id)
            ):
                raise HTTPException(
                    status_code=406,
                    detail="Invalid move direction",
                )

            # update the other component with the current one
            db.execute(
                """
                UPDATE components
                SET component_order=%s
                WHERE article_id=%s AND component_order=%s;
                """,
                [cur_order, body.article_id, new_order],
            )
            db.execute(
                """
                UPDATE components
                SET component_order=%s WHERE id=%s;
                """,
                [new_order, body.component_id],
            )
        except DatabaseException as e:
            raise HTTPException(
                status_code=500,
                detail=(
                    f"Error occurred while moving component: {e}"
                )
            ) from e
