from sqlalchemy import (
    Column,
    Integer,
    ForeignKey,
    DateTime,
    Enum,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.base import Base
from app.models.enums import StockStatus


class Inventory(Base):
    __tablename__ = "inventory"

    __table_args__ = (
        UniqueConstraint(
            "company_id",
            "product_id",
            name="uq_company_product_inventory",
        ),
    )

    id = Column(Integer, primary_key=True, index=True)

    company_id = Column(
        Integer,
        ForeignKey("companies.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    product_id = Column(
        Integer,
        ForeignKey("products.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    current_stock = Column(Integer, nullable=False, default=0)

    reserved_stock = Column(Integer, nullable=False, default=0)

    available_stock = Column(Integer, nullable=False, default=0)

    reorder_level = Column(Integer, nullable=False, default=10)

    stock_status = Column(
        Enum(StockStatus),
        nullable=False,
        default=StockStatus.IN_STOCK,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    # Relationships

    company = relationship(
        "Company",
        back_populates="inventories",
    )

    product = relationship(
        "Product",
        back_populates="inventory",
    )

    movements = relationship(
        "InventoryMovement",
        back_populates="inventory",
        cascade="all, delete-orphan",
        order_by="InventoryMovement.created_at.desc()",
    )