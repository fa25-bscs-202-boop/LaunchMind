from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, Integer, Text

from app.database import Base


class MVPPlan(Base):
    __tablename__ = "mvp_plans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    analysis_id = Column(Integer, ForeignKey("analyses.id"), nullable=False)
    mvp_summary = Column(Text, nullable=False)
    core_features = Column(Text, nullable=False)
    excluded_features = Column(Text, nullable=False)
    recommended_tech_stack = Column(Text, nullable=False)
    development_phases = Column(Text, nullable=False)
    timeline = Column(Text, nullable=False)
    required_team = Column(Text, nullable=False)
    budget_considerations = Column(Text, nullable=False)
    launch_checklist = Column(Text, nullable=False)
    success_metrics = Column(Text, nullable=False)
    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
