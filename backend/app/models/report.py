from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text

from app.database import Base


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    analysis_id = Column(Integer, ForeignKey("analyses.id"), nullable=False)
    title = Column(String, nullable=False)
    executive_summary = Column(Text, nullable=False)
    introduction = Column(Text, nullable=False)
    problem_statement = Column(Text, nullable=False)
    objectives = Column(Text, nullable=False)
    scope = Column(Text, nullable=False)
    methodology = Column(Text, nullable=False)
    market_feasibility = Column(Text, nullable=False)
    technical_feasibility = Column(Text, nullable=False)
    operational_feasibility = Column(Text, nullable=False)
    financial_feasibility = Column(Text, nullable=False)
    legal_considerations = Column(Text, nullable=False)
    risk_assessment = Column(Text, nullable=False)
    findings = Column(Text, nullable=False)
    recommendations = Column(Text, nullable=False)
    conclusion = Column(Text, nullable=False)
    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
