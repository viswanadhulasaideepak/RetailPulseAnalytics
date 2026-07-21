from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field


# Sale Item
class SaleItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(gt=0)
    discount: float = Field(default=0, ge=0)
    tax: float = Field(default=0, ge=0)


class SaleItemResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    product_id: int
    category_id: int

    quantity: int

    unit_price: float
    discount: float
    tax: float
    total: float

    product_name: Optional[str] = None
    category_name: Optional[str] = None


# Create Sale

class SaleCreate(BaseModel):
    customer_name: Optional[str] = None
    sales_channel: str
    payment_method: str

    items: List[SaleItemCreate] = Field(min_length=1)


# Update Sale
class SaleUpdate(BaseModel):
    customer_name: Optional[str] = None
    sales_channel: Optional[str] = None
    payment_method: Optional[str] = None
    
    items: List[SaleItemCreate]


# Response
class SaleResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    company_id: int

    invoice_number: str
    customer_name: Optional[str]

    sale_date: datetime

    sales_channel: str
    payment_method: str

    total_amount: float

    created_by: int
    
    created_at: datetime
    updated_at: datetime

    created_by_name: Optional[str] = None

    items: List[SaleItemResponse] = []
    
# SaleSummary    
class SalesSummary(BaseModel):
    total_sales: float
    total_revenue: float

    total_orders: int

    average_order_value: float    
    
# Search and Filter    
class SaleFilter(BaseModel):
    invoice_number: Optional[str] = None
    customer_name: Optional[str] = None
    product_name: Optional[str] = None
    category_id: Optional[int] = None
    sales_channel: Optional[str] = None
    payment_method: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None    
    sort_by: Optional[str] = "date"