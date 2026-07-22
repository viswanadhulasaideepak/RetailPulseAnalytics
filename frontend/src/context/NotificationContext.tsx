import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { ReactNode } from "react";

import type {Notification} from "../types/notification";

import {getNotifications,markAsRead,
} from "../api/notificationApi";

interface NotificationContextType {
  notifications: Notification[];

  unreadCount: number;

  loading: boolean;

  loadNotifications: () => Promise<void>;

  markNotificationRead: (
    id: number
  ) => Promise<void>;
}

const NotificationContext =
  createContext(
    {} as NotificationContextType
  );

export const NotificationProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [
    notifications,
    setNotifications,
  ] = useState<Notification[]>([]);

  const [loading, setLoading] =
    useState(true);

  const loadNotifications =
    async () => {
      try {
        setLoading(true);

        const data =
          await getNotifications();

        setNotifications(data);
      } catch (error) {
        console.error(
          "Failed to load notifications",
          error
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    loadNotifications();
  }, []);

  const markNotificationRead =
    async (id: number) => {
      try {
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
      } catch (error) {
        console.error(
          "Failed to mark notification",
          error
        );
      }
    };

  const unreadCount =
    notifications.filter(
      (item) => !item.is_read
    ).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        loadNotifications,
        markNotificationRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications =
  () => useContext(NotificationContext);