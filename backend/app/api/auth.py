from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db import get_db, User
from app.auth_utils import (
    hash_password, verify_password, create_access_token, get_current_user
)

router = APIRouter(prefix="/auth", tags=["Auth"])


class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str
    full_name: str = ""


class LoginRequest(BaseModel):
    username: str
    password: str


def _user_dict(user: User):
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "full_name": user.full_name,
        "avatar_url": user.avatar_url,
        "bio": user.bio,
        "rating": user.rating,
        "puzzle_rating": user.puzzle_rating,
        "subscription_tier": user.subscription_tier,
        "is_admin": user.is_admin,
        "created_at": str(user.created_at),
    }


@router.post("/register")
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    # Check duplicates
    if db.query(User).filter(User.username == data.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        username=data.username,
        email=data.email,
        hashed_password=hash_password(data.password),
        full_name=data.full_name,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": user.id})
    return {"token": token, "user": _user_dict(user)}


@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == data.username).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user.id})
    return {"token": token, "user": _user_dict(user)}


@router.get("/me")
def get_me(user: User = Depends(get_current_user)):
    return _user_dict(user)


@router.put("/profile")
def update_profile(data: dict, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    for field in ["full_name", "bio", "phone", "address", "avatar_url"]:
        if field in data:
            setattr(user, field, data[field])
    db.commit()
    db.refresh(user)
    return _user_dict(user)