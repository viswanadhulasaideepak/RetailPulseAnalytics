from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    DateTime,
    ForeignKey,
)
from sqlalchemy import UniqueConstraint, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.base import Base

class Product(Base):
    __tablename__ = "products"
    
    __table_args__ = (
    UniqueConstraint(
        "company_id",
        "sku",
        name="uq_company_sku",
    ),
    UniqueConstraint(
        "company_id",
        "category_id",
        "name",
        name="uq_company_category_product",
    ),
    Index("idx_product_name", "name"),
    Index("idx_product_brand", "brand"),
)

    id = Column(Integer, primary_key=True, index=True)

    company_id = Column( Integer,ForeignKey("companies.id", ondelete="CASCADE"),
        nullable=False,index=True)

    category_id = Column(Integer,ForeignKey("categories.id", ondelete="CASCADE"),
        nullable=False)

    name = Column(String(150), nullable=False)
    sku = Column(String(50), nullable=False)
    brand = Column(String(100))
    description = Column(String(500))
    unit_price = Column(Float, nullable=False)
    cost_price = Column(Float, nullable=False)
    stock_quantity = Column(Integer, default=0)
    unit_of_measure = Column(String(30))
    status = Column(String(20), default="Active")
    created_at = Column(DateTime(timezone=True),server_default=func.now(),)
    updated_at = Column(DateTime(timezone=True),server_default=func.now(),onupdate=func.now())
    category = relationship("Category",back_populates="products",lazy="joined")
    company = relationship("Company",back_populates="products")
    sale_items = relationship("SaleItem",back_populates="product",cascade="all, delete-orphan")