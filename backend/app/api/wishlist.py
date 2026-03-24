from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db import get_db, WishlistItem, Product, User
from app.auth_utils import get_current_user

router = APIRouter(prefix="/wishlist", tags=["Wishlist"])


@router.get("/")
def get_wishlist(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    items = db.query(WishlistItem).filter(WishlistItem.user_id == user.id).all()
    result = []
    for item in items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if product:
            result.append({
                "id": item.id,
                "product_id": product.id,
                "name": product.name,
                "price": product.price,
                "original_price": product.original_price,
                "image_url": product.image_url,
                "rating_avg": product.rating_avg,
                "stock": product.stock,
                "added_at": str(item.created_at),
            })
    return result


@router.post("/{product_id}")
def add_to_wishlist(
    product_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    existing = db.query(WishlistItem).filter(
        WishlistItem.user_id == user.id,
        WishlistItem.product_id == product_id,
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already in wishlist")

    item = WishlistItem(user_id=user.id, product_id=product_id)
    db.add(item)
    db.commit()
    return {"message": "Added to wishlist"}


@router.delete("/{product_id}")
def remove_from_wishlist(
    product_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    item = db.query(WishlistItem).filter(
        WishlistItem.user_id == user.id,
        WishlistItem.product_id == product_id,
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Not in wishlist")

    db.delete(item)
    db.commit()
    return {"message": "Removed from wishlist"}
