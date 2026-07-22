import { useEffect, useState } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";

import type { Inventory } from "../../types/inventory";

import {
  addStock,
  removeStock,
  adjustStock,
} from "../../api/inventoryApi";

interface Props {
  open: boolean;
  onClose: () => void;
  inventory: Inventory | null;

  mode: "add" | "remove" | "adjust";

  refresh: () => void;
}
const StockDialog = ({
  open,
  onClose,
  inventory,
  mode,
  refresh,
}: Props) => {
    const [quantity, setQuantity] = useState(0);
    const [reason, setReason] = useState("");
    const [remarks, setRemarks] = useState("");
    const [loading, setLoading] = useState(false);

    //---------Reset Form------------------
    useEffect(() => {
        if (open) {
            setQuantity(0);
            setReason("");
            setRemarks("");
        }
    }, [open]);
    //-------------------Handle Sunmit-----------------

    const handleSubmit = async () => {
        if (!inventory) return;
        try {
            setLoading(true);
            
            if (mode === "add") {
                await addStock({
                    product_id: inventory.product_id,
                    quantity,
                    reason,
                    remarks,
                });
            }
            
            if (mode === "remove") {
                await removeStock({
                    product_id: inventory.product_id,
                    quantity,
                    reason,
                    remarks,
                });
            }
            
            if (mode === "adjust") {
                await adjustStock({
                    product_id: inventory.product_id,
                    new_quantity: quantity,
                    reason,
                    remarks,
                });
            }
            refresh();
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    return (
  <Dialog
    open={open}
    onClose={onClose}
    fullWidth
    maxWidth="sm"
  >
    <DialogTitle>

      {mode === "add" && "Add Stock"}

      {mode === "remove" && "Remove Stock"}

      {mode === "adjust" && "Adjust Stock"}

    </DialogTitle>

    <DialogContent>

      <Stack sx={{spacing:3, mt:1}}>

        <TextField
          label="Product"
          value={inventory?.product.name ?? ""}
          fullWidth
          disabled
        />

        <TextField
          label={
            mode === "adjust"
              ? "New Quantity"
              : "Quantity"
          }
          type="number"
          value={quantity}
          onChange={(e) =>
            setQuantity(Number(e.target.value))
          }
          fullWidth
        />

        <TextField
          label="Reason"
          value={reason}
          onChange={(e) =>
            setReason(e.target.value)
          }
          fullWidth
          required
        />

        <TextField
          label="Remarks"
          value={remarks}
          onChange={(e) =>
            setRemarks(e.target.value)
          }
          fullWidth
          multiline
          rows={3}
        />

      </Stack>

    </DialogContent>

    <DialogActions>

      <Button
        onClick={onClose}
      >
        Cancel
      </Button>

      <Button
        variant="contained"
        onClick={handleSubmit}
        disabled={loading}
      >
        Save
      </Button>

    </DialogActions>

  </Dialog>
);
}
export default StockDialog;