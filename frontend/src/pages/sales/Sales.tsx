import DashboardLayout from "../../layouts/DashboardLayout";

import {
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  Stack,
} from "@mui/material";

import PointOfSaleRoundedIcon from "@mui/icons-material/PointOfSaleRounded";
import AddShoppingCartRoundedIcon from "@mui/icons-material/AddShoppingCart";

const Sales = () => {
  return (
    <DashboardLayout>
      <Stack direction="row"
        sx={{
         justifyContent: "space-between",
         alignItems: "center",
         mb: 4,
         }}>
        <div>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700 }}
          >
            Sales
          </Typography>

          <Typography color="text.secondary">
            Manage customer sales and transactions
          </Typography>
        </div>

        <Button
          variant="contained"
          startIcon={<AddShoppingCartRoundedIcon />}
        >
          New Sale
        </Button>
      </Stack>

      <Grid container spacing={3}>

        <Grid size={{ xs: 12, md: 3 }}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <PointOfSaleRoundedIcon
                color="primary"
                sx={{ fontSize: 40 }}
              />

              <Typography
                variant="h4"
                sx={{fontWeight:700}}
              >
                ₹0
              </Typography>

              <Typography color="text.secondary">
                Today's Sales
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography
                variant="h4"
                sx={{fontWeight:700}}
              >
                0
              </Typography>

              <Typography color="text.secondary">
                Orders
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography
                variant="h4"
                sx={{fontWeight:700}}
              >
                ₹0
              </Typography>

              <Typography color="text.secondary">
                Revenue
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography
                variant="h4"
                sx={{fontWeight:700}}
              >
                0
              </Typography>

              <Typography color="text.secondary">
                Customers
              </Typography>
            </CardContent>
          </Card>
        </Grid>

      </Grid>

      <Card
        sx={{
          mt: 4,
          borderRadius: 3,
        }}
      >
        <CardContent>

          <Typography
            variant="h6"
            sx={{fontWeight:600,  mb:2}}
            
          >
            Recent Sales
          </Typography>

          <Typography color="text.secondary">
            Sales records will appear here once the backend
            is connected.
          </Typography>

        </CardContent>
      </Card>

    </DashboardLayout>
  );
};

export default Sales;