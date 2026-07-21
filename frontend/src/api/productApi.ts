import axios from "./axios";

import type { Product } from "../types/product";

//---------------------------------------------

export const getProducts = async (
  params?: any
): Promise<Product[]> => {
  const res = await axios.get("/products", {
    params,
  });
  console.log("Products API:", res.data);

  return res.data;
};

//---------------------------------------------

export const getDashboardSummary = async () => {
  const res = await axios.get("/products/summary");
  return res.data;
};

//---------------------------------------------

export const createProduct = async (data: any) => {
  const res = await axios.post("/products", data);
  return res.data;
};

//---------------------------------------------

export const updateProduct = async (
  id: number,
  data: any
) => {
  const res = await axios.put(`/products/${id}`, data);
  return res.data;
};

//---------------------------------------------

export const deleteProduct = async (
  id: number
) => {
  const res = await axios.delete(`/products/${id}`);
  return res.data;
};

//---------------------------------------------

export const updateProductStatus = async (
  id: number,
  status: string
) => {
  const res = await axios.patch(
    `/products/${id}/status`,
    { status }
  );

  return res.data;
};