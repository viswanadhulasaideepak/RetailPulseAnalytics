import api from "./axios";

import type {
  Inventory,
  InventoryDashboard,
  InventoryMovement,
  StockRequest,
  AdjustStockRequest,
  ReorderLevelRequest,
} from "../types/inventory";

export const getInventory = async (
  params?: any
) => {
  const res = await api.get<Inventory[]>(
    "/inventory",
    { params }
  );

  return res.data;
};

export const getInventoryDashboard = async () => {
  const res =
    await api.get<InventoryDashboard>(
      "/inventory/dashboard"
    );

  return res.data;
};

export const addStock = async (
  data: StockRequest
) => {
  const res = await api.post(
    "/inventory/add-stock",
    data
  );

  return res.data;
};

export const removeStock = async (
  data: StockRequest
) => {
  const res = await api.post(
    "/inventory/remove-stock",
    data
  );

  return res.data;
};

export const adjustStock = async (
  data: AdjustStockRequest
) => {
  const res = await api.post(
    "/inventory/adjust-stock",
    data
  );

  return res.data;
};

export const updateReorderLevel =
async (
  data: ReorderLevelRequest
) => {
  const res = await api.put(
    "/inventory/reorder-level",
    data
  );

  return res.data;
};

export const getMovementHistory =
async (
  inventoryId: number
) => {
  const res =
    await api.get<InventoryMovement[]>(
      `/inventory/movements/${inventoryId}`
    );

  return res.data;
};