from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from app.models.enums import MovementType


class InventoryMovementBase(BaseModel):
    movement_type: MovementType
    quantity_changed: int
    reason: str
    remarks: Optional[str] = None


class InventoryMovementCreate(InventoryMovementBase):
    inventory_id: int


class InventoryMovementResponse(BaseModel):
    id: int

    inventory_id: int

    movement_type: MovementType

    quantity_changed: int
    previous_quantity: int
    updated_quantity: int

    reason: str
    remarks: Optional[str]

    performed_by: int

    created_at: datetime

    model_config = {
        "from_attributes": True
    }