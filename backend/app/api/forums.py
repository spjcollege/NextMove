from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db import get_db, ForumPost, ForumComment, User
from app.auth_utils import get_current_user

router = APIRouter(prefix="/forums", tags=["Forums"])


class CreatePostRequest(BaseModel):
    title: str
    content: str
    category: str = "general"


class CreateCommentRequest(BaseModel):
    content: str


@router.get("/")
def get_posts(
    category: str = None,
    db: Session = Depends(get_db),
):
    query = db.query(ForumPost).order_by(ForumPost.is_pinned.desc(), ForumPost.created_at.desc())
    if category:
        query = query.filter(ForumPost.category == category)
    posts = query.all()

    result = []
    for p in posts:
        user = db.query(User).filter(User.id == p.user_id).first()
        result.append({
            "id": p.id,
            "title": p.title,
            "content": p.content[:200],  # preview
            "category": p.category,
            "likes": p.likes,
            "views": p.views,
            "is_pinned": p.is_pinned,
            "comment_count": len(p.comments),
            "username": user.username if user else "Unknown",
            "avatar_url": user.avatar_url if user else "",
            "created_at": str(p.created_at),
        })
    return result


@router.get("/{post_id}")
def get_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(ForumPost).filter(ForumPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    post.views += 1
    db.commit()

    user = db.query(User).filter(User.id == post.user_id).first()
    comments = []
    for c in post.comments:
        c_user = db.query(User).filter(User.id == c.user_id).first()
        comments.append({
            "id": c.id,
            "content": c.content,
            "likes": c.likes,
            "username": c_user.username if c_user else "Unknown",
            "avatar_url": c_user.avatar_url if c_user else "",
            "created_at": str(c.created_at),
        })

    return {
        "id": post.id,
        "title": post.title,
        "content": post.content,
        "category": post.category,
        "likes": post.likes,
        "views": post.views,
        "is_pinned": post.is_pinned,
        "username": user.username if user else "Unknown",
        "avatar_url": user.avatar_url if user else "",
        "created_at": str(post.created_at),
        "comments": comments,
    }


@router.post("/")
def create_post(
    data: CreatePostRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    post = ForumPost(
        user_id=user.id,
        title=data.title,
        content=data.content,
        category=data.category,
    )
    db.add(post)
    db.commit()
    db.refresh(post)
    return {"message": "Post created", "post_id": post.id}


@router.post("/{post_id}/comment")
def add_comment(
    post_id: int,
    data: CreateCommentRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    post = db.query(ForumPost).filter(ForumPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    comment = ForumComment(
        post_id=post_id,
        user_id=user.id,
        content=data.content,
    )
    db.add(comment)
    db.commit()
    return {"message": "Comment added"}


@router.post("/{post_id}/like")
def like_post(
    post_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    post = db.query(ForumPost).filter(ForumPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    post.likes += 1
    db.commit()
    return {"likes": post.likes}
