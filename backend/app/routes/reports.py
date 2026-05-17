from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.analysis import Analysis
from app.models.report import Report
from app.models.user import User
from app.schemas.report import ReportResponse
from app.services.report_service import (
    ReportAIConfigurationError,
    ReportGenerationUnavailableError,
    ReportInvalidResponseError,
    generate_report_from_analysis,
)
from app.utils.dependencies import get_current_user


router = APIRouter(prefix="/reports", tags=["reports"])


@router.post("/generate/{analysis_id}", response_model=ReportResponse)
def generate_report(
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
        report_data = generate_report_from_analysis(analysis)
    except ReportAIConfigurationError as error:
        print(f"Report AI configuration error: {error}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="AI service is not configured. Please contact support.",
        ) from error
    except ReportInvalidResponseError as error:
        print(f"Report AI invalid response: {error}")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Report could not be prepared properly. Please try again.",
        ) from error
    except ReportGenerationUnavailableError as error:
        print(f"Report generation unavailable: {error}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=(
                "Report generation is temporarily unavailable. Please check "
                "your internet connection or try again in a few minutes."
            ),
        ) from error

    report = Report(
        user_id=current_user.id,
        analysis_id=analysis.id,
        **report_data,
    )

    db.add(report)
    db.commit()
    db.refresh(report)

    return report


@router.get("", response_model=list[ReportResponse])
def get_reports(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(Report)
        .filter(Report.user_id == current_user.id)
        .order_by(Report.created_at.desc())
        .all()
    )


@router.get("/{report_id}", response_model=ReportResponse)
def get_report(
    report_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    report = (
        db.query(Report)
        .filter(Report.id == report_id, Report.user_id == current_user.id)
        .first()
    )

    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found",
        )

    return report


@router.delete("/{report_id}")
def delete_report(
    report_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    report = (
        db.query(Report)
        .filter(Report.id == report_id, Report.user_id == current_user.id)
        .first()
    )

    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found",
        )

    db.delete(report)
    db.commit()

    return {"message": "Report deleted successfully"}

