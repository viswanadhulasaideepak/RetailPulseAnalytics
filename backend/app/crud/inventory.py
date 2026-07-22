from typing import Optional

from sqlalchemy import func, or_
from sqlalchemy.orm import Session, joinedload

from app.models.inventory import Inventory
from app.models.inventory_movement import InventoryMovement
from app.models.enums import StockStatus, MovementType
from app.models.product import Product
from app.models.category import Category

#-----------get inventory by product--------------
def get_inventory_by_product(
    db: Session,
    company_id: int,
    product_id: int,
):
    return (
        db.query(Inventory)
        .filter(
            Inventory.company_id == company_id,
            Inventory.product_id == product_id,
        )
        .first()
    )
    
#--------------------create inventory--------------------
def create_inventory(
    db: Session,
    company_id: int,
    product_id: int,
    reorder_level: int = 10,
):
    inventory = Inventory(
        company_id=company_id,
        product_id=product_id,
        current_stock=0,
        reserved_stock=0,
        available_stock=0,
        reorder_level=reorder_level,
        stock_status=StockStatus.OUT_OF_STOCK,
    )

    db.add(inventory)
    db.commit()
    db.refresh(inventory)

    return inventory

#------------------------List Inventory----------------------    
def get_inventory(
    db: Session,
    company_id: int,
    search: Optional[str] = None,
    category_id: Optional[int] = None,
    brand: Optional[str] = None,
    stock_status: Optional[StockStatus] = None,
):
    query = (
        db.query(Inventory)
        .join(Product)
        .options(
            joinedload(Inventory.product).joinedload(Product.category)
            )
        .filter(
            Inventory.company_id == company_id
        )
    )

    if search:
        query = query.filter(
            or_(
                Product.name.ilike(f"%{search}%"),
                Product.sku.ilike(f"%{search}%"),
            )
        )

    if category_id:
        query = query.filter(
            Product.category_id == category_id
        )

    if brand:
        query = query.filter(
            Product.brand.ilike(f"%{brand}%")
        )

    if stock_status:
        query = query.filter(
            Inventory.stock_status == stock_status
        )

    return query.all()

#-----------------Update Inventory-----------------
def update_inventory(
    db: Session,
    inventory: Inventory,
):
    db.add(inventory)
    db.commit()
    db.refresh(inventory)

    return inventory

#--------------------Create Inventory Movement-----------------
def create_inventory_movement(
    db: Session,
    inventory_id: int,
    movement_type: MovementType,
    quantity_changed: int,
    previous_quantity: int,
    updated_quantity: int,
    reason: str,
    remarks: str,
    performed_by: int,
):
    movement = InventoryMovement(
        inventory_id=inventory_id,
        movement_type=movement_type,
        quantity_changed=quantity_changed,
        previous_quantity=previous_quantity,
        updated_quantity=updated_quantity,
        reason=reason,
        remarks=remarks,
        performed_by=performed_by,
    )

    db.add(movement)
    db.commit()
    db.refresh(movement)

    return movement

#------------------Inventory Movement History-----------------
def get_inventory_movements(
    db: Session,
    inventory_id: int,
):
    return (
        db.query(InventoryMovement)
        .filter(
            InventoryMovement.inventory_id == inventory_id
        )
        .order_by(
            InventoryMovement.created_at.desc()
        )
        .all()
    )
 
#------------------Dashboard Summary----------------

def get_dashboard_summary(
    db: Session,
    company_id: int,
):
    total_products = (
        db.query(Inventory)
        .filter(
            Inventory.company_id == company_id
        )
        .count()
    )

    total_quantity = (
        db.query(
            func.coalesce(func.sum(Inventory.current_stock), 0)
        )
        .filter(
            Inventory.company_id == company_id
        )
        .scalar()
    )

    low_stock = (
        db.query(Inventory)
        .filter(
            Inventory.company_id == company_id,
            Inventory.stock_status == StockStatus.LOW_STOCK,
        )
        .count()
    )

    out_of_stock = (
        db.query(Inventory)
        .filter(
            Inventory.company_id == company_id,
            Inventory.stock_status == StockStatus.OUT_OF_STOCK,
        )
        .count()
    )

    return {
        "total_products": total_products,
        "total_inventory_quantity": total_quantity,
        "low_stock_products": low_stock,
        "out_of_stock_products": out_of_stock,
    }    
    