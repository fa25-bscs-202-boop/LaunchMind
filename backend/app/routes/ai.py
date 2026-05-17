from fastapi import APIRouter, Depends, HTTPException, status

from app.models.user import User
from app.schemas.ai import AITestRequest, AITestResponse
from app.services.ai_service import test_ai_connection
from app.utils.dependencies import get_current_user


router = APIRouter(prefix="/ai", tags=["ai"])


@router.post("/test", response_model=AITestResponse)
def test_ai(
    request: AITestRequest,
    current_user: User = Depends(get_current_user),
):
    try:
        response = test_ai_connection(request.prompt)
    except ValueError as error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(error),
        )

    return {"response": response}
