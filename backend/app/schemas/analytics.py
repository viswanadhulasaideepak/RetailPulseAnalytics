from pydantic import BaseModel
from typing import List, Optional
from datetime import date

#-------------------- KPI RESPONSE-----------

class DashboardKPI(BaseModel):

    total_revenue: float = 0
    total_orders: int = 0
    total_products_sold: int = 0
    average_order_value: float = 0

    total_inventory_value: float = 0

    low_stock_products: int = 0
    out_of_stock_products: int = 0

    total_categories: int = 0


# -----------------------REVENUE TREND-------------------------

class RevenueTrend(BaseModel):

    date: date
    revenue: float


# ----------------------PRODUCT SALES-----------------------

class ProductSales(BaseModel):

    product_id: int
    product_name: str

    quantity: int
    revenue: float


# -------------------CATEGORY SALES-----------------------

class CategorySales(BaseModel):

    category_id: int
    category_name: str

    revenue: float


# -----------------PAYMENT METHOD----------------

class PaymentAnalytics(BaseModel):

    payment_method: str
    total_amount: float


# -------------------SALES CHANNEL-----------------------

class SalesChannelAnalytics(BaseModel):

    channel: str
    orders: int


# -------------------INVENTORY CATEGORY------------------------

class InventoryCategory(BaseModel):

    category_name: str
    stock_quantity: int
    inventory_value: float


# ---------------------STOCK STATUS----------------------

class StockStatus(BaseModel):

    status: str
    count: int


#--------------- COMPLETE DASHBOARD RESPONSE--------------------

class AnalyticsDashboardResponse(BaseModel):

    kpis: DashboardKPI
    revenue_trend: List[RevenueTrend]
    top_products: List[ProductSales]
    categories: List[CategorySales]
    payment_methods: List[PaymentAnalytics]
    sales_channels: List[SalesChannelAnalytics]
    inventory_categories: List[InventoryCategory]
    stock_status: List[StockStatus]