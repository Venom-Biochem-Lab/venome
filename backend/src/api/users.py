from fastapi import APIRouter, Response
import logging as log
from passlib.hash import bcrypt
from ..api_types import LoginBody, LoginResponse
from ..db import Database
from ..auth import generateAuthToken

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

            # Grabs the stored hash and admin.
            password_hash, admin = entry_sql[0]

            # Returns "incorrect email/password" message if password is incorrect.
            if not bcrypt.verify(password, password_hash):
                return LoginResponse(token="", error="Invalid Email or Password")

            # Generates the token and returns
            token = generateAuthToken(email, admin)
            return LoginResponse(token=token, error="")

        except Exception as e:
            log.error(e)
            # TODO: Return something better than query error
            return LoginResponse(token="", error="Server error.")
