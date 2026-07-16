from sqlalchemy import asc, desc
from sqlalchemy.orm import Session

from app.models.category import Category
from app.models.product import Product


def get_products(
    db: Session,
    company_id: int,
    search: str | None = None,
    category_id: int | None = None,
    status: str | None = None,
    brand: str | None = None,
    sort: str = "recent",
    page: int = 1,
    page_size: int =10,
):

    query = db.query(Product).filter(
        Product.company_id == company_id
    )

    if search:

        query = query.filter(
            (Product.name.ilike(f"%{search}%"))
            | (Product.sku.ilike(f"%{search}%"))
            | (Product.brand.ilike(f"%{search}%"))
        )

    if category_id:
        query = query.filter(
            Product.category_id == category_id
        )

    if status:
        query = query.filter(
            Product.status == status
        )

    if brand:
        query = query.filter(
            Product.brand.ilike(f"%{brand}%")
        )

    if sort == "name":
        query = query.order_by(asc(Product.name))

    elif sort == "price":
        query = query.order_by(desc(Product.unit_price))

    else:
        query = query.order_by(desc(Product.created_at))

    return (
    query
    .offset((page - 1) * page_size)
    .limit(page_size)
    .all()
)


def get_product(
    db: Session,
    product_id: int,
    company_id: int,
):
    return (
        db.query(Product)
        .filter(
            Product.id == product_id,
            Product.company_id == company_id,
        )
        .first()
    )


def create_product(
    db: Session,
    company_id: int,
    data,
):

    category = (
        db.query(Category)
        .filter(
            Category.id == data.category_id,
            Category.company_id == company_id,
        )
        .first()
    )

    if not category:
        raise ValueError("Category not found")

    sku = (
        db.query(Product)
        .filter(
            Product.company_id == company_id,
            Product.sku == data.sku,
        )
        .first()
    )

    if sku:
        raise ValueError("SKU already exists")

    duplicate = (
        db.query(Product)
        .filter(
            Product.company_id == company_id,
            Product.category_id == data.category_id,
            Product.name == data.name,
        )
        .first()
    )

    if duplicate:
        raise ValueError(
            "Product already exists in this category"
        )

    if data.cost_price > data.unit_price:
        raise ValueError(
            "Cost Price cannot exceed Unit Price"
        )

    values = data.model_dump()

    print("========== PRODUCT DATA ==========")
    print(values)

    product = Product(
    company_id=company_id,
    **values,
)

    db.add(product)
    db.commit()
    db.refresh(product)

    return product


def update_product(
    db: Session,
    product: Product,
    data,
):

    values = data.model_dump(exclude_unset=True)

    if (
        "cost_price" in values
        and "unit_price" in values
    ):
        if values["cost_price"] > values["unit_price"]:
            raise ValueError(
                "Cost Price cannot exceed Unit Price"
            )

    if "sku" in values:

        duplicate = (
            db.query(Product)
            .filter(
                Product.company_id == product.company_id,
                Product.sku == values["sku"],
                Product.id != product.id,
            )
            .first()
        )

        if duplicate:
            raise ValueError("SKU already exists")

    for key, value in values.items():
        setattr(product, key, value)

    db.commit()
    db.refresh(product)

    return product


def delete_product(
    db: Session,
    product: Product,
):
    db.delete(product)
    db.commit()


def dashboard_summary(
    db: Session,
    company_id: int,
):
    total_products = (
        db.query(Product)
        .filter(Product.company_id == company_id)
        .count()
    )

    active_products = (
        db.query(Product)
        .filter(
            Product.company_id == company_id,
            Product.status == "Active",
        )
        .count()
    )

    inactive_products = (
        db.query(Product)
        .filter(
            Product.company_id == company_id,
            Product.status == "Inactive",
        )
        .count()
    )

    total_categories = (
        db.query(Category)
        .filter(Category.company_id == company_id)
        .count()
    )

    return {
        "total_products": total_products,
        "active_products": active_products,
        "inactive_products": inactive_products,
        "total_categories": total_categories,
    }