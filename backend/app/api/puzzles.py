from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db import get_db, Puzzle, PuzzleAttempt, User
from app.auth_utils import get_current_user

router = APIRouter(prefix="/puzzles", tags=["Puzzles"])


def _puzzle_dict(p: Puzzle):
    return {
        "id": p.id,
        "fen": p.fen,
        "solution": p.solution,
        "difficulty": p.difficulty,
        "theme": p.theme,
        "is_daily": p.is_daily,
    }


@router.get("/daily")
def get_daily_puzzle(db: Session = Depends(get_db)):
    puzzle = db.query(Puzzle).filter(Puzzle.is_daily == True).first()
    if not puzzle:
        puzzle = db.query(Puzzle).first()
    if not puzzle:
        raise HTTPException(status_code=404, detail="No puzzles available")
    return _puzzle_dict(puzzle)


@router.get("/")
def get_puzzles(
    theme: str = None,
    db: Session = Depends(get_db),
):
    query = db.query(Puzzle)
    if theme:
        query = query.filter(Puzzle.theme == theme)
    puzzles = query.limit(20).all()
    return [_puzzle_dict(p) for p in puzzles]


@router.post("/{puzzle_id}/solve")
def solve_puzzle(
    puzzle_id: int,
    data: dict,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    puzzle = db.query(Puzzle).filter(Puzzle.id == puzzle_id).first()
    if not puzzle:
        raise HTTPException(status_code=404, detail="Puzzle not found")

    user_solution = data.get("solution", "")
    correct = user_solution.strip().lower() == puzzle.solution.strip().lower()

    attempt = PuzzleAttempt(
        user_id=user.id,
        puzzle_id=puzzle_id,
        solved=correct,
    )
    db.add(attempt)

    if correct:
        user.puzzle_rating = min(user.puzzle_rating + 15, 3000)
    else:
        user.puzzle_rating = max(user.puzzle_rating - 10, 100)

    db.commit()
    return {
        "correct": correct,
        "solution": puzzle.solution,
        "new_rating": user.puzzle_rating,
    }


@router.get("/stats")
def get_puzzle_stats(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    attempts = db.query(PuzzleAttempt).filter(PuzzleAttempt.user_id == user.id).all()
    solved = sum(1 for a in attempts if a.solved)
    return {
        "total_attempts": len(attempts),
        "solved": solved,
        "puzzle_rating": user.puzzle_rating,
        "accuracy": round(solved / len(attempts) * 100, 1) if attempts else 0,
    }
