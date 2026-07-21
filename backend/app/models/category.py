from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy import UniqueConstraint
from app.database.base import Base


class Category(Base):
    __tablename__ = "categories"
    
    __table_args__ = (
    UniqueConstraint(
        "company_id",
        "name",
        name="uq_company_category",
    ),
)

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer,ForeignKey("companies.id", ondelete="CASCADE"),
        nullable=False,index=True,)

    name = Column(String(120), nullable=False)
    description = Column(String(500))
    status = Column(String(20), default="Active")
    created_at = Column(DateTime(timezone=True),server_default=func.now())
    updated_at = Column(DateTime(timezone=True),server_default=func.now(),onupdate=func.now())
    company = relationship("Company",back_populates="categories")
    products = relationship("Product",back_populates="category",cascade="all, delete-orphan",lazy="joined")
    sale_items = relationship("SaleItem",back_populates="category")