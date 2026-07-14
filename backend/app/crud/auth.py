from datetime import datetime
from sqlalchemy.orm import Session

from app.models.company import Company
from app.models.user import User
from app.models.refresh_token import RefreshToken
from app.models.audit_log import AuditLog

# -----------------COMPANY------------------------

def get_company_by_email(db: Session, email: str):
    return db.query(Company).filter(Company.email == email).first()

#--------------create company------------
def create_company(
    db: Session,
    name: str,
    industry: str,
    email: str,
    address: str,
    phone: str,
):
    company = Company(
        name=name,
        industry=industry,
        email=email,
        address=address,
        phone=phone,
    )

    db.add(company)
    db.commit()
    db.refresh(company)

    return company

#------------------------- USERS---------------------------

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()


def create_admin_user(
    db: Session,
    company_id: int,
    name: str,
    email: str,
    password_hash: str,
):
    user = User(
        company_id=company_id,
        name=name,
        email=email,
        password_hash=password_hash,
        role="Company Admin",
        status="Active",
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user

# -------------------REFRESH TOKENS---------------------

#-----------save-------------
def save_refresh_token(
    db: Session,
    user_id: int,
    token: str,
    expires_at,
):
    refresh = RefreshToken(
        user_id=user_id,
        token=token,
        expires_at=expires_at,
    )

    db.add(refresh)
    db.commit()
    db.refresh(refresh)

    return refresh

#----------- get refresh token---------
def get_refresh_token(
    db: Session,
    token: str,
):
    return (
        db.query(RefreshToken)
        .filter(RefreshToken.token == token)
        .first()
    )

#-----------delete---------------
def delete_refresh_token(
    db: Session,
    token: str,
):
    refresh = (
        db.query(RefreshToken)
        .filter(RefreshToken.token == token)
        .first()
    )

    if refresh:
        db.delete(refresh)
        db.commit()
