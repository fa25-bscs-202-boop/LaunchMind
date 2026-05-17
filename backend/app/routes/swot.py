import json

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.analysis import Analysis
from app.models.swot_analysis import SWOTAnalysis
from app.models.user import User
from app.schemas.swot import SWOTAnalysisResponse
from app.services.swot_service import generate_swot_analysis
from app.utils.dependencies import get_current_user


router = APIRouter(prefix="/swot", tags=["swot"])


@router.post("/generate/{analysis_id}", response_model=SWOTAnalysisResponse)
def generate_swot(
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
        swot_data = generate_swot_analysis(analysis)
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        ) from error

    swot_analysis = SWOTAnalysis(
        user_id=current_user.id,
        analysis_id=analysis.id,
        strengths=json.dumps(swot_data["strengths"]),
        weaknesses=json.dumps(swot_data["weaknesses"]),
        opportunities=json.dumps(swot_data["opportunities"]),
        threats=json.dumps(swot_data["threats"]),
        strategic_recommendations=json.dumps(
            swot_data["strategic_recommendations"]
        ),
    )

    db.add(swot_analysis)
    db.commit()
    db.refresh(swot_analysis)

    return swot_analysis


@router.get("", response_model=list[SWOTAnalysisResponse])
def get_swot_analyses(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(SWOTAnalysis)
        .filter(SWOTAnalysis.user_id == current_user.id)
        .order_by(SWOTAnalysis.created_at.desc())
        .all()
    )


@router.get("/{swot_id}", response_model=SWOTAnalysisResponse)
def get_swot_analysis(
    swot_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    swot_analysis = (
        db.query(SWOTAnalysis)
        .filter(SWOTAnalysis.id == swot_id, SWOTAnalysis.user_id == current_user.id)
        .first()
    )

    if not swot_analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="SWOT analysis not found",
        )

    return swot_analysis


@router.delete("/{swot_id}")
def delete_swot_analysis(
    swot_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    swot_analysis = (
        db.query(SWOTAnalysis)
        .filter(SWOTAnalysis.id == swot_id, SWOTAnalysis.user_id == current_user.id)
        .first()
    )

    if not swot_analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="SWOT analysis not found",
        )

    db.delete(swot_analysis)
    db.commit()

    return {"message": "SWOT analysis deleted successfully"}
