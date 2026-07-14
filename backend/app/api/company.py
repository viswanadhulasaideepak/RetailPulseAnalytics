from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user, require_role
from app.database.session import get_db
from app.models.company import Company
from app.models.user import User

router = APIRouter(prefix="/companies", tags=["companies"])


@router.get("/me")
def get_company(current_user: User = Depends(get_current_user)):
    company = current_user.company_id
    return {"company_id": company}


@router.get("/", dependencies=[Depends(require_role("Super Admin", "Company Admin"))])
def list_companies(db: Session = Depends(get_db)):
    return db.query(Company).all()
