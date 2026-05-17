from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, Integer, Text

from app.database import Base


class CompetitorAnalysis(Base):
    __tablename__ = "competitor_analyses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    analysis_id = Column(Integer, ForeignKey("analyses.id"), nullable=False)
    direct_competitors = Column(Text, nullable=False)
    indirect_competitors = Column(Text, nullable=False)
    competitor_strengths = Column(Text, nullable=False)
    competitor_weaknesses = Column(Text, nullable=False)
    market_gap = Column(Text, nullable=False)
    differentiation_strategy = Column(Text, nullable=False)
    pricing_comparison = Column(Text, nullable=False)
    recommendations = Column(Text, nullable=False)
    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
