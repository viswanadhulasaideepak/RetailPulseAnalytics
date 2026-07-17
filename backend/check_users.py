from app.database.session import SessionLocal
from app.models.user import User
from app.models.company import Company

db = SessionLocal()

users = (
    db.query(User)
    .join(Company)
    .order_by(User.company_id, User.role)
    .all()
)

print("\n========== USERS ==========\n")

if not users:
    print("No users found.")
else:
    for user in users:
        print(f"""
ID          : {user.id}
Name        : {user.name}
Email       : {user.email}
Role        : {user.role}
Company ID  : {user.company_id}
Company     : {user.company.name}
Status      : {user.status}
Last Login  : {user.last_login}
----------------------------------------
""")

db.close()