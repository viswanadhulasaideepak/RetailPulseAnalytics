from datetime import datetime
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from sqlalchemy import or_
from app.models.sale import Sale, SaleItem
from app.models.product import Product
from app.models.audit_log import AuditLog
from app.models.notification import Notification
from app.services import notification_service
from app.services import audit_service


#-----------------Invoice Generator------------------

def generate_invoice_number(
    db: Session,
    company_id: int,
) -> str:
    year = datetime.now().year

    last_sale = (
        db.query(Sale)
        .filter(Sale.company_id == company_id)
        .order_by(Sale.id.desc())
        .first()
    )

    next_number = 1

    if last_sale:
        try:
            next_number = int(last_sale.invoice_number.split("-")[-1]) + 1
        except Exception:
            next_number = last_sale.id + 1

    while True:
        invoice = f"INV-{year}-{next_number:06d}"
        
        exists = (
            db.query(Sale)
            .filter(
                Sale.company_id == company_id,
                Sale.invoice_number == invoice,
                )
            .first()
            )

        if not exists:
            return invoice

        next_number += 1

#-------------------Create Sale------------------------

def create_sale(
    db: Session,
    company_id: int,
    user_id: int,
    data,
):
    invoice = generate_invoice_number(db, company_id)

    sale = Sale(
        company_id=company_id,
        created_by=user_id,
        invoice_number=invoice,
        customer_name=data.customer_name,
        sales_channel=data.sales_channel,
        payment_method=data.payment_method,
        total_amount=0,
    )

    db.add(sale)
    db.flush()

    grand_total = 0

    for item in data.items:

        product = (
            db.query(Product)
            .filter(
                Product.id == item.product_id,
                Product.company_id == company_id,
            )
            .first()
        )

        if not product:
            raise ValueError(f"Product {item.product_id} not found")

        if product.stock_quantity < item.quantity:
            raise ValueError(
                f"Insufficient stock for {product.name}"
            )

        unit_price = product.unit_price

        subtotal = unit_price * item.quantity

        if item.discount > subtotal:
            raise ValueError(
                "Discount cannot exceed subtotal."
            )
        
        product.stock_quantity -= item.quantity
        
        audit_service.create_audit_log(
            db=db,
            company_id=company_id,
            user_id=user_id,
            action="Inventory Updated",
            invoice_number=invoice,
            product_name=product.name,
            )
        
        total = subtotal - item.discount + item.tax

        # Low Stock Notification

        if product.stock_quantity <= 10 and product.stock_quantity > 0:
            notification_service.create_notification(
                db=db,
                company_id=company_id,
                title="Low Stock Alert",
                message=(
                    f"{product.name} stock is running low. "
                    f"Only {product.stock_quantity} left."
                    ),
                )
        if product.stock_quantity == 0:
            product.status = "Out of Stock"
            
            notification_service.create_notification(
                db=db,
                company_id=company_id,
                title="Out Of Stock",
                message=f"{product.name} is now Out of Stock.",
                )

            audit_service.create_audit_log(
                db=db,
                company_id=company_id,
                user_id=user_id,
                action="Product Marked Out Of Stock",
                invoice_number=invoice,
                product_name=product.name,
                )

        sale_item = SaleItem(
            sale_id=sale.id,
            product_id=product.id,
            category_id=product.category_id,
            quantity=item.quantity,
            unit_price=unit_price,
            discount=item.discount,
            tax=item.tax,
            total=total,
        )

        db.add(sale_item)

        grand_total += total

    sale.total_amount = grand_total

    db.commit()
    db.refresh(sale)
    
    for item in sale.items:
        
        audit_service.create_audit_log(
        db=db,
        company_id=company_id,
        user_id=user_id,
        action="Sale Created",
        invoice_number=sale.invoice_number,
        product_name=item.product.name,
    )

    return sale

#----------------------Update Sale--------------------

