import { useEffect, useState } from "react";

import {
  Grid,
  MenuItem,
  Paper,
  TextField,
} from "@mui/material";

import { getCategories } from "../../api/categoryApi";

interface Category {
  id: number;
  name: string;
}

interface Props {
  search: string;
  setSearch: (value: string) => void;

  category: number | "";
  setCategory: (value: number | "") => void;

  brand: string;
  setBrand: (value: string) => void;

  stockStatus: string;
  setStockStatus: (value: string) => void;
}

const InventoryFilters = ({
  search,
  setSearch,
  category,
  setCategory,
  brand,
  setBrand,
  stockStatus,
  setStockStatus,
}: Props) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await getCategories();

      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Paper
      sx={{
        p: 2,
        mb: 3,
        borderRadius: 3,
      }}
    >
      <Grid container spacing={2}>
        <Grid
          size={{
            xs: 12,
            md: 3,
          }}
        >
          <TextField
            fullWidth
            label="Search Product / SKU"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            md: 3,
          }}
        >
          <TextField
            select
            fullWidth
            label="Category"
            value={category}
            onChange={(e) =>
              setCategory(
                e.target.value === ""
                  ? ""
                  : Number(e.target.value)
              )
            }
          >
            <MenuItem value="">
              All Categories
            </MenuItem>

            {categories.map((cat) => (
              <MenuItem
                key={cat.id}
                value={cat.id}
              >
                {cat.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid
          size={{
            xs: 12,
            md: 3,
          }}
        >
          <TextField
            fullWidth
            label="Brand"
            value={brand}
            onChange={(e) =>
              setBrand(e.target.value)
            }
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            md: 3,
          }}
        >
          <TextField
            select
            fullWidth
            label="Stock Status"
            value={stockStatus}
            onChange={(e) =>
              setStockStatus(e.target.value)
            }
          >
            <MenuItem value="">
              All Status
            </MenuItem>

            <MenuItem value="IN_STOCK">
              In Stock
            </MenuItem>

            <MenuItem value="LOW_STOCK">
              Low Stock
            </MenuItem>

            <MenuItem value="OUT_OF_STOCK">
              Out Of Stock
            </MenuItem>
          </TextField>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default InventoryFilters;