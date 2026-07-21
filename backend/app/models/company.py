from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.base import Base


class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    industry = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    address = Column(String(255), nullable=False)
    phone = Column(String(30), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    users = relationship("User",back_populates="company",cascade="all, delete-orphan")
    categories = relationship("Category",back_populates="company",cascade="all, delete-orphan")
    products = relationship("Product",back_populates="company",cascade="all, delete-orphan")
    sales = relationship("Sale",back_populates="company",cascade="all, delete-orphan")
    notifications = relationship("Notification",back_populates="company",cascade="all, delete-orphan")
    
    


