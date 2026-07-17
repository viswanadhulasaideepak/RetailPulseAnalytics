from app.database.session import SessionLocal
from app.models.user import User
from app.core.security import hash_password

db = SessionLocal()

email = "viewer@nexusretail.com"

existing = (
    db.query(User)
    .filter(User.email == email)
    .first()
)

if existing:
    print("Viewer already exists!")
else:
    user = User(
        company_id=1,
        name="Priya Reddy",
        email=email,
        password_hash=hash_password("viewer@123"),
        role="Viewer",
        status="Active",
    )

    db.add(user)
    db.commit()

    print(" Viewer created successfully!")

db.close()