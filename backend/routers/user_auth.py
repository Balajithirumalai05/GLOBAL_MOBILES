from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.db import get_db
from models.catalog import User
from passlib.context import CryptContext
from jose import jwt
from pydantic import BaseModel
from sqlalchemy import or_

from utils.security import SECRET_KEY, ALGORITHM

router = APIRouter(prefix="/auth", tags=["User Auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)


# ================= REGISTER =================
class RegisterSchema(BaseModel):
    name: str
    email: str
    password: str


@router.post("/register")
def register_user(data: RegisterSchema, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(400, "Email already exists")

    user = User(
        name=data.name,
        email=data.email,
        password=hash_password(data.password)
    )

    db.add(user)
    db.commit()

    return {"message": "User registered successfully"}


# ================= LOGIN =================
class LoginSchema(BaseModel):
    email: str
    password: str
@router.post("/login")
def login_user(data: LoginSchema, db: Session = Depends(get_db)):
    user = (
        db.query(User)
        .filter(
            or_(
                User.email == data.email,
                User.name == data.email   # allow username login
            )
        )
        .first()
    )

    if not user:
        raise HTTPException(401, "Invalid credentials")

    if not verify_password(data.password, user.password):
        raise HTTPException(401, "Invalid credentials")

    token = jwt.encode(
        {"sub": str(user.id)},
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return {
        "token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email
        }
    }