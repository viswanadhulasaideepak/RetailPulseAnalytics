from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.base import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(30), nullable=False)
    status = Column(String(30), default="Active")
    last_login = Column(DateTime)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    company = relationship("Company",back_populates="users")
    refresh_tokens = relationship("RefreshToken",back_populates="user",cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog",back_populates="user")