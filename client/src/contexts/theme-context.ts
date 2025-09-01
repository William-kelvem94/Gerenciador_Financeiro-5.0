// React Context para temas do sistema
import { createContext, useContext } from 'react';

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
  isDark: boolean;
  toggleTheme: () => void;
  colors: Record<string, string>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

export { ThemeContext };
