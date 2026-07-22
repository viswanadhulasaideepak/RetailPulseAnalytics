from app.database.session import SessionLocal
from app.models.inventory import Inventory
from app.models.enums import StockStatus

db = SessionLocal()

inventories = db.query(Inventory).all()

for inv in inventories:
    inv.available_stock = inv.current_stock - inv.reserved_stock

    if inv.available_stock == 0:
        inv.stock_status = StockStatus.OUT_OF_STOCK
    elif inv.available_stock <= inv.reorder_level:
        inv.stock_status = StockStatus.LOW_STOCK
    else:
        inv.stock_status = StockStatus.IN_STOCK

db.commit()

print("Inventory status updated successfully!")

db.close()