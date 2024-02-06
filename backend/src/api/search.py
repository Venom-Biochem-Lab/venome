from fastapi import APIRouter
import logging as log

# from ..api_types import LoginBody, LoginResponse
from ..db import Database

router = APIRouter()


@router.post("/search")
def search_proteins():
    log.warn("hello!")
