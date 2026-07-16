from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.category import Category
from app.models.product import Product


def get_categories(
    db: Session,
    company_id: int,
    search: str | None = None,
):
    query = db.query(Category).filter(
        Category.company_id == company_id
    )

    if search:
        query = query.filter(
            Category.name.ilike(f"%{search}%")
        )

    categories = query.order_by(Category.name).all()

    print("Company ID:", company_id)
    print("Search:", search)
    print("Categories:", categories)

    results = []

    for category in categories:

        product_count = (
            db.query(func.count(Product.id))
            .filter(Product.category_id == category.id)
            .scalar()
        )

        category.product_count = product_count
        results.append(category)

    return results


def get_category(
    db: Session,
    category_id: int,
    company_id: int,
):
    return (
        db.query(Category)
        .filter(
            Category.id == category_id,
            Category.company_id == company_id,
        )
        .first()
    )

#---------------------Create Category-----------------
def create_category(
    db: Session,
    company_id: int,
    data,
):
    print("========== CREATE CATEGORY ==========")
    print("Company ID:", company_id)
    print("Data:", data)

    existing = (
        db.query(Category)
        .filter(
            Category.company_id == company_id,
            Category.name == data.name,
        )
        .first()
    )

    print("Existing:", existing)

    if existing:
        raise ValueError("Category already exists")

    category = Category(
        company_id=company_id,
        name=data.name,
        description=data.description,
        status=data.status,
    )

    print("Category object created:", category)

    db.add(category)
    print("Added to session")

    db.commit()
    print("Committed to database")

    db.refresh(category)
    print("Created Category:", category.id, category.name)

    return category

#---------------Update Category--------------------
def update_category(
    db: Session,
    category: Category,
    data,
):

    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(category, key, value)

    db.commit()
    db.refresh(category)

    return category

#---------------Delete Category------------

def delete_category(
    db: Session,
    category: Category,
):
    db.delete(category)
    db.commit()
    
def get_category_by_name(
    db: Session,
    company_id: int,
    name: str,
):
    return (
        db.query(Category)
        .filter(
            Category.company_id == company_id,
            Category.name == name,
        )
        .first()
    )    