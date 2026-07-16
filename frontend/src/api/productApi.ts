import axios from "./axios";

export const getProducts = (params: any) =>
  axios.get("/products", {
    params,
  });

export const getDashboardSummary = () =>
  axios.get("/products/summary");

export const createProduct = (data: any) =>
  axios.post("/products", data);

export const updateProduct = (
  id: number,
  data: any
) =>
  axios.put(`/products/${id}`, data);

export const deleteProduct = (id: number) =>
  axios.delete(`/products/${id}`);

export const updateProductStatus = (
  id: number,
  status: string
) =>
  axios.patch(`/products/${id}/status`, {
    status,
  });