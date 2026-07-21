export interface SaleItem {
  id?: number;
  product_id: number;
  product_name?: string;
  category_id?: number;
  category_name?: string;
  quantity: number;
  unit_price: number;
  discount: number;
  tax: number;
  total: number;
}

export interface Sale {
  id: number;
  invoice_number: string;
  customer_name?: string;
  sale_date: string;
  sales_channel: string;
  payment_method: string;
  total_amount: number;
  created_at: string;
  created_by?: number;
  created_by_name?: string;
  items: SaleItem[];
}

export interface SaleCreate {
  customer_name: string;
  sales_channel: string;
  payment_method: string;
  items: SaleItem[];
}

export interface SaleSummary {
  total_sales: number;
  total_revenue: number;
  total_orders: number;
  average_order_value: number;
}