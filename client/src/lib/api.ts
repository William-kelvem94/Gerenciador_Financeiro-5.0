import axios, { AxiosError, AxiosResponse } from 'axios';
import toast from 'react-hot-toast';

// Create axios instance
export const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add loading states here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Any status code that lies within the range of 2xx causes this function to trigger
    return response;
  },
  (error: AxiosError) => {
    // Any status codes that fall outside the range of 2xx causes this function to trigger
    const { response } = error;

    if (response) {
      switch (response.status) {
        case 401:
          // Unauthorized - redirect to login or refresh token
          toast.error('Your session has expired. Please login again.');
          // Clear auth store if available
          localStorage.removeItem('auth-storage');
          window.location.href = '/login';
          break;
        
        case 403:
          toast.error('You do not have permission to perform this action.');
          break;
        
        case 404:
          toast.error('The requested resource was not found.');
          break;
        
        case 422:
          // Validation errors
          const message = (response.data as any)?.message || 'Validation error';
          toast.error(message);
          break;
        
        case 429:
          toast.error('Too many requests. Please try again later.');
          break;
        
        case 500:
          toast.error('Internal server error. Please try again later.');
          break;
        
        default:
          toast.error('An unexpected error occurred.');
      }
    } else if (error.request) {
      // Network error
      toast.error('Network error. Please check your connection.');
    } else {
      // Something else happened
      toast.error('An unexpected error occurred.');
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