"""Adds API routes for user management"""

import logging as log

from fastapi import APIRouter
from fastapi.requests import Request
from fastapi.exceptions import HTTPException

import bcrypt

from src.auth import generate_auth_token
from src.db import Database, DatabaseException

from src.user_types import (
    UserLoginBody,
    UserLoginResponse,
    UserSignupBody,
    UserIDResponse,
    UserEntry,
    UserEditBody,
    UserProteinResponse,
    UserAuthType,
)
from src.auth import requires_authentication


router = APIRouter()


@router.post("/users/signup", status_code=201)
def signup(body: UserSignupBody):
    """Creates a new user account.

    Args:
        body (UserSignupBody): The request body containing user signup info.
    """
    with Database() as db:
        hashed_password = bcrypt.hashpw(
            body.password.encode("utf-8"), bcrypt.gensalt(12))
        query = """
            INSERT INTO users(username, email, pword, admin)
            VALUES (%s, %s, %s, false);
            """
        try:
            db.execute(query, [body.username, body.email, hashed_password])
        except DatabaseException as e:
            log.error(e)
            raise HTTPException(
                status_code=400,
                detail=f"User already exists or invalid data provided. ({e})"
            ) from e


@router.post("/users/login", response_model=UserLoginResponse, status_code=200)
def login(body: UserLoginBody):
    """Logs in a user and returns a JWT token and user ID.

        Args:
            body (UserLoginBody): The request body containing
            user login information.
        Returns:
            UserLoginResponse: The response containing the
            JWT token, user ID.
        """
    with Database() as db:
        email = body.email
        password = body.password

        query = """
                SELECT users.pword, users.admin, users.id
                FROM users WHERE users.email = %s;
                """

        try:
            response = db.execute_return(query, [email])
        except DatabaseException as e:
            log.error(e)
            raise HTTPException(
                status_code=500,
                detail=f"Error occurred while logging in: {e}"
            ) from e

        # Returns error message if there is no such account.
        if response is None or len(response) == 0:
            log.error("No such account: %s", email)
            raise HTTPException(
                status_code=404,
                detail="No account found with that email address."
            )

        # Grabs the stored hash and admin status.
        password_hash, admin, user_id = response[0]

        # Returns error message if password is incorrect.
        if not bcrypt.checkpw(
            password.encode("utf-8"),
            password_hash.encode("utf-8")
        ):
            log.warning("Incorrect password for account: %s", email)
            raise HTTPException(
                status_code=401,
                detail="Incorrect password."
            )

        # Generates the token and returns
        token = generate_auth_token(email, admin)
        log.warning("Giving token: %s", token)
        return UserLoginResponse(token=token, user_id=user_id)


@router.get("/users/", response_model=list[UserEntry], status_code=200)
def get_users(req: Request):
    """Returns a list of all users in the database

    Args:
        req (Request): The request object.
    Returns:
        list[UserEntry]: The response containing a list of users,
        and an error message if any.
    """
    requires_authentication(UserAuthType.ADMIN, req)
    with Database() as db:
        query = """
                SELECT id, username, email, admin FROM users;
                """
        try:
            users_list = db.execute_return(query)
        except DatabaseException as e:
            log.error(e)
            raise HTTPException(
                status_code=500,
                detail=f"Error occurred while fetching users: {e}"
            ) from e

        if users_list is not None:
            users_list.sort(key=lambda user: user[0])
            return [
                UserEntry(
                    id=user[0],
                    username=user[1],
                    email=user[2],
                    admin=user[3],
                )
                for user in users_list
            ],
        else:
            log.error("No users found.")
            raise HTTPException(
                status_code=404,
                detail="No users found."
            )


