from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.services.audit_service import create_audit_log
from app.crud import category as category_crud
from app.models.category import Category


def get_categories(
    db: Session,
    company_id: int,
    search: str | None = None,
):
    return category_crud.get_categories(
        db=db,
        company_id=company_id,
        search=search,
    )


def get_category(
    db: Session,
    category_id: int,
    company_id: int,
):
    category = category_crud.get_category(
        db,
        category_id,
        company_id,
    )

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )

    return category

#---------------Create Category-------------
def create_category(
    db: Session,
    company_id: int,
    data,
    current_user=None,
):
    print("SERVICE HIT")
    try:
        category = category_crud.create_category(
            db,
            company_id,
            data,
        )

        if current_user:
            create_audit_log(
                db=db,
                company_id=current_user.company_id,
                user_id=current_user.id,
                action=f"Category Created : {category.name}",
            )

        return category

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )

#----------------Update Category-----------------
def update_category(
    db: Session,
    category,
    data,
    current_user=None,
):

    updated = category_crud.update_category(
        db,
        category,
        data,
    )

    if current_user:
        create_audit_log(
            db=db,
            company_id=current_user.company_id,
            user_id=current_user.id,
            action=f"Category Updated : {updated.name}",
        )

    return updated

#----------------------Delete Category--------------
def delete_category(
    db: Session,
    category,
    current_user=None,
):

    name = category.name

    category_crud.delete_category(
        db,
        category,
    )

    if current_user:
        create_audit_log(
            db=db,
            company_id=current_user.company_id,
            user_id=current_user.id,
            action=f"Category Deleted : {name}",
        )

    return {
        "message": "Category deleted successfully"
    }