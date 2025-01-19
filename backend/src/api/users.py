"""Adds routes for user management to FastAPI."""

import logging as log

from fastapi import APIRouter
from fastapi.exceptions import HTTPException
from passlib.hash import bcrypt
from src.api_types import (
    LoginBody,
    LoginResponse,
    SignupBody,
    SignupResponse,
    UserIDResponse,
    UserResponse,
    UsersResponse,
    UserBody,
)
from src.auth import generate_auth_token
from src.db import Database

router = APIRouter()


@router.post("/users/signup", response_model=SignupResponse | None)
def signup(body: SignupBody):
    with Database() as db:
        hashed_password = bcrypt.hash(body.password)
        query = """INSERT INTO users(username, email, pword, admin) VALUES (%s, %s, %s, false);"""
        try:
            db.execute(query, [body.username, body.email, hashed_password])
            return SignupResponse(error="")
        except Exception as e:
            log.error(e)
            return SignupResponse(error="Server error.")


@router.post("/users/login", response_model=LoginResponse | None)
def login(body: LoginBody):
    with Database() as db:
        try:
            email = body.email
            password = body.password

            query = (
                """SELECT users.pword, users.admin FROM users WHERE users.email = %s;"""
            )
            entry_sql = db.execute_return(query, [email])

            # Returns "incorrect email/password" message if there is no such account.
            if entry_sql is None or len(entry_sql) == 0:
                return LoginResponse(token="", error="Invalid Email or Password")

            # Grabs the stored hash and admin status.
            password_hash, admin = entry_sql[0]

            # Returns "incorrect email/password" message if password is incorrect.
            if not bcrypt.verify(password, password_hash):
                return LoginResponse(token="", error="Invalid Email or Password")

            # Generates the token and returns
            token = generate_auth_token(email, admin)
            log.warn(
                f"Giving token: {token}",
            )
            return LoginResponse(token=token, error="")

        except Exception as e:
            log.error(e)
            # TODO: Return something better than query error
            return LoginResponse(token="", error="Server error.")


# THIS METHOD IS NOT WORKING YET and email is treated as username
@router.post("/users/admin/signup", response_model=None)
def admin_signup(body: LoginBody):
    # currently raise exception, since we don't have a frontend and we don't want people to create admin accounts this easily
    raise HTTPException(404, "signup not secure so not executing")
    with Database() as db:
        hashed_password = bcrypt.hash(body.password)
        query = """INSERT INTO users(username, email, pword, admin) VALUES (%s, %s, %s, %s);"""
        try:
            db.execute(query, [body.email, body.email, hashed_password, True])
        except Exception:
            raise HTTPException(501, "signup insert failed")


@router.get("/users/", response_model=UsersResponse)
def get_users():
    with Database() as db:
        query = """SELECT id, username, email, admin FROM users;"""
        users_list = db.execute_return(query)
        if users_list is not None:
            users_list.sort(key=lambda user: user[0])
            return UsersResponse(
                users=[
                    UserResponse(
                        id=user[0], username=user[1], email=user[2], admin=user[3]
                    )
                    for user in users_list
                ]
            )
        else:
            return UsersResponse(users=[])


@router.get("/user/id/{username}", response_model=UserIDResponse)
def get_user_id(username: str):
    with Database() as db:
        query = """SELECT id FROM users WHERE username = %s;"""
        user_id = db.execute_return(query, [username])
        if user_id is not None:
            return UserIDResponse(id=user_id[0][0])
        else:
            return UserIDResponse(id=-1)


@router.get("/user/{id}", response_model=UserResponse)
def get_user(user_id: int):
    with Database() as db:
        query = """SELECT id, username, email, admin FROM users WHERE id = %s;"""
        user = db.execute_return(query, [user_id])
        if user is not None:
            return UserResponse(
                id=user[0][0], username=user[0][1], email=user[0][2], admin=user[0][3]
            )
        else:
            return UserResponse(id=user_id, username="", email="", admin=False)


@router.put("/user/{id}", response_model=None)
def edit_user(user_id: int, body: UserBody):
    with Database() as db:
        query = """UPDATE users SET """
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
        except Exception as e:
            log.error(e)
            return None
        return None


@router.delete("/user/{id}", response_model=None)
def delete_user(user_id: int):
    with Database() as db:
        query = """DELETE FROM users WHERE id = %s;"""
        try:
            db.execute(query, [user_id])
        except Exception as e:
            log.error(e)
            return None
        return None
