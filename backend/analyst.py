from app.database.session import SessionLocal
from app.models.user import User
from app.core.security import hash_password

db = SessionLocal()

email = "analyst@nexusretail.com"

existing = (
    db.query(User)
    .filter(User.email == email)
    .first()
)

if existing:
    print("Analyst already exists!")
else:
    user = User(
        company_id=1,        
        name="Gokul Krishna",
        email=email,
        password_hash=hash_password("analyst@123"),
        role="Analyst",
        status="Active",
    )

    db.add(user)
    db.commit()

    print(" Analyst created successfully!")

db.close()