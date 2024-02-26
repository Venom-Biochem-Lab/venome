import jwt
from datetime import datetime, timezone, timedelta
from fastapi.requests import Request
from fastapi import HTTPException

# TODO: This method of secret key generation is, obviously, extremely unsafe.
# This needs to be changed.
secret_key = "SuperSecret"


def generateAuthToken(userId, admin):
    payload = {
        "email": userId,
        "admin": admin,
        "exp": datetime.now(tz=timezone.utc) + timedelta(hours=24),
    }
    return jwt.encode(payload, secret_key, algorithm="HS256")


def authenticateToken(token):
    # Return the decoded token if it's valid.
    try:
        # Valid token is always is in the form "Bearer [token]", so we need to slice off the "Bearer" portion.
        sliced_token = token[7:]
        print(sliced_token)
        decoded = jwt.decode(sliced_token, secret_key, algorithms="HS256")
        print("Valid token")
        print(decoded)
        return decoded

    # If the token is invalid, return None.
    except Exception as err:
        print("Invalid token:", err)
        return None


# Use this function with a request if you want.
def requiresAuthentication(req: Request):
    userInfo = authenticateToken(req.headers["authorization"])
    if not userInfo or not userInfo.get("admin"):
        print("Unauthorized User")
        raise HTTPException(status_code=403, detail="Unauthorized")
    else:
        print("User authorized.")
