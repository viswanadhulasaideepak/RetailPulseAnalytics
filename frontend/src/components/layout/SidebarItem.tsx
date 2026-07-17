import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";

interface SidebarItemProps {
  title: string;
  icon: ReactNode;
  path: string;
}

const SidebarItem = ({
  title,
  icon,
  path,
}: SidebarItemProps) => {
  return (
    <ListItemButton
      component={NavLink}
      to={path}
      sx={{
        mx: 2,
        my: 0.5,
        borderRadius: 3,
        transition:"all .25s ease",
        color: "#CBD5E1",

        "&.active": {
          background:
            "linear-gradient(90deg,#6366F1,#8B5CF6)",
          color: "#fff",
        },

        "&:hover": {
          background: "#1E293B",
        },
      }}>
      <ListItemIcon
        sx={{
          color: "inherit",
          minWidth: 40,
        }}>
        {icon}
      </ListItemIcon>

      <ListItemText
        primary={title}
        sx={{
          "& .MuiListItemText-primary": {
            fontSize: 15,
            fontWeight: 500,
          },
        }}/>
    </ListItemButton>
  );
};

export default SidebarItem;