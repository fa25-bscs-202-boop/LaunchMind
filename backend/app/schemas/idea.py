from pydantic import BaseModel


class IdeaAnalyzeRequest(BaseModel):
    idea: str
    industry: str | None = None
    target_audience: str | None = None
    project_id: int | None = None


class IdeaAnalyzeResponse(BaseModel):
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
