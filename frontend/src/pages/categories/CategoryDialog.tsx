import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

import type {Category,CategoryFormData} from "../../types/category";

interface Props {
  open: boolean;

  onClose: () => void;

  onSave: (
    data: CategoryFormData
  ) => void;

  category?: Category | null;
}

const CategoryDialog = ({
  open,
  onClose,
  onSave,
  category,
}: Props) => {

  const [form, setForm] =
  useState<CategoryFormData>({
    name: "",
    description: "",
    status: "Active",
  });

  useEffect(() => {

    if (category) {

      setForm(category);

    } else {

      setForm({
        name: "",
        description: "",
        status: "Active",
      });

    }

  }, [category]);

  return (
    <Dialog
      open={open}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>

        {category
          ? "Edit Category"
          : "Add Category"}

      </DialogTitle>

      <DialogContent>

        <TextField
          label="Category Name"
          fullWidth
          margin="normal"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
        />

        <TextField
          label="Description"
          fullWidth
          multiline
          rows={3}
          margin="normal"
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
        />

        <TextField
          select
          label="Status"
          fullWidth
          margin="normal"
          value={form.status}
          onChange={(e) =>
            setForm({
              ...form,
              status: e.target.value as "Active" | "Inactive",
            })
          }
        >
          <MenuItem value="Active">
            Active
          </MenuItem>

          <MenuItem value="Inactive">
            Inactive
          </MenuItem>

        </TextField>

      </DialogContent>

      <DialogActions>

        <Button onClick={onClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={() => onSave(form)}
        >
          Save
        </Button>

      </DialogActions>

    </Dialog>
  );
};

export default CategoryDialog;