// Configurações da API para desenvolvimento local
const isDevelopment = window.location.port === '4000';

export const API_CONFIG = {
  BASE_URL: isDevelopment 
    ? 'http://localhost:3000'  // Backend local
    : 'http://localhost:3001', // Backend Docker
  ENDPOINTS: {
    DASHBOARD: '/dashboard',
    TRANSACTIONS: '/transactions',
    IA_CHAT: '/ia-chat',
  }
};

// Helper para fazer requisições à API
export const apiUrl = (endpoint: string) => `${API_CONFIG.BASE_URL}${endpoint}`;

// Helper para fetch com configuração padrão
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = apiUrl(endpoint);
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };
  
  try {
    const response = await fetch(url, defaultOptions);
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Erro na requisição para ${url}:`, error);
    throw error;
  }
};
