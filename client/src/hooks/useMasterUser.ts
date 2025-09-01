/**
 * Hook para detectar e gerenciar usuários master
 * Não interfere com o sistema de autenticação Firebase existente
 */
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

export interface MasterUser {
  id: string;
  email: string;
  role: 'master' | 'admin' | 'user';
  databases: string[];
  permissions: string[];
  displayName?: string;
}

// Configuração de usuários master - em produção, isso viria do backend
const MASTER_USERS: Record<string, MasterUser> = {
  'admin@familia.com': {
    id: 'master-001',
    email: 'admin@familia.com',
    role: 'master',
    databases: ['db-family', 'db-pai', 'db-mae'],
    permissions: ['create', 'read', 'update', 'delete', 'admin'],
    displayName: 'Administrador Master',
  },
  'pai@familia.com': {
    id: 'user-002',
    email: 'pai@familia.com',
    role: 'admin',
    databases: ['db-pai', 'db-family'],
    permissions: ['create', 'read', 'update', 'delete'],
    displayName: 'Pai - Administrador',
  },
  'mae@familia.com': {
    id: 'user-003',
    email: 'mae@familia.com',
    role: 'admin',
    databases: ['db-mae', 'db-family'],
    permissions: ['create', 'read', 'update', 'delete'],
    displayName: 'Mãe - Administradora',
  },
};

export function useMasterUser() {
  const { user: firebaseUser, isAuthenticated } = useAuthStore();
  const [masterUser, setMasterUser] = useState<MasterUser | null>(null);
  const [isMaster, setIsMaster] = useState(false);

  useEffect(() => {
    if (isAuthenticated && firebaseUser) {
      const userEmail = firebaseUser.email;

      if (userEmail && MASTER_USERS[userEmail]) {
        const master = MASTER_USERS[userEmail];
        setMasterUser(master);
        setIsMaster(master.role === 'master');

        console.log('🔑 Usuário master detectado:', master);
      } else {
        // Usuário Firebase comum
        setMasterUser(null);
        setIsMaster(false);
      }
    } else {
      setMasterUser(null);
      setIsMaster(false);
    }
  }, [firebaseUser, isAuthenticated]);

  const hasPermission = (permission: string): boolean => {
    return masterUser?.permissions.includes(permission) || false;
  };

  const hasDatabase = (database: string): boolean => {
    return masterUser?.databases.includes(database) || false;
  };

  const getUserDisplayName = (): string => {
    if (masterUser?.displayName) {
      return masterUser.displayName;
    }
    if (firebaseUser?.email) {
      return firebaseUser.email.split('@')[0]; // Usar parte antes do @ como nome
    }
    return 'Usuário';
  };

  const getUserRole = (): string => {
    if (masterUser) {
      return masterUser.role;
    }
    return 'user';
  };

  return {
    masterUser,
    isMaster,
    isAdmin: masterUser?.role === 'admin' || isMaster,
    hasPermission,
    hasDatabase,
    getUserDisplayName,
    getUserRole,
    databases: masterUser?.databases || [],
    permissions: masterUser?.permissions || [],
  };
}