def update_sale(
    db: Session,
    company_id: int,
    sale_id: int,
    user_id: int,
    data,
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

    try:

        # Restore previous stock
        for item in sale.items:

            product = (
                db.query(Product)
                .filter(Product.id == item.product_id)
                .first()
            )

            if product:
                product.stock_quantity += item.quantity
                product.status = "Active"

        # Remove previous sale items
        db.query(SaleItem).filter(
            SaleItem.sale_id == sale.id
        ).delete()

        grand_total = 0

        # Update basic information
        sale.customer_name = data.customer_name
        sale.sales_channel = data.sales_channel
        sale.payment_method = data.payment_method

        # Add new items
        for item in data.items:

            product = (
                db.query(Product)
                .filter(
                    Product.id == item.product_id,
                    Product.company_id == company_id,
                )
                .first()
            )

            if not product:
                raise ValueError(
                    f"Product {item.product_id} not found"
                )

            if product.stock_quantity < item.quantity:
                raise ValueError(
                    f"Insufficient stock for {product.name}"
                )

            subtotal = product.unit_price * item.quantity

            if item.discount > subtotal:
                raise ValueError(
                    "Discount cannot exceed subtotal"
                )

            total = subtotal - item.discount + item.tax

            product.stock_quantity -= item.quantity
            
            audit_service.create_audit_log(
                db=db,
                company_id=company_id,
                user_id=user_id,
                action="Inventory Updated",
                invoice_number=sale.invoice_number,
                product_name=product.name,
                )
            
            # Low Stock Notification

            if product.stock_quantity <= 10 and product.stock_quantity > 0:
                notification_service.create_notification(
                    db=db,
                    company_id=company_id,
                    title="Low Stock Alert",
                    message=(
                        f"{product.name} stock is running low. "
                        f"Only {product.stock_quantity} left."
                        ),
                    )
                
            if product.stock_quantity == 0:
                product.status = "Out of Stock"
                
                notification_service.create_notification(
                    db=db,
                    company_id=company_id,
                    title="Out Of Stock",
                    message=f"{product.name} is now Out of Stock.",
                )
                    
                audit_service.create_audit_log(
                    db=db,
                    company_id=company_id,
                    user_id=user_id,
                    action="Product Marked Out Of Stock",
                    invoice_number=sale.invoice_number,
                    product_name=product.name,
                )

            sale_item = SaleItem(
                sale_id=sale.id,
                product_id=product.id,
                category_id=product.category_id,
                quantity=item.quantity,
                unit_price=product.unit_price,
                discount=item.discount,
                tax=item.tax,
                total=total,
            )

            db.add(sale_item)

            grand_total += total

        sale.total_amount = grand_total

        db.commit()
        db.refresh(sale)
        
        for item in sale.items:
            
            audit_service.create_audit_log(
                db=db,
                company_id=company_id,
                user_id=user_id,
                action="Sale Updated",
                invoice_number=sale.invoice_number,
                product_name=item.product.name,
                )

        return sale

    except Exception:
        db.rollback()
        raise

#------------------Get All Sales-----------------------

def get_sales(
    db: Session,
    company_id: int,
):
    return (
        db.query(Sale)
        .options(
            joinedload(Sale.items)
            .joinedload(SaleItem.product)
        )
        .filter(
            Sale.company_id == company_id
        )
        .order_by(
            Sale.sale_date.desc()
        )
        .all()
    )
    
#--------------------Get Single Sale--------------------------

def get_sale(
    db: Session,
    company_id: int,
    sale_id: int,
):
    return (
        db.query(Sale)
        .options(
            joinedload(Sale.items)
            .joinedload(SaleItem.product)
        )
        .filter(
            Sale.id == sale_id,
            Sale.company_id == company_id,
        )
        .first()
    )
    
#--------------------------Delete Sale-------------------------

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
        for item in sale.items:

            product = (
                db.query(Product)
                .filter(Product.id == item.product_id)
                .first()
            )

            if product:

                product.stock_quantity += item.quantity
                
                audit_service.create_audit_log(
                        db=db,
                        company_id=company_id,
                        user_id=user_id,
                        action="Inventory Restored",
                        invoice_number=sale.invoice_number,
                        product_name=item.product.name,
                        ) 
                
                if product.stock_quantity > 0:
                    product.status = "Active"
                    
        db.delete(sale)
        db.commit()
        
        for item in sale.items:
            audit_service.create_audit_log(
                db=db,
                company_id=company_id,
                user_id=user_id,
                action="Sale Deleted",
                invoice_number=sale.invoice_number,
                product_name=item.product.name,
                )

        return {
            "message": "Sale deleted successfully",
            "invoice_number": invoice_number,
        }

    except Exception:
        db.rollback()
        raise
#----------------Dashboard Summary---------------------

def get_sales_summary(
    db: Session,
    company_id: int,
):
    total_orders = (
        db.query(func.count(Sale.id))
        .filter(Sale.company_id == company_id)
        .scalar()
    )

    total_revenue = (
        db.query(
            func.coalesce(
                func.sum(Sale.total_amount),
                0,
            )
        )
        .filter(Sale.company_id == company_id)
        .scalar()
    )

    average_order = (
        total_revenue / total_orders
        if total_orders
        else 0
    )

    return {
        "total_sales": total_orders,
        "total_revenue": total_revenue,
        "total_orders": total_orders,
        "average_order_value": round(
            average_order,
            2,
        ),
    }        
    
#------------------------Search--------------------------

def search_sales(
    db: Session,
    company_id: int,
    keyword: str,
):
    return (
        db.query(Sale)
        .join(Sale.items)
        .join(Product)
        .filter(
            Sale.company_id == company_id,
            or_(
                Sale.invoice_number.ilike(f"%{keyword}%"),
                Sale.customer_name.ilike(f"%{keyword}%"),
                Product.name.ilike(f"%{keyword}%"),
            ),
        )
        .distinct()
        .all()
    )    
    
#---------------------Filter Sale----------------------

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
    query = (
        db.query(Sale)
        .join(Sale.items)
        .filter(Sale.company_id == company_id)
    )

    if start_date:
        query = query.filter(
            Sale.sale_date >= start_date
        )

    if end_date:
        query = query.filter(
            Sale.sale_date <= end_date
        )

    if category_id:
        query = query.filter(
            SaleItem.category_id == category_id
        )

    if sales_channel:
        query = query.filter(
            Sale.sales_channel == sales_channel
        )

    if payment_method:
        query = query.filter(
            Sale.payment_method == payment_method
        )

    if sort_by == "invoice":
        query = query.order_by(Sale.invoice_number)

    elif sort_by == "amount":
        query = query.order_by(Sale.total_amount.desc())

    else:
        query = query.order_by(Sale.sale_date.desc())

    return query.distinct().all()    