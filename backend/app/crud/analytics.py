from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.sale import Sale, SaleItem
from app.models.product import Product
from app.models.category import Category
from app.models.inventory import Inventory
from app.models.enums import StockStatus



# KPI

def get_total_revenue(db: Session, company_id: int):
    return (
        db.query(func.coalesce(func.sum(Sale.total_amount), 0))
        .filter(Sale.company_id == company_id)
        .scalar()
    )


def get_total_orders(db: Session, company_id: int):
    return (
        db.query(Sale)
        .filter(Sale.company_id == company_id)
        .count()
    )


def get_total_products_sold(db: Session, company_id: int):
    return (
        db.query(func.coalesce(func.sum(SaleItem.quantity), 0))
        .join(Sale)
        .filter(Sale.company_id == company_id)
        .scalar()
    )


def get_total_categories(db: Session, company_id: int):
    return (
        db.query(Category)
        .filter(Category.company_id == company_id)
        .count()
    )


def get_inventory_value(db: Session, company_id: int):
    return (
        db.query(
            func.coalesce(
                func.sum(
                    Inventory.current_stock * Product.cost_price
                ),
                0,
            )
        )
        .join(Product,
              Inventory.product_id == Product.id)
        .filter(Inventory.company_id == company_id)
        .scalar()
    )


def get_low_stock_products(db: Session, company_id: int):
    return (
        db.query(Inventory)
        .filter(
            Inventory.company_id == company_id,
            Inventory.current_stock <= Inventory.reorder_level,
            Inventory.current_stock > 0,
        )
        .count()
    )


def get_out_of_stock_products(db: Session, company_id: int):
    return (
        db.query(Inventory)
        .filter(
            Inventory.company_id == company_id,
            Inventory.current_stock == 0,
        )
        .count()
    )
    
#----------------Revenue Trend----------------

def get_revenue_trend(
    db: Session,
    company_id: int,
):

    rows = (
        db.query(
            func.date(Sale.sale_date).label("date"),
            func.sum(Sale.total_amount).label("revenue"),
        )
        .filter(
            Sale.company_id == company_id
        )
        .group_by(
            func.date(Sale.sale_date)
        )
        .order_by(
            func.date(Sale.sale_date)
        )
        .all()
    )

    return rows    

#--------------------Sales Trend--------------------

def get_sales_trend(
    db: Session,
    company_id: int,
):

    rows = (
        db.query(
            func.date(Sale.sale_date).label("date"),
            func.count(Sale.id).label("orders"),
        )
        .filter(
            Sale.company_id == company_id
        )
        .group_by(
            func.date(Sale.sale_date)
        )
        .order_by(
            func.date(Sale.sale_date)
        )
        .all()
    )

    return rows

#------------------------Top Selling Product------------------------
def get_top_products(
    db: Session,
    company_id: int,
):

    rows = (
        db.query(
            Product.id,
            Product.name,
            func.sum(SaleItem.quantity).label("quantity"),
            func.sum(SaleItem.total).label("revenue"),
        )
        .join(SaleItem,
              SaleItem.product_id == Product.id)
        
        .join(Sale,
              Sale.id == SaleItem.sale_id)
        .filter(
            Sale.company_id == company_id
        )
        .group_by(
            Product.id,
            Product.name,
        )
        .order_by(
            func.sum(SaleItem.quantity).desc()
        )
        .limit(10)
        .all()
    )

    return rows

#--------------------------Top Categories-----------------------

def get_top_categories(
    db: Session,
    company_id: int,
):

    rows = (
        db.query(
            Category.id,
            Category.name,
            func.sum(SaleItem.total).label("revenue"),
        )
        .join(SaleItem,
              SaleItem.category_id == Category.id)
        
        .join(Sale,
              Sale.id == SaleItem.sale_id)
        
        .filter(
            Sale.company_id == company_id
        )
        .group_by(
            Category.id,
            Category.name,
        )
        .order_by(
            func.sum(SaleItem.total).desc()
        )
        .all()
    )

    return rows

#------------------------Payment Methods------------------------

def get_payment_methods(
    db: Session,
    company_id: int,
):

    rows = (
        db.query(
            Sale.payment_method,
            func.sum(Sale.total_amount),
        )
        .filter(
            Sale.company_id == company_id
        )
        .group_by(
            Sale.payment_method
        )
        .all()
    )

    return rows

#---------------------Sales Channels----------------------

def get_sales_channels(
    db: Session,
    company_id: int,
):

    rows = (
        db.query(
            Sale.sales_channel,
            func.count(Sale.id),
        )
        .filter(
            Sale.company_id == company_id
        )
        .group_by(
            Sale.sales_channel
        )
        .all()
    )

    return rows    