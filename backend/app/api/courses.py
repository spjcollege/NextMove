from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List
import json
from app.db import get_db, Course, Lesson, Enrollment, User
from app.auth_utils import get_current_user, get_optional_user

router = APIRouter(prefix="/courses", tags=["Courses"])


def _course_dict(c: Course):
    return {
        "id": c.id,
        "title": c.title,
        "description": c.description,
        "instructor": c.instructor,
        "price": c.price,
        "duration": c.duration,
        "difficulty": c.difficulty,
        "category": c.category,
        "thumbnail": c.thumbnail,
        "is_free": c.is_free,
        "lesson_count": c.lesson_count,
        "enrolled_count": c.enrolled_count,
        "rating_avg": c.rating_avg,
    }


def _lesson_dict(l: Lesson):
    return {
        "id": l.id,
        "title": l.title,
        "content": l.content,
        "video_url": l.video_url,
        "fen_position": l.fen_position,
        "order": l.order,
        "duration_minutes": l.duration_minutes,
    }


@router.get("/")
def get_courses(
    category: str = None,
    difficulty: str = None,
    db: Session = Depends(get_db),
):
    query = db.query(Course)
    if category:
        query = query.filter(Course.category == category)
    if difficulty:
        query = query.filter(Course.difficulty == difficulty)
    return [_course_dict(c) for c in query.all()]


@router.get("/categories")
def get_course_categories(db: Session = Depends(get_db)):
    cats = db.query(Course.category).distinct().all()
    return [c[0] for c in cats if c[0]]


@router.get("/{course_id}")
def get_course(course_id: int, db: Session = Depends(get_db)):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    result = _course_dict(course)
    result["lessons"] = [_lesson_dict(l) for l in course.lessons]
    return result


@router.post("/{course_id}/enroll")
def enroll_course(
    course_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    existing = db.query(Enrollment).filter(
        Enrollment.user_id == user.id,
        Enrollment.course_id == course_id,
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already enrolled")

    enrollment = Enrollment(user_id=user.id, course_id=course_id)
    db.add(enrollment)
    course.enrolled_count += 1
    db.commit()

    return {"message": "Enrolled successfully"}


@router.get("/user/enrolled")
def get_user_enrollments(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    enrollments = db.query(Enrollment).filter(Enrollment.user_id == user.id).all()
    result = []
    for e in enrollments:
        course = db.query(Course).filter(Course.id == e.course_id).first()
        if course:
            d = _course_dict(course)
            d["progress"] = e.progress
            d["completed_lessons"] = json.loads(e.completed_lessons) if e.completed_lessons else []
            d["enrolled_at"] = str(e.enrolled_at)
            result.append(d)
    return result


@router.post("/{course_id}/lessons/{lesson_id}/complete")
def complete_lesson(
    course_id: int,
    lesson_id: int,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    enrollment = db.query(Enrollment).filter(
        Enrollment.user_id == user.id,
        Enrollment.course_id == course_id,
    ).first()
    if not enrollment:
        raise HTTPException(status_code=400, detail="Not enrolled")

    completed = json.loads(enrollment.completed_lessons) if enrollment.completed_lessons else []
    if lesson_id not in completed:
        completed.append(lesson_id)
        enrollment.completed_lessons = json.dumps(completed)

        # Update progress
        course = db.query(Course).filter(Course.id == course_id).first()
        if course and course.lesson_count > 0:
            new_p = round(len(completed) / course.lesson_count * 100, 1)
            if new_p >= 100 and enrollment.progress < 100:
                user.loyalty_points += 50
            enrollment.progress = new_p

    db.commit()
    return {"message": "Lesson completed", "progress": enrollment.progress}