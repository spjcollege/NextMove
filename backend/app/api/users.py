from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/users", tags=["Users"])

USERS_DB = []

class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    address: str | None = None
    phone: str | None = None

@router.post("/register")
def register_user(user: UserCreate):

    USERS_DB.append(user.dict())

    return {
        "message": "User registered successfully",
        "user": user
    }