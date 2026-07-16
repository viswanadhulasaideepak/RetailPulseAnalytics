from app.database.session import SessionLocal
from app.models.category import Category

db = SessionLocal()

company_id = 5   # Your logged-in company

categories = [
    "Electronics",
    "Gadgets",
    "Groceries",
    "Fashion",
    "Home Appliances",
    "Furniture",
    "Books",
    "Sports",
    "Beauty",
    "Toys",
]

for name in categories:
    exists = (
        db.query(Category)
        .filter(
            Category.company_id == company_id,
            Category.name == name,
        )
        .first()
    )

    if not exists:
        db.add(
            Category(
                company_id=company_id,
                name=name,
                description=f"{name} products",
                status="Active",
            )
        )

db.commit()

print("Categories inserted successfully!")

print("\nCurrent Categories:")

for c in db.query(Category).filter(Category.company_id == company_id).all():
    print(c.id, c.name)

db.close()