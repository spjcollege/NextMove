from fastapi import APIRouter, HTTPException
from collections import Counter
from app.api.users import USER_ACTIVITY

router = APIRouter(prefix="/products", tags=["Products"])

PRODUCTS = [
    {"id":1,"name":"Wooden Tournament Chess Board","price":1500,"stock":10},
    {"id":2,"name":"Weighted Staunton Chess Pieces","price":900,"stock":15},
    {"id":3,"name":"Digital Chess Clock","price":1700,"stock":8},
    {"id":4,"name":"Magnetic Travel Chess Set","price":600,"stock":20},
    {"id":5,"name":"Luxury Marble Chess Board","price":3500,"stock":5},
    {"id":6,"name":"Professional Chess Pieces Set","price":2000,"stock":12},
    {"id":7,"name":"Chess Opening Book","price":500,"stock":25},
    {"id":8,"name":"Foldable Tournament Board","price":1100,"stock":18},
    {"id":9,"name":"Chess Notation Scorebook","price":350,"stock":30}
]


@router.get("/")
def get_products():
    return PRODUCTS


@router.get("/{product_id}")
def get_product(product_id:int):
    for product in PRODUCTS:
        if product["id"] == product_id:
            return product

    raise HTTPException(status_code=404, detail="Product not found")


# 🔥 CRM BASED RECOMMENDATIONS
@router.get("/recommend/{user_id}")
def recommend_products(user_id: str):

    user_data = [a for a in USER_ACTIVITY if a["user_id"] == user_id]

    if not user_data:
        return PRODUCTS[:3]

    product_ids = [a["product_id"] for a in user_data]
    most_common = Counter(product_ids).most_common(1)

    if not most_common:
        return PRODUCTS[:3]

    preferred_id = most_common[0][0]

    return [p for p in PRODUCTS if p["id"] != preferred_id][:3]