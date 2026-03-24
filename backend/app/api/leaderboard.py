from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db import get_db, User, PuzzleAttempt, Order, ForumPost

router = APIRouter(prefix="/leaderboard", tags=["Leaderboard"])


@router.get("/puzzles")
def puzzle_leaderboard(db: Session = Depends(get_db)):
    users = db.query(User).order_by(User.puzzle_rating.desc()).limit(20).all()
    return [
        {
            "rank": i + 1,
            "username": u.username,
            "avatar_url": u.avatar_url,
            "puzzle_rating": u.puzzle_rating,
            "subscription_tier": u.subscription_tier,
        }
        for i, u in enumerate(users)
    ]


@router.get("/community")
def community_leaderboard(db: Session = Depends(get_db)):
    """Most active community members by forum posts."""
    results = (
        db.query(
            User.id,
            User.username,
            User.avatar_url,
            func.count(ForumPost.id).label("post_count"),
        )
        .join(ForumPost, ForumPost.user_id == User.id)
        .group_by(User.id)
        .order_by(func.count(ForumPost.id).desc())
        .limit(20)
        .all()
    )
    return [
        {
            "rank": i + 1,
            "username": r.username,
            "avatar_url": r.avatar_url,
            "post_count": r.post_count,
        }
        for i, r in enumerate(results)
    ]


@router.get("/players")
def player_leaderboard(db: Session = Depends(get_db)):
    users = db.query(User).order_by(User.rating.desc()).limit(20).all()
    return [
        {
            "rank": i + 1,
            "username": u.username,
            "avatar_url": u.avatar_url,
            "rating": u.rating,
            "subscription_tier": u.subscription_tier,
        }
        for i, u in enumerate(users)
    ]
