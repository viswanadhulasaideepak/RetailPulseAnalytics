from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.database.session import get_db
from app.models.user import User
from app.services.auth_service import verify_token

security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> User:

    print("========== AUTH DEBUG ==========")
    print("Credentials:", credentials)

    token = credentials.credentials
    print("Token:", token)

    try:
        payload = verify_token(token)
        print("Payload:", payload)

    except JWTError as exc:
        print("JWT ERROR:", exc)
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )

    email = payload.get("sub")
    print("Email:", email)

    user = db.query(User).filter(User.email == email).first()
    print("User:", user)

    return user


def require_role(*allowed_roles: str):
    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
        return current_user

    return role_checker
