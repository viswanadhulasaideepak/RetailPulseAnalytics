import {Chip,IconButton,Paper,Table,TableBody,
  TableCell,TableHead,TableRow,} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Switch from "@mui/material/Switch";
import type { Product } from "../../types/product";

interface Props {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (product: Product) => void;
}

const ProductTable = ({
  products,
  onEdit,
  onDelete,
  onToggleStatus,}: Props) => {
    
  return (
    <Paper sx={{overflowX: "auto",}}>
        <Table sx={{minWidth: 900,}}> 

        <TableHead>

          <TableRow>

            <TableCell>Name</TableCell>
            <TableCell>SKU</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Brand</TableCell>
            <TableCell align="right"> Price</TableCell>
            <TableCell align="right">Stock</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="center">Actions</TableCell>

          </TableRow>

        </TableHead>

        <TableBody>

          {products.map((product) => (

            <TableRow key={product.id} hover>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.sku}</TableCell>
              <TableCell>{product.category?.name}</TableCell>
              <TableCell>{product.brand || "-"}</TableCell>
              <TableCell align="right">₹ {product.unit_price.toFixed(2)}</TableCell>
              <TableCell align="right">{product.stock_quantity}</TableCell>
              <TableCell>
                <Switch checked={product.status === "Active"}
                onChange={() => onToggleStatus(product)}/>
                
                <Chip size="small" label={product.status}
                color={product.status === "Active" ? "success" : "default"}/>
              </TableCell>

              <TableCell align="center">

                <IconButton
                  onClick={() =>
                    onEdit(product)
                  }>
                  <EditIcon />
                </IconButton>

                <IconButton color="error"
                  onClick={() =>
                    onDelete(product.id)
                  }>
                  <DeleteIcon />
                </IconButton>

              </TableCell>

            </TableRow>

          ))}

        </TableBody>

      </Table>

    </Paper>
  );
};

export default ProductTable;