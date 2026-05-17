from pydantic import BaseModel


class AITestRequest(BaseModel):
    prompt: str


class AITestResponse(BaseModel):
    response: str
