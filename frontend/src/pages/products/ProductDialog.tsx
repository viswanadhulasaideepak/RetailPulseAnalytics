import { useEffect, useState } from "react";
import type { Category } from "../../types/category";
import {Button, Dialog, DialogActions, DialogContent,
  DialogTitle,MenuItem,TextField,} from "@mui/material";

import type {Product,ProductFormData,} from "../../types/product";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: ProductFormData) => void;
  product?: Product | null;
  categories: Category[];
}

const ProductDialog = ({
  open,
  onClose,
  onSave,
  product,
  categories,
}: Props) => {
  const [form, setForm] =
  useState<ProductFormData>({
    name: "",
    sku: "",
    category_id: undefined,
    category_name: "",
    brand: "",
    description: "",
    unit_price: 0,
    cost_price: 0,
    stock_quantity: 0,
    unit_of_measure: "",
    status: "Active",
});

  useEffect(() => {
    if (product) {
      setForm({
    name: product.name,
    sku: product.sku,
    category_id: product.category_id,
    category_name: product.category?.name ?? "",
    brand: product.brand,
    description: product.description,
    unit_price: product.unit_price,
    cost_price: product.cost_price,
    stock_quantity: product.stock_quantity,
    unit_of_measure: product.unit_of_measure,
    status: product.status,
});
    } else {
      setForm({
    name: "",
    sku: "",
    category_id: undefined,
    category_name: "",
    brand: "",
    description: "",
    unit_price: 0,
    cost_price: 0,
    stock_quantity: 0,
    unit_of_measure: "",
    status: "Active",
});
    }
  }, [product]);

  const handleChange = (
    field: keyof ProductFormData,
    value: any
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  console.log("Categories:", categories);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md">
      <DialogTitle>
        {product ? "Edit Product" : "Add Product"}
      </DialogTitle>

      <DialogContent>

        <TextField
          fullWidth
          margin="normal"
          label="Product Name"
          value={form.name}
          onChange={(e) =>
            handleChange("name", e.target.value)
          }/>

        <TextField
          fullWidth
          margin="normal"
          label="SKU"
          value={form.sku}
          onChange={(e) =>
            handleChange("sku", e.target.value)
          }/>

        <TextField
    select
    fullWidth
    margin="normal"
    label="Category"
    value={form.category_id ?? ""}
    onChange={(e) => {
    const id = Number(e.target.value);
    const selected = categories.find(c => c.id === id);

    setForm(prev => ({
        ...prev,
        category_id: id,
        category_name: selected?.name ?? "",
    }));
}}
>
    <MenuItem value="">
        Select Category
    </MenuItem>

    {categories.map((category) => (
        <MenuItem
            key={category.id}
            value={category.id}
        >
            {category.name}
        </MenuItem>
    ))}
</TextField>

        <TextField
          fullWidth
          margin="normal"
          label="Brand"
          value={form.brand}
          onChange={(e) =>
            handleChange("brand", e.target.value)
          }/>

        <TextField
          fullWidth
          margin="normal"
          multiline
          rows={3}
          label="Description"
          value={form.description}
          onChange={(e) =>
            handleChange(
              "description",
              e.target.value
            )}/>
                <TextField
          fullWidth
          margin="normal"
          type="number"
          label="Unit Price"
          value={form.unit_price}
          onChange={(e) =>
            handleChange(
              "unit_price",
              Number(e.target.value)
            )}/>

        <TextField
          fullWidth
          margin="normal"
          type="number"
          label="Cost Price"
          value={form.cost_price}
          onChange={(e) =>
            handleChange(
              "cost_price",
              Number(e.target.value)
            )}/>

        <TextField
          fullWidth
          margin="normal"
          type="number"
          label="Initial Stock Quantity"
          value={form.stock_quantity}
          onChange={(e) =>
            handleChange(
              "stock_quantity",
              Number(e.target.value)
            )}/>

        <TextField
          fullWidth
          margin="normal"
          label="Unit of Measure"
          value={form.unit_of_measure}
          onChange={(e) =>
            handleChange(
              "unit_of_measure",
              e.target.value
            )}
          placeholder="Pieces, Kg, Liters, Box..."/>

        <TextField
          select
          fullWidth
          margin="normal"
          label="Status"
          value={form.status}
          onChange={(e) =>
            handleChange(
              "status",
              e.target.value as "Active" | "Inactive"
            )}>
          <MenuItem value="Active">
            Active
          </MenuItem>

          <MenuItem value="Inactive">
            Inactive
          </MenuItem>

        </TextField>

      </DialogContent>

      <DialogActions>

        <Button
          onClick={onClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={() => {

            if (!form.category_id) {
    alert("Category is required");
    return;
}

            if (!form.sku.trim()) {
              alert("SKU is required");
              return;
            }

            if (!form.category_name.trim()) {
                alert("Category is required");
                return;
            }

            if (form.unit_price <= 0) {
              alert("Unit Price must be greater than zero");
              return;
            }

            if (
              form.cost_price >
              form.unit_price
            ) {
              alert(
                "Cost Price cannot exceed Unit Price"
              );
              return;
            }

            if (
              form.stock_quantity < 0
            ) {
              alert(
                "Stock cannot be negative"
              );
              return;
            }
            onSave(form);
          }}>
          Save
        </Button>

      </DialogActions>

    </Dialog>

  );

};

export default ProductDialog;