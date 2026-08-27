import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'created_at'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [],
      unreadCount: 0,
      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: crypto.randomUUID(),
          read: false,
          created_at: new Date().toISOString(),
        };
        set((state) => ({
          notifications: [newNotification, ...state.notifications].slice(0, 50),
          unreadCount: state.unreadCount + 1,
        }));
      },
      markAsRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n),
        unreadCount: Math.max(0, state.unreadCount - 1),
      })),
      markAllAsRead: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, read: true })),
        unreadCount: 0,
      })),
      removeNotification: (id) => set((state) => {
        const n = state.notifications.find(n => n.id === id);
        return {
          notifications: state.notifications.filter(n => n.id !== id),
          unreadCount: n && !n.read ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
        };
      }),
      clearAll: () => set({ notifications: [], unreadCount: 0 }),
    }),
    {
      name: 'notifications-storage',
      partialize: (state) => ({ notifications: state.notifications, unreadCount: state.unreadCount }),
    }
  )
);