from app.database.session import SessionLocal
from app.models.user import User
from app.core.security import verify_password

db = SessionLocal()

user = db.query(User).filter(
    User.email == "viewer@nexusretail.com"
).first()

print("Email:", user.email)
print("Verify viewer@123:", verify_password("viewer@123", user.password_hash))
print("Verify Viewer@123:", verify_password("Viewer@123", user.password_hash))
print("Verify viewer123:", verify_password("viewer123", user.password_hash))
print("Verify password:", verify_password("password", user.password_hash))

db.close()