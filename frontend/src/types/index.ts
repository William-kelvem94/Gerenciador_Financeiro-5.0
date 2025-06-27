export interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  account: string;
  date: string;
  tags?: string[];
  location?: string;
  note?: string;
  attachment?: string;
  recurring?: boolean;
  recurringPeriod?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  createdAt: string;
  updatedAt: string;
}

export interface DashboardData {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  balanceChange: number;
  balanceChangePercent: number;
  incomeChange: number;
  incomeChangePercent: number;
  expenseChange: number;
  expenseChangePercent: number;
  totalTransactions: number;
  transactionChange: number;
  transactionChangePercent: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlyBalance: number;
  recentTransactions: Transaction[];
  categoryBreakdown: CategoryData[];
  monthlyTrend: MonthlyTrendData[];
}

export interface CategoryData {
  category: string;
  amount: number;
  percentage: number;
  color: string;
  transactions: number;
}

export interface MonthlyTrendData {
  month: string;
  income: number;
  expenses: number;
  balance: number;
}

export interface Account {
  id: number;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment' | 'cash';
  balance: number;
  currency: string;
  color: string;
  active: boolean;
}

export interface Category {
  id: number;
  name: string;
  type: 'income' | 'expense';
  color: string;
  icon: string;
  budget?: number;
  active: boolean;
}

export interface Budget {
  id: number;
  category: string;
  limit: number;
  spent: number;
  period: 'monthly' | 'yearly';
  alertThreshold: number;
}

export interface Goal {
  id: number;
  name: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  currency: string;
  language: 'pt' | 'en';
  notifications: {
    budget: boolean;
    goals: boolean;
    transactions: boolean;
  };
  dashboard: {
    showBalance: boolean;
    defaultPeriod: 'week' | 'month' | 'year';
    quickStats: string[];
  };
}

export interface Filter {
  dateRange: {
    start: string;
    end: string;
  };
  categories: string[];
  accounts: string[];
  types: ('income' | 'expense')[];
  amountRange: {
    min: number;
    max: number;
  };
  searchTerm: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
