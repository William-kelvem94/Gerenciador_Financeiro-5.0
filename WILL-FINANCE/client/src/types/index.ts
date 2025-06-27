// Tipos de dados do sistema financeiro

export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  bio?: string;
  location?: string;
  website?: string;
  phone?: string;
  dateOfBirth?: string;
  currency: string;
  language: string;
  timezone: string;
  theme: string;
  monthlyBudget?: number;
  savingsGoal?: number;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  description?: string;
  color: string;
  icon?: string;
  isActive: boolean;
  bankName?: string;
  accountNumber?: string;
  routingNumber?: string;
  creditLimit?: number;
  interestRate?: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  type: CategoryType;
  parentId?: string;
  isSystem: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
  parent?: Category;
  children?: Category[];
}

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  notes?: string;
  type: TransactionType;
  status: TransactionStatus;
  location?: string;
  latitude?: number;
  longitude?: number;
  receiptUrl?: string;
  merchantName?: string;
  aiAnalyzed: boolean;
  aiCategories: string[];
  aiTags: string[];
  aiConfidence?: number;
  date: string;
  userId: string;
  accountId: string;
  categoryId?: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  account?: Account;
  category?: Category;
}

export interface Budget {
  id: string;
  name: string;
  amount: number;
  spent: number;
  period: BudgetPeriod;
  startDate: string;
  endDate: string;
  isActive: boolean;
  alertAt50: boolean;
  alertAt75: boolean;
  alertAt90: boolean;
  alertAt100: boolean;
  userId: string;
  categoryId?: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  category?: Category;
}

export interface Goal {
  id: string;
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: string;
  isCompleted: boolean;
  color: string;
  icon?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  data?: any;
  userId: string;
  createdAt: string;
  readAt?: string;
  user?: User;
}

export interface AiInsight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  data: any;
  confidence: number;
  isViewed: boolean;
  userId: string;
  createdAt: string;
  viewedAt?: string;
  user?: User;
}

// Enums
export type AccountType = 
  | 'CHECKING' 
  | 'SAVINGS' 
  | 'CREDIT_CARD' 
  | 'INVESTMENT' 
  | 'CASH' 
  | 'LOAN' 
  | 'OTHER';

export type CategoryType = 
  | 'INCOME' 
  | 'EXPENSE' 
  | 'TRANSFER';

export type TransactionType = 
  | 'INCOME' 
  | 'EXPENSE' 
  | 'TRANSFER';

export type TransactionStatus = 
  | 'PENDING' 
  | 'COMPLETED' 
  | 'CANCELLED' 
  | 'FAILED';

export type BudgetPeriod = 
  | 'WEEKLY' 
  | 'MONTHLY' 
  | 'QUARTERLY' 
  | 'YEARLY';

export type NotificationType = 
  | 'BUDGET_ALERT' 
  | 'GOAL_MILESTONE' 
  | 'UNUSUAL_SPENDING' 
  | 'BILL_REMINDER' 
  | 'AI_INSIGHT' 
  | 'SECURITY_ALERT' 
  | 'SYSTEM';

export type InsightType = 
  | 'SPENDING_PATTERN' 
  | 'BUDGET_OPTIMIZATION' 
  | 'SAVINGS_OPPORTUNITY' 
  | 'UNUSUAL_TRANSACTION' 
  | 'GOAL_PROGRESS' 
  | 'CASHFLOW_PREDICTION' 
  | 'EXPENSE_CATEGORY_ANALYSIS';

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

export interface TransactionForm {
  amount: number;
  description: string;
  notes?: string;
  type: TransactionType;
  date: string;
  accountId: string;
  categoryId?: string;
  location?: string;
  merchantName?: string;
}

export interface AccountForm {
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  description?: string;
  color: string;
  bankName?: string;
  accountNumber?: string;
  creditLimit?: number;
}

export interface CategoryForm {
  name: string;
  description?: string;
  color: string;
  icon?: string;
  type: CategoryType;
  parentId?: string;
}

export interface BudgetForm {
  name: string;
  amount: number;
  period: BudgetPeriod;
  startDate: string;
  endDate: string;
  categoryId?: string;
}

export interface GoalForm {
  name: string;
  description?: string;
  targetAmount: number;
  targetDate?: string;
  color: string;
  icon?: string;
}
