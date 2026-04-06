from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db import get_db, User, Order, Product, Enrollment, UserActivity, OrderItem
from app.auth_utils import get_current_user

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/dashboard")
def get_dashboard_stats(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Forbidden: Admin access required")
    
    # Sales Data
    total_revenue = db.query(func.sum(Order.total)).scalar() or 0.0
    total_orders = db.query(func.count(Order.id)).scalar() or 0
    
    # Marketing / User Data
    total_users = db.query(func.count(User.id)).scalar() or 0
    total_enrollments = db.query(func.count(Enrollment.id)).scalar() or 0
    
    # Activity
    total_activities = db.query(func.count(UserActivity.id)).scalar() or 0

    # Recent Orders (last 5)
    recent_orders_query = db.query(Order).order_by(Order.created_at.desc()).limit(5).all()
    recent_orders = []
    for order in recent_orders_query:
        # Find usernames for a better dashboard experience
        order_user = db.query(User).filter(User.id == order.user_id).first()
        recent_orders.append({
            "id": order.id,
            "user": order_user.username if order_user else "Unknown",
            "status": order.status,
            "total": order.total,
            "created_at": str(order.created_at)
        })

    # Top selling products Group By
    top_products_query = db.query(
        OrderItem.product_id,
        func.sum(OrderItem.quantity).label('total_sold')
    ).group_by(OrderItem.product_id).order_by(func.sum(OrderItem.quantity).desc()).limit(5).all()

    top_products = []
    for tp in top_products_query:
        product = db.query(Product).filter(Product.id == tp.product_id).first()
        if product:
            top_products.append({
                "id": product.id,
                "name": product.name,
                "total_sold": tp.total_sold,
                "revenue": tp.total_sold * product.price
            })

    return {
        "sales": {
            "total_revenue": total_revenue,
            "total_orders": total_orders,
            "recent_orders": recent_orders,
            "top_products": top_products
        },
        "marketing": {
            "total_users": total_users,
            "total_enrollments": total_enrollments,
            "total_activities": total_activities
        }
    }
