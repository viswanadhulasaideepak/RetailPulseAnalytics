import {Dialog,DialogTitle,DialogContent,DialogActions,Button,Grid,Typography,
  Divider,Stack,Chip,Paper,} from "@mui/material";

import type { Sale } from "../../types/sale";

interface Props {
  open: boolean;
  sale: Sale | null;
  onClose: () => void;
}

const SaleDetailsDialog = ({
  open,
  sale,
  onClose,
}: Props) => {
    if (!sale) {
  return null;
}
    return (

    <Dialog open={open} onClose={onClose}
      maxWidth="md" fullWidth scroll="paper">

      <DialogTitle sx={{fontWeight: 700}}>
        Sale Details
      </DialogTitle>

      <DialogContent dividers>

        <Paper variant="outlined"
          sx={{ p: 3, mb: 3, borderRadius: 2 }}>

          <Typography variant="h6" sx={{fontWeight : 700}} gutterBottom>
            Invoice Information
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={3}>

            <Grid size={{ xs: 12, md: 6 }}>

              <Typography color="text.secondary">
                Invoice Number
              </Typography>

              <Typography sx={{fontWeight : 600}}>
                {sale.invoice_number}
              </Typography>

            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>

              <Typography color="text.secondary">
                Sale Date
              </Typography>

              <Typography sx={{fontWeight : 600}}>
                {new Date(sale.sale_date).toLocaleString(
                  "en-IN",
                  {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }
                  )}
              </Typography>

            </Grid>

          </Grid>

        </Paper>

        <Paper variant="outlined"
          sx={{ p: 3, mb: 3, borderRadius: 2}}>

          <Typography variant="h6" sx={{fontWeight : 700}} gutterBottom>
            Customer Information
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={3}>

            <Grid size={{ xs: 12, md: 6 }}>

              <Typography color="text.secondary">
                Customer Name
              </Typography>

              <Typography sx={{fontWeight : 600}}>
                {sale.customer_name || "Walk-in Customer"}
              </Typography>

            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>

              <Typography color="text.secondary">
                Invoice Total
              </Typography>

              <Typography sx={{fontWeight : 700}} color="primary.main">
                ₹{sale.total_amount.toFixed(2)}
              </Typography>

            </Grid>

          </Grid>

        </Paper>

          <Paper variant="outlined"
          sx={{ p: 3, mb: 3, borderRadius: 2,}}>

          <Typography variant="h6"
           sx={{fontWeight : 700}} gutterBottom>
            Sales Information
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={3}>

            <Grid size={{ xs: 12, md: 6 }}>

              <Typography color="text.secondary">
                Sales Channel
              </Typography>

              <Chip label={sale.sales_channel}
                color="primary" variant="outlined"/>

            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>

              <Typography color="text.secondary">
                Payment Method
              </Typography>

              <Chip label={sale.payment_method}
                color="secondary" variant="outlined"/>

            </Grid>

          </Grid>

        </Paper>

        <Paper variant="outlined"
          sx={{ p: 3, borderRadius: 2,}}>

          <Typography variant="h6"
            sx={{fontWeight : 700}} gutterBottom>
            Product Details
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Stack spacing={2}>

            {sale.items?.map((item) => (

              <Paper key={item.id} variant="outlined"
                sx={{ p: 2, borderRadius: 2 }}>

                <Grid container spacing={2}>

                  <Grid size={{ xs: 12, md: 3 }}>

                    <Typography color="text.secondary">
                      Product
                    </Typography>

                    <Typography sx={{fontWeight : 600}}>
                      {item.product_name ?? "-"}
                    </Typography>

                  </Grid>

                  <Grid size={{ xs: 6, md: 2 }}>
                    <Typography color="text.secondary">
                      Category
                    </Typography>

                    <Typography>
                      {item.category_name ?? "-"}
                    </Typography>
                  </Grid>

                  <Grid size={{ xs: 6, md: 1 }}>

                    <Typography color="text.secondary">
                      Quantity
                    </Typography>

                    <Typography>
                      {item.quantity}
                    </Typography>

                  </Grid>

                  <Grid size={{ xs: 6, md: 2 }}>

                    <Typography color="text.secondary">
                      Unit Price
                    </Typography>

                    <Typography>
                      ₹{item.unit_price.toFixed(2)}
                    </Typography>

                  </Grid>

                  <Grid size={{ xs: 6, md: 1 }}>

                    <Typography color="text.secondary">
                      Discount
                    </Typography>

                    <Typography>
                      ₹{item.discount.toFixed(2)}
                    </Typography>

                  </Grid>

                  <Grid size={{ xs: 6, md: 1 }}>

                    <Typography color="text.secondary">
                      Tax
                    </Typography>

                    <Typography>
                      ₹{item.tax.toFixed(2)}
                    </Typography>

                  </Grid>

                  <Grid size={{ xs: 6, md: 2 }}>
                    
                    <Typography color="text.secondary">
                      Total
                    </Typography>
                    
                    <Typography sx={{ fontWeight: 700 }}>
                      ₹{item.total.toFixed(2)}
                    </Typography>
                  </Grid>

                </Grid>

              </Paper>

            ))}

          </Stack>

        </Paper>

        <Paper
          variant="outlined"
          sx={{ mt: 3, p: 3, borderRadius: 2}}>

          <Typography variant="h6" sx={{fontWeight : 600}} gutterBottom>
            Pricing Breakdown
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Stack spacing={2}>

            {sale.items?.map((item) => (

              <Stack key={item.id}
                sx={{direction :"row",
                justifyContent :"space-between"}}>

                <Typography>
                  {item.product_name}
                </Typography>

                <Typography>
                  ₹{item.total.toFixed(2)}
                </Typography>

              </Stack>

            ))}

            <Divider />

            <Stack
              sx={{direction :"row",
                justifyContent :"space-between"}}>

              <Typography sx={{fontWeight : 700}}>
                Grand Total
              </Typography>

              <Typography color="primary.main"
                sx={{fontWeight : 700}}>
                ₹{sale.total_amount.toFixed(2)}
              </Typography>

            </Stack>

          </Stack>

        </Paper>

        <Paper variant="outlined"
          sx={{ mt: 3, p: 3, borderRadius: 2}}>

          <Typography variant="h6" sx={{fontWeight : 700}} gutterBottom>
            Audit Information
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Grid container spacing={3}>

            <Grid size={{ xs: 12, md: 6 }}>

              <Typography color="text.secondary">
                Created By
              </Typography>

              <Typography sx={{fontWeight : 600}}>
                {sale.created_by_name ?? "-"}
              </Typography>

            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>

              <Typography color="text.secondary">
                Created At
              </Typography>

              <Typography sx={{fontWeight : 600}}>
                {new Date(sale.created_at).toLocaleString (
                  "en-IN",
                  {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }
                  )}
              </Typography>

            </Grid>

          </Grid>

        </Paper>

              </DialogContent>

      <DialogActions
      sx={{ px: 3, py: 2, justifyContent: "space-between",}}>
        <Button variant="outlined" onClick={() => window.print()}>
          Print
        </Button>

        <Button variant="contained" onClick={onClose}>
          Close
        </Button>
      </DialogActions>

    </Dialog>

  );

};

export default SaleDetailsDialog;