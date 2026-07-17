import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import { Badge, IconButton } from "@mui/material";

const NotificationMenu = () => {
  return (
    <IconButton color="inherit">
      <Badge
        badgeContent={3}
        color="error">
        <NotificationsRoundedIcon />
      </Badge>
    </IconButton>
  );
};

export default NotificationMenu;