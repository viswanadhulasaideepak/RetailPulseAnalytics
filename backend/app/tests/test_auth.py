import unittest
from uuid import uuid4

from app.core.security import hash_password, verify_password
from app.database.base import Base
from app.database.database import engine
from app.database.session import SessionLocal
from app.models.user import User
from app.services.auth_service import create_access_token, register_company_and_owner


class AuthServiceTests(unittest.TestCase):
    def test_password_hashing_and_verification(self):
        password = "StrongPass123!"
        hashed = hash_password(password)

        self.assertTrue(hashed.startswith("$2"))
        self.assertTrue(verify_password(password, hashed))
        self.assertFalse(verify_password("wrong-password", hashed))

    def test_access_token_includes_company_context(self):
        token = create_access_token(subject="demo@example.com", company_id=7, role="Company Admin")

        self.assertTrue(token)
        self.assertIsInstance(token, str)

    def test_registration_normalizes_email_addresses(self):
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        unique = uuid4().hex[:8]
        payload = {
            "company_name": f"Test Company {unique}",
            "industry": "Retail",
            "company_email": f"company-{unique}@Example.com",
            "company_address": "123 Test Street",
            "company_phone": "1234567890",
            "owner_name": "Owner Name",
            "owner_email": f"owner-{unique}@Example.com",
            "password": "StrongPass123!",
            "confirm_password": "StrongPass123!",
        }

        try:
            company, user = register_company_and_owner(db, payload)
            db.commit()
            self.assertEqual(user.email, payload["owner_email"].lower())
            self.assertEqual(company.email, payload["company_email"].lower())
        finally:
            db.query(User).filter(User.email == payload["owner_email"].lower()).delete()
            db.commit()
            db.close()


if __name__ == "__main__":
    unittest.main()
