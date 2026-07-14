from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, require_role
from app.database.session import get_db
from app.models.user import User

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me")
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
        "company_id": current_user.company_id,
        "status": current_user.status,
    }


@router.get("/", dependencies=[Depends(require_role("Super Admin", "Company Admin"))])
def list_users(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(User).filter(User.company_id == current_user.company_id).all()
