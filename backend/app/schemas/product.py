from datetime import datetime

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    field_validator,
)

class ProductBase(BaseModel):

    name: str = Field(..., min_length=2, max_length=150)

    sku: str = Field(..., min_length=3, max_length=50)

    category_id: int
    brand: str | None = None
    description: str | None = None
    unit_price: float
    cost_price: float
    stock_quantity: int = 0
    unit_of_measure: str
    status: str = "Active"

    @field_validator("unit_price")
    @classmethod
    def validate_unit_price(cls, value):
        if value <= 0:
            raise ValueError("Unit price must be greater than zero")
        return value

    @field_validator("cost_price")
    @classmethod
    def validate_cost_price(cls, value):
        if value < 0:
            raise ValueError("Cost price cannot be negative")
        return value

    @field_validator("stock_quantity")
    @classmethod
    def validate_stock(cls, value):
        if value < 0:
            raise ValueError("Stock quantity cannot be negative")
        return value


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):

    name: str | None = None
    sku: str | None = None
    category_id: int | None = None
    brand: str | None = None
    description: str | None = None
    unit_price: float | None = None
    cost_price: float | None = None
    stock_quantity: int | None = None
    unit_of_measure: str | None = None
    status: str | None = None


class CategoryInfo(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str


class ProductResponse(ProductBase):

    model_config = ConfigDict(from_attributes=True)

    id: int
    company_id: int
    category: CategoryInfo
    created_at: datetime
    updated_at: datetime    