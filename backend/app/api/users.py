from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/users", tags=["Users"])

USERS = []

class UserCreate(BaseModel):
    name: str
    email: str
    password: str

@router.post("/register")
def register_user(user: UserCreate):
    USERS.append(user)
    return {"message": "User registered successfully", "user": user}