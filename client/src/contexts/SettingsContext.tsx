import React, { createContext, useContext, useState, ReactNode } from "react";

interface SettingsContextProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

const SettingsContext = createContext<SettingsContextProps | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <SettingsContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
