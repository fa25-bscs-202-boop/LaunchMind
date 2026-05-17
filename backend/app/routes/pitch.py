from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.analysis import Analysis
from app.models.pitch_deck import PitchDeck
from app.models.user import User
from app.schemas.pitch import PitchDeckResponse
from app.services.pitch_service import generate_pitch_deck
from app.utils.dependencies import get_current_user


router = APIRouter(prefix="/pitch", tags=["pitch"])


@router.post("/generate/{analysis_id}", response_model=PitchDeckResponse)
def generate_pitch(
    analysis_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    analysis = (
        db.query(Analysis)
        .filter(Analysis.id == analysis_id, Analysis.user_id == current_user.id)
        .first()
    )

    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found",
        )

    try:
        pitch_data = generate_pitch_deck(analysis)
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        ) from error

    pitch_deck = PitchDeck(
        user_id=current_user.id,
        analysis_id=analysis.id,
        **pitch_data,
    )

    db.add(pitch_deck)
    db.commit()
    db.refresh(pitch_deck)

    return pitch_deck


@router.get("", response_model=list[PitchDeckResponse])
def get_pitch_decks(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(PitchDeck)
        .filter(PitchDeck.user_id == current_user.id)
        .order_by(PitchDeck.created_at.desc())
        .all()
    )


@router.get("/{pitch_id}", response_model=PitchDeckResponse)
def get_pitch_deck(
    pitch_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    pitch_deck = (
        db.query(PitchDeck)
        .filter(PitchDeck.id == pitch_id, PitchDeck.user_id == current_user.id)
        .first()
    )

    if not pitch_deck:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pitch deck not found",
        )

    return pitch_deck


@router.delete("/{pitch_id}")
def delete_pitch_deck(
    pitch_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    pitch_deck = (
        db.query(PitchDeck)
        .filter(PitchDeck.id == pitch_id, PitchDeck.user_id == current_user.id)
        .first()
    )

    if not pitch_deck:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pitch deck not found",
        )

    db.delete(pitch_deck)
    db.commit()

    return {"message": "Pitch deck deleted successfully"}
