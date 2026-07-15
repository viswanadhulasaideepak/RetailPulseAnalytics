from fastapi import APIRouter, Depends

from app.core.dependencies import get_current_user, require_role
from app.models.user import User

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/", dependencies=[Depends(require_role("Super Admin", "Company Admin", "Analyst"))])
def list_analytics(current_user: User = Depends(get_current_user)):
    return {
        "items": [],
        "company_id": current_user.company_id,
        "role": current_user.role,
        "message": "Analytics endpoint ready for company-scoped data access",
    }
