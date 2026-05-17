import json
from datetime import datetime

from pydantic import BaseModel, ConfigDict, field_validator


class CompetitorAnalysisResponse(BaseModel):
    id: int
    user_id: int
    analysis_id: int
    direct_competitors: list[str]
    indirect_competitors: list[str]
    competitor_strengths: str
    competitor_weaknesses: str
    market_gap: str
    differentiation_strategy: str
    pricing_comparison: str
    recommendations: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

    @field_validator("direct_competitors", "indirect_competitors", mode="before")
    @classmethod
    def parse_json_list(cls, value):
        if isinstance(value, list):
            return value

        if isinstance(value, str):
            try:
                parsed_value = json.loads(value)
            except json.JSONDecodeError:
                return []

            if isinstance(parsed_value, list):
                return parsed_value

        return []
