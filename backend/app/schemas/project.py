from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ProjectCreate(BaseModel):
    title: str
    raw_idea: str
    industry: str | None = None
    target_audience: str | None = None


class ProjectUpdate(BaseModel):
    title: str | None = None
    raw_idea: str | None = None
    industry: str | None = None
    target_audience: str | None = None
    status: str | None = None


class ProjectResponse(BaseModel):
    id: int
    user_id: int
    title: str
    raw_idea: str
    industry: str | None
    target_audience: str | None
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
