import { create } from "zustand";

export interface AppNotification {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  read: boolean;
}

interface NotificationsState {
  notifications: AppNotification[];
  unreadCount: number;
  add: (notification: Omit<AppNotification, "id" | "read" | "createdAt">) => void;
  markAllRead: () => void;
  clear: () => void;
}

export const useNotificationsStore = create<NotificationsState>((set) => ({
  notifications: [],
  unreadCount: 0,
  add: (notification) =>
    set((state) => ({
      notifications: [
        {
          ...notification,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          read: false,
        },
        ...state.notifications,
      ].slice(0, 50),
      unreadCount: state.unreadCount + 1,
    })),
  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),
  clear: () => set({ notifications: [], unreadCount: 0 }),
}));
