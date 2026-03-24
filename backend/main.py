from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import (
    products, users, auth, orders, courses,
    community, reviews, wishlist, forums, puzzles,
    leaderboard, news
)

app = FastAPI(title="NextMove API", version="2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Register Routers ───
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(orders.router)
app.include_router(users.router)
app.include_router(courses.router)
app.include_router(community.router)
app.include_router(reviews.router)
app.include_router(wishlist.router)
app.include_router(forums.router)
app.include_router(puzzles.router)
app.include_router(leaderboard.router)
app.include_router(news.router)


@app.get("/")
def root():
    return {"message": "NextMove Chess Platform API v2.0"}