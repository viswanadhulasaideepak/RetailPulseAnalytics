import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const ActivityCard = () => {
  return (
   <Card
    sx={{
        borderRadius: 3,
        boxShadow: 2,
        transition: "0.3s",
        "&:hover": {
            transform: "translateY(-3px)",
            boxShadow: 5,
        },
    }}
>
      <CardContent>

        <Typography variant="h6"
         sx={{ mb: 2 }}>
          Recent Activity
        </Typography>

        <List>

          <ListItem>
            <ListItemText
              primary="John added new Product"
              secondary="2 minutes ago"
            />
          </ListItem>

          <ListItem>
            <ListItemText
              primary="Inventory Updated"
              secondary="15 minutes ago"
            />
          </ListItem>

          <ListItem>
            <ListItemText
              primary="Report Generated"
              secondary="1 hour ago"
            />
          </ListItem>

        </List>

      </CardContent>
    </Card>
  );
};

export default ActivityCard;