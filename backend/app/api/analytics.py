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

    # Inventory Stats
    total_items = db.query(func.count(Product.id)).scalar() or 0
    total_stock_value = db.query(func.sum(Product.price * Product.stock)).scalar() or 0.0
    low_stock_items_query = db.query(Product).filter(Product.stock < 5).all()
    low_stock_items = [{
        "id": p.id,
        "name": p.name,
        "stock": p.stock,
        "price": p.price
    } for p in low_stock_items_query]

    # Category Performance
    categories = db.query(Product.category).distinct().all()
    category_perf = []
    for (cat_name,) in categories:
        # Average price in category
        avg_price = db.query(func.avg(Product.price)).filter(Product.category == cat_name).scalar() or 0
        # Total sold in category
        cat_sold = db.query(func.sum(OrderItem.quantity))\
            .join(Product)\
            .filter(Product.category == cat_name).scalar() or 0
        # Revenue in category
        cat_revenue = db.query(func.sum(OrderItem.quantity * OrderItem.price))\
            .join(Product)\
            .filter(Product.category == cat_name).scalar() or 0
        
        category_perf.append({
            "category": cat_name,
            "sold": cat_sold,
            "revenue": cat_revenue,
            "avg_price": avg_price
        })

    # Recent Registrations (Marketing)
    recent_users = db.query(User).order_by(User.created_at.desc()).limit(5).all()
    recent_registrations = [{
        "id": u.id,
        "username": u.username,
        "created_at": str(u.created_at)
    } for u in recent_users]

    return {
        "sales": {
            "total_revenue": total_revenue,
            "total_orders": total_orders,
            "recent_orders": recent_orders,
            "top_products": top_products
        },
        "inventory": {
            "total_items": total_items,
            "total_stock_value": total_stock_value,
            "low_stock_items": low_stock_items
        },
        "category_performance": category_perf,
        "marketing": {
            "total_users": total_users,
            "total_enrollments": total_enrollments,
            "total_activities": total_activities,
            "recent_registrations": recent_registrations
        }
    }
