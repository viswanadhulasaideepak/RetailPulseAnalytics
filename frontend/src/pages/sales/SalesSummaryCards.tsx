import {
  Card,
  CardContent,
  Grid,
  Typography,
  Stack
} from "@mui/material";

import PointOfSaleRoundedIcon from "@mui/icons-material/PointOfSaleRounded";
import ReceiptRoundedIcon from "@mui/icons-material/ReceiptRounded";
import CurrencyRupeeRoundedIcon from "@mui/icons-material/CurrencyRupeeRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";

import type { SaleSummary } from "../../types/sale";

interface Props {
  summary: SaleSummary;
}

const SalesSummaryCards = ({ summary }: Props) => {
  const cards = [
    {
      title: "Total Sales",
     value: summary.total_sales,
      icon: <PointOfSaleRoundedIcon color="primary" sx={{ fontSize: 38 }} />,
    },
    {
      title: "Total Orders",
      value: summary.total_orders,
      icon: <ReceiptRoundedIcon color="success" sx={{ fontSize: 38 }} />,
    },
    {
      title: "Total Revenue",
      value: `₹${summary.total_revenue.toFixed(2)}`,
      icon: (
        <CurrencyRupeeRoundedIcon color="warning" sx={{ fontSize: 38 }}/>
      ),
    },
    {
      title: "Average Order Value",
      value: `₹${summary.average_order_value.toFixed(2)}`,
      icon: (
        <TrendingUpRoundedIcon color="secondary" sx={{ fontSize: 38 }}/>
      ),
    },
  ];

  return (
    <Grid container sx={{spacing : 3, mb : 4}}>
      {cards.map((card) => (
        <Grid key={card.title}
          size={{ xs: 12, sm: 6, md: 3 }}>
          <Card
          sx={{
            borderRadius: 3,
            height: "100%",
            transition: "0.25s",
            "&:hover": {
              boxShadow: 6,
              transform: "translateY(-4px)",
            },
            }}>
            <CardContent>

              <Stack spacing={1}>
                {card.icon}
                
                <Typography variant="h5"
                sx={{fontWeight : 700}}>
                  {card.value}
                </Typography>

                <Typography color="text.secondary">
                  {card.title}
                </Typography>
                
                </Stack>

            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default SalesSummaryCards;