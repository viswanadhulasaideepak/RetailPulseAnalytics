from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.crud import inventory as inventory_crud
from app.models.enums import (
    StockStatus,
    MovementType,
)
from app.models.inventory import Inventory
from app.services.notification_service import create_notification
from app.services.audit_service import create_audit_log

#-----------Calculate Stock Status-------------
def calculate_stock_status(
    available_stock: int,
    reorder_level: int,
):
    if available_stock == 0:
        return StockStatus.OUT_OF_STOCK

    if available_stock <= reorder_level:
        return StockStatus.LOW_STOCK

    return StockStatus.IN_STOCK

#----------------Update Inventory values------------------
def refresh_inventory(
    inventory: Inventory,
):
    inventory.available_stock = (
        inventory.current_stock
        - inventory.reserved_stock
    )

    inventory.stock_status = calculate_stock_status(
        inventory.available_stock,
        inventory.reorder_level,
    )

    return inventory

#-------------------Get Inventory--------------------
def get_inventory(
    db: Session,
    company_id: int,
    search=None,
    category_id=None,
    brand=None,
    stock_status=None,
):
    return inventory_crud.get_inventory(
        db=db,
        company_id=company_id,
        search=search,
        category_id=category_id,
        brand=brand,
        stock_status=stock_status,
    )
    
#-----------------Dashboard---------------------
def get_dashboard_summary(
    db: Session,
    company_id: int,
):
    return inventory_crud.get_dashboard_summary(
        db,
        company_id,
    )
    
#-----------------Add Stock-------------------
def add_stock(
    db: Session,
    company_id: int,
    product_id: int,
    quantity: int,
    reason: str,
    remarks: str,
    user_id: int,
):

    if quantity <= 0:
        raise HTTPException(
            status_code=400,
            detail="Quantity must be greater than zero."
        )

    inventory = inventory_crud.get_inventory_by_product(
        db,
        company_id,
        product_id,
    )

    if not inventory:
        raise HTTPException(
            status_code=404,
            detail="Inventory not found."
        )

    previous = inventory.current_stock

    inventory.current_stock += quantity

    refresh_inventory(inventory)

    inventory_crud.update_inventory(
        db,
        inventory,
    )

    inventory_crud.create_inventory_movement(
        db=db,
        inventory_id=inventory.id,
        movement_type=MovementType.STOCK_IN,
        quantity_changed=quantity,
        previous_quantity=previous,
        updated_quantity=inventory.current_stock,
        reason=reason,
        remarks=remarks,
        performed_by=user_id,
    )
    
    create_audit_log(
    db=db,
    company_id=inventory.company_id,
    user_id=user_id,
    action="Stock Added",
    product_name=inventory.product.name,
    quantity_changed=quantity,
    movement_type="Stock Addition",
)
    if inventory.stock_status == StockStatus.LOW_STOCK:
        create_notification(
        db=db,
        company_id=inventory.company_id,
        title="Low Stock Alert",
        message=f"{inventory.product.name} is running low on stock.",
    )

    elif inventory.stock_status == StockStatus.OUT_OF_STOCK:
        create_notification(
        db=db,
        company_id=inventory.company_id,
        title="Out of Stock",
        message=f"{inventory.product.name} is out of stock.",
    )

    return inventory

