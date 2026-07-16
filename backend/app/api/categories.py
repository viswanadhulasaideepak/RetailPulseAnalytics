from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.core.dependencies import get_current_user, require_role
from app.schemas.category import (
    CategoryCreate,
    CategoryUpdate,
    CategoryResponse,
)
from app.services import category_service

router = APIRouter(
    prefix="/categories",
    tags=["Categories"],
)


@router.get(
    "/",
    response_model=list[CategoryResponse],
)
def get_categories(
    search: str | None = Query(None),
    db: Session = Depends(get_db),
    current_user=Depends(require_role("Admin", "Company Admin")),
):
    print("Logged in company:", current_user.company_id)
    return category_service.get_categories(
        db=db,
        company_id=current_user.company_id,
        search=search,
    )


@router.get(
    "/{category_id}",
    response_model=CategoryResponse,
)
def get_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("Admin", "Company Admin")),
):
    return category_service.get_category(
        db,
        category_id,
        current_user.company_id,
    )


@router.post(
    "/",
    response_model=CategoryResponse,
)
def create_category(
    data: CategoryCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("Admin", "Company Admin")),
):
    
    print("API HIT")
    print(current_user.company_id)
    print(data)
    return category_service.create_category(
        db,
        current_user.company_id,
        data,
    )


@router.put(
    "/{category_id}",
    response_model=CategoryResponse,
)
def update_category(
    category_id: int,
    data: CategoryUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("Admin", "Company Admin")),
):
    category = category_service.get_category(
        db,
        category_id,
        current_user.company_id,
    )

    return category_service.update_category(
        db,
        category,
        data,
    )


@router.delete("/{category_id}")
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
   current_user=Depends(require_role("Admin", "Company Admin")),
):
    category = category_service.get_category(
        db,
        category_id,
        current_user.company_id,
    )

    return category_service.delete_category(
        db,
        category,
    )