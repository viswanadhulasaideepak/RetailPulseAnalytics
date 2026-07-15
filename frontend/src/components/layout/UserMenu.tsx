import {
  Avatar,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";

import { useState } from "react";
import type { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

const UserMenu = () => {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const [anchor, setAnchor] =
    useState<null | HTMLElement>(null);

  const openMenu = (
    e: MouseEvent<HTMLElement>
  ) => {
    setAnchor(e.currentTarget);
  };

  return (
    <>
      <Avatar
        onClick={openMenu}
        sx={{
          cursor: "pointer",
          bgcolor: "#6366F1",
        }}
      >
        {user?.name?.charAt(0).toUpperCase()}
      </Avatar>

      <Menu
        anchorEl={anchor}
        open={Boolean(anchor)}
        onClose={() => setAnchor(null)}
      >
        <MenuItem disabled>
          <Typography sx={{ fontWeight: 700 }}>{user?.name}</Typography>
        </MenuItem>

        <MenuItem
          onClick={() => navigate("/profile")}
        >
          Profile
        </MenuItem>

        <MenuItem
          onClick={() => {
            logout();
            navigate("/");
          }}
        >
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;