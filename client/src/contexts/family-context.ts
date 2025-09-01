// React Context para gerenciamento de família
import { createContext, useContext } from 'react';

interface FamilyContextType {
  users: any[];
  selectedUser: any | null;
  selectUser: (user: any) => void;
  addUser: (user: any) => Promise<void>;
  updateUser: (userId: string, userData: any) => Promise<void>;
  removeUser: (userId: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const FamilyContext = createContext<FamilyContextType | undefined>(undefined);

export const useFamilyContext = () => {
  const context = useContext(FamilyContext);
  if (!context) {
    throw new Error('useFamilyContext must be used within a FamilyProvider');
  }
  return context;
};

export { FamilyContext };
