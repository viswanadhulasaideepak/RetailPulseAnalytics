from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.services.audit_service import create_audit_log
from app.crud import product as product_crud
from app.models.product import Product
from app.schemas.product import ProductUpdate
from app.models.user import User
from app.schemas.product import ProductCreate
from app.crud import category as category_crud


def get_products(
    db: Session,
    company_id: int,
    search=None,
    category_id=None,
    status_filter=None,
    brand=None,
    sort="recent",
    
    page=1,
    page_size=10,
):
    return product_crud.get_products(
        db=db,
        company_id=company_id,
        search=search,
        category_id=category_id,
        status=status_filter,
        brand=brand,
        sort=sort,
        
        page=page,
        page_size=page_size,
    )


def get_product(
    db: Session,
    product_id: int,
    company_id: int,
):
    product = product_crud.get_product(
        db,
        product_id,
        company_id,
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found",
        )

    return product

#---------------Create Product-----------------
def create_product(
    db: Session,
    company_id: int,
    data: ProductCreate,
    current_user: User | None = None,
):
    try:

        product = product_crud.create_product(
            db,
            company_id,
            data,
        )

        if current_user:
            create_audit_log(
                db=db,
                company_id=current_user.company_id,
                user_id=current_user.id,
                action=f"Product Created : {product.name}",
            )

    
        return product

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )

#--------------------Update Product--------------------
def update_product(
    db: Session,
    product: Product,
    data : ProductUpdate,
    current_user: User | None = None,
):
    values = data.model_dump(exclude_unset=True)

    current_unit_price = values.get(
        "unit_price",
        product.unit_price,
    )

    current_cost_price = values.get(
        "cost_price",
        product.cost_price,
    )

    if current_cost_price > current_unit_price:
        raise HTTPException(
            status_code=400,
            detail="Cost Price cannot exceed Unit Price",
        )

    try:
        updated = product_crud.update_product(
            db,
            product,
            data,
        )

        if current_user:

            # Check if status was updated
            if "status" in values:
                action = (
                    f"Product Activated : {updated.name}"
                    
                    if updated.status == "Active"
                    else
                    f"Product Deactivated : {updated.name}"
                    )
            else:
                action = f"Product Updated : {updated.name}"

            create_audit_log(
                db=db,
                company_id=current_user.company_id,
                user_id=current_user.id,
                action=action,
            )

        return updated

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )    

#------------------Delete Product------------------
def delete_product(
    db,
    product,
    current_user=None,
):

    name = product.name

    product_crud.delete_product(
        db,
        product,
    )

    if current_user:
        create_audit_log(
            db=db,
            company_id=current_user.company_id,
            user_id=current_user.id,
            action=f"Product Deleted : {name}",
        )

    return {
        "message": "Product deleted successfully"
    }

#----------DAshboard Summary-----------------
def dashboard_summary(
    db: Session,
    company_id: int,
):
    return product_crud.dashboard_summary(
        db,
        company_id,
    )
    
#---------------Update Product Status----------------    
def update_product_status(
    db,
    product,
    status,
    current_user,
):
    if status not in ["Active", "Inactive"]:
        raise HTTPException(
            status_code=400,
            detail="Invalid status",
        )

    product.status = status

    db.commit()

    db.refresh(product)

    create_audit_log(
        db=db,
        company_id=current_user.company_id,
        user_id=current_user.id,
        action=f"Product {'Activated' if status == 'Active' else 'Deactivated'} : {product.name}",
    )

    return product    