import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const menu = [
    {
      title: "Dashboard",
      icon: <DashboardRoundedIcon />,
      path: "/dashboard",
    },
    {
      title: "Company",
      icon: <BusinessRoundedIcon />,
      path: "/company",
    },
    {
      title: "Profile",
      icon: <PersonRoundedIcon />,
      path: "/profile",
    },
    {
      title: "Settings",
      icon: <SettingsRoundedIcon />,
      path: "/settings",
    },
  ];

  return (
    <Box
  sx={{
    width: 260,
    height: "100vh",
    position: "fixed",
    top: 0,
    left: 0,
    bgcolor: "#111827",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    zIndex: 1300,
  }}
>
      <Typography variant="h5" sx={{ fontWeight: 700, textAlign: "center", py: 3 }}>
        RetailPulse
      </Typography>

      <Divider />

      <Box sx={{ p: 2 }}>
        <Typography sx={{ fontWeight: 700 }}>{user?.name}</Typography>

        <Typography variant="body2" color="text.secondary">
          {user?.role}
        </Typography>
      </Box>

      <Divider />

      <List sx={{ flex: 1 }}>
        {menu.map((item) => (
          <ListItemButton
            key={item.title}
            component={NavLink}
            to={item.path}
            sx={{
              mx: 1,
              my: 0.5,
              borderRadius: 2,
              "&.active": {
                bgcolor: "#4F46E5",
              },
            }}
          >
            <ListItemIcon sx={{ color: "white" }}>
              {item.icon}
            </ListItemIcon>

            <ListItemText primary={item.title} />
          </ListItemButton>
        ))}
      </List>

      <Divider />

      <List>
        <ListItemButton
          onClick={() => {
            logout();
            navigate("/");
          }}
        >
          <ListItemIcon sx={{ color: "white" }}>
            <LogoutRoundedIcon />
          </ListItemIcon>

          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Box>
  );
};

export default Sidebar;