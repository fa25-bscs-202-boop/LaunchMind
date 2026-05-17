import json
from datetime import datetime

from pydantic import BaseModel, ConfigDict, field_validator


class AnalysisResponse(BaseModel):
    id: int
    user_id: int
    project_id: int | None
    idea: str
    industry: str | None
    target_audience: str | None
    startup_names: list[str]
    one_line_pitch: str
    problem_statement: str
    proposed_solution: str
    target_market: str
    market_feasibility: str
    technical_feasibility: str
    financial_feasibility: str
    operational_feasibility: str
    legal_feasibility: str
    risk_assessment: list[str]
    revenue_model: list[str]
    launch_roadmap: list[str]
    final_recommendation: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

    @field_validator(
        "startup_names",
        "risk_assessment",
        "revenue_model",
        "launch_roadmap",
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


class AnalysisListResponse(AnalysisResponse):
    pass
