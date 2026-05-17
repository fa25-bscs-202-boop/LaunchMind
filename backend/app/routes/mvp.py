import json

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.analysis import Analysis
from app.models.mvp_plan import MVPPlan
from app.models.user import User
from app.schemas.mvp import MVPPlanResponse
from app.services.mvp_service import generate_mvp_plan
from app.utils.dependencies import get_current_user


router = APIRouter(prefix="/mvp", tags=["mvp"])


@router.post("/generate/{analysis_id}", response_model=MVPPlanResponse)
def generate_mvp(
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
        mvp_data = generate_mvp_plan(analysis)
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        ) from error

    mvp_plan = MVPPlan(
        user_id=current_user.id,
        analysis_id=analysis.id,
        mvp_summary=mvp_data["mvp_summary"],
        core_features=json.dumps(mvp_data["core_features"]),
        excluded_features=json.dumps(mvp_data["excluded_features"]),
        recommended_tech_stack=json.dumps(mvp_data["recommended_tech_stack"]),
        development_phases=json.dumps(mvp_data["development_phases"]),
        timeline=mvp_data["timeline"],
        required_team=json.dumps(mvp_data["required_team"]),
        budget_considerations=mvp_data["budget_considerations"],
        launch_checklist=json.dumps(mvp_data["launch_checklist"]),
        success_metrics=json.dumps(mvp_data["success_metrics"]),
    )

    db.add(mvp_plan)
    db.commit()
    db.refresh(mvp_plan)

    return mvp_plan


@router.get("", response_model=list[MVPPlanResponse])
def get_mvp_plans(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(MVPPlan)
        .filter(MVPPlan.user_id == current_user.id)
        .order_by(MVPPlan.created_at.desc())
        .all()
    )


@router.get("/{mvp_id}", response_model=MVPPlanResponse)
def get_mvp_plan(
    mvp_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    mvp_plan = (
        db.query(MVPPlan)
        .filter(MVPPlan.id == mvp_id, MVPPlan.user_id == current_user.id)
        .first()
    )

    if not mvp_plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="MVP plan not found",
        )

    return mvp_plan


@router.delete("/{mvp_id}")
def delete_mvp_plan(
    mvp_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    mvp_plan = (
        db.query(MVPPlan)
        .filter(MVPPlan.id == mvp_id, MVPPlan.user_id == current_user.id)
        .first()
    )

    if not mvp_plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="MVP plan not found",
        )

    db.delete(mvp_plan)
    db.commit()

    return {"message": "MVP plan deleted successfully"}
