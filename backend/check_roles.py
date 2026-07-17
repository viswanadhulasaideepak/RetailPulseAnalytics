from app.database.session import SessionLocal
from app.models.user import User
from app.core.security import hash_password

db = SessionLocal()

roles = [
    ("Super Admin", "super@test.com"),
    ("Analyst", "analyst@test.com"),
    ("Viewer", "viewer@test.com"),
]

for role, email in roles:

    exists = db.query(User).filter(User.email == email).first()

    if not exists:

        db.add(
            User(
                company_id=5,
                name=role,
                email=email,
                password_hash=hash_password("Password123"),
                role=role,
                status="Active",
            )
        )

db.commit()
db.close()

print("Users Created")