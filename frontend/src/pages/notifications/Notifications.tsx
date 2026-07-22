import { useEffect, useState } from "react";

import DashboardLayout from "../../layouts/DashboardLayout";

import {
  Card,
  CardContent,
  Typography,
  Stack,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Chip
} from "@mui/material";

import {
  getNotifications,
  markAsRead,
} from "../../api/notificationApi";

import type {
  Notification,
} from "../../types/notification";

const Notifications = () => {

  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  const [search, setSearch] =
    useState("");

  const [page, setPage] =
    useState(0);

  const [rowsPerPage, setRowsPerPage] =
    useState(10);

  const loadNotifications =
    async () => {
      try {

        const data =
          await getNotifications();

        setNotifications(data);

      } catch (err) {
        console.error(err);
      }
    };

  useEffect(() => {
    loadNotifications();
  }, []);

  const filtered =
    notifications.filter((item) =>
      item.title
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      item.message
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  const handleRead =
    async (id: number) => {

      await markAsRead(id);

      setNotifications((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                is_read: true,
              }
            : item
        )
      );
    };

  return (

    <DashboardLayout>

      <Stack sx={{ mb: 3 }}>

        <Typography
          variant="h4"
          sx={{ fontWeight: 700 }}
        >
          Notifications
        </Typography>

        <Typography
          color="text.secondary"
        >
          View all system notifications
        </Typography>

      </Stack>

      <Card
        sx={{
          borderRadius: 3,
        }}
      >

        <CardContent>

          <TextField
            fullWidth
            label="Search Notifications"
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            sx={{
              mb: 3,
            }}
          />

          <Table>

            <TableHead>

              <TableRow>

                <TableCell>
                  <strong>Title</strong>
                </TableCell>

                <TableCell>
                  <strong>Message</strong>
                </TableCell>

                <TableCell>
                  <strong>Status</strong>
                </TableCell>

                <TableCell>
                  <strong>Time</strong>
                </TableCell>

              </TableRow>

            </TableHead>

            <TableBody>

              {filtered.length === 0 ? (

                <TableRow>

                  <TableCell
                    colSpan={4}
                    align="center"
                  >

                    No Notifications Found

                  </TableCell>

                </TableRow>

              ) : (

                filtered
                  .slice(
                    page * rowsPerPage,
                    page * rowsPerPage +
                      rowsPerPage
                  )
                  .map((item) => (

                    <TableRow
                      hover
                      key={item.id}
                      onClick={() =>
                        handleRead(
                          item.id
                        )
                      }
                      sx={{
                        cursor: "pointer",
                      }}
                    >

                      <TableCell>

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

                      </TableCell>

                      <TableCell>

                        {item.message}

                      </TableCell>

                      <TableCell>

                        <Chip
                          label={
                            item.is_read
                              ? "Read"
                              : "Unread"
                          }
                          color={
                            item.is_read
                              ? "success"
                              : "error"
                          }
                          size="small"
                        />

                      </TableCell>

                      <TableCell>

                        {new Date(
                          item.created_at
                        ).toLocaleString()}

                      </TableCell>

                    </TableRow>

                  ))

              )}

            </TableBody>

          </Table>

          <TablePagination
            component="div"
            count={filtered.length}
            page={page}
            rowsPerPage={
              rowsPerPage
            }
            rowsPerPageOptions={[
              5,
              10,
              25,
              50,
            ]}
            onPageChange={(
              _,
              newPage
            ) =>
              setPage(newPage)
            }
            onRowsPerPageChange={(
              e
            ) => {

              setRowsPerPage(
                parseInt(
                  e.target.value,
                  10
                )
              );

              setPage(0);

            }}
          />

        </CardContent>

      </Card>

    </DashboardLayout>

  );
};

export default Notifications;