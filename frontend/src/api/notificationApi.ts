import api from "./axios";

import type { Notification } from "../types/notification";

// Get all notifications
export const getNotifications = async () => {
  const res = await api.get<Notification[]>(
    "/notifications/"
  );

  return res.data;
};

// Mark notification as read
export const markAsRead = async (
  id: number
) => {
  const res = await api.put(
    `/notifications/${id}`
  );

  return res.data;
};