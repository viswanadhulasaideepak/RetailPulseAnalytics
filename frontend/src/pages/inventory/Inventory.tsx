import { useEffect, useState } from "react";

import DashboardLayout from "../../layouts/DashboardLayout";

import InventoryHeader from "./InventoryHeader";
import InventoryFilters from "./InventoryFilters";
import InventorySummaryCards from "./InventorySummaryCards";
import InventoryContent from "./InventoryContent";

import {
  getInventory,
  getInventoryDashboard,
} from "../../api/inventoryApi";

import type {
  Inventory as InventoryType,
  InventoryDashboard,
} from "../../types/inventory";

const Inventory = () => {
  const [inventory, setInventory] = useState<InventoryType[]>([]);
  const [dashboard, setDashboard] =useState<InventoryDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<number | "">("");
  const [brand, setBrand] = useState("");
  const [stockStatus, setStockStatus] = useState("");

  const loadInventory = async () => {
    try {
      setLoading(true);

      const [inventoryData, dashboardData] =
        await Promise.all([
          getInventory({
            search,
            category_id: category || undefined,
            brand,
            stock_status: stockStatus || undefined,
          }),
          getInventoryDashboard(),
        ]);

      setInventory(inventoryData);
      setDashboard(dashboardData);
    } catch (error) {
      console.error("Failed to load inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, [search, category, brand, stockStatus]);

  return (
    <DashboardLayout>
      <InventoryHeader refresh={loadInventory} />

      {dashboard && (
        <InventorySummaryCards dashboard={dashboard} />
      )}

      <InventoryFilters
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        brand={brand}
        setBrand={setBrand}
        stockStatus={stockStatus}
        setStockStatus={setStockStatus}
      />

      <InventoryContent
        inventory={inventory}
        loading={loading}
        refresh={loadInventory}
      />
    </DashboardLayout>
  );
};

export default Inventory;