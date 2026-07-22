import {
  Box,
  Button,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Menu,
  Typography,
  Chip,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import { useNotifications } from "../../context/NotificationContext";

interface Props {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
}

const NotificationMenu = ({
  anchorEl,
  open,
  onClose,
}: Props) => {
  const navigate = useNavigate();

  const {
    notifications,
    markNotificationRead,
  } = useNotifications();

  const handleClick = async (
    id: number
  ) => {
    await markNotificationRead(id);
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: 380,
            maxHeight: 500,
            borderRadius: 3,
          },
        },
      }}
    >
      <Box
        sx={{
          px: 2,
          py: 1.5,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
          }}
        >
          Notifications
        </Typography>
      </Box>

      <Divider />

      <List disablePadding>

        {notifications.length === 0 && (

          <Box
            sx={{
              py: 5,
              textAlign: "center",
            }}
          >
            <Typography color="text.secondary">
              No Notifications
            </Typography>
          </Box>

        )}

        {notifications
          .slice(0, 5)
          .map((item) => (

            <ListItemButton
              key={item.id}
              onClick={() =>
                handleClick(item.id)
              }
              sx={{
                alignItems: "flex-start",
              }}
            >

              <ListItemText

                primary={
                  <Box
                    sx={{display:"flex",
                    justifyContent:"space-between"}}>

                    <Typography
                      sx={{
                        fontWeight:
                          item.is_read
                            ? 500
                            : 700,
                      }}
                    >
                      {item.title}
                    </Typography>

                    {!item.is_read && (
                      <Chip
                        label="New"
                        size="small"
                        color="error"
                      />
                    )}

                  </Box>
                }

                secondary={
                  <>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {item.message}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      {new Date(
                        item.created_at
                      ).toLocaleString()}
                    </Typography>

                  </>
                }

              />

            </ListItemButton>

          ))}

      </List>

      <Divider />

      <Box
        sx={{
          p: 1.5,
        }}
      >
        <Button
          fullWidth
          variant="contained"
          onClick={() => {
            navigate(
              "/notifications"
            );
            onClose();
          }}
        >
          View All Notifications
        </Button>
      </Box>

    </Menu>
  );
};

export default NotificationMenu;