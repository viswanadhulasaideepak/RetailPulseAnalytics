import sys

sys.path.append(r"C:\Users\LENOV O\OneDrive\Desktop\RetailPulseAnalytics\backend")

from app.database.session import SessionLocal
from app.models.product import Product

db = SessionLocal()

products = db.query(Product).all()

print(f"Total Products: {len(products)}")

for product in products:
    print(
        f"ID: {product.id}, "
        f"Company ID: {product.company_id}, "
        f"Category ID: {product.category_id}, "
        f"Name: {product.name}"
    )

db.close()