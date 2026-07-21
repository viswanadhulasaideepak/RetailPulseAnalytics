from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.core.dependencies import get_current_user

from app.schemas.sale import (
    SaleCreate,
    SaleUpdate,
    SaleResponse,
    SalesSummary,
)

from app.services import sale_service

router = APIRouter(
    prefix="/sales",
    tags=["Sales"],
)

#----------------------- Create Sale--------------------------

@router.post(
    "/",
    response_model=SaleResponse,
)
def create_sale(
    payload: SaleCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return sale_service.create_sale(
        db=db,
        company_id=current_user.company_id,
        user_id=current_user.id,
        data=payload,
    )

# ------------------------------Get All Sales-------------------------
@router.get(
    "/",
    response_model=list[SaleResponse],
)
def get_sales(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return sale_service.get_sales(
        db,
        current_user.company_id,
    )

#------------------------- Get Sale Details----------------------------------

@router.get(
    "/{sale_id}",
    response_model=SaleResponse,
)
def get_sale(
    sale_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return sale_service.get_sale(
        db,
        current_user.company_id,
        sale_id,
    )

# ----------------------------------Update Sale-----------------------------
@router.put(
    "/{sale_id}",
    response_model=SaleResponse,
)
def update_sale(
    sale_id: int,
    payload: SaleUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return sale_service.update_sale(
        db=db,
        company_id=current_user.company_id,
        sale_id=sale_id,
        user_id=current_user.id,
        data=payload,
    )

# ---------------------------Delete Sale---------------------------
@router.delete("/{sale_id}")
def delete_sale(
    sale_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return sale_service.delete_sale(
        db=db,
        company_id=current_user.company_id,
        sale_id=sale_id,
        user_id=current_user.id,
    )

#----------------------------- Dashboard Summary------------------------------------
@router.get(
    "/summary/dashboard",
    response_model=SalesSummary,
)
def sales_summary(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return sale_service.get_sales_summary(
        db,
        current_user.company_id,
    )

#------------------------------ Search-------------------------------------
@router.get("/search")
def search_sales(
    keyword: str = Query(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return sale_service.search_sales(
        db,
        current_user.company_id,
        keyword,
    )

# ----------------------------------Filter------------------------------------
@router.get("/filter")
def filter_sales(
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    category_id: Optional[int] = Query(None),
    sales_channel: Optional[str] = Query(None),
    payment_method: Optional[str] = Query(None),
    sort_by: str = "date", 
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return sale_service.filter_sales(
        db=db,
        company_id=current_user.company_id,
        start_date=start_date,
        end_date=end_date,
        category_id=category_id,
        sales_channel=sales_channel,
        payment_method=payment_method,
        sort_by=sort_by
    )