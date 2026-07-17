from app.database.session import SessionLocal
from app.models.user import User
from app.core.security import hash_password

db = SessionLocal()

COMPANY_ID = 1      

users = [
    {
        "name": "System Admin",
        "email": "superadmin@retailpulse.com",
        "role": "Super Admin",
    },
    {
        "name": "Ramesh Kumar",
        "email": "analyst@nexusretail.com",
        "role": "Analyst",
    },
    {
        "name": "Priya Reddy",
        "email": "viewer@nexusretail.com",
        "role": "Viewer",
    },
]

for u in users:

    exists = (
        db.query(User)
        .filter(User.email == u["email"])
        .first()
    )

    if exists:
        print(f"{u['role']} already exists")
        continue

    db.add(
        User(
            company_id=COMPANY_ID,
            name=u["name"],
            email=u["email"],
            password_hash=hash_password("Password@123"),
            role=u["role"],
            status="Active",
        )
    )

db.commit()

print(" Test users created successfully!")

db.close()