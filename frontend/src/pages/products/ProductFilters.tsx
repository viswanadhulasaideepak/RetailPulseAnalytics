import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

import type { Category } from "../../types/category";

interface Props {
  search: string;
  setSearch: (value: string) => void;

  categoryId: number | "";
  setCategoryId: (value: number | "") => void;

  status: string;
  setStatus: (value: string) => void;

  brand: string;
  setBrand: (value: string) => void;

  sort: string;
  setSort: (value: string) => void;

  categories: Category[];
}

const ProductFilters = ({
  search,
  setSearch,

  categoryId,
  setCategoryId,

  status,
  setStatus,

  brand,
  setBrand,

  sort,
  setSort,

  categories,
}: Props) => {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        mb: 3,
        flexWrap: "wrap",
      }}
    >
      <TextField
        label="Search Product / SKU / Brand"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ minWidth: 280 }}/>

       <FormControl sx={{ minWidth: 180 }}>

        <InputLabel>Sort By</InputLabel>

        <Select label="Sort By" value={sort}
        onChange={(e) => setSort(e.target.value)}>

        <MenuItem value="recent">
         Recently Added
        </MenuItem>

        <MenuItem value="name">
         Name
        </MenuItem>

        <MenuItem value="price">
          Price
        </MenuItem>
        </Select>
       </FormControl> 

      <FormControl sx={{ minWidth: 220 }}>
        <InputLabel>Category</InputLabel>

        <Select
          label="Category"
          value={categoryId === "" ? "" : String(categoryId)}
          onChange={(e) => {
            const value = e.target.value;
            setCategoryId(
                value === "" ? "" : Number(value)
            );
        }}>
            
          <MenuItem value="">
            All Categories
          </MenuItem>

          {categories.map((cat) => (
            <MenuItem
              key={cat.id}
              value={String(cat.id)}
            >
              {cat.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 180 }}>
        <InputLabel>Status</InputLabel>

        <Select label="Status" value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }>    
          <MenuItem value="">
            All
          </MenuItem>

          <MenuItem value="Active">
            Active
          </MenuItem>

          <MenuItem value="Inactive">
            Inactive
          </MenuItem>

           <TextField label="Brand"  value={brand} 
           onChange={(e) => setBrand(e.target.value)}
           sx={{ minWidth: 200 }}/>

        </Select>
      </FormControl>
    </Box>
  );
};

export default ProductFilters;