
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/users", tags=["Users"])

USERS_DB = []

class UserCreate(BaseModel):

    name: str
    email: str
    password: str



@router.post("/register")
def register_user(user: UserCreate):

    USERS_DB.append(user.dict())

    return {
        "message": "User registered successfully",
        "user": {"id": new_user.id, "username": new_user.username}
    }


# 🔥 CRM TRACKING
@router.post("/track")
def track_user(data: dict):
    activity = {
        "user_id": data.get("userId"),
        "action": data.get("action"),
        "product_id": data.get("productId"),
        "price": data.get("price"),
        "timestamp": datetime.now()
    }

    USER_ACTIVITY.append(activity)

    return {"message": "Tracked"}