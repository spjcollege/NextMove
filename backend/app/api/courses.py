from fastapi import APIRouter

router = APIRouter(prefix="/courses", tags=["Courses"])

# 🔥 Dummy Courses
COURSES = [
    {
        "id": 1,
        "title": "Chess Basics for Beginners",
        "price": 499,
        "duration": "1 Month",
        "content": ["Intro", "Piece Movement", "Basic Checkmates"]
    },
    {
        "id": 2,
        "title": "Intermediate Chess Strategy",
        "price": 999,
        "duration": "2 Months",
        "content": ["Openings", "Tactics", "Endgames"]
    },
    {
        "id": 3,
        "title": "Advanced Tournament Play",
        "price": 1499,
        "duration": "3 Months",
        "content": ["Deep Strategy", "Psychology", "Game Analysis"]
    }
]

# 🔥 USER SUBSCRIPTIONS
SUBSCRIPTIONS = []

@router.get("/")
def get_courses():
    return COURSES


@router.post("/subscribe")
def subscribe(data: dict):

    subscription = {
        "user": data.get("user"),
        "course_id": data.get("course_id")
    }

    SUBSCRIPTIONS.append(subscription)

    return {"message": "Subscribed successfully"}


@router.get("/user/{user}")
def get_user_courses(user: str):
    user_courses = [
        s["course_id"] for s in SUBSCRIPTIONS if s["user"] == user
    ]

    return [c for c in COURSES if c["id"] in user_courses]