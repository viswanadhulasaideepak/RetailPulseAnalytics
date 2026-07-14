from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import OperationalError

from app.api.auth import router as auth_router
from app.api.company import router as company_router
from app.api.users import router as users_router
from app.core.config import settings
from app.database.base import Base
from app.database.database import engine

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        Base.metadata.create_all(bind=engine)
        print("Database connected successfully.")
    except OperationalError as exc:
        print(f"Database unavailable during startup: {exc}")

    yield

app = FastAPI(
    title=settings.APP_NAME,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(company_router)
app.include_router(users_router)



@app.get("/")
def home():
    return {"status": "success", "message": "RetailPulse Analytics Backend Running"}