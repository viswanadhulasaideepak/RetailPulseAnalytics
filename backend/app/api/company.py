from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, require_role
from app.database.session import get_db
from app.models.company import Company
from app.models.user import User
from app.core.permissions import ensure_company_access

router = APIRouter(prefix="/companies", tags=["companies"])


@router.get("/me")
def get_company(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    company = (
        db.query(Company)
        .filter(Company.id == current_user.company_id)
        .first()
    )

    return company


@router.get("/")
def list_companies(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role == "Super Admin":
        return db.query(Company).all()

    return (
        db.query(Company)
        .filter(Company.id == current_user.company_id)
        .all()
    )
