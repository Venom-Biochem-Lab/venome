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


# THIS METHOD IS NOT WORKING YET
@router.post("/users/signup", response_model=None)
def signup(body: LoginBody):
    # I used this method to print out the hash and manually put into the database as users
    log.warn(f"{body.email} {bcrypt.hash(body.password)}")
    raise HTTPException(404, "signup not implemented yet")
