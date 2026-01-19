from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from utils.security import SECRET_KEY, ALGORITHM

security = HTTPBearer()

def admin_required(
    cred: HTTPAuthorizationCredentials = Depends(security)
):
    try:
        payload = jwt.decode(
            cred.credentials,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )
        return payload["sub"]
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
