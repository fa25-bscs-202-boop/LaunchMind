from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ReportResponse(BaseModel):
    id: int
    user_id: int
    analysis_id: int
    title: str
    executive_summary: str
    introduction: str
    problem_statement: str
    objectives: str
    scope: str
    methodology: str
    market_feasibility: str
    technical_feasibility: str
    operational_feasibility: str
    financial_feasibility: str
    legal_considerations: str
    risk_assessment: str
    findings: str
    recommendations: str
    conclusion: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
