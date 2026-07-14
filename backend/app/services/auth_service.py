from datetime import datetime, timedelta, timezone
from typing import Any, Optional

from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import hash_password, verify_password
from app.models.company import Company
from app.models.refresh_token import RefreshToken
from app.models.user import User


def create_access_token(subject: str, company_id: int, role: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {
        "sub": subject,
        "company_id": company_id,
        "role": role,
        "exp": expire,
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def create_refresh_token(user_id: int) -> str:
    expire = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    payload = {
        "sub": str(user_id),
        "exp": expire,
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def verify_token(token: str) -> dict[str, Any]:
    return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()


def register_company_and_owner(db: Session, payload: dict[str, Any]) -> tuple[Company, User]:
    existing_company = db.query(Company).filter(Company.email == payload["company_email"]).first()
    if existing_company:
        raise ValueError("Company email already registered")

    existing_user = db.query(User).filter(User.email == payload["owner_email"]).first()
    if existing_user:
        raise ValueError("User email already registered")

    company = Company(
        name=payload["company_name"],
        industry=payload["industry"],
        email=payload["company_email"],
        address=payload["company_address"],
        phone=payload["company_phone"],
    )
    db.add(company)
    db.flush()

    user = User(
        company_id=company.id,
        name=payload["owner_name"],
        email=payload["owner_email"],
        password_hash=hash_password(payload["password"]),
        role="Company Admin",
        status="Active",
    )
    db.add(user)
    db.flush()

    return company, user


def store_refresh_token(db: Session, user_id: int, token: str, expires_at: datetime) -> RefreshToken:
    refresh_token = RefreshToken(user_id=user_id, token=token, expires_at=expires_at)
    db.add(refresh_token)
    db.commit()
    db.refresh(refresh_token)
    return refresh_token


def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.password_hash):
        return None
    return user


def update_last_login(db: Session, user: User) -> None:
    user.last_login = datetime.now(timezone.utc)
    db.add(user)
    db.commit()
