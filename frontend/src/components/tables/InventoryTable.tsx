import { useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import {
  Chip,
  CircularProgress,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import type { Inventory } from "../../types/inventory";

import StockDialog from "../../pages/inventory/StockDialog";
import MovementHistoryDialog from "../../pages/inventory/MovementHistoryDialog";
import ReorderLevelDialog from "../../pages/inventory/ReorderLevelDialog";

interface Props {
  inventory: Inventory[];
  loading: boolean;
  refresh: () => void;
}

const InventoryTable = ({
  inventory,
  loading,
  refresh,
}: Props) => {

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedInventory, setSelectedInventory] = useState<Inventory | null>(null);
    const [stockDialogOpen, setStockDialogOpen] = useState(false);
    const [movementDialogOpen, setMovementDialogOpen] = useState(false);
    const [reorderDialogOpen, setReorderDialogOpen] = useState(false);
    const [mode, setMode] = useState<"add" | "remove" | "adjust">("add");

    //------------Open Menu-------------------
    const openMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
    row: Inventory
) => {
    setAnchorEl(event.currentTarget);
    setSelectedInventory(row);
};
const closeMenu = () => {
    setAnchorEl(null);
};
if (loading) {
    return (
        <Paper sx={{p:5,textAlign:"center"}}>
            <CircularProgress />
        </Paper>
    );
}
return (
<TableContainer component={Paper}
sx={{borderRadius:3}}>
    <Table>
        <TableHead>
            <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>SKU</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Brand</TableCell>
                <TableCell align="center">Current</TableCell>
                <TableCell align="center">Reserved</TableCell>
                <TableCell align="center">Available</TableCell>
                <TableCell align="center">Reorder</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell>Updated</TableCell>
                <TableCell align="center">Actions</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {inventory.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={11} align="center">
                        No inventory found.
                    </TableCell>
                    </TableRow>
                    ) : (
                        inventory.map((row) => (
                        <TableRow hover key={row.id}>
                            <TableCell>
                        <Typography sx={{fontWeight : 600}}>
                            {row.product.name}
                        </Typography>
                    </TableCell>
                    <TableCell>{row.product.sku}</TableCell>
                    <TableCell>{row.product.category.name}</TableCell>
                    <TableCell>{row.product.brand}</TableCell>
                    <TableCell align="center">{row.current_stock}</TableCell>
                    <TableCell align="center">{row.reserved_stock}</TableCell>
                    <TableCell align="center">{row.available_stock}</TableCell>
                    <TableCell align="center">{row.reorder_level}</TableCell>
                    <TableCell align="center">
                        <Chip variant="filled" size="small"
                        label={
                            row.stock_status === "IN_STOCK"
                            ? "In Stock"
                            : row.stock_status === "LOW_STOCK"
                            ? "Low Stock"
                            : "Out of Stock"}
                            color={row.stock_status === "IN_STOCK" 
                                ? "success"
                                : row.stock_status === "LOW_STOCK"
                                ? "warning"
                                : "error"
                                }/>
                    </TableCell>
                    <TableCell>
                        {new Date(row.updated_at).toLocaleString()}
                    </TableCell>
                    <TableCell align="center">
                        <Tooltip title="Inventory Actions">
                            <IconButton onClick={(e)=>openMenu(e,row)}>
                                <MoreVertIcon/>
                            </IconButton>
                        </Tooltip>
                    </TableCell>
                </TableRow>
            ))
        )}
        </TableBody>
    </Table>
    <Menu anchorEl={anchorEl}
    open={Boolean(anchorEl)}
    onClose={closeMenu}>
        
        <MenuItem 
        onClick={()=>{
            setMode("add");
            setStockDialogOpen(true);
            closeMenu();
            }}>
                Add Stock
        </MenuItem>
        <MenuItem disabled={selectedInventory?.available_stock === 0}
        onClick={()=>{
            setMode("remove");
            setStockDialogOpen(true);
            closeMenu();
            }}>
                Remove Stock
        </MenuItem>

        <MenuItem disabled={!selectedInventory}
        onClick={()=>{
            setMode("adjust");
            setStockDialogOpen(true);
            closeMenu();
            }}>
                Adjust Stock
        </MenuItem>
        <MenuItem onClick={()=>{
            setMovementDialogOpen(true);
            closeMenu();
            }}>
                Movement History
        </MenuItem>
        <MenuItem onClick={()=>{
            setReorderDialogOpen(true);
            closeMenu();
            }}>
                Update Reorder Level
            </MenuItem>
    </Menu> 

    <StockDialog open={stockDialogOpen}
    onClose={() => setStockDialogOpen(false)}
    inventory={selectedInventory}
    mode={mode}
    refresh={refresh}/>
    
    <MovementHistoryDialog open={movementDialogOpen}
    onClose={() => setMovementDialogOpen(false)}
    inventory={selectedInventory}/>

    <ReorderLevelDialog open={reorderDialogOpen}
    onClose={() => setReorderDialogOpen(false)}
    inventory={selectedInventory}
    refresh={refresh}/>

</TableContainer>
)
};

export default InventoryTable;