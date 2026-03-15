from fastapi import APIRouter

router = APIRouter(prefix="/products", tags=["Products"])

PRODUCTS = [

    {"id":1,"name":"Wooden Tournament Chess Board","price":1500},
    {"id":2,"name":"Weighted Staunton Chess Pieces","price":900},
    {"id":3,"name":"Digital Chess Clock","price":1700},
    {"id":4,"name":"Magnetic Travel Chess Set","price":600},
    {"id":5,"name":"Luxury Marble Chess Board","price":3500},
    {"id":6,"name":"Professional Chess Pieces Set","price":2000},
    {"id":7,"name":"Chess Opening Book","price":500},
    {"id":8,"name":"Foldable Tournament Board","price":1100},
    {"id":9,"name":"Chess Notation Scorebook","price":350}

]

@router.get("/")
def get_products():
    return PRODUCTS