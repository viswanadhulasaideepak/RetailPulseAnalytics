import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
} from "@mui/material";

import DashboardLayout from "../../layouts/DashboardLayout";
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
        My Profile
      </Typography>

      <Card sx={{ backgroundColor: "#adc0e0", borderRadius: 4 }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Avatar sx={{ width: 90, height: 90, fontSize: 34 }}>
              {user?.name?.charAt(0) ?? "U"}
            </Avatar>

            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {user?.name}
              </Typography>

              <Typography color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography color="text.secondary">Role</Typography>
              <Typography>{user?.role}</Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography color="text.secondary">Company</Typography>
              <Typography>{user?.company_name}</Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography color="text.secondary">Status</Typography>
              <Typography>{user?.status}</Typography>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Typography color="text.secondary">Last Login</Typography>
              <Typography>{user?.last_login}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Profile;