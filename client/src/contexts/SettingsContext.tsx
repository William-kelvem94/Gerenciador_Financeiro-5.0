import React, { createContext, useState, ReactNode } from 'react';

interface SettingsContextProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export const SettingsContext = createContext<SettingsContextProps | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <SettingsContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </SettingsContext.Provider>
  );
};
