from app.database.session import SessionLocal
from app.models.user import User
from app.core.security import hash_password

db = SessionLocal()

email = "superadmin@retailpulse.com"

existing = (
    db.query(User)
    .filter(User.email == email)
    .first()
)

if existing:
    print("Super Admin already exists!")
else:
    user = User(
        company_id=1,          
        name="System Admin",
        email=email,
        password_hash=hash_password("superadmin@123"),
        role="Super Admin",
        status="Active",
    )

    db.add(user)
    db.commit()

    print(" Super Admin created successfully!")

db.close()