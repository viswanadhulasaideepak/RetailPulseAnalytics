import { Box, Grid, Typography } from "@mui/material";

import DashboardLayout from "../../layouts/DashboardLayout";
import StatCard from "../../components/dashboard/StatCard";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Dashboard
        </Typography>
        <Typography color="text.secondary">
          Overview of your business performance
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard title="Revenue" value="$245,000" />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard title="Products" value="840" />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard title="Orders" value="1,240" />
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

export default Dashboard;