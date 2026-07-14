from datetime import datetime, timedelta, timezone
from typing import Any, Optional
from app.services.audit_service import create_audit_log
from jose import JWTError, jwt
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import hash_password, verify_password
from app.models.company import Company
from app.models.refresh_token import RefreshToken
from app.models.user import User


def create_access_token(
    subject: str,
    company_id: int,
    role: str,
    user_id: int,
) -> str:

    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "sub": subject,
        "company_id": company_id,
        "role": role,
        "user_id": user_id,
        "exp": expire,
    }

    return jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM,
    )


def create_refresh_token(user_id: int) -> str:
    expire = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    payload = {
        "sub": str(user_id),
        "exp": expire,
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def verify_token(token: str):
    try:
        return jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
    except JWTError:
        raise


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    normalized_email = email.strip().lower()

    user = db.query(User).filter(func.lower(User.email) == normalized_email).first()
    if user:
        return user

    return (
        db.query(User)
        .join(Company, User.company_id == Company.id)
        .filter(func.lower(Company.email) == normalized_email, User.role == "Company Admin")
        .first()
    )


def register_company_and_owner(db: Session, payload: dict[str, Any]) -> tuple[Company, User]:
    company_email = str(payload["company_email"]).strip().lower()
    owner_email = str(payload["owner_email"]).strip().lower()

    existing_company = db.query(Company).filter(func.lower(Company.email) == company_email).first()
    if existing_company:
        raise ValueError("Company email already registered")

    existing_user = db.query(User).filter(func.lower(User.email) == owner_email).first()
    if existing_user:
        raise ValueError("User email already registered")

    company = Company(
    name=payload["company_name"],
    industry=payload["industry"],
    email=company_email,
    address=payload["company_address"],
    phone=payload["company_phone"],
)
    db.add(company)
    db.flush()

    user = User(
        company_id=company.id,
        name=payload["owner_name"],
        email=owner_email,
        password_hash=hash_password(payload["password"]),
        role="Company Admin",
        status="Active"
        )

    db.add(user)
    db.flush()

    create_audit_log(
        db=db,
        company_id=company.id,
        user_id=user.id,
        action="Company Registered",
        )

    db.commit()

    db.refresh(company)
    db.refresh(user)

    return company, user

def store_refresh_token(db: Session, user_id: int, token: str, expires_at: datetime) -> RefreshToken:
    refresh_token = RefreshToken(user_id=user_id, token=token, expires_at=expires_at)
    db.add(refresh_token)
    db.commit()
    db.refresh(refresh_token)
    return refresh_token

#------------------authenticate user------------------
def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.password_hash):
        return None
    return user

#-------------last login---------------
def update_last_login(db: Session, user: User) -> None:
    user.last_login = datetime.now(timezone.utc)
    
    db.commit()
    db.refresh(user)

#-------------logout user--------------------
def logout_user(
    db: Session,
    user: User,
    refresh_token: str,
):
    token = (
        db.query(RefreshToken)
        .filter(RefreshToken.token == refresh_token)
        .first()
    )

    if token:
        db.delete(token)

    create_audit_log(
        db=db,
        company_id=user.company_id,
        user_id=user.id,
        action="User Logout",
    )

    db.commit()
        
# ==========================================================
# VERIFY REFRESH TOKEN
# ==========================================================

def verify_refresh_token(
    db: Session,
    refresh_token: str,
) -> Optional[User]:
    try:
        payload = jwt.decode(
            refresh_token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
    except JWTError:
        return None

    user_id = int(payload.get("sub"))

    token = (
        db.query(RefreshToken)
        .filter(
            RefreshToken.token == refresh_token
        )
        .first()
    )

    if token is None:
        return None

    if token.expires_at < datetime.now(timezone.utc):
        db.delete(token)
        db.commit()
        return None

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    return user


# ==========================================================
# CHANGE PASSWORD
# ==========================================================

def change_password(
    db: Session,
    user: User,
    new_password: str,
) -> User:

    user.password_hash = hash_password(new_password)

    db.commit()
    create_audit_log(
    db=db,
    company_id=user.company_id,
    user_id=user.id,
    action="Password Changed",
)
    db.refresh(user)

    return user
   