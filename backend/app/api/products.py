from fastapi import APIRouter

router = APIRouter(prefix="/products", tags=["Products"])

PRODUCTS = [
    {"id": 1, "name": "Wooden Chess Board", "price": 1200},
    {"id": 2, "name": "Weighted Chess Pieces", "price": 900},
    {"id": 3, "name": "Digital Chess Clock", "price": 1500},
    {"id": 4, "name": "Beginner Chess Set", "price": 800},
]

@router.get("/")
def get_products():
    return PRODUCTS