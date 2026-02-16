from fastapi import FastAPI
from app.api import products, users

app = FastAPI(title="NextMove API")

app.include_router(products.router)
app.include_router(users.router)


@app.get("/")
def root():
    return {"message": "NextMove backend is running"}