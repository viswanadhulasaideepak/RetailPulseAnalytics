from fastapi import FastAPI
from sqlalchemy.exc import OperationalError

from app.api.auth import router as auth_router
from app.api.company import router as company_router
from app.api.users import router as users_router
from app.core.config import settings
from app.database.base import Base
from app.database.database import engine

app = FastAPI(title=settings.APP_NAME)

app.include_router(auth_router)
app.include_router(company_router)
app.include_router(users_router)


@app.on_event("startup")
def startup_event():
    try:
        Base.metadata.create_all(bind=engine)
    except OperationalError as exc:
        print(f"Database unavailable during startup: {exc}")


@app.get("/")
def home():
    return {"status": "success", "message": "RetailPulse Analytics Backend Running"}