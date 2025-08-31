/**
 * Provedor de contexto para gerenciamento familiar
 * Sistema hierárquico de usuários com permissões granulares
 */
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { toast } from 'react-toastify';

export interface FamilyUser {
  id: string;
  name: string;
  email: string;
  role: 'master' | 'admin' | 'user' | 'child';
  databases: string[];
  permissions: Permission[];
  avatar?: string;
  createdAt: string;
  lastActive?: string;
  isActive: boolean;
  metadata?: {
    birthDate?: string;
    phone?: string;
    preferences?: Record<string, any>;
  };
}

export interface Permission {
  resource: string; // 'transactions', 'budgets', 'reports', etc.
  actions: ('create' | 'read' | 'update' | 'delete' | 'admin')[];
  scope?: 'own' | 'family' | 'all'; // Escopo da permissão
}

export interface FamilyDatabase {
  id: string;
  name: string;
  displayName: string;
  description: string;
  owner: string; // ID do usuário proprietário
  members: string[]; // IDs dos usuários com acesso
  createdAt: string;
  isActive: boolean;
}

interface FamilyContextType {
  // Estado
  master: FamilyUser | null;
  users: FamilyUser[];
  databases: FamilyDatabase[];
  currentUser: FamilyUser | null;
  
  // Ações de usuário
  addUser: (user: Omit<FamilyUser, 'id' | 'createdAt' | 'isActive'>) => Promise<FamilyUser>;
  updateUser: (id: string, updates: Partial<FamilyUser>) => Promise<boolean>;
  removeUser: (id: string) => Promise<boolean>;
  setCurrentUser: (user: FamilyUser | null) => void;
  
  // Ações de database
  createDatabase: (database: Omit<FamilyDatabase, 'id' | 'createdAt' | 'isActive'>) => Promise<FamilyDatabase>;
  updateDatabase: (id: string, updates: Partial<FamilyDatabase>) => Promise<boolean>;
  removeDatabase: (id: string) => Promise<boolean>;
  
  // Verificações de permissão
  hasPermission: (userId: string, resource: string, action: string) => boolean;
  canAccessDatabase: (userId: string, databaseId: string) => boolean;
  
  // Utilitários
  getUsersByRole: (role: FamilyUser['role']) => FamilyUser[];
  getActiveUsers: () => FamilyUser[];
  getFamilyStats: () => {
    totalUsers: number;
    activeUsers: number;
    totalDatabases: number;
    usersByRole: Record<string, number>;
  };
}

const FamilyContext = createContext<FamilyContextType | null>(null);

// Permissões padrão por role
const DEFAULT_PERMISSIONS: Record<FamilyUser['role'], Permission[]> = {
  master: [
    {
      resource: '*',
      actions: ['create', 'read', 'update', 'delete', 'admin'],
      scope: 'all'
    }
  ],
  admin: [
    {
      resource: 'transactions',
      actions: ['create', 'read', 'update', 'delete'],
      scope: 'family'
    },
    {
      resource: 'budgets',
      actions: ['create', 'read', 'update', 'delete'],
      scope: 'family'
    },
    {
      resource: 'reports',
      actions: ['create', 'read'],
      scope: 'family'
    }
  ],
  user: [
    {
      resource: 'transactions',
      actions: ['create', 'read', 'update'],
      scope: 'own'
    },
    {
      resource: 'budgets',
      actions: ['read'],
      scope: 'own'
    }
  ],
  child: [
    {
      resource: 'transactions',
      actions: ['read'],
      scope: 'own'
    }
  ]
};

interface FamilyProviderProps {
  children: ReactNode;
}

