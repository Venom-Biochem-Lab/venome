from fastapi import APIRouter
import logging as log
from api_types import  LoginBody, UploadError
from db import Database, bytea_to_str, str_to_bytea

router = APIRouter()

def validateUser(email, password):
    #TODO: Implement validate user
    pass

@router.get("/users/login", response_model=UploadError)
def login(body: LoginBody):
    with Database() as db:
        try:
            authenticated = validateUser(
                body.email,
                body.password
            )
            if authenticated:
                query = """SELECT users.admin WHERE users.email = %s"""
                entry_sql = db.execute_return(query, [body.email])
                log.warn(entry_sql)

                # Proceed only if we got a result back
                if entry_sql is not None and len(entry_sql) != 0:
                    #return the only entry
                    only_returned_entry = entry_sql[0]
                    admin = only_returned_entry

                # TODO: Generate an authentication token
                token = 1
                
                user = 0
                # Grab user from DB
                admin = 0 if 

        except Exception as e:
            log.error(e)