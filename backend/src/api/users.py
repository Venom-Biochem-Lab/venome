from fastapi import APIRouter
import logging as log
from passlib.hash import bcrypt
from ..api_types import LoginBody, LoginResponse
from ..db import Database
from ..auth import generate_auth_token
from fastapi.exceptions import HTTPException

router = APIRouter()


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
