from app.database.session import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash, verify_password

db = SessionLocal()

user = db.query(User).filter(
    User.email == "viewer@nexusretail.com"
).first()

print("Stored Hash:")
print(user.password_hash)

new_hash = get_password_hash("viewer@123")

print("\nNew Hash:")
print(new_hash)

print("\nVerify stored hash:")
print(verify_password("viewer@123", user.password_hash))

print("\nVerify new hash:")
print(verify_password("viewer@123", new_hash))

db.close()