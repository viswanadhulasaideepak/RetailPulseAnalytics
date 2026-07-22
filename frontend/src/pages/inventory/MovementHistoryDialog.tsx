import { useEffect, useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Typography,
} from "@mui/material";

import type {
  Inventory,
  InventoryMovement,
} from "../../types/inventory";

import { getMovementHistory } from "../../api/inventoryApi";

interface Props {
  open: boolean;
  onClose: () => void;
  inventory: Inventory | null;
}

const MovementHistoryDialog = ({
  open,
  onClose,
  inventory,
}: Props) => {
  const [loading, setLoading] = useState(false);

  const [movements, setMovements] = useState<
    InventoryMovement[]
  >([]);

  useEffect(() => {
    if (open && inventory) {
      loadMovements();
    }
  }, [open, inventory]);

  const loadMovements = async () => {
    if (!inventory) return;

    try {
      setLoading(true);

      const data =
        await getMovementHistory(
          inventory.id
        );

      setMovements(data);
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
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>
        Movement History
      </DialogTitle>

      <DialogContent>

        {loading ? (
          <CircularProgress />
        ) : movements.length === 0 ? (
          <Typography>
            No movement history found.
          </Typography>
        ) : (
          <Table>

            <TableHead>

              <TableRow>

                <TableCell>
                  Type
                </TableCell>

                <TableCell>
                  Previous
                </TableCell>

                <TableCell>
                  Updated
                </TableCell>

                <TableCell>
                  Changed
                </TableCell>

                <TableCell>
                  Reason
                </TableCell>

                <TableCell>
                  Remarks
                </TableCell>

                <TableCell>
                  User
                </TableCell>

                <TableCell>
                  Date
                </TableCell>

              </TableRow>

            </TableHead>

            <TableBody>

              {movements.map((row) => (

                <TableRow key={row.id}>

                  <TableCell>
                    {row.movement_type}
                  </TableCell>

                  <TableCell>
                    {row.previous_quantity}
                  </TableCell>

                  <TableCell>
                    {row.updated_quantity}
                  </TableCell>

                  <TableCell>
                    {row.quantity_changed}
                  </TableCell>

                  <TableCell>
                    {row.reason}
                  </TableCell>

                  <TableCell>
                    {row.remarks}
                  </TableCell>

                  <TableCell>
                    {row.performed_by_name}
                  </TableCell>

                  <TableCell>
                    {new Date(
                      row.created_at
                    ).toLocaleString()}
                  </TableCell>

                </TableRow>

              ))}

            </TableBody>

          </Table>
        )}

      </DialogContent>
    </Dialog>
  );
};

export default MovementHistoryDialog;