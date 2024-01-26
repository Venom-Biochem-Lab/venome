import jwt
import datetime

#TODO: This method of secret key generation is, obviously, extremely unsafe.
# This needs to be changed.
secretKey = "SuperSecret"

def generateAuthToken(userId, admin):
    payload = {
        "email": userId,
        "admin": admin,
        "exp": datetime.datetime.now(tz=timezone.utc) + datetime.timedelta(seconds=30)
    }
    return 