from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey,
    Enum,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.base import Base
from app.models.enums import MovementType


class InventoryMovement(Base):
    __tablename__ = "inventory_movements"

    id = Column(Integer, primary_key=True, index=True)

    inventory_id = Column(
        Integer,
        ForeignKey("inventory.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    movement_type = Column(
        Enum(MovementType),
        nullable=False,
    )

    quantity_changed = Column(
        Integer,
        nullable=False,
    )

    previous_quantity = Column(
        Integer,
        nullable=False,
    )

    updated_quantity = Column(
        Integer,
        nullable=False,
    )

    reason = Column(
        String(255),
        nullable=False,
    )

    remarks = Column(
        String(500),
        nullable=True,
    )

    performed_by = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    # Relationships

    inventory = relationship(
        "Inventory",
        back_populates="movements",
    )

    user = relationship(
        "User",
        back_populates="inventory_movements",
    )