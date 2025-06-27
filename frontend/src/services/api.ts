import axios from 'axios';
import { 
  Transaction, 
  DashboardData, 
  Account, 
  Category, 
  Budget, 
  Goal, 
  User, 
  PaginatedResponse 
} from '../types/index.js';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptors para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(new Error(error?.response?.data?.message ?? error.message ?? 'Erro na API'));
  }
);

// Dashboard
export const dashboardService = {
  async getDashboard(): Promise<DashboardData> {
    const response = await api.get<DashboardData>('/dashboard');
    return response.data;
  },
};

// Transactions
export const transactionService = {
  async getTransactions(page = 1, limit = 10, filters?: any): Promise<PaginatedResponse<Transaction>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });
    const response = await api.get<PaginatedResponse<Transaction>>(`/transactions?${params}`);
    return response.data;
  },

  async getTransaction(id: number): Promise<Transaction> {
    const response = await api.get<Transaction>(`/transactions/${id}`);
    return response.data;
  },

  async createTransaction(transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<Transaction> {
    const response = await api.post<Transaction>('/transactions', transaction);
    return response.data;
  },

  async updateTransaction(id: number, transaction: Partial<Transaction>): Promise<Transaction> {
    const response = await api.put<Transaction>(`/transactions/${id}`, transaction);
    return response.data;
  },

  async deleteTransaction(id: number): Promise<void> {
    await api.delete(`/transactions/${id}`);
  },

  async getTransactionsByCategory(category: string): Promise<Transaction[]> {
    const response = await api.get<Transaction[]>(`/transactions/category/${category}`);
    return response.data;
  },

  async getTransactionsByDateRange(startDate: string, endDate: string): Promise<Transaction[]> {
    const response = await api.get<Transaction[]>(`/transactions/date-range?start=${startDate}&end=${endDate}`);
    return response.data;
  },
};

// Accounts
export const accountService = {
  async getAccounts(): Promise<Account[]> {
    const response = await api.get<Account[]>('/accounts');
    return response.data;
  },

  async getAccount(id: number): Promise<Account> {
    const response = await api.get<Account>(`/accounts/${id}`);
    return response.data;
  },

  async createAccount(account: Omit<Account, 'id'>): Promise<Account> {
    const response = await api.post<Account>('/accounts', account);
    return response.data;
  },

  async updateAccount(id: number, account: Partial<Account>): Promise<Account> {
    const response = await api.put<Account>(`/accounts/${id}`, account);
    return response.data;
  },

  async deleteAccount(id: number): Promise<void> {
    await api.delete(`/accounts/${id}`);
  },
};

// Categories
export const categoryService = {
  async getCategories(): Promise<Category[]> {
    const response = await api.get<Category[]>('/categories');
    return response.data;
  },

  async getCategory(id: number): Promise<Category> {
    const response = await api.get<Category>(`/categories/${id}`);
    return response.data;
  },

  async createCategory(category: Omit<Category, 'id'>): Promise<Category> {
    const response = await api.post<Category>('/categories', category);
    return response.data;
  },

  async updateCategory(id: number, category: Partial<Category>): Promise<Category> {
    const response = await api.put<Category>(`/categories/${id}`, category);
    return response.data;
  },

  async deleteCategory(id: number): Promise<void> {
    await api.delete(`/categories/${id}`);
  },
};

// Budgets
export const budgetService = {
  async getBudgets(): Promise<Budget[]> {
    const response = await api.get<Budget[]>('/budgets');
    return response.data;
  },

  async getBudget(id: number): Promise<Budget> {
    const response = await api.get<Budget>(`/budgets/${id}`);
    return response.data;
  },

  async createBudget(budget: Omit<Budget, 'id'>): Promise<Budget> {
    const response = await api.post<Budget>('/budgets', budget);
    return response.data;
  },

  async updateBudget(id: number, budget: Partial<Budget>): Promise<Budget> {
    const response = await api.put<Budget>(`/budgets/${id}`, budget);
    return response.data;
  },

  async deleteBudget(id: number): Promise<void> {
    await api.delete(`/budgets/${id}`);
  },
};

// Goals
export const goalService = {
  async getGoals(): Promise<Goal[]> {
    const response = await api.get<Goal[]>('/goals');
    return response.data;
  },

  async getGoal(id: number): Promise<Goal> {
    const response = await api.get<Goal>(`/goals/${id}`);
    return response.data;
  },

  async createGoal(goal: Omit<Goal, 'id'>): Promise<Goal> {
    const response = await api.post<Goal>('/goals', goal);
    return response.data;
  },

  async updateGoal(id: number, goal: Partial<Goal>): Promise<Goal> {
    const response = await api.put<Goal>(`/goals/${id}`, goal);
    return response.data;
  },

  async deleteGoal(id: number): Promise<void> {
    await api.delete(`/goals/${id}`);
  },
};

// User
export const userService = {
  async getUser(): Promise<User> {
    const response = await api.get<User>('/user');
    return response.data;
  },

  async updateUser(user: Partial<User>): Promise<User> {
    const response = await api.put<User>('/user', user);
    return response.data;
  },
};

// Exports
export default api;
