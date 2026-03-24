from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db import get_db, NewsArticle

router = APIRouter(prefix="/news", tags=["News"])


@router.get("/")
def get_news(
    category: str = None,
    db: Session = Depends(get_db),
):
    query = db.query(NewsArticle).order_by(NewsArticle.created_at.desc())
    if category:
        query = query.filter(NewsArticle.category == category)
    articles = query.limit(20).all()

    return [
        {
            "id": a.id,
            "title": a.title,
            "summary": a.summary,
            "content": a.content,
            "image_url": a.image_url,
            "author": a.author,
            "category": a.category,
            "created_at": str(a.created_at),
        }
        for a in articles
    ]


@router.get("/{article_id}")
def get_article(article_id: int, db: Session = Depends(get_db)):
    from fastapi import HTTPException
    article = db.query(NewsArticle).filter(NewsArticle.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return {
        "id": article.id,
        "title": article.title,
        "summary": article.summary,
        "content": article.content,
        "image_url": article.image_url,
        "author": article.author,
        "category": article.category,
        "created_at": str(article.created_at),
    }
