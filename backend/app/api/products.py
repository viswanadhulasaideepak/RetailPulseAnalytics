from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from fastapi import Body
from app.database.session import get_db
from app.core.dependencies import require_role
from app.schemas.product import (
    ProductCreate,
    ProductUpdate,
    ProductResponse,
)
from app.services import product_service

router = APIRouter(
    prefix="/products",
    tags=["Products"],
)


@router.get("/",response_model=list[ProductResponse],)
def get_products(
    search: str | None = Query(None),
    category_id: int | None = Query(None),
    status: str | None = Query(None),
    brand: str | None = Query(None),
    sort: str = Query("recent"),
    db: Session = Depends(get_db),
    
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    current_user=Depends(require_role("Admin", "Company Admin")),
):
    return product_service.get_products(
        db=db,
        company_id=current_user.company_id,
        search=search,
        category_id=category_id,
        status_filter=status,
        brand=brand,
        sort=sort,
        
        page=page,
        page_size=page_size,
    )

#------------Dashboard Summary------------
@router.get("/summary",)
def dashboard_summary(
    db: Session = Depends(get_db),
    current_user=Depends(require_role("Admin", "Company Admin")),
):
    return product_service.dashboard_summary(
        db,
        current_user.company_id,
    )

#-------------------get product--------------------
@router.get("/{product_id}",response_model=ProductResponse,)
def get_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("Admin", "Company Admin")),
):
    return product_service.get_product(
        db,
        product_id,
        current_user.company_id,
    )

#----------------Create Product----------------
@router.post("/",response_model=ProductResponse,)
def create_product(
    data: ProductCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("Admin", "Company Admin")),
):
    return product_service.create_product(
    db,
    current_user.company_id,
    data,
    current_user,
)

#----------------Update Product---------------
@router.put("/{product_id}",response_model=ProductResponse,)
def update_product(
    product_id: int,
    data: ProductUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("Admin", "Company Admin")),
):
    product = product_service.get_product(
        db,
        product_id,
        current_user.company_id,
    )

    return product_service.update_product(
    db=db,
    product=product,
    data=data,
    current_user=current_user,
)
    
#-------------------Update Product Status-----------------    
@router.patch("/{product_id}/status")
def update_product_status(
    product_id: int,
    status: str = Body(..., embed=True),
    db: Session = Depends(get_db),
    current_user=Depends(require_role("Admin", "Company Admin")),
):
    product = product_service.get_product(
        db,
        product_id,
        current_user.company_id,
    )

    return product_service.update_product_status(
        db,
        product,
        status,
        current_user,
    )    

#-----------------Delete Product---------------
@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_role("Admin", "Company Admin")),
):
    product = product_service.get_product(
        db,
        product_id,
        current_user.company_id,
    )

    return product_service.delete_product(
    db=db,
    product=product,
    current_user=current_user,
)