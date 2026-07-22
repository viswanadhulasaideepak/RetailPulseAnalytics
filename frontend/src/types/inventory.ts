export interface Inventory {
  id: number;
  company_id: number;
  product_id: number;
  current_stock: number;
  reserved_stock: number;
  available_stock: number;
  reorder_level: number;

  stock_status:
    | "IN_STOCK"
    | "LOW_STOCK"
    | "OUT_OF_STOCK";

  updated_at: string;

  product: {
    id: number;
    name: string;
    sku: string;
    brand: string;

    category: {
      id: number;
      name: string;
    };
  };
}

export interface InventoryDashboard {
  total_products: number;
  total_inventory_quantity: number;
  low_stock_products: number;
  out_of_stock_products: number;
}

export interface StockRequest {
  product_id: number;
  quantity: number;

  reason: string;
  remarks: string;
}

export interface AdjustStockRequest {
  product_id: number;
  new_quantity: number;

  reason: string;
  remarks: string;
}

export interface ReorderLevelRequest {
  product_id: number;
  reorder_level: number;
}

export interface InventoryMovement {
  id: number;

  movement_type: string;

  quantity_changed: number;
  previous_quantity: number;
  updated_quantity: number;

  reason: string;
  remarks: string;

  performed_by: number;

  performed_by_name: string;
  created_at: string;
}