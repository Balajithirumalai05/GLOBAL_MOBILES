from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database.db import get_db
from models.catalog import Admin
from utils.security import verify_password, create_access_token

router = APIRouter(prefix="/admin/auth", tags=["Admin Auth"])


class LoginRequest(BaseModel):
    username: str
    password: str


@router.post("/login")
def admin_login(
    data: LoginRequest,
    db: Session = Depends(get_db)
):
    admin = db.query(Admin)\
        .filter(Admin.username == data.username)\
        .first()

    if not admin or not verify_password(data.password, admin.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": admin.username})

    return {
        "access_token": token,
        "token_type": "bearer"
    }
