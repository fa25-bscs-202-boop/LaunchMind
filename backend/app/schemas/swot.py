import json
from datetime import datetime

from pydantic import BaseModel, ConfigDict, field_validator


class SWOTAnalysisResponse(BaseModel):
    id: int
    user_id: int
    analysis_id: int
    strengths: list[str]
    weaknesses: list[str]
    opportunities: list[str]
    threats: list[str]
    strategic_recommendations: list[str]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

    @field_validator(
        "strengths",
        "weaknesses",
        "opportunities",
        "threats",
        "strategic_recommendations",
        mode="before",
    )
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
