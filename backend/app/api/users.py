from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, require_role
from app.database.session import get_db
from app.models.user import User
from app.core.permissions import apply_company_scope

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me")
def get_current_user_profile(current_user: User = Depends(get_current_user)):
   return {
    "id": current_user.id,
    "name": current_user.name,
    "email": current_user.email,
    "role": current_user.role,
    "company": current_user.company.name if current_user.company else None,
    "last_login": current_user.last_login,
    "status": current_user.status,
}

@router.get("/", dependencies=[Depends(require_role("Super Admin", "Company Admin"))])
def list_users(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
    ):
    
    query = db.query(User)
    if current_user.role != "Super Admin":
        query = apply_company_scope(query, current_user.company_id)
    return query.all()
