import { useContext } from 'react';
import { FamilyContext } from '../contexts/FamilyContext';

// Hook para verificar se é usuário master
export const useMaster = () => {
  const context = useContext(FamilyContext);
  if (!context) {
    throw new Error('useMaster deve ser usado dentro de um FamilyProvider');
  }
  const { master, currentUser } = context;
  const isMaster = currentUser?.id === master?.id;
  
  return {
    master,
    isMaster,
    masterData: master
  };
};