from fastapi import APIRouter, Depends

from app.core.dependencies import get_current_user, require_role
from app.models.user import User

router = APIRouter(prefix="/inventory", tags=["inventory"])


@router.get("/", dependencies=[Depends(require_role("Super Admin", "Company Admin", "Analyst", "Viewer"))])
def list_inventory(current_user: User = Depends(get_current_user)):
    return {
        "items": [],
        "company_id": current_user.company_id,
        "role": current_user.role,
        "message": "Inventory endpoint ready for company-scoped data access",
    }
