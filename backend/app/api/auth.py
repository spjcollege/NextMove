
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db import SessionLocal, User


router = APIRouter(prefix="/auth", tags=["Auth"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class Login(BaseModel):
    username: str
    password: str



@router.post("/login")
def login_user(data: Login, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == data.username).first()
    if user and user.password == data.password:
        return {
            "message": "Login successful",
            "user": {"id": user.id, "username": user.username}
        }
    raise HTTPException(
        status_code=401,
        detail="Invalid credentials"
    )