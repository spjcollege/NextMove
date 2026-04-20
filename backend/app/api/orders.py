from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List
from app.db import get_db, Order, OrderItem, Product, UserActivity, User
from app.auth_utils import get_current_user

router = APIRouter(prefix="/orders", tags=["Orders"])


class OrderItemRequest(BaseModel):
    product_id: int
    quantity: int


class PlaceOrderRequest(BaseModel):
    items: List[OrderItemRequest]
    address: str = ""
    payment_method: str = "cod"
    points_to_use: int = 0


@router.post("/place")
def place_order(
    data: PlaceOrderRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    total = 0
    order_items = []
    for item in data.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")
        if product.stock < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"{product.name} — only {product.stock} left in stock"
            )

        # Pull strategy: reduce stock
        product.stock -= item.quantity
        item_total = product.price * item.quantity
        total += item_total

        order_items.append(OrderItem(
            product_id=product.id,
            quantity=item.quantity,
            price=product.price,
        ))

        # CRM: track purchase
        db.add(UserActivity(
            user_id=user.id,
            action="purchase",
            product_id=product.id,
        ))

    # Apply loyalty points discount: 1 point = 1 Rupee discount
    discount = 0
    if data.points_to_use > 0:
        if data.points_to_use > user.loyalty_points:
            raise HTTPException(status_code=400, detail="Not enough loyalty points")
        
        # Max discount 50% to prevent abuse
        max_discount = total * 0.5
        discount = min(float(data.points_to_use), max_discount)
        total -= discount
        user.loyalty_points -= int(discount)

    # Earn new points: 1 point per 100 Rs spent
    points_earned = int(total // 100)
    user.loyalty_points += points_earned

    order = Order(
        user_id=user.id,
        total=total,
        address=data.address,
        payment_method=data.payment_method,
        items=order_items,
    )
    db.add(order)
    db.commit()
    db.refresh(order)

    return {
        "message": "Order placed successfully",
        "order_id": order.id,
        "total": total,
    }


@router.get("/")
def get_user_orders(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    orders = db.query(Order).filter(Order.user_id == user.id).order_by(
        Order.created_at.desc()
    ).all()

    result = []
    for order in orders:
        items = []
        for item in order.items:
            product = db.query(Product).filter(Product.id == item.product_id).first()
            items.append({
                "product_id": item.product_id,
                "name": product.name if product else "Unknown",
                "image_url": product.image_url if product else "",
                "quantity": item.quantity,
                "price": item.price,
            })
        result.append({
            "id": order.id,
            "status": order.status,
            "total": order.total,
            "address": order.address,
            "payment_method": order.payment_method,
            "items": items,
            "created_at": str(order.created_at),
        })

    return result


@router.get("/smart-restock")
def smart_restock(db: Session = Depends(get_db)):
    """CRM → SCM integration: restock popular products."""
    activities = db.query(UserActivity).filter(UserActivity.action == "purchase").all()

    demand = {}
    for a in activities:
        if a.product_id:
            demand[a.product_id] = demand.get(a.product_id, 0) + 1

    restocked = []
    for product in db.query(Product).all():
        if demand.get(product.id, 0) >= 2:
            product.stock += 10
            restocked.append(product.name)

    db.commit()
    return {"message": "Smart restock done", "restocked": restocked}