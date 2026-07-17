from app.database.session import SessionLocal
from app.models.user import User

db = SessionLocal()

for u in db.query(User).all():
    print(u.email, "|", repr(u.role))

db.close()