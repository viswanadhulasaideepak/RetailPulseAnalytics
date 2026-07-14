import sys
sys.path.append(r'C:\Users\LENOV O\OneDrive\Desktop\RetailPulseAnalytics\backend')

from app.database.session import SessionLocal
from app.models.user import User

db = SessionLocal()
users = [u.email for u in db.query(User).all()]
print(users)
db.close()