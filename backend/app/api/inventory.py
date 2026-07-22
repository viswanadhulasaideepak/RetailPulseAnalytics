from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database.session import get_db

from app.core.dependencies import get_current_user

from app.services import inventory_service

from app.schemas.inventory import (
    InventoryResponse,
    InventoryDashboard,
    AddStockRequest,
    RemoveStockRequest,
    AdjustStockRequest,
    ReorderLevelRequest
)

from app.models.user import User
from app.models.enums import StockStatus

router = APIRouter(
    prefix="/inventory",
    tags=["Inventory"],
)

#------------------------Dashboard----------------------
@router.get(
    "/dashboard",
    response_model=InventoryDashboard,
)
def get_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return inventory_service.get_dashboard_summary(
        db,
        current_user.company_id,
    )
    
#------------Get Inventory------------------
@router.get(
    "/",
    response_model=list[InventoryResponse],
)
def get_inventory(
    search: Optional[str] = None,
    category_id: Optional[int] = None,
    brand: Optional[str] = None,
    stock_status: Optional[StockStatus] = Query(None),

    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return inventory_service.get_inventory(
        db=db,
        company_id=current_user.company_id,
        search=search,
        category_id=category_id,
        brand=brand,
        stock_status=stock_status,
    )
    
#--------------------Movement History--------------------
@router.get(
    "/movements/{inventory_id}",
)
def get_movements(
    inventory_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return inventory_service.get_inventory_movements(
        db,
        inventory_id,
    )        
    
#---------------Add Stock------------
@router.post(
    "/add-stock",
    response_model=InventoryResponse,
)
def add_stock(
    request: AddStockRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return inventory_service.add_stock(
        db=db,
        company_id=current_user.company_id,
        product_id=request.product_id,
        quantity=request.quantity,
        reason=request.reason,
        remarks=request.remarks,
        user_id=current_user.id,
    )
    
#------------------Remove Stock--------------------
@router.post("/remove-stock",response_model=InventoryResponse)
def remove_stock(
    request: RemoveStockRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return inventory_service.remove_stock(
        db=db,
        company_id=current_user.company_id,
        product_id=request.product_id,
        quantity=request.quantity,
        reason=request.reason,
        remarks=request.remarks,
        user_id=current_user.id,
    )        
    
#-------------------Manual Adjust Stock---------------------
@router.post("/adjust-stock",response_model=InventoryResponse)
def adjust_stock(
    request: AdjustStockRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return inventory_service.adjust_stock(
        db=db,
        company_id=current_user.company_id,
        product_id=request.product_id,
        new_quantity=request.new_quantity,
        reason=request.reason,
        remarks=request.remarks,
        user_id=current_user.id,
    )    
    
#-------------------History----------------
@router.put("/reorder-level",response_model=InventoryResponse)
def update_reorder_level(
    request: ReorderLevelRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    return inventory_service.update_reorder_level(
        db=db,
        company_id=current_user.company_id,
        product_id=request.product_id,
        reorder_level=request.reorder_level,
        user_id=current_user.id
    )    