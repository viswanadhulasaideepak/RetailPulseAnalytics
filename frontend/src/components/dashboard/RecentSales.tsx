import {
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
} from "@mui/material";

const rows = [
  {
    product: "iPhone 16",
    quantity: 2,
    total: "$2400",
  },
  {
    product: "Samsung S25",
    quantity: 1,
    total: "$1200",
  },
  {
    product: "MacBook Pro",
    quantity: 3,
    total: "$9000",
  },
];

const RecentSales = () => {
  return (
    <Card
      sx={{
        bgcolor: "#1E293B",
        borderRadius: 4,
      }}
    >
      <CardContent>

        <Typography
          variant="h6"
          mb={2}
        >
          Recent Sales
        </Typography>

        <Table>

          <TableHead>

            <TableRow>

              <TableCell>Product</TableCell>

              <TableCell>Qty</TableCell>

              <TableCell>Total</TableCell>

            </TableRow>

          </TableHead>

          <TableBody>

            {rows.map((row) => (
              <TableRow key={row.product}>

                <TableCell>
                  {row.product}
                </TableCell>

                <TableCell>
                  {row.quantity}
                </TableCell>

                <TableCell>
                  {row.total}
                </TableCell>

              </TableRow>
            ))}

          </TableBody>

        </Table>

      </CardContent>
    </Card>
  );
};

export default RecentSales;