import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface NotificationState {
  notifications: Notification[];
  addNotification: (
    notification: Omit<Notification, 'id' | 'read' | 'time'>
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const cookieStorage = {
  getItem: (name: string) => Cookies.get(name) || null,
  setItem: (name: string, value: string) => {
    Cookies.set(name, value, { expires: 365, sameSite: 'strict' });
  },
  removeItem: (name: string) => Cookies.remove(name),
};

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [
        {
          id: '1',
          title: 'Donation Successful',
          message:
            'Thank you for your donation at Hospital Josina Machel! You saved 3 lives.',
          time: '2 hours ago',
          read: false,
          type: 'success',
        },
        {
          id: '2',
          title: 'Emergency: O+ Needed',
          message:
            'Urgent need for O+ blood at Clinica Girassol. Can you help?',
          time: '5 hours ago',
          read: false,
          type: 'warning',
        },
        {
          id: '3',
          title: 'New Center Available',
          message:
            'Centro de Hemoterapia de Luanda is now accepting appointments.',
          time: 'Yesterday',
          read: true,
          type: 'info',
        },
      ],
      addNotification: (n) =>
        set((state) => ({
          notifications: [
            {
              ...n,
              id: Math.random().toString(36).substring(7),
              read: false,
              time: 'Just now',
            },
            ...state.notifications,
          ],
        })),
      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),
      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),
      clearNotifications: () => set({ notifications: [] }),
    }),
    {
      name: 'blood-hub-notifications',
      storage: createJSONStorage(() => cookieStorage),
    }
  )
);
