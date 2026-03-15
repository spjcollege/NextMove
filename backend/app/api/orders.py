from fastapi import APIRouter, HTTPException
from app.api.products import PRODUCTS

router = APIRouter(prefix="/orders", tags=["Orders"])

ORDERS = []

@router.post("/place")
def place_order(order: dict):

    items = order["items"]

    for item in items:

        for product in PRODUCTS:

            if product["id"] == item["id"]:

                if product["stock"] <= 0:
                    raise HTTPException(
                        status_code=400,
                        detail=f"{product['name']} out of stock"
                    )

                product["stock"] -= 1

    ORDERS.append(order)

    return {
        "message": "Order placed successfully",
        "order": order
    }


@router.get("/")
def get_orders():
    return ORDERS