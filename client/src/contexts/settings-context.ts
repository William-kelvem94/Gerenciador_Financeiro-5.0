// React Context para configurações do sistema
import { createContext, useContext } from 'react';

interface SettingsContextType {
  settings: Record<string, any>;
  updateSetting: (key: string, value: any) => void;
  resetSettings: () => void;
  loading: boolean;
  error: string | null;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettingsContext = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettingsContext must be used within a SettingsProvider');
  }
  return context;
};

export { SettingsContext };
