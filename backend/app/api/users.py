from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db import get_db, User, UserActivity
from app.auth_utils import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/{username}")
def get_user_profile(username: str, db: Session = Depends(get_db)):
    """Public user profile."""
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": user.id,
        "username": user.username,
        "full_name": user.full_name,
        "avatar_url": user.avatar_url,
        "bio": user.bio,
        "rating": user.rating,
        "puzzle_rating": user.puzzle_rating,
        "subscription_tier": user.subscription_tier,
        "created_at": str(user.created_at),
    }


@router.post("/track")
def track_activity(
    data: dict,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    activity = UserActivity(
        user_id=user.id,
        action=data.get("action", "view"),
        product_id=data.get("product_id"),
        extra_data=str(data.get("extra_data", "")),
    )
    db.add(activity)
    db.commit()
    return {"message": "Tracked"}