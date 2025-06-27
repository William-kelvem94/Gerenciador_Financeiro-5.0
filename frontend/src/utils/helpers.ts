// Formatação de moeda
export const formatCurrency = (
  amount: number,
  currency = 'BRL',
  locale = 'pt-BR'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// Formatação de data
export const formatDate = (
  date: string | Date,
  locale = 'pt-BR',
  options?: Intl.DateTimeFormatOptions
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  }).format(dateObj);
};

// Formatação de data curta
export const formatDateShort = (
  date: string | Date,
  locale = 'pt-BR'
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  }).format(dateObj);
};

// Formatação relativa de data
export const formatRelativeDate = (
  date: string | Date,
  locale = 'pt-BR'
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - dateObj.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return 'Ontem';
  if (diffDays === 0) return 'Hoje';
  if (diffDays <= 7) return `${diffDays} dias atrás`;
  if (diffDays <= 30) return `${Math.floor(diffDays / 7)} semanas atrás`;
  if (diffDays <= 365) return `${Math.floor(diffDays / 30)} meses atrás`;
  return `${Math.floor(diffDays / 365)} anos atrás`;
};

// Formatação de porcentagem
export const formatPercentage = (
  value: number,
  locale = 'pt-BR',
  minimumFractionDigits = 1
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits,
    maximumFractionDigits: 2,
  }).format(value / 100);
};

// Formatação de número
export const formatNumber = (
  value: number,
  locale = 'pt-BR',
  minimumFractionDigits = 0
): string => {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits,
    maximumFractionDigits: 2,
  }).format(value);
};

// Cores para categorias
export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    // Receitas
    'Salário': '#4CAF50',
    'Freelance': '#8BC34A',
    'Investimentos': '#2E7D32',
    'Vendas': '#66BB6A',
    'Outros Ganhos': '#388E3C',
    
    // Despesas
    'Alimentação': '#FF5722',
    'Transporte': '#FF9800',
    'Moradia': '#F44336',
    'Saúde': '#E91E63',
    'Educação': '#9C27B0',
    'Lazer': '#673AB7',
    'Compras': '#3F51B5',
    'Serviços': '#2196F3',
    'Impostos': '#795548',
    'Outros Gastos': '#607D8B',
  };

  return colors[category] || '#757575';
};

// Ícones para categorias
export const getCategoryIcon = (category: string): string => {
  const icons: Record<string, string> = {
    // Receitas
    'Salário': 'work',
    'Freelance': 'business_center',
    'Investimentos': 'trending_up',
    'Vendas': 'store',
    'Outros Ganhos': 'add_circle',
    
    // Despesas
    'Alimentação': 'restaurant',
    'Transporte': 'directions_car',
    'Moradia': 'home',
    'Saúde': 'local_hospital',
    'Educação': 'school',
    'Lazer': 'sports_esports',
    'Compras': 'shopping_cart',
    'Serviços': 'build',
    'Impostos': 'receipt_long',
    'Outros Gastos': 'remove_circle',
  };

  return icons[category] || 'category';
};

// Validação de email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validação de CPF (simplificada)
export const isValidCPF = (cpf: string): boolean => {
  const cleanCPF = cpf.replace(/\D/g, '');
  return cleanCPF.length === 11;
};

// Truncar texto
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

// Debounce function
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Gerar ID único
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

// Calcular diferença em dias
export const daysBetween = (date1: Date, date2: Date): number => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Gerar cor aleatória
export const generateRandomColor = (): string => {
  const colors = [
    '#F44336', '#E91E63', '#9C27B0', '#673AB7',
    '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4',
    '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
    '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Storage helpers
export const storage = {
  get: (key: string) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  set: (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      console.error('Erro ao salvar no localStorage');
    }
  },
  remove: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch {
      console.error('Erro ao remover do localStorage');
    }
  },
  clear: () => {
    try {
      localStorage.clear();
    } catch {
      console.error('Erro ao limpar localStorage');
    }
  },
};