@router.get("/user/{user_id}", response_model=UserEntry, status_code=200)
def get_user(user_id: int):
    """Returns the user entry for a given user ID.

    Args:
        user_id (int): The user ID to retrieve.
    Returns:
        UserEntry: The response containing the user entry,
        and an error message if any.
    """
    with Database() as db:
        query = """
                SELECT id, username, email, admin FROM users WHERE id = %s;
                """
        try:
            user = db.execute_return(query, [user_id])
        except DatabaseException as e:
            log.error(e)
            raise HTTPException(
                status_code=500,
                detail=f"Error occurred while fetching user: {e}"
            ) from e

        if user is not None:
            return UserEntry(
                id=user[0][0],
                username=user[0][1],
                email=user[0][2],
                admin=user[0][3]
            )
        else:
            log.error("No such user: %s", user_id)
            raise HTTPException(
                status_code=404,
                detail="User not found."
            )


@router.put("/user/{user_id}", status_code=204)
def edit_user(user_id: int, body: UserEditBody, req: Request):
    """Edits a user entry for a given user ID.

    Args:
        user_id (int): The user ID to edit.
        body (UserEditBody): The request body containing user info.
        req (Request): The request object.
    """
    requires_authentication(UserAuthType.ADMIN, req)
    with Database() as db:
        query = """
                UPDATE users SET
                """
        arg_list = []
        if body.username is not None:
            query += """username = %s, """
            arg_list.append(body.username)
        if body.email is not None:
            query += """email = %s, """
            arg_list.append(body.email)
        if body.admin is not None:
            query += """admin = %s, """
            arg_list.append(body.admin)
        query = query[:-2] + """ WHERE id = %s;"""

        try:
            db.execute(query, arg_list + [user_id])
        except DatabaseException as e:
            log.error(e)
            raise HTTPException(
                status_code=500,
                detail=f"Error occurred while editing user: {e}"
            ) from e


@router.delete("/user/{user_id}", status_code=204)
def delete_user(user_id: int, req: Request):
    """Deletes a user entry for a given user ID.

    Args:
        user_id (int): The user ID to delete.
        req (Request): The request object.
    """
    requires_authentication(UserAuthType.ADMIN, req)
    with Database() as db:
        query = """
                DELETE FROM users WHERE id = %s;
                """
        try:
            db.execute(query, [user_id])
        except DatabaseException as e:
            log.error(e)
            raise HTTPException(
                status_code=500,
                detail=f"Error occurred while deleting user: {e}"
            ) from e


@router.get(
    "/user/id/{username}",
    response_model=UserIDResponse,
    status_code=200
)
def get_user_id(username: str):
    """Returns the user ID for a given username.

    Args:
        username (str): The username to retrieve the ID for.
    Returns:
        UserIDResponse: The response containing the user ID,
        and an error message if any.
    """
    with Database() as db:
        query = """
                SELECT id FROM users WHERE username = %s;
                """
        try:
            user_id = db.execute_return(query, [username])
        except DatabaseException as e:
            log.error(e)
            raise HTTPException(
                status_code=500,
                detail=f"Error occurred while fetching user ID: {e}"
            ) from e

        if user_id is not None:
            return UserIDResponse(id=user_id[0][0])
        else:
            log.error("No such user: %s", username)
            raise HTTPException(
                status_code=404,
                detail="User not found."
            )


@router.get("/user/{user_id}/proteins", response_model=UserProteinResponse)
def get_user_proteins(user_id: int):
    """Returns a list of protein names for a given user ID.

    Args:
        user_id (int): The user ID to retrieve proteins for.
    Returns:
        UserProteinResponse: The response containing a list of protein names,
        and an error message if any.
    """
    with Database() as db:
        query = """
                SELECT proteins.name from proteins
                JOIN requests ON proteins.id = requests.protein_id
                WHERE requests.user_id = %s;
                """
        try:
            proteins = db.execute_return(query, [user_id])
        except DatabaseException as e:
            log.error(e)
            raise HTTPException(
                status_code=500,
                detail=f"Error occurred while fetching user proteins: {e}"
            ) from e
        if proteins is not None:
            return UserProteinResponse(
                proteins=[protein[0] for protein in proteins]
            )
        else:
            log.error("No proteins found for user: %s", user_id)
            raise HTTPException(
                status_code=404,
                detail="No proteins found for this user."
            )
