import {
  Card,
  CardContent,
  Grid,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

interface Props {

  categories: any[];

  search: string;
  setSearch: (value: string) => void;

  category: string;
  setCategory: (value: string) => void;

  categoryId?: number;
  setCategoryId: (value:number|undefined)=>void;

  channel: string;
  setChannel: (value: string) => void;

  payment: string;
  setPayment: (value: string) => void;

  sortBy: string;
  setSortBy: (value: string) => void;

  startDate: string;
  setStartDate: (value: string) => void;

  endDate: string;
  setEndDate: (value: string) => void;
}

const SalesFilters = ({
  categories,
  search,
  setSearch,
  category,
  setCategory,
  setCategoryId,
  channel,
  setChannel,
  payment,
  setPayment,
  sortBy,
  setSortBy,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}: Props) => {
  return (
    <Card sx={{ mb: 3, borderRadius: 3 }}>
      <CardContent>

        <Typography variant="h6"
          sx={{fontWeight: 600, mb: 3}}>
          Search & Filters
        </Typography>

        <Grid container spacing={2}>

          {/* Search */}

          <Grid size={{ xs: 12, md: 3 }}>
            <TextField fullWidth
              placeholder="Search Invoice / Customer" value={search}
              onChange={(e) => setSearch(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRoundedIcon />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>

          <Grid 
          size={{ xs: 12, md: 2 }}>
            <TextField fullWidth type="date"
             label="Start Date" value={startDate}
             onChange={(e) =>
              setStartDate(e.target.value)
            }
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}/>
          </Grid>
          
          <Grid size={{ xs: 12, md: 2 }}>
            
            <TextField fullWidth type="date"
             label="End Date" value={endDate}
              onChange={(e) =>
                 setEndDate(e.target.value)
                }
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}/>
            </Grid>

          {/* Category */}

          <Grid size={{ xs: 12, md: 2 }}>

            <TextField select fullWidth
            label="Category" value={category}
            onChange={(e) => {
              const selected = categories.find(
                (c) => c.name === e.target.value
              );
              setCategory(e.target.value);
              setCategoryId(selected?.id);
              }}>

              <MenuItem value="">
              All Categories
              </MenuItem>

              {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.name}>
                {cat.name}
              </MenuItem>
            ))}
            </TextField>
          </Grid>

          {/* Channel */}

          <Grid size={{ xs: 12, md: 2 }}>
            <TextField select fullWidth
              label="Sales Channel" value={channel}
              onChange={(e) => setChannel(e.target.value)}>
              <MenuItem value="">
                All
              </MenuItem>

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

          <Grid size={{ xs: 12, md: 2 }}>
            <TextField
              select
              fullWidth
              label="Payment"
              value={payment}
              onChange={(e) => setPayment(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>

              <MenuItem value="Cash">Cash</MenuItem>

              <MenuItem value="Card">Card</MenuItem>

              <MenuItem value="UPI">UPI</MenuItem>

              <MenuItem value="Bank Transfer">
                Bank Transfer
              </MenuItem>
            </TextField>
          </Grid>

          {/* Sort */}

          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              select
              fullWidth
              label="Sort By"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="date">
                Date
              </MenuItem>

              <MenuItem value="invoice">
                Invoice Number
              </MenuItem>

              <MenuItem value="amount">
                Total Amount
              </MenuItem>
            </TextField>
          </Grid>

        </Grid>

      </CardContent>
    </Card>
  );
};

export default SalesFilters;