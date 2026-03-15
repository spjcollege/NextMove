from fastapi import APIRouter, HTTPException

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