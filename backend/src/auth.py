"""This module handles authentication and authorization for the application."""

from datetime import datetime, timezone, timedelta
import logging as log
from os import getenv

from jwt import encode, decode
from jwt.exceptions import InvalidTokenError, DecodeError

from dotenv import load_dotenv

from fastapi.requests import Request
from fastapi.exceptions import HTTPException

from src.user_types import UserAuthType

load_dotenv()

SECRET_KEY = getenv('SECRET_KEY')


def generate_auth_token(email, admin):
    """Create a JWT token for the user with the given email and admin status.

    Args:
        email (str): The user's email address.
        admin (bool): Whether the user is an admin or not.
    Returns:
        str: The generated JWT token.
    """
    payload = {
        "email": email,
        "admin": admin,
        "exp": datetime.now(tz=timezone.utc) + timedelta(hours=24),
    }
    return encode(payload, SECRET_KEY, algorithm="HS256")


def authenticate_token(token):
    """Check if the token is valid and return the token if it is.

    Args:
        token (str): The token to authenticate.
    Returns:
        dict: The decoded token if valid, None otherwise.
    """
    try:
        # Valid token is always is in the form "Bearer [token]",
        # so we need to slice off the "Bearer" portion.
        sliced_token = token[7:]
        decoded = decode(sliced_token, SECRET_KEY, algorithms=["HS256"])
        log.warning("Valid token")
        return decoded

    # If the token is invalid, return None.
    except (InvalidTokenError, DecodeError) as err:
        log.error("Invalid token: %s", err)
        return None


# Use this function with a request if you want.
def requires_authentication(auth_type: UserAuthType, req: Request):
    """Check if the request has a valid token and
    if the user has the correct role.

    Args:
        auth_type (UserAuthType): The type of authentication required.
        req (Request): The request object.
    """

    # no header at all
    if "authorization" not in req.headers:
        raise HTTPException(status_code=403, detail="Unauthorized")

    # verify token is good if provided
    user_info = authenticate_token(req.headers["authorization"])
    if not user_info:
        log.error("Unauthorized User")
        raise HTTPException(status_code=403, detail="Unauthorized")

    # Check if admin access is required
    if auth_type == UserAuthType.ADMIN and not user_info.get("admin"):
        log.error("Admin access required")
        raise HTTPException(status_code=403, detail="Admin access required")

    log.warning("User authorized.")
