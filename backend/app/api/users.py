from fastapi import APIRouter
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/users", tags=["Users"])

# 🔥 USERS STORAGE
USERS_DB = []

# 🔥 FIX: ADD THIS (required for products.py)
USER_ACTIVITY = []


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


# 🔥 TRACK USER ACTIVITY (for CRM)
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

    return {"message": "Tracked successfully"}