from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt
from utils.security import SECRET_KEY, ALGORITHM

security = HTTPBearer()

def user_required(
    cred: HTTPAuthorizationCredentials = Depends(security)
):
    try:
        payload = jwt.decode(
            cred.credentials,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
        return int(payload["sub"])
    except:
        raise HTTPException(401, "Invalid token")
