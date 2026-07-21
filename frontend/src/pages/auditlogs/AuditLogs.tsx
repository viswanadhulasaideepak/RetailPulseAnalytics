import { useEffect, useState } from "react";

import DashboardLayout from "../../layouts/DashboardLayout";

import { getAuditLogs } from "../../api/auditApi";
import type { AuditLog } from "../../types/audit";

import {Card,CardContent,Typography,TextField,Table,TableHead,TableRow,TableCell,
  TableBody,Stack,Chip,Box,TablePagination,} from "@mui/material";

const AuditLogs = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const loadLogs = async () => {
    try {
      const res = await getAuditLogs(search);
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [search]);

  const handleChangePage = (
  _: unknown,
  newPage: number
) => {
  setPage(newPage);
};

const handleChangeRowsPerPage = (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  setRowsPerPage(
    parseInt(event.target.value, 10)
  );

  setPage(0);
};

  return (
    <DashboardLayout>
      <Stack sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{fontWeight:700}}>
          Audit Logs
        </Typography>

        <Typography color="text.secondary">
          View company activities and security events
        </Typography>
      </Stack>

      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <TextField
            label="Search logs"
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ mb: 3 }}
          />

          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>User</strong></TableCell>
                <TableCell><strong>Action</strong></TableCell>
                <TableCell><strong>IP Address</strong></TableCell>
                <TableCell><strong>Browser</strong></TableCell>
                <TableCell><strong>Time</strong></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No Audit Logs Found
                  </TableCell>
                </TableRow>
              ) : (
                logs.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                ).map((log) => (
                  <TableRow key={log.id} hover>
                    <TableCell>
                      <Box>
                        <Typography sx={{fontWeight:600}}>
                          {log.user_name || "-"}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                          {log.user_email || "-"}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={log.action}
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>

                    <TableCell>
                      {log.ip_address || "-"}
                    </TableCell>

                    <TableCell>
                      {log.browser || "-"}
                    </TableCell>

                    <TableCell>
                      {new Date(log.created_at).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <TablePagination
           component="div"
           count={logs.length}
           page={page}
           onPageChange={handleChangePage}
           rowsPerPage={rowsPerPage}
           onRowsPerPageChange={handleChangeRowsPerPage}
           rowsPerPageOptions={[5, 10, 25, 50]}/>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default AuditLogs;