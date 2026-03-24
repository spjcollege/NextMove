from fastapi import APIRouter, HTTPException
from datetime import datetime

router = APIRouter(prefix="/community", tags=["Community"])

# 🔥 In-memory storage
MESSAGES = []

# 🔥 Import subscriptions
from app.api.courses import SUBSCRIPTIONS

# 🔐 CHECK IF USER IS SUBSCRIBER
def is_subscriber(user):
    return any(s["user"] == user for s in SUBSCRIPTIONS)


@router.get("/{user}")
def get_messages(user: str):

    if not is_subscriber(user):
        raise HTTPException(status_code=403, detail="Subscribe to access community")

    return MESSAGES


@router.post("/post")
def post_message(data: dict):

    user = data.get("user")

    if not is_subscriber(user):
        raise HTTPException(status_code=403, detail="Only subscribers allowed")

    message = {
        "user": user,
        "text": data.get("text"),
        "time": datetime.now().strftime("%H:%M")
    }

    MESSAGES.append(message)

    return {"message": "Posted"}