import {Paper,Table,TableHead,TableRow,TableCell,TableBody,
  TableContainer,Typography,Stack,IconButton,Chip,CircularProgress,
  TablePagination,} from "@mui/material";
  import Tooltip from "@mui/material/Tooltip";

import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

import { useState } from "react";

import type { Sale } from "../../types/sale";

interface Props {
  sales: Sale[];
  loading: boolean;
  onDelete: (id: number) => void;
  //onRefresh: () => void;
  onView: (sale: Sale) => void;
  onEdit: (sale: Sale) => void;
}

const SalesTable = ({
  sales,
  loading,
  onDelete,
  onEdit,
  onView,
}: Props) => {

  const [page, setPage] = useState(0);

  const [rowsPerPage, setRowsPerPage] =
    useState(10);
      const paginatedSales = sales.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) {
    return (
      <Stack
        sx={{alignItems : "center", py: 8}}>
        <CircularProgress />
      </Stack>
    );
  }

  return (
  <Paper elevation={0}>
    <TableContainer sx={{ maxHeight: 600}}>
        <Table>
            <TableHead
            sx={{"& .MuiTableCell-root": {
                fontWeight: 700,
                bgcolor: "grey.100",
            },
            }}>
                <TableRow>
                    <TableCell>
                        Invoice
                    </TableCell>

                    <TableCell>
                        Customer
                    </TableCell>

                    <TableCell>
                        Date
                    </TableCell>

                    <TableCell>
                        Payment
                    </TableCell>

                    <TableCell>
                        Channel
                     </TableCell>

                    <TableCell align="right">
                        Total
                    </TableCell>

                    <TableCell align="center">
                        Actions
                    </TableCell>

                </TableRow>

            </TableHead>
            
            <TableBody>
                {paginatedSales.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={7}
                        align="center" sx={{ py: 6 }}>
                            <Typography color="text.secondary" sx={{ fontWeight: 500 }}>
                                No sales transactions found.
                            </Typography>
                        </TableCell>

                    </TableRow>
                    
                ) : (
                    
                    paginatedSales.map((sale) => (
                    
                    <TableRow hover key={sale.id}
                    sx={{"&:hover": {
                        bgcolor: "action.hover",
                    },
                    }}>
                        {/* Invoice */}
                        <TableCell>
                            
                            <Typography sx={{fontWeight : 600}}>
                                {sale.invoice_number}
                            </Typography>
                        </TableCell>

                        {/* Customer */}

                        <TableCell>
                            {sale.customer_name || "-"}
                        </TableCell>

                        {/* Date */}

                        <TableCell>
                            {new Date(sale.sale_date).toLocaleDateString(
                                "en-IN",
                                {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                }
                                )}
                        </TableCell>

                        {/* Payment */}
                        <TableCell>
                            <Chip size="small" label={sale.payment_method}
                            color="primary" variant="outlined"/>
                        </TableCell>

                        {/* Sales Channel */}
                        <TableCell>
                            <Chip size="small" label={sale.sales_channel}
                            color="secondary" variant="outlined"/>
                        </TableCell>

                        {/* Total */}
                        <TableCell align="right">
                            <Typography sx={{fontWeight : 700}}>
                                ₹{sale.total_amount.toFixed(2)}
                            </Typography>
                        </TableCell>

                        {/* Actions */}

                        <TableCell align="center">

                            <Stack
                            sx={{direction : "row",
                            spacing : 1,
                            justifyContent : "center"}}>
                                
                            <Tooltip title="View Sale">
                                <IconButton color="primary" onClick={() => onView(sale)}>
                                    <VisibilityRoundedIcon />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Edit Sale">
                                <IconButton color="warning" onClick={() => onEdit(sale)}>
                                    <EditRoundedIcon />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Delete Sale">
                                <IconButton color="error" onClick={() => onDelete(sale.id)}>
                                    <DeleteRoundedIcon />
                                </IconButton>
                            </Tooltip>

                            </Stack>

                        </TableCell>

                    </TableRow>
                    ))
                    )}
            </TableBody>

        </Table>

      </TableContainer>
      <TablePagination
        component="div"
        count={sales.length}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
        onPageChange={(_, newPage) =>
          setPage(newPage)
        }
        onRowsPerPageChange={(event) => {

          setRowsPerPage(
            parseInt(event.target.value, 10)
          );

          setPage(0);

        }}/>
        </Paper>
        );
    };

export default SalesTable;

