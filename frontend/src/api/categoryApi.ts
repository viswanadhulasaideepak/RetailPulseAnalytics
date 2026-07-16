import axios from "./axios";

export const getCategories = (search = "") =>
  axios.get("/categories", {
    params: { search },
  });

export const createCategory = (data: any) =>
  axios.post("/categories", data);

export const updateCategory = (id: number, data: any) =>
  axios.put(`/categories/${id}`, data);

export const deleteCategory = (id: number) =>
  axios.delete(`/categories/${id}`);