from fastapi import APIRouter
from app.api.products import PRODUCTS
from app.api.users import USER_ACTIVITY

router = APIRouter(prefix="/orders", tags=["Orders"])

ORDERS = []


@router.post("/place")
def place_order(order: dict):

    for item in order["items"]:
        for product in PRODUCTS:

            if product["id"] == item["id"]:

                if product["stock"] < item["quantity"]:
                    return {"error": f"{product['name']} out of stock"}

                # 🔥 PULL STRATEGY
                product["stock"] -= item["quantity"]

                # 🔥 CRM TRACK PURCHASE
                USER_ACTIVITY.append({
                    "user_id": order.get("user"),
                    "action": "purchase",
                    "product_id": product["id"]
                })

    ORDERS.append(order)

    return {"message": "Order placed successfully"}


@router.get("/")
def get_orders():
    return ORDERS


# 🔥 CRM → SCM INTEGRATION
@router.get("/smart-restock")
def smart_restock():

    demand = {}

    for a in USER_ACTIVITY:
        if a["action"] == "purchase":
            pid = a["product_id"]
            demand[pid] = demand.get(pid, 0) + 1

    for product in PRODUCTS:
        if demand.get(product["id"], 0) >= 2:
            product["stock"] += 10  # PUSH STRATEGY

    return {"message": "Smart restock done"}