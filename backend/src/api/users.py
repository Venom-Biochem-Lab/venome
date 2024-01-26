from fastapi import APIRouter
import logging as log
from passlib.hash import bcrypt
from ..api_types import  LoginBody, UploadError, ResponseToken
from ..db import Database, bytea_to_str, str_to_bytea
from ..auth import authenticateToken, generateAuthToken

router = APIRouter()

#TODO: Change response model?     
@router.post("/users/login", response_model=UploadError)
def login(body: LoginBody):
    with Database() as db:
        try:
            email = body.email
            password = body.password

            query = """SELECT users.password, users.admin WHERE users.email = %s;"""
            entry_sql = db.execute_return(query, [email])

            password_hash, admin = entry_sql

            # If the password is not correct, return something else.
            if not bcrypt.verify(password, hash):
                # TODO: Return something better than query error
                return UploadError.QUERY_ERROR
            
            # Generates the token and returns
            token = generateAuthToken(email, password)
            return ResponseToken(token=token)
                
        except Exception as e:
            log.error(e)
            # TODO: Return something better than query error
            return UploadError.QUERY_ERROR