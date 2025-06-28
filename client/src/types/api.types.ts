// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  statusCode: number;
  success: boolean;
  timestamp?: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
  timestamp?: string;
  path?: string;
  details?: any;
}

// User Types
export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role?: UserRole;
  isEmailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  PREMIUM = 'premium'
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// Transaction Types
export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: TransactionCategory;
  type: TransactionType;
  date: string;
  accountId: string;
  account?: Account;
  userId: string;
  tags?: string[];
  recurring?: boolean;
  recurringFrequency?: RecurringFrequency;
  createdAt: string;
  updatedAt: string;
}

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
  TRANSFER = 'transfer'
}

export enum TransactionCategory {
  FOOD = 'food',
  TRANSPORT = 'transport',
  ENTERTAINMENT = 'entertainment',
  UTILITIES = 'utilities',
  HEALTHCARE = 'healthcare',
  EDUCATION = 'education',
  SHOPPING = 'shopping',
  SALARY = 'salary',
  INVESTMENT = 'investment',
  OTHER = 'other'
}

export enum RecurringFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly'
}

// Account Types
export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  color?: string;
  icon?: string;
  isDefault?: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export enum AccountType {
  CHECKING = 'checking',
  SAVINGS = 'savings',
  CREDIT_CARD = 'credit_card',
  INVESTMENT = 'investment',
  CASH = 'cash'
}

// Budget Types
export interface Budget {
  id: string;
  name: string;
  amount: number;
  spent: number;
  category: TransactionCategory;
  period: BudgetPeriod;
  startDate: string;
  endDate: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export enum BudgetPeriod {
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly'
}

// Goal Types
export interface Goal {
  id: string;
  name: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: GoalCategory;
  priority: GoalPriority;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export enum GoalCategory {
  EMERGENCY_FUND = 'emergency_fund',
  VACATION = 'vacation',
  CAR = 'car',
  HOUSE = 'house',
  EDUCATION = 'education',
  RETIREMENT = 'retirement',
  OTHER = 'other'
}

export enum GoalPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

// Pagination Types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Analytics Types
export interface AnalyticsData {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  monthlyTrend: MonthlyTrend[];
  categoryBreakdown: CategoryBreakdown[];
  accountBalances: AccountBalance[];
}

export interface MonthlyTrend {
  month: string;
  income: number;
  expenses: number;
  netIncome: number;
}

export interface CategoryBreakdown {
  category: TransactionCategory;
  amount: number;
  percentage: number;
  transactions: number;
}

export interface AccountBalance {
  accountId: string;
  accountName: string;
  balance: number;
  currency: string;
}

// Import/Export Types
export interface ImportData {
  file: File;
  type: ImportType;
  mapping?: FieldMapping;
}

export enum ImportType {
  CSV = 'csv',
  OFX = 'ofx',
  QIF = 'qif',
  JSON = 'json'
}

export interface FieldMapping {
  [key: string]: string;
}

export interface ExportOptions {
  format: ExportFormat;
  dateRange: DateRange;
  accounts?: string[];
  categories?: TransactionCategory[];
}

export enum ExportFormat {
  CSV = 'csv',
  PDF = 'pdf',
  EXCEL = 'excel',
  JSON = 'json'
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

// Notification Types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  userId: string;
  createdAt: string;
}

export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  BUDGET_ALERT = 'budget_alert',
  GOAL_PROGRESS = 'goal_progress'
}
