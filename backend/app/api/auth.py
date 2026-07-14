from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.schemas.auth import LoginRequest, LoginResponse
from app.schemas.company import CompanyRegister
from app.schemas.user import UserProfile
from app.services.auth_service import (
    authenticate_user,
    create_access_token,
    create_refresh_token,
    register_company_and_owner,
    store_refresh_token,
    update_last_login,
)

router = APIRouter(prefix="/auth", tags=["auth"])


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

    db.commit()

    access_token = create_access_token(user.email, company.id, user.role)
    refresh_token = create_refresh_token(user.id)
    store_refresh_token(db, user.id, refresh_token, datetime.now(timezone.utc))

    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = authenticate_user(db, payload.email, payload.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(user.email, user.company_id, user.role)
    refresh_token = create_refresh_token(user.id)
    store_refresh_token(db, user.id, refresh_token, datetime.now(timezone.utc))
    update_last_login(db, user)

    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserProfile)
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
        "status": current_user.status,
    }