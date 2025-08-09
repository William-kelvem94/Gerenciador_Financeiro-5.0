import axios, { AxiosError, AxiosResponse } from 'axios';
import toast from 'react-hot-toast';

// Configuração base da API - agora usando proxy do Vite na porta 5174
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Instância do axios com configurações padrão
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para incluir token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(new Error(error?.message || 'Erro desconhecido'));
  }
);

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    const { response } = error;

    if (response) {
      switch (response.status) {
        case 401:
          toast.error('Sua sessão expirou. Faça login novamente.');
          localStorage.removeItem('auth-token');
          window.location.href = '/login';
          break;
        case 403:
          toast.error('Você não tem permissão para esta ação.');
          break;
        case 404:
          toast.error('Recurso não encontrado.');
          break;
        case 422: {
          const message = (response.data as any)?.message || 'Erro de validação';
          toast.error(message);
          break;
        }
        case 429:
          toast.error('Muitas requisições. Tente novamente mais tarde.');
          break;
        case 500:
          toast.error('Erro interno do servidor. Tente novamente mais tarde.');
          break;
        default:
          toast.error('Ocorreu um erro inesperado.');
      }
    } else if (error.request) {
      toast.error('Erro de rede. Verifique sua conexão.');
    } else {
      toast.error('Ocorreu um erro inesperado.');
    }

    return Promise.reject(error);
  }
);

// Helper functions for different HTTP methods
export const apiClient = {
  get: <T = any>(url: string, config = {}) => 
    api.get<T>(url, config).then(res => res.data),
  
  post: <T = any>(url: string, data = {}, config = {}) => 
    api.post<T>(url, data, config).then(res => res.data),
  
  put: <T = any>(url: string, data = {}, config = {}) => 
    api.put<T>(url, data, config).then(res => res.data),
  
  patch: <T = any>(url: string, data = {}, config = {}) => 
    api.patch<T>(url, data, config).then(res => res.data),
  
  delete: <T = any>(url: string, config = {}) => 
    api.delete<T>(url, config).then(res => res.data),
};

export default api;
