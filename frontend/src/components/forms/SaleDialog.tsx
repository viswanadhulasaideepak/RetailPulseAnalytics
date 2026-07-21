import { useEffect, useMemo, useState } from "react";

import type {Sale} from "../../types/sale";

import {Dialog, DialogTitle,DialogContent,DialogActions,Button,Grid,TextField,
  MenuItem,Typography,Divider,Stack,} from "@mui/material";

import {getProducts} from "../../api/productApi";
import {createSale,updateSale } from "../../api/salesApi";

import type {Product} from "../../types/product";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editMode?: boolean;
  sale?: Sale | null;
}

const SaleDialog = ({
  open,
  onClose,
  onSuccess,
  editMode = false,
  sale,
}: Props) => {

  const [products, setProducts] =useState<Product[]>([]);
  const [customerName, setCustomerName] =useState("");
  const [productId, setProductId] = useState<number>(0);
  const [quantity, setQuantity] =useState(1);
  const [discount, setDiscount] =useState(0);
  const [tax, setTax] =useState(0);
  const [salesChannel, setSalesChannel] =useState("Retail Store");
  const [paymentMethod, setPaymentMethod] =useState("Cash");
  const [saving, setSaving] =useState(false);

  // Load Products

  useEffect(() => {
    if (!open) return;
    const loadProducts = async () => {
    const data = await getProducts();
    console.log("Products API", data);
    setProducts(data);
  };
  loadProducts();
  if (!editMode || !sale) {
    resetForm();
    return;
  }
  setCustomerName(sale.customer_name ?? "");
  setSalesChannel(sale.sales_channel);
  setPaymentMethod(sale.payment_method);

  if (sale.items.length > 0) {
    const first = sale.items[0];
    setProductId(first.product_id);
    setQuantity(first.quantity);
    setDiscount(first.discount);
    setTax(first.tax);
  }
}, [open, sale, editMode]);

 // Selected Product
const selectedProduct = useMemo(() => {
    return products.find(
        p => Number(p.id) === Number(productId)
    );
}, [products, productId]);

const unitPrice = selectedProduct?.unit_price ?? 0;
const stock = selectedProduct?.stock_quantity ?? 0;
const subtotal = unitPrice * quantity;
const total = subtotal - discount + tax;

useEffect(() => {
    console.log("Products:", products);
    console.log("Selected Product:", selectedProduct);
    console.log("Stock:", stock);
}, [products, selectedProduct, stock]);

  // Reset
  const resetForm = () => {
    setCustomerName("");
    setProductId(0);
    setQuantity(1);
    setDiscount(0);
    setTax(0);
    setSaving(false);
    setSalesChannel("Retail Store");
    setPaymentMethod("Cash");
  };

  useEffect(() => {
  console.log(products);
}, [products]);

  // Save
  const handleSave = async () => {

    if (!productId) {
    alert("Select a product"); 
    return;
  }
  
  if (quantity <= 0) {
    alert("Quantity must be greater than zero");
    return;
  }

  if (quantity > stock) {
    alert("Insufficient stock");
    return;
  }

  if (discount > subtotal) {
    alert("Discount exceeds subtotal");
    return;
  }

  if (tax < 0) {
    alert("Invalid tax");
    return;
  }

  try {
    setSaving(true);
    if (editMode && sale) {
      await updateSale(
        sale.id,
        {
          customer_name: customerName,
          sales_channel: salesChannel,
          payment_method: paymentMethod,
          
          items: [
            {
              product_id: Number(productId),
              quantity,
              discount,
              tax,
              unit_price: unitPrice,
              total,
            },
          ],
        }
      );
    } else {
      await createSale({
        customer_name: customerName,
        sales_channel: salesChannel,
        payment_method: paymentMethod,
        
        items: [
          {
            product_id: Number(productId),
            quantity,
            discount,
            tax,
            unit_price: unitPrice,
            total,
          },
        ],
      });
    }
    resetForm();
    onSuccess();
  } finally {
    setSaving(false);
  }
};

  return (

    <Dialog open={open} onClose={onClose}
      fullWidth maxWidth="md" scroll="paper">

      <DialogTitle
      sx={{
        fontWeight: 700,
        }}>
          {editMode ? "Edit Sale" : "Create New Sale"}
      </DialogTitle>
      

      <DialogContent dividers>

        <Grid container sx={{spacing : 3,mt : 0.5}}>

          {/* Customer Name */}
          <Grid size={{ xs: 12, md: 6 }}>

            <TextField fullWidth label="Customer Name"
              value={customerName} onChange={(e) =>
                setCustomerName(e.target.value)}/>

          </Grid>

          {/* Product */}
          <Grid size={{ xs: 12, md: 6 }}>

            <TextField select fullWidth disabled={editMode}
              label="Product" value={productId}
              onChange={(e)=>{
                const id = Number(e.target.value);
                console.log(id);
                setProductId(id);
                }}>

              <MenuItem value={0}>
              Select Product
              </MenuItem>

              {products.map((product) => (

                <MenuItem key={product.id} value={product.id}>
                  {product.name}
                </MenuItem>

              ))}

            </TextField>

          </Grid>

          {/* Category */}
          <Grid size={{ xs: 12, md: 6 }}>

            <TextField label="Category" 
            value={selectedProduct?.category?.name ?? ""}
            slotProps={{
              input: {
                readOnly: true,
              },
              }}/>

          </Grid>

          {/* Available Stock */}
          <Grid size={{ xs: 12, md: 6 }}>

            <TextField fullWidth label="Available Stock" value={stock}
              slotProps={{
                input:{
                  readOnly:true,
                },
              }}/>

          </Grid>

        </Grid>

        <Divider  sx={{ my: 3 }} />
        <Typography variant = "h6"
          sx={{fontWeight : 600,mb : 2}}>
          Pricing
        </Typography>

        <Grid container spacing={3}>

          {/* Quantity */}
          <Grid size={{ xs: 12, md: 3 }}>

            <TextField fullWidth type="number"
              label="Quantity" value={quantity}
              onChange={(e) =>
                setQuantity(Number(e.target.value))
              }/>

          </Grid>

          {/* Unit Price */}

          <Grid size={{ xs: 12, md: 3 }}>

            <TextField fullWidth label="Unit Price" value={unitPrice}
              slotProps={{
                input:{
                  readOnly:true,
                },
                }}/>

          </Grid>

          {/* Discount */}
          <Grid size={{ xs: 12, md: 3 }}>

            <TextField fullWidth type="number"
              label="Discount" value={discount}
              onChange={(e) =>
                setDiscount(Number(e.target.value))
              }/>

          </Grid>

          {/* Tax */}
          <Grid size={{ xs: 12, md: 3 }}>

            <TextField fullWidth type="number"
              label="Tax" value={tax}
              onChange={(e) =>
                setTax(Number(e.target.value))
              }/>

          </Grid>

        </Grid>

        <Divider sx={{ my: 3 }} />
        <Stack
          sx={{direction : "row",
          justifyContent : "space-between",
          alignItems : "center"}}>

          <Typography variant="h6">
            Total Amount
          </Typography>

          <Typography variant = "h4"
            sx={{ fontWeight : 700,color : "primary"}}>
            ₹{total.toFixed(2)}
          </Typography>

        </Stack>
        <Divider sx={{ my: 3 }} />

        <Typography variant = "h6"
          sx={{ fontWeight : 600,mb : 2}}>
          Sales Information
        </Typography>

        <Grid container spacing={3}>

          {/* Sales Channel */}
          <Grid size={{ xs: 12, md: 6 }}>

            <TextField select fullWidth
              label="Sales Channel" value={salesChannel}
              onChange={(e) =>
                setSalesChannel(e.target.value)
              }>

              <MenuItem value="Retail Store">
                Retail Store
              </MenuItem>

              <MenuItem value="Online Store">
                Online Store
              </MenuItem>

              <MenuItem value="Marketplace">
                Marketplace
              </MenuItem>

            </TextField>

          </Grid>

          {/* Payment */}
          <Grid size={{ xs: 12, md: 6 }}>

            <TextField select fullWidth
              label="Payment Method" value={paymentMethod}
              onChange={(e) =>
                setPaymentMethod(e.target.value)
              }>

              <MenuItem value="Cash">
                Cash
              </MenuItem>

              <MenuItem value="Card">
                Card
              </MenuItem>

              <MenuItem value="UPI">
                UPI
              </MenuItem>

              <MenuItem value="Bank Transfer">
                Bank Transfer
              </MenuItem>

            </TextField>

          </Grid>

        </Grid>
        <Divider sx={{ my: 3 }} />

        {productId === 0 && (

          <Typography color="error" variant="body2">
            Product selection is required.
          </Typography>

        )}

        {quantity <= 0 && (

          <Typography color="error" variant="body2">
            Quantity must be greater than zero.
          </Typography>

        )}

        {quantity > stock && stock > 0 && (

          <Typography color="error" variant="body2">
            Quantity exceeds available stock.
          </Typography>

        )}

        {discount > subtotal && (

          <Typography color="error" variant="body2">
            Discount cannot exceed subtotal.
          </Typography>

        )}

        {tax < 0 && (

          <Typography color="error" variant="body2">
            Tax cannot be negative.
          </Typography>

        )}
        </DialogContent>

      <DialogActions
        sx={{ px: 3, py: 2}}>

        <Button onClick={() => {
            resetForm();
            onClose();
          }}>
          Cancel
        </Button>

        <Button variant="contained"
          disabled={
            saving ||
            productId === 0 ||
            quantity <= 0 ||
            (selectedProduct && quantity > selectedProduct.stock_quantity) ||
            discount > subtotal ||
            tax < 0
          }
          onClick={handleSave}>
          {saving ? "Saving..." : editMode ? "Update Sale" : "Create Sale"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SaleDialog;