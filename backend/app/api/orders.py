from fastapi import APIRouter
from app.api.products import PRODUCTS

router = APIRouter(prefix="/orders", tags=["Orders"])

ORDERS = []

@router.post("/place")
def place_order(order: dict):

    # inventory check + update
    for item in order["items"]:
        for product in PRODUCTS:
            if product["id"] == item["id"]:

                if product["stock"] < item["quantity"]:
                    return {"error": f"{product['name']} out of stock"}

                product["stock"] -= item["quantity"]

    ORDERS.append(order)

    return {"message": "Order placed successfully"}

@router.get("/")
def get_orders():
    return ORDERS