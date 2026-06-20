import json

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.analysis import Analysis
from app.models.competitor_analysis import CompetitorAnalysis
from app.models.user import User
from app.schemas.competitor import CompetitorAnalysisResponse
from app.services.competitor_service import generate_competitor_analysis
from app.utils.dependencies import get_current_user


router = APIRouter(prefix="/competitors", tags=["competitors"])


@router.post("/analyze/{analysis_id}", response_model=CompetitorAnalysisResponse)
def analyze_competitors(
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
        competitor_data = generate_competitor_analysis(analysis)
    except ValueError as error:
        print(f"Competitor analysis generation error: {error}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Competitor analysis is temporarily unavailable. Please try again.",
        ) from error

    competitor_analysis = CompetitorAnalysis(
        user_id=current_user.id,
        analysis_id=analysis.id,
        direct_competitors=json.dumps(competitor_data["direct_competitors"]),
        indirect_competitors=json.dumps(competitor_data["indirect_competitors"]),
        competitor_strengths=competitor_data["competitor_strengths"],
        competitor_weaknesses=competitor_data["competitor_weaknesses"],
        market_gap=competitor_data["market_gap"],
        differentiation_strategy=competitor_data["differentiation_strategy"],
        pricing_comparison=competitor_data["pricing_comparison"],
        recommendations=competitor_data["recommendations"],
    )

    db.add(competitor_analysis)
    db.commit()
    db.refresh(competitor_analysis)

    return competitor_analysis


@router.get("", response_model=list[CompetitorAnalysisResponse])
def get_competitor_analyses(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(CompetitorAnalysis)
        .filter(CompetitorAnalysis.user_id == current_user.id)
        .order_by(CompetitorAnalysis.created_at.desc())
        .all()
    )


@router.get("/{competitor_id}", response_model=CompetitorAnalysisResponse)
def get_competitor_analysis(
    competitor_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    competitor_analysis = (
        db.query(CompetitorAnalysis)
        .filter(
            CompetitorAnalysis.id == competitor_id,
            CompetitorAnalysis.user_id == current_user.id,
        )
        .first()
    )

    if not competitor_analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Competitor analysis not found",
        )

    return competitor_analysis


@router.delete("/{competitor_id}")
def delete_competitor_analysis(
    competitor_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    competitor_analysis = (
        db.query(CompetitorAnalysis)
        .filter(
            CompetitorAnalysis.id == competitor_id,
            CompetitorAnalysis.user_id == current_user.id,
        )
        .first()
    )

    if not competitor_analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Competitor analysis not found",
        )

    db.delete(competitor_analysis)
    db.commit()

    return {"message": "Competitor analysis deleted successfully"}
