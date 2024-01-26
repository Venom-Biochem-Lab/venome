import jwt
from datetime import datetime, timezone, timedelta

#TODO: This method of secret key generation is, obviously, extremely unsafe.
# This needs to be changed.
secret_key = "SuperSecret"

def generateAuthToken(userId, admin):
    payload = {
        "email": userId,
        "admin": admin,
        "exp": datetime.now(tz=timezone.utc) + timedelta(hours=24)
    }
    return jwt.encode(payload, secret_key, algorithm="HS256")

def authenticateToken(token):
    # Return the decoded token if it's valid.
    try:
        decoded = jwt.decode(token, secret_key, algorithms="HS256")
        return decoded
    
    # If the token is invalid, return None.
    except Exception:
        return None