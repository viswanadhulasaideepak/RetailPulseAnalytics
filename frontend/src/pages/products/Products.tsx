import { useEffect, useState } from "react";

import {Box,Button,Grid,Typography,} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import AddIcon from "@mui/icons-material/Add";

import DashboardLayout from "../../layouts/DashboardLayout";
import StatCard from "../../components/dashboard/StatCard";

import ProductFilters from "./ProductFilters";
import ProductTable from "./ProductTable";
import ProductDialog from "./ProductDialog";

import {getProducts,createProduct,updateProduct,
  deleteProduct,getDashboardSummary,} from "../../api/productApi";
import { updateProductStatus } from "../../api/productApi";
import { getCategories } from "../../api/categoryApi";

import type {Product,ProductFormData} from "../../types/product";
import type { Category } from "../../types/category";

import toast from "react-hot-toast";

import EmptyState from "../../components/common/EmptyState";
import LoadingTable from "../../components/common/LoadingTable";
import DeleteDialog from "../../components/common/DeleteDialog";

const Products = () => {

  const [products, setProducts] =useState<Product[]>([]);
  const [categories, setCategories] =useState<Category[]>([]);
  const [summary, setSummary] =
    useState({
      total_products: 0,
      active_products: 0,
      inactive_products: 0,
      total_categories: 0,
    });

  const [search, setSearch] =useState("");
  const [categoryId, setCategoryId] =useState<number | "">("");
  const [status, setStatus] =useState("");
  const [brand, setBrand] = useState("");
  const [sort, setSort] = useState("recent");
  const [openDialog, setOpenDialog] =useState(false);
  const [selectedProduct, setSelectedProduct] =useState<Product | null>(null);
  const [deleteOpen, setDeleteOpen] =useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] =useState<number | null>(null);


//--------------Load Products--------------
  const loadProducts = async () => {
  setLoading(true);
  try {
    const res = await getProducts({
      search,
      category_id:
        categoryId === "" ? undefined : categoryId,
      status: status || undefined,
      brand: brand || undefined,
      sort,
      page,
      page_size: pageSize,
    });
    setProducts(res.data);
  } catch (err) {
    console.error(err);
    toast.error("Unable to load products");
  } finally {
    setLoading(false);
  }
};

//---------------Load Categories------------------
  const loadCategories = async () => {
  try {
    const res = await getCategories();

    console.log("Categories API Response:", res.data);

    setCategories(res.data);
  } catch (err) {
    console.error(err);
    toast.error("Unable to load categories");
  }
};

//-------------Load Summary--------------  
  const loadSummary = async () => {
    try {
      const res =
        await getDashboardSummary();
      setSummary(res.data);
    } catch (err) {
      toast.error("Unable to load dashboard summary");
    }
  };

  useEffect(() => {
    loadProducts();
  }, [
    search,
    categoryId,
    status,
    brand,
    sort,
    page,
]);

  useEffect(() => {
    loadCategories();
    loadSummary();
  }, []);

  //----------Handle Save--------------
    const handleSave = async (
    data: ProductFormData
  ) => {

    try {
      if (selectedProduct) {
        await updateProduct(selectedProduct.id,data);
        
      } else {
        await createProduct(data);
      }
      toast.success(selectedProduct 
          ? "Product updated successfully"
          : "Product created successfully"
        );
      setOpenDialog(false);
      setSelectedProduct(null);
      loadProducts();
      loadSummary();
    } catch (err: any) {
      console.log(err);

      console.log(err.response);

      console.log(err.response?.data);

     alert(err.response?.data?.detail || "Unable to save product");
     }
  };

//--------------Handle Delete---------------- 
  const handleDelete = (id: number) => {
  setDeleteId(id);
  setDeleteOpen(true);
};

//----------Confirm Delete------------
  const confirmDelete = async () => {
  if (deleteId === null) return;
  try {
    await deleteProduct(deleteId);
    toast.success("Product deleted successfully");
    setDeleteOpen(false);
    setDeleteId(null);
    loadProducts();
    loadSummary();
  } catch (err) {
    console.error(err);
    toast.error("Unable to delete product");
  }
};

//--------------Toggle Status--------------
const handleToggleStatus = async (product: Product) => {
  try {
    await updateProductStatus(
      product.id,
      product.status === "Active" ? "Inactive" : "Active"
    );
    toast.success("Status updated");
    loadProducts();
    loadSummary();
  } catch (err) {
    toast.error("Unable to update status");
  }
};
    return (
    <DashboardLayout>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}>
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700 }}>
            Products
          </Typography>

          <Typography color="text.secondary">
            Manage your company products
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedProduct(null);
            setOpenDialog(true);
          }}>
          Add Product
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>

        <Grid size={{ xs: 12, md: 3 }}>
          <StatCard
            title="Total Products"
            value={summary.total_products}/>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <StatCard
            title="Active Products"
            value={summary.active_products}/>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <StatCard
            title="Inactive Products"
            value={summary.inactive_products}/>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <StatCard
            title="Categories"
            value={summary.total_categories}/>
        </Grid>

      </Grid>

      <ProductFilters
      search={search}
      setSearch={setSearch}

      categoryId={categoryId}
      setCategoryId={setCategoryId}

      status={status}
      setStatus={setStatus}

      brand={brand}
      setBrand={setBrand}

      sort={sort}
      setSort={setSort}

      categories={categories}/>

      {loading ? (

    <LoadingTable />
  ) : products.length === 0 ? (
  
    <EmptyState
        title="No Products Found"
        subtitle="Click 'Add Product' to create your first product."/>
      
      ) : (
      
      <ProductTable products={products}
        onEdit={(product) => {
            setSelectedProduct(product);
            setOpenDialog(true);
        }}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}/>
        
        )}

    <Box sx={{
        mt: 3,
        display: "flex",
        justifyContent: "center",
        }}>
          <Pagination page={page} count={10}
          color="primary" onChange={(_, value) => setPage(value)}/>
    </Box>

      <ProductDialog
    open={openDialog}
    onClose={() => {
        setOpenDialog(false);
        setSelectedProduct(null);
    }}
    onSave={handleSave}
    product={selectedProduct}
    categories={categories}
/>

      <DeleteDialog open={deleteOpen}
       onClose={() => {
        setDeleteOpen(false);
        setDeleteId(null);
      }}
      onConfirm={confirmDelete} title="Delete Product"
      message="Are you sure you want to delete this product?"/>  

    </DashboardLayout>
  );
};

export default Products;  