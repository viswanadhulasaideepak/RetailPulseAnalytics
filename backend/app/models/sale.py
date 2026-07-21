from sqlalchemy import (
    Column,
    Integer,
    Float,
    String,
    DateTime,
    ForeignKey,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy import UniqueConstraint, Index

from app.database.base import Base


class Sale(Base):
    __tablename__ = "sales"
    
    __table_args__ = (
    UniqueConstraint(
        "company_id",
        "invoice_number",
        name="uq_company_invoice",
    ),
)

    id = Column(Integer, primary_key=True, index=True)

    company_id = Column(Integer,ForeignKey("companies.id", ondelete="CASCADE"),
        nullable=False,index=True)

    created_by = Column(Integer,ForeignKey("users.id"),nullable=False)
    invoice_number = Column(String(30),nullable=False,index=True)
    customer_name = Column(String(150))
    sale_date = Column(DateTime(timezone=True),server_default=func.now())
    sales_channel = Column(String(30), nullable=False)
    payment_method = Column(String(30), nullable=False)
    total_amount = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True),server_default=func.now())
    updated_at = Column(DateTime(timezone=True),server_default=func.now(),onupdate=func.now())
    company = relationship("Company", back_populates="sales")
    user = relationship("User",back_populates="sales")
    items = relationship("SaleItem",back_populates="sale",cascade="all, delete-orphan",lazy="selectin")
    
class SaleItem(Base):
    __tablename__ = "sale_items"

    id = Column(Integer, primary_key=True)
    sale_id = Column(Integer,ForeignKey("sales.id", ondelete="CASCADE"),nullable=False)
    product_id = Column(Integer,ForeignKey("products.id"),nullable=False,)
    category_id = Column(Integer,ForeignKey("categories.id"),nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Float, nullable=False)
    discount = Column(Float, default=0)
    tax = Column(Float, default=0)
    total = Column(Float, nullable=False)
    sale = relationship("Sale", back_populates="items")
    product = relationship("Product",back_populates="sale_items",lazy="joined",)
    category = relationship("Category",back_populates="sale_items",lazy="joined",)   