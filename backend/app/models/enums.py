from enum import Enum


class StockStatus(str, Enum):
    IN_STOCK = "In Stock"
    LOW_STOCK = "Low Stock"
    OUT_OF_STOCK = "Out of Stock"


class MovementType(str, Enum):
    STOCK_IN = "Stock Addition"
    STOCK_OUT = "Stock Removal"
    MANUAL_ADJUSTMENT = "Manual Adjustment"
    SALE = "Sale"