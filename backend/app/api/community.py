from fastapi import APIRouter, HTTPException, Depends, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from typing import List
import json

from app.db import get_db, CommunityMessage, User, SessionLocal
from app.auth_utils import get_current_user
from app.auth_utils import SECRET_KEY, ALGORITHM
from jose import jwt, JWTError

router = APIRouter(prefix="/community", tags=["Community"])


# ─── WebSocket Connection Manager ───
class ConnectionManager:
    def __init__(self):
        self.active: List[WebSocket] = []

    async def connect(self, ws: WebSocket):
        await ws.accept()
        self.active.append(ws)

    def disconnect(self, ws: WebSocket):
        if ws in self.active:
            self.active.remove(ws)

    async def broadcast(self, message: dict):
        dead = []
        for connection in self.active:
            try:
                await connection.send_text(json.dumps(message))
            except Exception:
                dead.append(connection)
        for d in dead:
            self.disconnect(d)


manager = ConnectionManager()


# ─── Helper: decode token from query param ───
def _get_user_from_token(token: str, db: Session):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        uid = int(payload.get("sub"))
        return db.query(User).filter(User.id == uid).first()
    except (JWTError, TypeError, ValueError):
        return None


# ─── WebSocket Endpoint ───
@router.websocket("/ws")
async def community_ws(ws: WebSocket, token: str = ""):
    await manager.connect(ws)
    db: Session = SessionLocal()
    try:
        # Send message history on connect
        messages = db.query(CommunityMessage).order_by(
            CommunityMessage.created_at.asc()
        ).limit(50).all()
        history = []
        for m in messages:
            u = db.query(User).filter(User.id == m.user_id).first()
            history.append({
                "id": m.id,
                "text": m.text,
                "username": u.username if u else "Unknown",
                "created_at": str(m.created_at),
                "type": "history"
            })
        await ws.send_text(json.dumps({"type": "history", "messages": history}))

        # Listen for incoming messages
        while True:
            data = await ws.receive_text()
            payload = json.loads(data)
            text = payload.get("text", "").strip()
            if not text:
                continue

            # Authenticate the sender
            user = _get_user_from_token(token, db)
            if not user:
                await ws.send_text(json.dumps({"type": "error", "detail": "Not authenticated"}))
                continue

            # Persist to DB
            msg = CommunityMessage(user_id=user.id, text=text)
            db.add(msg)
            db.commit()
            db.refresh(msg)

            # Broadcast to all connected clients
            await manager.broadcast({
                "type": "message",
                "id": msg.id,
                "text": msg.text,
                "username": user.username,
                "created_at": str(msg.created_at),
            })

    except WebSocketDisconnect:
        manager.disconnect(ws)
    except Exception:
        manager.disconnect(ws)
    finally:
        db.close()


# ─── Existing HTTP endpoints (kept for backwards compatibility) ───
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