#------------------Remove Stock----------------
def remove_stock(
    db: Session,
    company_id: int,
    product_id: int,
    quantity: int,
    reason: str,
    remarks: str,
    user_id: int,
):

    if quantity <= 0:
        raise HTTPException(
            status_code=400,
            detail="Quantity must be greater than zero."
        )

    inventory = inventory_crud.get_inventory_by_product(
        db,
        company_id,
        product_id,
    )

    if not inventory:
        raise HTTPException(
            status_code=404,
            detail="Inventory not found."
        )

    if quantity > inventory.available_stock:
        raise HTTPException(
            status_code=400,
            detail="Insufficient stock."
        )

    previous = inventory.current_stock

    inventory.current_stock -= quantity

    refresh_inventory(inventory)

    inventory_crud.update_inventory(
        db,
        inventory,
    )

    inventory_crud.create_inventory_movement(
        db=db,
        inventory_id=inventory.id,
        movement_type=MovementType.STOCK_OUT,
        quantity_changed=quantity,
        previous_quantity=previous,
        updated_quantity=inventory.current_stock,
        reason=reason,
        remarks=remarks,
        performed_by=user_id,
    )
    
    create_audit_log(
    db=db,
    company_id=inventory.company_id,
    user_id=user_id,
    action="Stock Removed",
    product_name=inventory.product.name,
    quantity_changed=quantity,
    movement_type="Stock Removal",
)
    if inventory.stock_status == StockStatus.LOW_STOCK:
        create_notification(
        db=db,
        company_id=inventory.company_id,
        title="Low Stock Alert",
        message=f"{inventory.product.name} is running low on stock.",
    )

    elif inventory.stock_status == StockStatus.OUT_OF_STOCK:
        create_notification(
        db=db,
        company_id=inventory.company_id,
        title="Out of Stock",
        message=f"{inventory.product.name} is out of stock.",
    )

    return inventory

#--------------------Manual Adjustment Stock----------------
def adjust_stock(
    db: Session,
    company_id: int,
    product_id: int,
    new_quantity: int,
    reason: str,
    remarks: str,
    user_id: int,
):

    if new_quantity < 0:
        raise HTTPException(
            status_code=400,
            detail="Stock cannot be negative."
        )

    inventory = inventory_crud.get_inventory_by_product(
        db,
        company_id,
        product_id,
    )

    if not inventory:
        raise HTTPException(
            status_code=404,
            detail="Inventory not found."
        )

    previous = inventory.current_stock

    inventory.current_stock = new_quantity

    refresh_inventory(inventory)

    inventory_crud.update_inventory(
        db,
        inventory,
    )

    inventory_crud.create_inventory_movement(
        db=db,
        inventory_id=inventory.id,
        movement_type=MovementType.MANUAL_ADJUSTMENT,
        quantity_changed=abs(
            new_quantity - previous
        ),
        previous_quantity=previous,
        updated_quantity=new_quantity,
        reason=reason,
        remarks=remarks,
        performed_by=user_id,
    )
    
    create_audit_log(
    db=db,
    company_id=inventory.company_id,
    user_id=user_id,
    action="Stock Adjusted",
    product_name=inventory.product.name,
    quantity_changed=abs(new_quantity - previous),
    movement_type="Manual Adjustment",
)

    create_notification(
    db=db,
    company_id=inventory.company_id,
    title="Stock Adjusted",
    message=f"{inventory.product.name} inventory was manually adjusted.",
)

    return inventory

#--------------------Movement History----------------
def get_inventory_movements(
    db: Session,
    inventory_id: int,
):
    return inventory_crud.get_inventory_movements(
        db,
        inventory_id,
    )
    
#-------------------Update Recorder Level------------

def update_reorder_level(
    db: Session,
    company_id: int,
    product_id: int,
    reorder_level: int,
    user_id: int
):

    if reorder_level < 0:
        raise HTTPException(
            status_code=400,
            detail="Reorder level cannot be negative."
        )

    inventory = inventory_crud.get_inventory_by_product(
        db,
        company_id,
        product_id,
    )

    if not inventory:
        raise HTTPException(
            status_code=404,
            detail="Inventory not found."
        )

    inventory.reorder_level = reorder_level

    refresh_inventory(inventory)
    create_notification(
    db=db,
    company_id=inventory.company_id,
    title="Reorder Level Updated",
    message=(
        f"Reorder level for "
        f"{inventory.product.name} "
        f"was updated."
    ),
)
    
    create_audit_log(
    db=db,
    company_id=inventory.company_id,
    user_id=user_id,  
    action="Reorder Level Updated",
    product_name=inventory.product.name,
)

    return inventory_crud.update_inventory(
        db,
        inventory,
    )            