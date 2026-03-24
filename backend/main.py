from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import products, users, auth, orders, courses, community

app = FastAPI(title="NextMove API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router)
app.include_router(users.router)
app.include_router(auth.router)
app.include_router(orders.router)
app.include_router(courses.router)      # 🔥 NEW
app.include_router(community.router)    # 🔥 NEW

@app.get("/")
def root():
    return {"message": "NextMove backend is running"}