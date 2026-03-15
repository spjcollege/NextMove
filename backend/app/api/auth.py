from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.api.users import USERS_DB

router = APIRouter(prefix="/auth", tags=["Auth"])

class Login(BaseModel):

    email: str
    password: str


@router.post("/login")
def login_user(data: Login):

    for user in USERS_DB:

        if user["email"] == data.email and user["password"] == data.password:

            return {
                "message": "Login successful",
                "user": user
            }

    raise HTTPException(
        status_code=401,
        detail="Invalid credentials"
    )