from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text

from app.database import Base


class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    idea = Column(Text, nullable=False)
    industry = Column(String, nullable=True)
    target_audience = Column(String, nullable=True)
    startup_names = Column(Text, nullable=False)
    one_line_pitch = Column(Text, nullable=False)
    problem_statement = Column(Text, nullable=False)
    proposed_solution = Column(Text, nullable=False)
    target_market = Column(Text, nullable=False)
    market_feasibility = Column(Text, nullable=False)
    technical_feasibility = Column(Text, nullable=False)
    financial_feasibility = Column(Text, nullable=False)
    operational_feasibility = Column(Text, nullable=False)
    legal_feasibility = Column(Text, nullable=False)
    risk_assessment = Column(Text, nullable=False)
    revenue_model = Column(Text, nullable=False)
    launch_roadmap = Column(Text, nullable=False)
    final_recommendation = Column(Text, nullable=False)
    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
