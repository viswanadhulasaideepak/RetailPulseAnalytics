from fastapi import HTTPException
from sqlalchemy.orm import Session,joinedload

from app.crud import sale as sale_crud
from app.services.audit_service import create_audit_log
from app.models.sale import Sale
from app.models.product import Product
from app.services.inventory_service import add_stock
from app.services.inventory_service import remove_stock

def create_sale(
    db: Session,
    company_id: int,
    user_id: int,
    data,
):
    try:
        sale = sale_crud.create_sale(
            db=db,
            company_id=company_id,
            user_id=user_id,
            data=data,
        )
        
        for item in sale.items:
            remove_stock(
                db=db,
                company_id=company_id,
                product_id=item.product_id,
                quantity=item.quantity,
                reason="Sale",
                remarks=f"Invoice {sale.invoice_number}",
                user_id=user_id,
                )

        create_audit_log(
            db=db,
            company_id=company_id,
            user_id=user_id,
            action=f"Sale Created - {sale.invoice_number}",
        )

        return sale

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


def get_sales(
    db: Session,
    company_id: int,
):
    return sale_crud.get_sales(
        db,
        company_id,
    )


def get_sale(
    db: Session,
    company_id: int,
    sale_id: int,
):
    sale = sale_crud.get_sale(
        db,
        company_id,
        sale_id,
    )

    if not sale:
        raise HTTPException(
            status_code=404,
            detail="Sale not found",
        )

    return sale


def update_sale(
    db,
    company_id,
    sale_id,
    user_id,
    data,
):
    try:

        sale = sale_crud.update_sale(
            db=db,
            company_id=company_id,
            sale_id=sale_id,
            user_id=user_id,
            data=data,
        )

        create_audit_log(
            db=db,
            company_id=company_id,
            user_id=user_id,
            action=f"Sale Updated - {sale.invoice_number}",
        )

        return sale

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


def delete_sale(
    db: Session,
    company_id: int,
    sale_id: int,
    user_id: int,
):
    sale = (
        db.query(Sale)
        .options(joinedload(Sale.items))
        .filter(
            Sale.id == sale_id,
            Sale.company_id == company_id,
        )
        .first()
    )

    if not sale:
        raise ValueError("Sale not found")

    invoice_number = sale.invoice_number

    try:
        # Restore inventory
        for item in sale.items:
            add_stock(
                db=db,
                company_id=company_id,
                product_id=item.product_id,
                quantity=item.quantity,
                reason="Sale Deleted",
                remarks=f"Invoice {invoice_number}",
                user_id=user_id,
                )

        db.delete(sale)
        db.commit()
        
        create_audit_log(
            db=db,
            company_id=company_id,
            user_id=user_id,
            action=f"Sale Deleted - {invoice_number}",
            )

        return {
            "message": "Sale deleted successfully",
            "invoice_number": invoice_number,
        }

    except Exception:
        db.rollback()
        raise


def get_sales_summary(
    db: Session,
    company_id: int,
):
    return sale_crud.get_sales_summary(
        db,
        company_id,
    )


def search_sales(
    db: Session,
    company_id: int,
    keyword: str,
):
    return sale_crud.search_sales(
        db,
        company_id,
        keyword,
    )


def filter_sales(
    db: Session,
    company_id: int,
    start_date=None,
    end_date=None,
    category_id=None,
    sales_channel=None,
    payment_method=None,
    sort_by="date",
):
    return sale_crud.filter_sales(
        db=db,
        company_id=company_id,
        start_date=start_date,
        end_date=end_date,
        category_id=category_id,
        sales_channel=sales_channel,
        payment_method=payment_method,
        sort_by=sort_by,
    )