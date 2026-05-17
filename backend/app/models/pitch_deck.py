from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text

from app.database import Base


class PitchDeck(Base):
    __tablename__ = "pitch_decks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    analysis_id = Column(Integer, ForeignKey("analyses.id"), nullable=False)
    startup_name = Column(String, nullable=False)
    elevator_pitch = Column(Text, nullable=False)
    problem = Column(Text, nullable=False)
    solution = Column(Text, nullable=False)
    target_market = Column(Text, nullable=False)
    business_model = Column(Text, nullable=False)
    competitor_landscape = Column(Text, nullable=False)
    go_to_market_strategy = Column(Text, nullable=False)
    revenue_model = Column(Text, nullable=False)
    mvp_summary = Column(Text, nullable=False)
    traction_strategy = Column(Text, nullable=False)
    funding_needs = Column(Text, nullable=False)
    future_roadmap = Column(Text, nullable=False)
    closing_statement = Column(Text, nullable=False)
    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
