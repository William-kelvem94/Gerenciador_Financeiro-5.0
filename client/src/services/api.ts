import { authService } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
  timestamp?: string;
  path?: string;
}

class ApiService {
  private async getAuthHeaders(): Promise<HeadersInit> {
    const token = await authService.getIdToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers = await this.getAuthHeaders();
    
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        ...headers,
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);
      
      const response = await fetch(url, config);
      
      console.log(`📊 API Response: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        return data;
      } else {
        // Para responses que não são JSON, retornar como texto
        const text = await response.text();
        return {
          data: text as unknown as T,
          success: true
        };
      }
    } catch (error: any) {
      console.error('🚨 API Error:', error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão com a internet e se o servidor está rodando.');
      }
      
      throw error;
    }
  }

  private async handleErrorResponse(response: Response): Promise<never> {
    let errorMessage = `Erro HTTP: ${response.status}`;
    let apiError: ApiError | null = null;
    
    try {
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        apiError = await response.json();
        errorMessage = apiError?.message || errorMessage;
      } else {
        const errorText = await response.text();
        console.error('🚨 API Error Response:', errorText);
        
        // Se for HTML (página de erro), mostrar mensagem mais amigável
        if (errorText.includes('<!doctype') || errorText.includes('<html')) {
          errorMessage = 'Servidor indisponível. Verifique se o backend está rodando.';
        } else {
          errorMessage = errorText || errorMessage;
        }
      }
    } catch (parseError) {
      console.error('Erro ao parsear resposta de erro:', parseError);
    }

    // Handle specific HTTP status codes
    switch (response.status) {
      case 401:
        // Token expirado ou inválido
        errorMessage = 'Sessão expirada. Faça login novamente.';
        // Optionally trigger logout here
        break;
      case 403:
        errorMessage = 'Você não tem permissão para realizar esta ação.';
        break;
      case 404:
        errorMessage = 'Recurso não encontrado.';
        break;
      case 422:
        errorMessage = apiError?.message || 'Dados inválidos fornecidos.';
        break;
      case 429:
        errorMessage = 'Muitas requisições. Tente novamente em alguns minutos.';
        break;
      case 500:
        errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
        break;
      case 503:
        errorMessage = 'Serviço temporariamente indisponível.';
        break;
    }

    const error = new Error(errorMessage);
    (error as any).statusCode = response.status;
    (error as any).apiError = apiError;
    
    throw error;
  }

  // User management methods
  async getUserProfile(): Promise<any> {
    const response = await this.request<any>('/api/users/profile');
    return response.data;
  }

  async createUser(userData: any): Promise<any> {
    const response = await this.request<any>('/api/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    return response.data;
  }

  async updateUserProfile(userData: any): Promise<any> {
    const response = await this.request<any>('/api/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
    return response.data;
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request<ApiResponse<{
      user: any;
      token: string;
      refreshToken: string;
    }>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: any) {
    return this.request<ApiResponse<{
      user: any;
      token: string;
      refreshToken: string;
    }>>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async loginWithFirebase(idToken: string) {
    return this.request<ApiResponse<{
      user: any;
      accessToken: string;
      refreshToken: string;
    }>>('/auth/firebase/login', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    });
  }

  async refreshToken(refreshToken: string) {
    return this.request<ApiResponse<{
      accessToken: string;
    }>>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  async logout() {
    return this.request<ApiResponse<{}>>('/auth/logout', {
      method: 'POST',
    });
  }

  // Transaction endpoints
  async getTransactions(params?: {
    page?: number;
    limit?: number;
    category?: string;
    type?: string;
    dateFrom?: string;
    dateTo?: string;
  }) {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const query = queryParams.toString();
    const queryString = query ? `?${query}` : '';
    return this.request<ApiResponse<{
      data: any[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>>(`/transactions${queryString}`);
  }

  async getTransaction(id: string) {
    return this.request<ApiResponse<any>>(`/transactions/${id}`);
  }

  async createTransaction(transactionData: any) {
    return this.request<ApiResponse<any>>('/transactions', {
      method: 'POST',
      body: JSON.stringify(transactionData),
    });
  }

  async updateTransaction(id: string, transactionData: any) {
    return this.request<ApiResponse<any>>(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(transactionData),
    });
  }

  async deleteTransaction(id: string) {
    return this.request<ApiResponse<{}>>(`/transactions/${id}`, {
      method: 'DELETE',
    });
  }

  // Category endpoints
  async getCategories() {
    return this.request<ApiResponse<any[]>>('/categories');
  }

  async createCategory(categoryData: any) {
    return this.request<ApiResponse<any>>('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  // Account endpoints
  async getAccounts() {
    return this.request<ApiResponse<any[]>>('/accounts');
  }

  async createAccount(accountData: any) {
    return this.request<ApiResponse<any>>('/accounts', {
      method: 'POST',
      body: JSON.stringify(accountData),
    });
  }

  async updateAccount(id: string, accountData: any) {
    return this.request<ApiResponse<any>>(`/accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(accountData),
    });
  }

  async deleteAccount(id: string) {
    return this.request<ApiResponse<{}>>(`/accounts/${id}`, {
      method: 'DELETE',
    });
  }

  // Budget endpoints
  async getBudgets() {
    return this.request<ApiResponse<any[]>>('/budgets');
  }

  async createBudget(budgetData: any) {
    return this.request<ApiResponse<any>>('/budgets', {
      method: 'POST',
      body: JSON.stringify(budgetData),
    });
  }

  async updateBudget(id: string, budgetData: any) {
    return this.request<ApiResponse<any>>(`/budgets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(budgetData),
    });
  }

  async deleteBudget(id: string) {
    return this.request<ApiResponse<{}>>(`/budgets/${id}`, {
      method: 'DELETE',
    });
  }

  // Goal endpoints
  async getGoals() {
    return this.request<ApiResponse<any[]>>('/goals');
  }

  async createGoal(goalData: any) {
    return this.request<ApiResponse<any>>('/goals', {
      method: 'POST',
      body: JSON.stringify(goalData),
    });
  }

  async updateGoal(id: string, goalData: any) {
    return this.request<ApiResponse<any>>(`/goals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(goalData),
    });
  }

  async deleteGoal(id: string) {
    return this.request<ApiResponse<{}>>(`/goals/${id}`, {
      method: 'DELETE',
    });
  }

  // Analytics endpoints
  async getAnalytics(params?: {
    dateFrom?: string;
    dateTo?: string;
    groupBy?: string;
  }) {
    const queryParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const query = queryParams.toString();
    const analyticsQuery = query ? `?${query}` : '';
    return this.request<ApiResponse<{
      totalIncome: number;
      totalExpenses: number;
      balance: number;
      categoryBreakdown: any[];
      monthlyTrends: any[];
      budgetProgress: any[];
      goalProgress: any[];
    }>>(`/analytics${analyticsQuery}`);
  }

  // AI endpoints
  async getAIInsights() {
    return this.request<ApiResponse<{
      insights: string[];
      recommendations: string[];
      predictions: any[];
    }>>('/ai/insights');
  }

  async askAI(question: string) {
    return this.request<ApiResponse<{
      answer: string;
      suggestions: string[];
    }>>('/ai/ask', {
      method: 'POST',
      body: JSON.stringify({ question }),
    });
  }

  // Notification endpoints
  async getNotifications() {
    return this.request<ApiResponse<any[]>>('/notifications');
  }

  async markNotificationAsRead(id: string) {
    return this.request<ApiResponse<{}>>(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  }

  async deleteNotification(id: string) {
    return this.request<ApiResponse<{}>>(`/notifications/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
