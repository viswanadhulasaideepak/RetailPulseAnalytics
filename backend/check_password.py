from app.database.session import SessionLocal
from app.models.user import User
from app.core.security import hash_password

db = SessionLocal()

company_id = 5      # Change if required

users = [
    {
        "name": "Company Admin",
        "email": "admin@nexusretail.com",
        "password": "Admin@123",
        "role": "Company Admin",
    },
    {
        "name": "Super Admin",
        "email": "super@nexusretail.com",
        "password": "Super@123",
        "role": "Super Admin",
    },
    {
        "name": "Analyst User",
        "email": "analyst@nexusretail.com",
        "password": "Analyst@123",
        "role": "Analyst",
    },
    {
        "name": "Viewer User",
        "email": "viewer@nexusretail.com",
        "password": "Viewer@123",
        "role": "Viewer",
    },
]

for item in users:
    exists = (
        db.query(User)
        .filter(User.email == item["email"])
        .first()
    )

    if not exists:
        user = User(
            company_id=company_id,
            name=item["name"],
            email=item["email"],
            password_hash=hash_password(item["password"]),
            role=item["role"],
            status="Active",
        )

        db.add(user)

db.commit()

print("Users inserted successfully!\n")

for u in db.query(User).filter(User.company_id == company_id).all():
    print(
        u.id,
        u.name,
        u.email,
        u.role,
    )

db.close()