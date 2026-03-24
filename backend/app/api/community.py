from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db import get_db, CommunityMessage, User
from app.auth_utils import get_current_user

router = APIRouter(prefix="/community", tags=["Community"])


@router.get("/messages")
def get_messages(db: Session = Depends(get_db)):
    messages = db.query(CommunityMessage).order_by(
        CommunityMessage.created_at.desc()
    ).limit(100).all()

    result = []
    for m in messages:
        user = db.query(User).filter(User.id == m.user_id).first()
        result.append({
            "id": m.id,
            "text": m.text,
            "username": user.username if user else "Unknown",
            "avatar_url": user.avatar_url if user else "",
            "created_at": str(m.created_at),
        })
    return result


@router.post("/messages")
def post_message(
    data: dict,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    text = data.get("text", "").strip()
    if not text:
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    msg = CommunityMessage(user_id=user.id, text=text)
    db.add(msg)
    db.commit()
    return {"message": "Posted"}