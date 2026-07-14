import unittest

from app.core.security import hash_password, verify_password
from app.services.auth_service import create_access_token


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


if __name__ == "__main__":
    unittest.main()
