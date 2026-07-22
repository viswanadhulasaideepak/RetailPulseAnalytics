from app.crud import analytics
from app.crud import analytics

#---------------Get Dashboard Data--------------

def get_dashboard_data(db, company_id):

    revenue = analytics.get_total_revenue(db, company_id)
    orders = analytics.get_total_orders(db, company_id)
    sold = analytics.get_total_products_sold(db, company_id)
    inventory_value = analytics.get_inventory_value(db, company_id)

    categories = analytics.get_total_categories(db, company_id)

    low_stock = analytics.get_low_stock_products(db, company_id)

    out_stock = analytics.get_out_of_stock_products(db, company_id)

    average = revenue / orders if orders else 0

    return {
        "kpis": {
            "total_revenue": revenue,
            "total_orders": orders,
            "total_products_sold": sold,
            "average_order_value": round(average, 2),
            "total_inventory_value": inventory_value,
            "low_stock_products": low_stock,
            "out_of_stock_products": out_stock,
            "total_categories": categories,
        },
        "revenue_trend":
        analytics.get_revenue_trend(
            db,
            company_id,
        ),

    "sales_trend":
        analytics.get_sales_trend(
            db,
            company_id,
        ),

    "top_products":
        analytics.get_top_products(
            db,
            company_id,
        ),

    "categories":
        analytics.get_top_categories(
            db,
            company_id,
        ),

    "payment_methods":
        analytics.get_payment_methods(
            db,
            company_id,
        ),

    "sales_channels":
        analytics.get_sales_channels(
            db,
            company_id,
        ),

    "inventory_distribution":
        analytics.get_inventory_distribution(
            db,
            company_id,
        ),

    "stock_status":
        analytics.get_stock_status_summary(
            db,
            company_id,
        ),

    "low_stock_products":
        analytics.get_low_stock_products_list(
            db,
            company_id,
        ),

    "out_of_stock_products":
        analytics.get_out_of_stock_products_list(
            db,
            company_id,
        ),

    "inventory_value":
        analytics.get_inventory_value_by_category(
            db,
            company_id,
        ),

}

#------------------Revenue Trend------------------

def revenue_trend(
    db,
    company_id,
):
    return analytics.get_revenue_trend(
        db,
        company_id,
    )
    
#------------------Sales Trend-------------------

def sales_trend(
    db,
    company_id,
):
    return analytics.get_sales_trend(
        db,
        company_id,
    )
    
#----------------------Top Products--------------------

def top_products(
    db,
    company_id,
):
    return analytics.get_top_products(
        db,
        company_id,
    )
    
#----------------------Top Categories---------------------

def top_categories(
    db,
    company_id,
):
    return analytics.get_top_categories(
        db,
        company_id,
    )
    
#-------------------Payment Methods----------------------

def payment_methods(
    db,
    company_id,
):
    return analytics.get_payment_methods(
        db,
        company_id,
    )
    
#--------------------Sales Channels--------------------

def sales_channels(
    db,
    company_id,
):
    return analytics.get_sales_channels(
        db,
        company_id,
    )                    