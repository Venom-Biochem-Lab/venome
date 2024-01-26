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