import { useEffect, useState } from "react";

import DashboardLayout from "../../layouts/DashboardLayout";

import {getSales, getSummary, deleteSale,filterSales} from "../../api/salesApi";

import type {Sale,SaleSummary,} from "../../types/sale";

import SalesHeader from "./SalesHeader";
import SalesSummaryCards from "./SalesSummaryCards";
import SalesFilters from "./SalesFilters";
import SalesContent from "./SalesContent";

import SaleDialog from "../../components/forms/SaleDialog";
import SaleDetailsDialog from "../../components/forms/SaleDetailsDialog";

import { getCategories } from "../../api/categoryApi";

interface Category {
    id: number;
    name: string;
}

const Sales = () => {

  const [sales, setSales] = useState<Sale[]>([]);

  const [summary, setSummary] =
    useState<SaleSummary>({
      total_sales: 0,
      total_revenue: 0,
      total_orders: 0,
      average_order_value: 0,
    });

  const [loading, setLoading] =useState(true);
  const [open, setOpen] =useState(false);
  const [selectedSale, setSelectedSale] =useState<Sale | null>(null);
  const [detailsOpen, setDetailsOpen] =useState(false);
  const [editMode, setEditMode] =useState(false);
  const [search, setSearch] =useState("");
  const [category, setCategory] =useState("");
  const [channel, setChannel] =useState("");
  const [payment, setPayment] =useState("");
  const [sortBy, setSortBy] = useState("date");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<number | undefined>();

  const loadData = async () => {
    setLoading(true);
    try {
      const [salesData,summaryData, categoryData] = await Promise.all([
        getSales(),
        getSummary(),
        getCategories()
      ]);
      setSales(salesData);
      setSummary(summaryData);
      setCategories(categoryData.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

 const handleDelete = async (id: number) => {
  if (!window.confirm("Delete this sale?")) return;
  try {
    await deleteSale(id);
    loadData();
  } catch (error) {
    console.error(error);
  }
};

useEffect(() => {

    const loadFiltered = async () => {

    setLoading(true);

    try {

        const data = await filterSales({
            category_id: categoryId,
            sales_channel: channel || undefined,
            payment_method: payment || undefined,
            start_date: startDate || undefined,
            end_date: endDate || undefined,
            sort_by: sortBy,
        });

        const keyword = search.toLowerCase();

        const result = data.filter((sale) =>
            sale.invoice_number
                .toLowerCase()
                .includes(keyword) ||

            (sale.customer_name ?? "")
                .toLowerCase()
                .includes(keyword)
        );
        setSales(result);
    } finally {
        setLoading(false);
    }
};
    loadFiltered();
}, [
    categoryId,
    channel,
    payment,
    startDate,
    endDate,
    sortBy,
    search,
]);

  return (

    <DashboardLayout>

      <SalesHeader onCreate={() => {
        setEditMode(false);
        setDetailsOpen(false);
        setSelectedSale(null);
        setOpen(true);
        }}/>

      <SalesSummaryCards summary={summary}/>

     <SalesFilters 
     categories={categories}
     categoryId={categoryId}
     setCategoryId={setCategoryId}
    search={search}
    setSearch={setSearch}
    category={category}
    setCategory={setCategory}
    channel={channel}
    setChannel={setChannel}
    payment={payment}
    setPayment={setPayment}
    sortBy={sortBy}
    setSortBy={setSortBy}
    startDate={startDate}
    setStartDate={setStartDate}
    endDate={endDate}
    setEndDate={setEndDate}
/>

     <SalesContent loading={loading}
     sales={sales} onDelete={handleDelete}
      onView={(sale) => {
      setSelectedSale(sale);
      setDetailsOpen(true);
    }}
    onEdit={(sale) => {
      setSelectedSale(sale);
      setDetailsOpen(false);
      setEditMode(true);
      setOpen(true);
      }}/>

      <SaleDialog open={open} sale={selectedSale}
      editMode={editMode}onClose={() => {
        setOpen(false);
        setSelectedSale(null);
      }}
      onSuccess={() => {
        setOpen(false);
        setEditMode(false);
        setSelectedSale(null);
        loadData();
        }}/>

      <SaleDetailsDialog open={detailsOpen}
      sale={selectedSale} onClose={() => {
        setDetailsOpen(false);
        setSelectedSale(null);
        }}/>  

        
    </DashboardLayout>

  );

};

export default Sales;