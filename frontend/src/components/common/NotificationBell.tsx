import { useState } from "react";

import {
  Badge,
  IconButton,
} from "@mui/material";

import NotificationsNoneRoundedIcon
from "@mui/icons-material/NotificationsNoneRounded";

import NotificationMenu
from "../layout/NotificationMenu";

import {
  useNotifications,
} from "../../context/NotificationContext";

const NotificationBell = () => {

  const {
    unreadCount,
  } = useNotifications();

  const [
    anchorEl,
    setAnchorEl,
  ] = useState<HTMLElement | null>(null);

  const handleOpen = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>

      <IconButton
        color="inherit"
        onClick={handleOpen}
      >

        <Badge
          badgeContent={unreadCount}
          color="error"
          max={99}
        >
          <NotificationsNoneRoundedIcon />
        </Badge>

      </IconButton>

      <NotificationMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      />

    </>
  );
};

export default NotificationBell;