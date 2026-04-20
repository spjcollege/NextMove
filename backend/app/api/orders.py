from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
import random, string
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
    points_earned = 0
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
        # Earn rate: 1 rupee = 1 point
        item_total = product.price * item.quantity
        points_earned += int(item_total)
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

    # Apply loyalty points discount: 100 points = 10 Rupee discount (1 point = 0.1 Rupee)
    points_to_use = data.points_to_use
    discount = 0
    if points_to_use > 0:
        if points_to_use > user.loyalty_points:
            raise HTTPException(status_code=400, detail="Not enough loyalty points")
        
        # Max discount 50% to prevent abuse
        potential_discount = points_to_use * 0.1
        max_discount = total * 0.5
        discount = min(potential_discount, max_discount)
        
        # If discount capped, adjust points_to_use
        if potential_discount > max_discount:
            points_to_use = int(max_discount * 10)
            discount = max_discount

        total -= discount

    # Calculate net points change
    # points_earned is what you get from order
    # points_to_use is what you spend
    net_points_change = points_earned - points_to_use
    
    if user.loyalty_points + net_points_change < 0:
        raise HTTPException(
            status_code=400, 
            detail=f"Not enough loyalty points. You need {points_to_use} points."
        )

    user.loyalty_points += net_points_change

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
        "points_earned": net_points_change,
        "new_loyalty_points": user.loyalty_points
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


# ─── Tracking helpers ────────────────────────────────────────────────────────

STATUS_FLOW = ["placed", "confirmed", "shipped", "out_for_delivery", "delivered"]

STATUS_LABELS = {
    "placed":           {"label": "Order Placed",      "icon": "📦", "desc": "We've received your order and are processing it."},
    "confirmed":        {"label": "Order Confirmed",    "icon": "✅", "desc": "Your order has been confirmed and is being packed."},
    "shipped":          {"label": "Shipped",            "icon": "🚚", "desc": "Your order is on its way to the delivery hub!"},
    "out_for_delivery": {"label": "Out for Delivery",  "icon": "🛵", "desc": "Your package is out for delivery today."},
    "delivered":        {"label": "Delivered",          "icon": "🎉", "desc": "Your order has been delivered. Enjoy!"},
}

def generate_tracking_number(order_id: int) -> str:
    date_str = datetime.utcnow().strftime("%Y%m%d")
    return f"NXT-{date_str}-{order_id:04d}"

def estimated_delivery_for(status: str, order_created: datetime) -> datetime:
    days_map = {"placed": 7, "confirmed": 5, "shipped": 3, "out_for_delivery": 1, "delivered": 0}
    return order_created + timedelta(days=days_map.get(status, 7))


def _build_order_dict(order: Order, db: Session) -> dict:
    items = []
    for item in order.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        items.append({
            "product_id": item.product_id,
            "name": product.name if product else "Unknown",
            "image_url": product.image_url if product else "",
            "category": product.category if product else "",
            "quantity": item.quantity,
            "price": item.price,
        })

    status_idx = STATUS_FLOW.index(order.status) if order.status in STATUS_FLOW else 0
    timeline = [
        {
            "status": s,
            "label": STATUS_LABELS[s]["label"],
            "icon": STATUS_LABELS[s]["icon"],
            "desc": STATUS_LABELS[s]["desc"],
            "completed": i <= status_idx,
            "active": i == status_idx,
        }
        for i, s in enumerate(STATUS_FLOW)
    ]

    est = order.estimated_delivery or estimated_delivery_for(order.status, order.created_at)

    return {
        "id": order.id,
        "status": order.status,
        "status_label": STATUS_LABELS.get(order.status, {}).get("label", order.status),
        "status_icon": STATUS_LABELS.get(order.status, {}).get("icon", "📦"),
        "tracking_number": order.tracking_number or generate_tracking_number(order.id),
        "total": order.total,
        "address": order.address,
        "payment_method": order.payment_method,
        "items": items,
        "timeline": timeline,
        "estimated_delivery": str(est.date()) if est else None,
        "created_at": str(order.created_at),
        "status_updated_at": str(order.status_updated_at or order.updated_at),
    }


@router.get("/{order_id}")
def get_order_detail(
    order_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get detailed order info including tracking timeline."""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.user_id != user.id and not user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    return _build_order_dict(order, db)


class StatusUpdateRequest(BaseModel):
    status: str


@router.patch("/{order_id}/status")
def update_order_status(
    order_id: int,
    data: StatusUpdateRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Admin: advance order status and auto-generate tracking number."""
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Admin only")
    if data.status not in STATUS_FLOW:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {STATUS_FLOW}")

    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    order.status = data.status
    order.status_updated_at = datetime.utcnow()

    # Auto-assign tracking number when shipped
    if data.status in ("shipped", "out_for_delivery", "delivered") and not order.tracking_number:
        order.tracking_number = generate_tracking_number(order.id)

    # Set estimated delivery when first confirmed
    if data.status == "confirmed" and not order.estimated_delivery:
        order.estimated_delivery = estimated_delivery_for("confirmed", order.created_at)

    db.commit()
    db.refresh(order)
    return _build_order_dict(order, db)