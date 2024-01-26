from fastapi import APIRouter
import logging as log
from passlib.hash import bcrypt
from ..api_types import  LoginBody, LoginError, ResponseToken
from ..db import Database, bytea_to_str, str_to_bytea
from ..auth import authenticateToken, generateAuthToken

router = APIRouter()

#TODO: Change response model?     
@router.post("/users/login", response_model=ResponseToken | LoginError)
def login(body: LoginBody):
    with Database() as db:
        try:
            email = body.email
            password = body.password

            query = """SELECT users.pword, users.admin FROM users WHERE users.email = %s;"""
            entry_sql = db.execute_return(query, [email])

            
            if entry_sql is None or len(entry_sql) == 0:
                # TODO: Once we're done testing this, change this from DEBUG_ACCOUNT to INCORRECT
                return LoginError.DEBUG_ACCOUNT
            
            password_hash, admin = entry_sql[0]

            # If the password is not correct, return something else.
            if not bcrypt.verify(password, password_hash):
                # TODO: Once we're done testing this, change this from DEBUG_PASSWORD to INCORRECT
                return LoginError.DEBUG_PASSWORD
            
            # Generates the token and returns
            token = generateAuthToken(email, admin)
            return ResponseToken(token=token)
                
        except Exception as e:
            log.error(e)
            # TODO: Return something better than query error
            return LoginError.QUERY_ERROR