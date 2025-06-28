import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { toast } from 'react-hot-toast';
import { ApiResponse, ApiError, User, Transaction, Account, Category } from '../types/api.types';

// Type aliases for cleaner code
type CreateTransactionData = Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;
type CreateAccountData = Omit<Account, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;
type CreateCategoryData = Omit<Category, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;

class ApiService {
  private readonly api: AxiosInstance;
  private readonly baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getStoredToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error('🚨 Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log(`📊 API Response: ${response.status} ${response.statusText}`);
        return response;
      },
      async (error: AxiosError<ApiError>) => {
        console.error('🚨 API Error:', error);
        
        if (error.response) {
          const { status, data } = error.response;
          
          // Handle authentication errors
          if (status === 401) {
            this.handleAuthError();
            toast.error('Sessão expirada. Faça login novamente.');
            return Promise.reject(new Error('Sessão expirada'));
          }
          
          // Handle specific error messages
          const errorMessage = data?.message || this.getDefaultErrorMessage(status);
          toast.error(errorMessage);
          
          return Promise.reject(new Error(errorMessage));
        } else if (error.request) {
          const errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão.';
          toast.error(errorMessage);
          return Promise.reject(new Error(errorMessage));
        } else {
          const errorMessage = error.message || 'Erro desconhecido';
          toast.error(errorMessage);
          return Promise.reject(new Error(errorMessage));
        }
      }
    );
  }

  private getStoredToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  private handleAuthError(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  private getDefaultErrorMessage(status: number): string {
    switch (status) {
      case 400:
        return 'Dados inválidos enviados';
      case 403:
        return 'Acesso negado';
      case 404:
        return 'Recurso não encontrado';
      case 409:
        return 'Conflito de dados';
      case 422:
        return 'Dados de entrada inválidos';
      case 429:
        return 'Muitas requisições. Tente novamente em instantes';
      case 500:
        return 'Erro interno do servidor';
      case 502:
        return 'Servidor indisponível';
      case 503:
        return 'Serviço temporariamente indisponível';
      default:
        return 'Erro desconhecido';
    }
  }

  // Authentication methods
  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string; refreshToken: string }>> {
    const response = await this.api.post('/auth/login', { email, password });
    return response.data;
  }

  async register(userData: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
  }): Promise<ApiResponse<{ user: User; token: string; refreshToken: string }>> {
    const response = await this.api.post('/auth/register', userData);
    return response.data;
  }

  async loginWithFirebase(idToken: string): Promise<ApiResponse<{ user: User; accessToken: string; refreshToken: string }>> {
    const response = await this.api.post('/auth/firebase/login', { idToken });
    return response.data;
  }

  async refreshToken(refreshToken: string): Promise<ApiResponse<{ accessToken: string }>> {
    const response = await this.api.post('/auth/refresh', { refreshToken });
    return response.data;
  }

  async logout(): Promise<ApiResponse<{}>> {
    const response = await this.api.post('/auth/logout');
    return response.data;
  }

  async verifyToken(): Promise<ApiResponse<{ user: User }>> {
    const response = await this.api.get('/auth/verify');
    return response.data;
  }

  // User methods
  async getUserProfile(): Promise<User> {
    const response = await this.api.get('/users/profile');
    return response.data.data.user;
  }

  async updateUserProfile(userData: Partial<User>): Promise<User> {
    const response = await this.api.put('/users/profile', userData);
    return response.data.data.user;
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const response = await this.api.post('/users', userData);
    return response.data.data.user;
  }

  // Transaction methods
  async getTransactions(params?: {
    page?: number;
    limit?: number;
    accountId?: string;
    categoryId?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<{ transactions: Transaction[]; total: number; page: number; totalPages: number }>> {
    const response = await this.api.get('/transactions', { params });
    return response.data;
  }

  async createTransaction(transactionData: CreateTransactionData): Promise<ApiResponse<{ transaction: Transaction }>> {
    const response = await this.api.post('/transactions', transactionData);
    return response.data;
  }

  async updateTransaction(id: string, transactionData: Partial<Transaction>): Promise<ApiResponse<{ transaction: Transaction }>> {
    const response = await this.api.put(`/transactions/${id}`, transactionData);
    return response.data;
  }

  async deleteTransaction(id: string): Promise<ApiResponse<{}>> {
    const response = await this.api.delete(`/transactions/${id}`);
    return response.data;
  }

  // Account methods
  async getAccounts(): Promise<ApiResponse<{ accounts: Account[] }>> {
    const response = await this.api.get('/accounts');
    return response.data;
  }

  async createAccount(accountData: CreateAccountData): Promise<ApiResponse<{ account: Account }>> {
    const response = await this.api.post('/accounts', accountData);
    return response.data;
  }

  async updateAccount(id: string, accountData: Partial<Account>): Promise<ApiResponse<{ account: Account }>> {
    const response = await this.api.put(`/accounts/${id}`, accountData);
    return response.data;
  }

  async deleteAccount(id: string): Promise<ApiResponse<{}>> {
    const response = await this.api.delete(`/accounts/${id}`);
    return response.data;
  }

  // Category methods
  async getCategories(): Promise<ApiResponse<{ categories: Category[] }>> {
    const response = await this.api.get('/categories');
    return response.data;
  }

  async createCategory(categoryData: CreateCategoryData): Promise<ApiResponse<{ category: Category }>> {
    const response = await this.api.post('/categories', categoryData);
    return response.data;
  }

  async updateCategory(id: string, categoryData: Partial<Category>): Promise<ApiResponse<{ category: Category }>> {
    const response = await this.api.put(`/categories/${id}`, categoryData);
    return response.data;
  }

  async deleteCategory(id: string): Promise<ApiResponse<{}>> {
    const response = await this.api.delete(`/categories/${id}`);
    return response.data;
  }

  // Analytics methods
  async getDashboardData(): Promise<ApiResponse<{
    totalBalance: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    recentTransactions: Transaction[];
    accountBalances: { accountId: string; balance: number }[];
    categoryExpenses: { categoryId: string; amount: number }[];
  }>> {
    const response = await this.api.get('/analytics/dashboard');
    return response.data;
  }

  async getReports(params: {
    type: 'income' | 'expense' | 'balance';
    period: 'week' | 'month' | 'year';
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<{
    labels: string[];
    data: number[];
    total: number;
  }>> {
    const response = await this.api.get('/analytics/reports', { params });
    return response.data;
  }

  // File upload methods
  async uploadFile(file: File, type: 'avatar' | 'transaction-import'): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await this.api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  // Import/Export methods
  async importTransactions(file: File): Promise<ApiResponse<{ imported: number; errors: string[] }>> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.api.post('/import/transactions', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  async exportTransactions(format: 'csv' | 'xlsx' | 'pdf', params?: {
    startDate?: string;
    endDate?: string;
    accountId?: string;
    categoryId?: string;
  }): Promise<Blob> {
    const response = await this.api.get('/export/transactions', {
      params: { ...params, format },
      responseType: 'blob',
    });

    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;
