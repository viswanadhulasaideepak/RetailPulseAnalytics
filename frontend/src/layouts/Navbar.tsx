import {
  AppBar,
  Avatar,
  IconButton,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
} from "@mui/material";
import NotificationBell from "../components/common/NotificationBell";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const [anchorEl, setAnchorEl] =
    useState<null | HTMLElement>(null);

  const handleOpen = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <AppBar
      elevation={0}
      position="fixed"
      sx={{
        background: "#111827",
        borderBottom: "1px solid #1F2937",
        width: "calc(100% - 260px)",
        ml: "260px",
        zIndex: 1200,
      }}
    >
      <Toolbar>

        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            fontWeight: 700,
          }}
        >
          RetailPulse Analytics
        </Typography>

        <NotificationBell />

        <IconButton
          color="inherit"
          onClick={handleOpen}
        >
          <Avatar
            sx={{
              bgcolor: "#7C3AED",
              width: 38,
              height: 38,
            }}
          >
            <AccountCircleRoundedIcon />
          </Avatar>
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem disabled>
            {user?.name}
          </MenuItem>

          <MenuItem disabled>
            {user?.role}
          </MenuItem>

          <MenuItem
            onClick={() => {
              navigate("/profile");
            }}
          >
            Profile
          </MenuItem>

          <MenuItem
            onClick={handleLogout}
          >
            Logout
          </MenuItem>

        </Menu>

      </Toolbar>
    </AppBar>
  );
};

export default Navbar;