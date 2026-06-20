from io import BytesIO

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import HTMLResponse, PlainTextResponse, StreamingResponse
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.analysis import Analysis
from app.models.mvp_plan import MVPPlan
from app.models.pitch_deck import PitchDeck
from app.models.report import Report
from app.models.swot_analysis import SWOTAnalysis
from app.models.user import User
from app.services.export_service import (
    analysis_to_html,
    analysis_to_markdown,
    analysis_to_pdf,
    competitor_to_pdf,
    mvp_to_pdf,
    pitch_to_pdf,
    report_to_pdf,
    swot_to_pdf,
)
from app.utils.dependencies import get_current_user


router = APIRouter(prefix="/exports", tags=["exports"])


def get_user_record(model, record_id: int, user_id: int, db: Session, label: str):
    record = (
        db.query(model)
        .filter(model.id == record_id, model.user_id == user_id)
        .first()
    )

    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{label} not found",
        )

    return record


def get_user_analysis(analysis_id: int, user_id: int, db: Session):
    return get_user_record(Analysis, analysis_id, user_id, db, "Analysis")


def pdf_response(pdf_bytes: bytes, filename: str):
    headers = {
        "Content-Disposition": f'attachment; filename="{filename}"'
    }
    return StreamingResponse(
        BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers=headers,
    )


@router.get("/analysis/{analysis_id}/markdown", response_class=PlainTextResponse)
def export_analysis_markdown(
    analysis_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    analysis = get_user_analysis(analysis_id, current_user.id, db)
    markdown = analysis_to_markdown(analysis)
    headers = {
        "Content-Disposition": f'attachment; filename="analysis-{analysis_id}.md"'
    }

    return PlainTextResponse(content=markdown, headers=headers)


@router.get("/analysis/{analysis_id}/html", response_class=HTMLResponse)
def export_analysis_html(
    analysis_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    analysis = get_user_analysis(analysis_id, current_user.id, db)
    html = analysis_to_html(analysis)

    return HTMLResponse(content=html)


@router.get("/analysis/{analysis_id}/pdf")
def export_analysis_pdf(
    analysis_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    analysis = get_user_analysis(analysis_id, current_user.id, db)
    return pdf_response(
        analysis_to_pdf(analysis),
        f"launchmind-analysis-{analysis_id}.pdf",
    )


@router.get("/report/{report_id}/pdf")
def export_report_pdf(
    report_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    report = get_user_record(Report, report_id, current_user.id, db, "Report")
    return pdf_response(
        report_to_pdf(report),
        f"launchmind-report-{report_id}.pdf",
    )


@router.get("/pitch/{pitch_id}/pdf")
def export_pitch_pdf(
    pitch_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    pitch = get_user_record(PitchDeck, pitch_id, current_user.id, db, "Pitch deck")
    return pdf_response(
        pitch_to_pdf(pitch),
        f"launchmind-pitch-{pitch_id}.pdf",
    )


@router.get("/swot/{swot_id}/pdf")
def export_swot_pdf(
    swot_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    swot = get_user_record(SWOTAnalysis, swot_id, current_user.id, db, "SWOT analysis")
    return pdf_response(
        swot_to_pdf(swot),
        f"launchmind-swot-{swot_id}.pdf",
    )


@router.get("/competitor/{competitor_id}/pdf")
def export_competitor_pdf(
    competitor_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    competitor = get_user_record(
        CompetitorAnalysis,
        competitor_id,
        current_user.id,
        db,
        "Competitor analysis",
    )
    return pdf_response(
        competitor_to_pdf(competitor),
        f"launchmind-competitor-{competitor_id}.pdf",
    )


@router.get("/mvp/{mvp_id}/pdf")
def export_mvp_pdf(
    mvp_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    mvp = get_user_record(MVPPlan, mvp_id, current_user.id, db, "MVP plan")
    return pdf_response(
        mvp_to_pdf(mvp),
        f"launchmind-mvp-{mvp_id}.pdf",
    )
