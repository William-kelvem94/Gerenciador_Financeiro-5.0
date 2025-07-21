import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'cyberpunk' | 'sunset' | 'ocean' | 'forest' | 'rose' | 'purple';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  devtools(
    persist(
      (set, get) => ({
        theme: 'dark',
        
        setTheme: (theme: Theme) => {
          set({ theme });
          
          // Apply theme to document
          if (typeof document !== 'undefined') {
            document.documentElement.className = `theme-${theme}`;
          }
        },
        
        toggleTheme: () => {
          const currentTheme = get().theme;
          const newTheme = currentTheme === 'light' ? 'dark' : 'light';
          get().setTheme(newTheme);
        },
      }),
      {
        name: 'will-finance-theme',
        onRehydrateStorage: () => (state) => {
          // Apply theme on page load
          if (state && typeof document !== 'undefined') {
            document.documentElement.className = `theme-${state.theme}`;
          }
        },
      }
    )
  )
);
