from datetime import datetime

from pydantic import BaseModel, ConfigDict


class PitchDeckResponse(BaseModel):
    id: int
    user_id: int
    analysis_id: int
    startup_name: str
    elevator_pitch: str
    problem: str
    solution: str
    target_market: str
    business_model: str
    competitor_landscape: str
    go_to_market_strategy: str
    revenue_model: str
    mvp_summary: str
    traction_strategy: str
    funding_needs: str
    future_roadmap: str
    closing_statement: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
