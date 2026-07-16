export interface Category {
  id: number;
  company_id: number;
  name: string;
  description: string;
  status: "Active" | "Inactive";
  product_count?: number;
  created_at: string;
  updated_at: string;
}

export interface CategoryFormData {
  name: string;
  description: string;
  status: "Active" | "Inactive";
}