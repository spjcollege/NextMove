from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db import get_db, Review, Product, User
from app.auth_utils import get_current_user

router = APIRouter(prefix="/reviews", tags=["Reviews"])


class ReviewRequest(BaseModel):
    rating: int  # 1-5
    title: str = ""
    text: str = ""


@router.get("/product/{product_id}")
def get_product_reviews(product_id: int, db: Session = Depends(get_db)):
    reviews = db.query(Review).filter(Review.product_id == product_id).order_by(
        Review.created_at.desc()
    ).all()

    result = []
    for r in reviews:
        user = db.query(User).filter(User.id == r.user_id).first()
        result.append({
            "id": r.id,
            "rating": r.rating,
            "title": r.title,
            "text": r.text,
            "username": user.username if user else "Unknown",
            "avatar_url": user.avatar_url if user else "",
            "created_at": str(r.created_at),
        })
    return result


@router.post("/product/{product_id}")
def post_review(
    product_id: int,
    data: ReviewRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if data.rating < 1 or data.rating > 5:
        raise HTTPException(status_code=400, detail="Rating must be 1-5")

    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Check if user already reviewed
    existing = db.query(Review).filter(
        Review.user_id == user.id,
        Review.product_id == product_id,
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="You already reviewed this product")

    review = Review(
        user_id=user.id,
        product_id=product_id,
        rating=data.rating,
        title=data.title,
        text=data.text,
    )
    db.add(review)

    # Update product rating
    all_reviews = db.query(Review).filter(Review.product_id == product_id).all()
    total_rating = sum(r.rating for r in all_reviews) + data.rating
    count = len(all_reviews) + 1
    product.rating_avg = total_rating / count
    product.rating_count = count

    db.commit()
    return {"message": "Review posted"}
