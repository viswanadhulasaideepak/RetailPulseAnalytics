from dotenv import load_dotenv
import os
from pathlib import Path

load_dotenv()


class Settings:
    APP_NAME = os.getenv("APP_NAME", "RetailPulse Analytics")
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key")
    ALGORITHM = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))
    REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", 7))
    DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./retailpulse.db",
)
    BCRYPT_ROUNDS = int(os.getenv("BCRYPT_ROUNDS", 12))


settings = Settings()