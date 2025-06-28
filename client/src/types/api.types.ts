// Definição de resposta genérica de API
export interface ApiResponse<T> {
  data: T;
  message?: string;
  statusCode: number;
  status: 'success' | 'error';
}

// Tipos de usuário
export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  emailVerified?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Tipos de transação
export interface Transaction {
  id: string;
  userId: string;
  accountId: string;
  categoryId: string;
  amount: number;
  description: string;
  type: 'income' | 'expense' | 'transfer';
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  account?: Account;
  category?: Category;
}

// Tipos de conta
export interface Account {
  id: string;
  userId: string;
  name: string;
  type: 'CHECKING' | 'SAVINGS' | 'CREDIT_CARD' | 'INVESTMENT' | 'CASH' | 'LOAN' | 'OTHER';
  balance: number;
  currency: string;
  description?: string;
  color: string;
  icon?: string;
  bankName?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Tipos de categoria
export interface Category {
  id: string;
  userId: string;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon?: string;
  description?: string;
  parentId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  children?: Category[];
  parent?: Category;
}

// Tipos de erro
export interface ApiError {
  message: string;
  statusCode: number;
  code?: string;
  details?: any;
}