export const FamilyProvider: React.FC<FamilyProviderProps> = ({ children }) => {
  const [master, setMaster] = useState<FamilyUser | null>(null);
  const [users, setUsers] = useState<FamilyUser[]>([]);
  const [databases, setDatabases] = useState<FamilyDatabase[]>([]);
  const [currentUser, setCurrentUser] = useState<FamilyUser | null>(null);

  const addUser = useCallback(async (userData: Omit<FamilyUser, 'id' | 'createdAt' | 'isActive'>): Promise<FamilyUser> => {
    try {
      // Verificar se email já existe
      if (users.some(u => u.email === userData.email)) {
        throw new Error('Email já está em uso');
      }

      const newUser: FamilyUser = {
        ...userData,
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        isActive: true,
        permissions: userData.permissions || DEFAULT_PERMISSIONS[userData.role] || DEFAULT_PERMISSIONS.user
      };

      setUsers(prev => [...prev, newUser]);

      if (userData.role === 'master') {
        setMaster(newUser);
      }

      toast.success(`Usuário ${newUser.name} adicionado com sucesso!`);
      return newUser;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao adicionar usuário';
      toast.error(message);
      throw error;
    }
  }, [users]);

  const createDatabase = useCallback(async (dbData: Omit<FamilyDatabase, 'id' | 'createdAt' | 'isActive'>): Promise<FamilyDatabase> => {
    try {
      const newDatabase: FamilyDatabase = {
        ...dbData,
        id: `db_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        isActive: true
      };

      setDatabases(prev => [...prev, newDatabase]);
      toast.success(`Database ${newDatabase.displayName} criado!`);
      return newDatabase;
    } catch {
      toast.error('Erro ao criar database');
      throw new Error('Erro ao criar database');
    }
  }, []);

  const initializeDefaultUsers = useCallback(async () => {
    const defaultUsers = [
      {
        name: 'Administrador Master',
        email: 'admin@familia.com',
        role: 'master' as const,
        databases: ['db-family', 'db-master', 'db-pai', 'db-mae'],
        permissions: DEFAULT_PERMISSIONS.master
      },
      {
        name: 'Pai',
        email: 'pai@familia.com',
        role: 'admin' as const,
        databases: ['db-family', 'db-pai'],
        permissions: DEFAULT_PERMISSIONS.admin
      },
      {
        name: 'Mãe',
        email: 'mae@familia.com',
        role: 'admin' as const,
        databases: ['db-family', 'db-mae'],
        permissions: DEFAULT_PERMISSIONS.admin
      }
    ];

    for (const userData of defaultUsers) {
      await addUser(userData);
    }

    // Criar databases padrão
    const defaultDatabases = [
      {
        name: 'db-family',
        displayName: 'Financeiro Familiar',
        description: 'Contas compartilhadas da família',
        owner: users.find(u => u.role === 'master')?.id || '',
        members: users.map(u => u.id)
      },
      {
        name: 'db-pai',
        displayName: 'Contas do Pai',
        description: 'Contas pessoais do pai',
        owner: users.find(u => u.email === 'pai@familia.com')?.id || '',
        members: [users.find(u => u.role === 'master')?.id || '', users.find(u => u.email === 'pai@familia.com')?.id || ''].filter(Boolean)
      },
      {
        name: 'db-mae',
        displayName: 'Contas da Mãe',
        description: 'Contas pessoais da mãe',
        owner: users.find(u => u.email === 'mae@familia.com')?.id || '',
        members: [users.find(u => u.role === 'master')?.id || '', users.find(u => u.email === 'mae@familia.com')?.id || ''].filter(Boolean)
      }
    ];

    for (const dbData of defaultDatabases) {
      await createDatabase(dbData);
    }

    toast.success('Sistema familiar inicializado com usuários padrão!');
  }, [addUser, createDatabase, users]);

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    const loadFamilyData = () => {
      try {
        const savedUsers = localStorage.getItem('family_users');
        const savedDatabases = localStorage.getItem('family_databases');
        const savedCurrentUser = localStorage.getItem('family_current_user');

        if (savedUsers) {
          const parsedUsers = JSON.parse(savedUsers);
          setUsers(parsedUsers);
          
          // Encontrar master
          const masterUser = parsedUsers.find((u: FamilyUser) => u.role === 'master');
          if (masterUser) {
            setMaster(masterUser);
          }
        }

        if (savedDatabases) {
          setDatabases(JSON.parse(savedDatabases));
        }

        if (savedCurrentUser) {
          setCurrentUser(JSON.parse(savedCurrentUser));
        }

        // Criar usuários padrão se não existirem
        if (!savedUsers || JSON.parse(savedUsers).length === 0) {
          initializeDefaultUsers();
        }
      } catch (error) {
        console.error('Erro ao carregar dados da família:', error);
        toast.error('Erro ao carregar configurações familiares');
      }
    };

    loadFamilyData();
  }, [initializeDefaultUsers]);

  // Salvar dados quando o estado mudar
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('family_users', JSON.stringify(users));
    }
  }, [users]);

  useEffect(() => {
    if (databases.length > 0) {
      localStorage.setItem('family_databases', JSON.stringify(databases));
    }
  }, [databases]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('family_current_user', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  // Atualizar usuário
  const updateUser = useCallback(async (id: string, updates: Partial<FamilyUser>): Promise<boolean> => {
    try {
      setUsers(prev => prev.map(user => {
        if (user.id === id) {
          const updatedUser = { ...user, ...updates };
          
          // Atualizar master se necessário
          if (updatedUser.role === 'master') {
            setMaster(updatedUser);
          }
          
          // Atualizar currentUser se é o mesmo
          if (currentUser?.id === id) {
            setCurrentUser(updatedUser);
          }
          
          return updatedUser;
        }
        return user;
      }));

      toast.success('Usuário atualizado com sucesso!');
      return true;
    } catch {
      toast.error('Erro ao atualizar usuário');
      return false;
    }
  }, [currentUser]);

  // Remover usuário
  const removeUser = useCallback(async (id: string): Promise<boolean> => {
    try {
      const userToRemove = users.find(u => u.id === id);
      if (!userToRemove) {
        throw new Error('Usuário não encontrado');
      }

      if (userToRemove.role === 'master') {
        throw new Error('Não é possível remover o usuário master');
      }

      setUsers(prev => prev.filter(u => u.id !== id));
      
      if (currentUser?.id === id) {
        setCurrentUser(null);
      }

      toast.success(`Usuário ${userToRemove.name} removido`);
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao remover usuário';
      toast.error(message);
      return false;
    }
  }, [users, currentUser]);

  // Atualizar database
  const updateDatabase = useCallback(async (id: string, updates: Partial<FamilyDatabase>): Promise<boolean> => {
    try {
      setDatabases(prev => prev.map(db => 
        db.id === id ? { ...db, ...updates } : db
      ));
      toast.success('Database atualizado!');
      return true;
    } catch {
      toast.error('Erro ao atualizar database');
      return false;
    }
  }, []);

  // Remover database
  const removeDatabase = useCallback(async (id: string): Promise<boolean> => {
    try {
      setDatabases(prev => prev.filter(db => db.id !== id));
      toast.success('Database removido');
      return true;
    } catch {
      toast.error('Erro ao remover database');
      return false;
    }
  }, []);

  // Verificar permissão
  const hasPermission = useCallback((userId: string, resource: string, action: string): boolean => {
    const user = users.find(u => u.id === userId);
    if (!user) return false;

    // Master tem todas as permissões
    if (user.role === 'master') return true;

    // Verificar permissões específicas
    return user.permissions.some(permission => {
      // Wildcard resource
      if (permission.resource === '*') {
        return permission.actions.includes(action as any);
      }
      
      // Resource específico
      if (permission.resource === resource) {
        return permission.actions.includes(action as any);
      }
      
      return false;
    });
  }, [users]);

  // Verificar acesso a database
  const canAccessDatabase = useCallback((userId: string, databaseId: string): boolean => {
    const user = users.find(u => u.id === userId);
    const database = databases.find(db => db.id === databaseId);
    
    if (!user || !database) return false;
    
    // Master tem acesso a tudo
    if (user.role === 'master') return true;
    
    // Verificar se é membro do database
    return database.members.includes(userId) || database.owner === userId;
  }, [users, databases]);

  // Obter usuários por role
  const getUsersByRole = useCallback((role: FamilyUser['role']): FamilyUser[] => {
    return users.filter(u => u.role === role);
  }, [users]);

  // Obter usuários ativos
  const getActiveUsers = useCallback((): FamilyUser[] => {
    return users.filter(u => u.isActive);
  }, [users]);

  // Obter estatísticas da família
  const getFamilyStats = useCallback(() => {
    const activeUsers = getActiveUsers();
    const usersByRole = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalUsers: users.length,
      activeUsers: activeUsers.length,
      totalDatabases: databases.length,
      usersByRole
    };
  }, [users, databases, getActiveUsers]);

  const contextValue: FamilyContextType = {
    // Estado
    master,
    users,
    databases,
    currentUser,
    
    // Ações de usuário
    addUser,
    updateUser,
    removeUser,
    setCurrentUser,
    
    // Ações de database
    createDatabase,
    updateDatabase,
    removeDatabase,
    
    // Verificações
    hasPermission,
    canAccessDatabase,
    
    // Utilitários
    getUsersByRole,
    getActiveUsers,
    getFamilyStats
  };

  return (
    <FamilyContext.Provider value={contextValue}>
      {children}
    </FamilyContext.Provider>
  );
};

// Hook para usar o contexto
// eslint-disable-next-line react-refresh/only-export-components
export const useFamily = (): FamilyContextType => {
  const context = useContext(FamilyContext);
  if (!context) {
    throw new Error('useFamily deve ser usado dentro de um FamilyProvider');
  }
  return context;
};

