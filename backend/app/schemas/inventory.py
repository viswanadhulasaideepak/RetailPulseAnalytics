from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from app.models.enums import StockStatus


class InventoryBase(BaseModel):
    current_stock: int = 0
    reserved_stock: int = 0
    reorder_level: int = 10


class InventoryCreate(InventoryBase):
    product_id: int


class InventoryUpdate(BaseModel):
    reserved_stock: Optional[int] = None
    reorder_level: Optional[int] = None


class InventoryResponse(BaseModel):
    id: int
    company_id: int
    product_id: int

    current_stock: int
    reserved_stock: int
    available_stock: int

    reorder_level: int
    stock_status: StockStatus

    created_at: datetime
    updated_at: datetime

    product: InventoryProductResponse

    model_config = {
        "from_attributes": True
    }


class InventoryDashboard(BaseModel):
    total_products: int
    total_inventory_quantity: int
    low_stock_products: int
    out_of_stock_products: int
    
class AddStockRequest(BaseModel):
    product_id: int
    quantity: int
    reason: str
    remarks: str | None = None    
    
class RemoveStockRequest(BaseModel):
    product_id: int
    quantity: int
    reason: str
    remarks: str | None = None    
    
class AdjustStockRequest(BaseModel):
    product_id: int
    new_quantity: int
    reason: str
    remarks: str | None = None    
    
class ReorderLevelRequest(BaseModel):
    product_id: int
    reorder_level: int    

class InventoryCategoryResponse(BaseModel):
    id: int
    name: str

    model_config = {
        "from_attributes": True
    }


class InventoryProductResponse(BaseModel):
    id: int
    name: str
    sku: str
    brand: str | None = None

    category: InventoryCategoryResponse

    model_config = {
        "from_attributes": True
    }    