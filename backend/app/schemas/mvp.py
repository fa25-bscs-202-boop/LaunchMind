import json
from datetime import datetime

from pydantic import BaseModel, ConfigDict, field_validator


class MVPPlanResponse(BaseModel):
    id: int
    user_id: int
    analysis_id: int
    mvp_summary: str
    core_features: list[str]
    excluded_features: list[str]
    recommended_tech_stack: list[str]
    development_phases: list[str]
    timeline: str
    required_team: list[str]
    budget_considerations: str
    launch_checklist: list[str]
    success_metrics: list[str]
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

    @field_validator(
        "core_features",
        "excluded_features",
        "recommended_tech_stack",
        "development_phases",
        "required_team",
        "launch_checklist",
        "success_metrics",
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
