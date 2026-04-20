from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from app.db import get_db, Competition, CompetitionParticipation, User
from app.auth_utils import get_current_user

router = APIRouter(prefix="/competitions", tags=["Competitions"])

@router.get("/")
def get_competitions(db: Session = Depends(get_db)):
    competitions = db.query(Competition).all()
    return competitions

@router.post("/{comp_id}/join")
def join_competition(comp_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    comp = db.query(Competition).filter(Competition.id == comp_id).first()
    if not comp:
        raise HTTPException(status_code=404, detail="Competition not found")
    
    if comp.status != "active" and comp.status != "upcoming":
        raise HTTPException(status_code=400, detail="Competition is not open for joining")

    existing = db.query(CompetitionParticipation).filter(
        CompetitionParticipation.competition_id == comp_id,
        CompetitionParticipation.user_id == user.id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already joined")

    participation = CompetitionParticipation(competition_id=comp_id, user_id=user.id)
    db.add(participation)
    db.commit()
    return {"message": "Joined successfully"}

@router.post("/{comp_id}/win")
def win_competition(comp_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # In a real app, this would be validated by scores/admin. For dummy, we allow winning.
    comp = db.query(Competition).filter(Competition.id == comp_id).first()
    if not comp:
        raise HTTPException(status_code=404, detail="Competition not found")

    participation = db.query(CompetitionParticipation).filter(
        CompetitionParticipation.competition_id == comp_id,
        CompetitionParticipation.user_id == user.id
    ).first()
    
    if not participation:
        raise HTTPException(status_code=400, detail="Not joined this competition")
    
    if participation.is_winner:
        return {"message": "Already won"}

    participation.is_winner = True
    user.loyalty_points += comp.points_reward
    db.commit()
    return {"message": "Congratulations! You won and earned points.", "points": comp.points_reward}
