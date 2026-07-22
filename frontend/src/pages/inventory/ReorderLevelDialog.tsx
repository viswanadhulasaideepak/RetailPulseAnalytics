import { useEffect, useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  TextField,
} from "@mui/material";

import type { Inventory } from "../../types/inventory";

import { updateReorderLevel } from "../../api/inventoryApi";

interface Props {
  open: boolean;
  onClose: () => void;
  inventory: Inventory | null;
  refresh: () => void;
}

const ReorderLevelDialog = ({
  open,
  onClose,
  inventory,
  refresh,
}: Props) => {
  const [level, setLevel] = useState(0);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (inventory) {
      setLevel(inventory.reorder_level);
    }
  }, [inventory]);

  const handleSave = async () => {
    if (!inventory) return;

    try {
      setLoading(true);

      await updateReorderLevel({
        product_id: inventory.product_id,
        reorder_level: level,
      });

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
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>
        Update Reorder Level
      </DialogTitle>

      <DialogContent>

        <Stack sx={{spacing : 3, mt : 2}}>

          <TextField
            label="Product"
            value={inventory?.product.name ?? ""}
            disabled
            fullWidth
          />

          <TextField
            label="Reorder Level"
            type="number"
            value={level}
            onChange={(e) =>
              setLevel(Number(e.target.value))
            }
            fullWidth
            slotProps={{
                htmlInput: {
                    min: 0,
                },
            }}/>

        </Stack>

      </DialogContent>

      <DialogActions>

        <Button onClick={onClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={loading}
        >
          Save
        </Button>

      </DialogActions>

    </Dialog>
  );
};

export default ReorderLevelDialog;