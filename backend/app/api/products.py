from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.db import get_db, Product, UserActivity
from app.auth_utils import get_optional_user, get_current_user
import json

router = APIRouter(prefix="/products", tags=["Products"])


def _product_dict(p: Product):
    return {
        "id": p.id,
        "name": p.name,
        "description": p.description,
        "price": p.price,
        "original_price": p.original_price,
        "stock": p.stock,
        "category": p.category,
        "image_url": p.image_url,
        "images": json.loads(p.images) if p.images else [],
        "rating_avg": round(p.rating_avg, 1),
        "rating_count": p.rating_count,
        "is_featured": p.is_featured,
    }


@router.get("/")
def get_products(
    category: str = None,
    search: str = None,
    sort: str = None,  # price_asc, price_desc, rating, newest
    min_price: float = None,
    max_price: float = None,
    db: Session = Depends(get_db),
):
    query = db.query(Product)

    if category:
        query = query.filter(Product.category == category)
    if search:
        query = query.filter(
            or_(
                Product.name.ilike(f"%{search}%"),
                Product.description.ilike(f"%{search}%"),
            )
        )
    if min_price is not None:
        query = query.filter(Product.price >= min_price)
    if max_price is not None:
        query = query.filter(Product.price <= max_price)

    if sort == "price_asc":
        query = query.order_by(Product.price.asc())
    elif sort == "price_desc":
        query = query.order_by(Product.price.desc())
    elif sort == "rating":
        query = query.order_by(Product.rating_avg.desc())
    elif sort == "newest":
        query = query.order_by(Product.created_at.desc())

    products = query.all()
    return [_product_dict(p) for p in products]


@router.get("/featured")
def get_featured(db: Session = Depends(get_db)):
    products = db.query(Product).filter(Product.is_featured == True).limit(6).all()
    return [_product_dict(p) for p in products]


@router.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    cats = db.query(Product.category).distinct().all()
    return [c[0] for c in cats if c[0]]


@router.get("/{product_id}")
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Product not found")
    return _product_dict(product)


@router.get("/recommend/{user_id}")
def recommend_products(user_id: int, db: Session = Depends(get_db)):
    """CRM-based recommendations."""
    activities = db.query(UserActivity).filter(
        UserActivity.user_id == user_id,
        UserActivity.action == "purchase"
    ).all()

    if not activities:
        # Return featured or top-rated products
        products = db.query(Product).order_by(Product.rating_avg.desc()).limit(4).all()
        return [_product_dict(p) for p in products]

    # Find products user hasn't purchased
    purchased_ids = {a.product_id for a in activities if a.product_id}
    products = db.query(Product).filter(
        Product.id.notin_(purchased_ids)
    ).order_by(Product.rating_avg.desc()).limit(4).all()
    return [_product_dict(p) for p in products]