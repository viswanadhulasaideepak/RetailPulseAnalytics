export interface Product {
  id: number;
  company_id: number;

  name: string;
  sku: string;

  category_id: number;

  brand: string;
  description: string;

  unit_price: number;
  cost_price: number;

  stock_quantity: number;

  unit_of_measure: string;

  status: "Active" | "Inactive";

  created_at: string;
  updated_at: string;

  category?: {
    id: number;
    name: string;
  };
}

export interface ProductFormData {
    name: string;
    sku: string;

    category_id?: number;
    category_name: string;

    brand: string;
    description: string;
    unit_price: number;
    cost_price: number;
    stock_quantity: number;
    unit_of_measure: string;
    status: "Active" | "Inactive";
}