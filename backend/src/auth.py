import jwt
from datetime import datetime, timezone, timedelta
from fastapi.requests import Request
from fastapi import HTTPException
import logging as log
from .api_types import AuthType

# TODO: This method of secret key generation is, obviously, extremely unsafe.
# This needs to be changed.
secret_key = "SuperSecret"


def generate_auth_token(user_id, admin):
    payload = {
        "email": user_id,
        "admin": admin,
        "exp": datetime.now(tz=timezone.utc) + timedelta(hours=24),
    }
    return jwt.encode(payload, secret_key, algorithm="HS256")


def authenticate_token(token):
    # Return the decoded token if it's valid.
    try:
        # Valid token is always is in the form "Bearer [token]", so we need to slice off the "Bearer" portion.
        sliced_token = token[7:]
        log.warn(sliced_token)
        decoded = jwt.decode(sliced_token, secret_key, algorithms=["HS256"])
        log.warn("Valid token")
        log.warn(decoded)
        return decoded

    # If the token is invalid, return None.
    except Exception as err:
        log.error("Invalid token:", err)
        return None


# Use this function with a request if you want.
def requires_authentication(type: AuthType, req: Request):
    # no header at all
    if "authorization" not in req.headers:
        raise HTTPException(status_code=403, detail="Unauthorized")

    # verify token is good if provided
    user_info = authenticate_token(req.headers["authorization"])
    if not user_info:
        log.error("Unauthorized User")
        raise HTTPException(status_code=403, detail="Unauthorized")

    # Check if admin access is required
    if type == AuthType.ADMIN and not user_info.get("admin"):
        log.error("Admin access required")
        raise HTTPException(status_code=403, detail="Admin access required")

    log.warn("User authorized.")
