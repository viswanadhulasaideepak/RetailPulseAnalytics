import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

import {
  Grid,
  Paper,
  Typography,
} from "@mui/material";

import type { Inventory } from "../../types/inventory";

interface Props {
  inventory: Inventory[];
}

const COLORS = [
  "#1976d2",
  "#2e7d32",
  "#ed6c02",
  "#d32f2f",
  "#7b1fa2",
  "#0097a7",
];

const InventoryCharts = ({
  inventory,
}: Props) => {

  const categoryMap: Record<string, number> = {};
  console.log("Inventory Data", inventory);

  inventory.forEach((item) => {
    const category = item.product.category.name;

    categoryMap[category] =
      (categoryMap[category] || 0) +
      item.current_stock;
  });

  const categoryData = Object.keys(
    categoryMap
  ).map((key) => ({
    category: key,
    quantity: categoryMap[key],
  }));

const statusData = Object.entries(
  inventory.reduce(
    (acc, item) => {
      acc[item.stock_status] =
        (acc[item.stock_status] || 0) + 1;

      return acc;
    },
    {} as Record<string, number>
  )
).map(([name, value]) => ({
  name,
  value,
}));
console.log("Status Data", statusData);

  return (
    <Grid container
      sx={{spacing:3, mt:1}}>

      <Grid size={{ xs:12, md:6}}>

        <Paper sx={{ p:3 }}>

          <Typography variant="h6"
           sx={{ mb:2}}>
            Inventory By Category
          </Typography>

          <ResponsiveContainer
            width="100%" height={300}>

            <BarChart
              data={categoryData}>

              <CartesianGrid
                strokeDasharray="3 3"/>

              <XAxis dataKey="category" />

              <YAxis />

              <Tooltip />

              <Legend />

              <Bar
                dataKey="quantity" name="Stock"/>

            </BarChart>

          </ResponsiveContainer>

        </Paper>

      </Grid>

      <Grid
        size={{ xs:12, md:6}}>

        <Paper sx={{ p:3 }}>

          <Typography variant="h6"
            sx={{ mb:2}}>
            Stock Status Distribution
          </Typography>

          <ResponsiveContainer
            width="100%" height={300}>

            <PieChart>

              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label>

                {statusData.map(
                  (_, index) => (
                    <Cell
                      key={index}
                      fill={
                        COLORS[
                          index %
                            COLORS.length
                        ]
                      }
                    />
                  )
                )}

              </Pie>

              <Tooltip />

              <Legend />

            </PieChart>

          </ResponsiveContainer>

        </Paper>

      </Grid>

    </Grid>
  );
};

export default InventoryCharts;