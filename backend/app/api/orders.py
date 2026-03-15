from fastapi import APIRouter

router = APIRouter(prefix="/orders", tags=["Orders"])

ORDERS = []

@router.post("/place")
def place_order(order: dict):

    ORDERS.append(order)

    return {
        "message": "Order placed successfully",
        "order": order
    }

@router.get("/")
def get_orders():
    return ORDERS