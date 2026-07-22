import {
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import Inventory2Icon from "@mui/icons-material/Inventory2";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CancelIcon from "@mui/icons-material/Cancel";

import type { InventoryDashboard } from "../../types/inventory";

interface Props {
  dashboard: InventoryDashboard;
}

const InventorySummaryCards = ({
  dashboard,
}: Props) => {
  const cards = [
    {
      title: "Total Products",
      value: dashboard.total_products,
      icon: <Inventory2Icon color="primary" />,
    },
    {
      title: "Inventory Quantity",
      value: dashboard.total_inventory_quantity,
      icon: <WarehouseIcon color="success" />,
    },
    {
      title: "Low Stock",
      value: dashboard.low_stock_products,
      icon: <WarningAmberIcon color="warning" />,
    },
    {
      title: "Out Of Stock",
      value: dashboard.out_of_stock_products,
      icon: <CancelIcon color="error" />,
    },
  ];

  return (
    <Grid container sx={{spacing: 3 ,mb:3}}>
      {cards.map((card) => (
        <Grid
          key={card.title}
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <Card
            sx={{
              borderRadius: 3,
              height: "100%",
              boxShadow: 2,
            }}
          >
            <CardContent>
              <Stack
                sx={{direction:"row",
                justifyContent:"space-between",
                alignItems:"center"}}
              >
                <Stack spacing={1}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {card.title}
                  </Typography>

                  <Typography
                    variant="h4"
                    sx={{fontWeight : 700}}
                  >
                    {card.value}
                  </Typography>
                </Stack>

                {card.icon}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default InventorySummaryCards;