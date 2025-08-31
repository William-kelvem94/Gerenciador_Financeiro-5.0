import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type Theme = 'dark' | 'light' | 'cyberpunk';

export interface UIState {
  theme: Theme;
  sidebarCollapsed: boolean;
  isLoading: boolean;
  notifications: Notification[];
  modal: {
    isOpen: boolean;
    type: string | null;
    data: any;
  };

  // Actions
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setLoading: (loading: boolean) => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  openModal: (type: string, data?: any) => void;
  closeModal: () => void;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  duration?: number;
  timestamp: number;
}

export const useUIStore = create<UIState>()(
  devtools(
    (set, get) => ({
      theme: 'cyberpunk',
      sidebarCollapsed: false,
      isLoading: false,
      notifications: [],
      modal: {
        isOpen: false,
        type: null,
        data: null,
      },

      setTheme: theme => {
        set({ theme });

        // Apply theme to document
        document.documentElement.setAttribute('data-theme', theme);

        if (theme === 'dark' || theme === 'cyberpunk') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },

      toggleSidebar: () => {
        set(state => ({ sidebarCollapsed: !state.sidebarCollapsed }));
      },

      setSidebarCollapsed: collapsed => {
        set({ sidebarCollapsed: collapsed });
      },

      setLoading: loading => {
        set({ isLoading: loading });
      },

      addNotification: notification => {
        const id = Date.now().toString();
        const newNotification: Notification = {
          ...notification,
          id,
          timestamp: Date.now(),
        };

        set(state => ({
          notifications: [...state.notifications, newNotification],
        }));

        // Auto-remove notification after duration
        if (notification.duration !== 0) {
          setTimeout(() => {
            get().removeNotification(id);
          }, notification.duration || 5000);
        }
      },

      removeNotification: id => {
        set(state => ({
          notifications: state.notifications.filter(n => n.id !== id),
        }));
      },

      openModal: (type, data = null) => {
        set({
          modal: {
            isOpen: true,
            type,
            data,
          },
        });
      },

      closeModal: () => {
        set({
          modal: {
            isOpen: false,
            type: null,
            data: null,
          },
        });
      },
    }),
    { name: 'ui-store' }
  )
);
