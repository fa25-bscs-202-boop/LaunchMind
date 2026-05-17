import json

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import ValidationError
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.analysis import Analysis
from app.models.project import Project
from app.models.user import User
from app.schemas.analysis import AnalysisResponse
from app.schemas.idea import IdeaAnalyzeRequest
from app.services.ai_service import analyze_startup_idea
from app.utils.dependencies import get_current_user


router = APIRouter(prefix="/ideas", tags=["ideas"])


@router.post("/analyze", response_model=AnalysisResponse)
def analyze_idea(
    request: IdeaAnalyzeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if request.project_id is not None:
        project = (
            db.query(Project)
            .filter(Project.id == request.project_id, Project.user_id == current_user.id)
            .first()
        )

        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found",
            )

    try:
        analysis = analyze_startup_idea(
            idea=request.idea,
            industry=request.industry,
            target_audience=request.target_audience,
        )
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )

    try:
        saved_analysis = Analysis(
            user_id=current_user.id,
            project_id=request.project_id,
            idea=request.idea,
            industry=request.industry,
            target_audience=request.target_audience,
            startup_names=json.dumps(analysis["startup_names"]),
            one_line_pitch=analysis["one_line_pitch"],
            problem_statement=analysis["problem_statement"],
            proposed_solution=analysis["proposed_solution"],
            target_market=analysis["target_market"],
            market_feasibility=analysis["market_feasibility"],
            technical_feasibility=analysis["technical_feasibility"],
            financial_feasibility=analysis["financial_feasibility"],
            operational_feasibility=analysis["operational_feasibility"],
            legal_feasibility=analysis["legal_feasibility"],
            risk_assessment=json.dumps(analysis["risk_assessment"]),
            revenue_model=json.dumps(analysis["revenue_model"]),
            launch_roadmap=json.dumps(analysis["launch_roadmap"]),
            final_recommendation=analysis["final_recommendation"],
        )

        db.add(saved_analysis)
        db.commit()
        db.refresh(saved_analysis)

        return AnalysisResponse.model_validate(saved_analysis)
    except ValidationError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="AI response invalid: missing or incorrect fields",
        ) from error
