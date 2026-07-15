from datetime import datetime, timedelta, timezone
from app.core.config import settings
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.schemas.auth import (
    LoginRequest,
    LoginResponse,
    RefreshTokenRequest,
    RefreshTokenResponse,
    LogoutRequest,
    ChangePasswordRequest,
)
from app.schemas.company import CompanyRegister
from app.schemas.user import UserProfile
from app.services.auth_service import (
    authenticate_user,
    create_access_token,
    create_refresh_token,
    register_company_and_owner,
    store_refresh_token,
    update_last_login,
    verify_refresh_token,
    logout_user,
    change_password,
)
from app.core.security import verify_password
from app.services.audit_service import create_audit_log


router = APIRouter(prefix="/auth", tags=["auth"])

#-----------------Register-----------------
@router.post("/register", response_model=LoginResponse, status_code=status.HTTP_201_CREATED)
def register(payload: CompanyRegister, db: Session = Depends(get_db)):
    if payload.password != payload.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    if len(payload.password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")

    try:
        company, user = register_company_and_owner(db, payload.model_dump())
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    access_token = create_access_token(
    subject=user.email,
    company_id=company.id,
    role=user.role,
    user_id=user.id,
)
    refresh_token = create_refresh_token(user.id)
    expires_at = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)

    store_refresh_token(
    db=db,
    user_id=user.id,
    token=refresh_token,
    expires_at=expires_at,
    )

    return {
    "access_token": access_token,
    "refresh_token": refresh_token,
    "token_type": "bearer",
}

#--------------------------Login--------------------
@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = authenticate_user(db, payload.email, payload.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(
    subject=user.email,
    company_id=user.company_id,
    role=user.role,
    user_id=user.id,
)
    refresh_token = create_refresh_token(user.id)
    expires_at = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)

    store_refresh_token(
    db=db,
    user_id=user.id,
    token=refresh_token,
    expires_at=expires_at,
    )
    update_last_login(db, user)
    
    create_audit_log(
    db=db,
    company_id=user.company_id,
    user_id=user.id,
    action="User Login",
)

    return {
    "access_token": access_token,
    "refresh_token": refresh_token,
    "token_type": "bearer",
}    
    
#---------------Refresh----------------    
@router.post("/refresh", response_model=RefreshTokenResponse)
def refresh_token(
    payload: RefreshTokenRequest,
    db: Session = Depends(get_db),
):
    user = verify_refresh_token(db, payload.refresh_token)

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid refresh token",
        )

    access_token = create_access_token(
        subject=user.email,
        company_id=user.company_id,
        role=user.role,
        user_id=user.id,
    )

    new_refresh = create_refresh_token(user.id)

    expires_at = datetime.now(timezone.utc) + timedelta(
        days=settings.REFRESH_TOKEN_EXPIRE_DAYS
    )

    store_refresh_token(
        db=db,
        user_id=user.id,
        token=new_refresh,
        expires_at=expires_at,
    )

    return {
        "access_token": access_token,
        "refresh_token": new_refresh,
        "token_type": "bearer",
    }    
    
#-----------------------Logout------------------------    
@router.post("/logout")
def logout(
    payload: LogoutRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    logout_user(
        db=db,
        user=current_user,
        refresh_token=payload.refresh_token,
    )

    return {
        "message": "Logged out successfully"
    }    

@router.get("/me", response_model=UserProfile)
def get_me(current_user: User = Depends(get_current_user)):
    return {
    "id": current_user.id,
    "name": current_user.name,
    "email": current_user.email,
    "role": current_user.role,
    "company_id": current_user.company_id,
    "company_name": current_user.company.name,
    "status": current_user.status,
    "last_login": current_user.last_login,
}

#----------------Change Password------------------    
@router.post("/change-password")
def update_password(
    payload: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not verify_password(
        payload.old_password,
        current_user.password_hash,
    ):
        raise HTTPException(
            status_code=400,
            detail="Old password is incorrect",
        )

    change_password(
        db=db,
        user=current_user,
        new_password=payload.new_password,
    )

    create_audit_log(
        db=db,
        company_id=current_user.company_id,
        user_id=current_user.id,
        action="Password Changed",
    )

    return {
        "message": "Password changed successfully"
    }    