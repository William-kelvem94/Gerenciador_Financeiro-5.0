// Categorias padrão
export const DEFAULT_CATEGORIES = {
  income: [
    { name: 'Salário', icon: 'work', color: '#4CAF50' },
    { name: 'Freelance', icon: 'business_center', color: '#8BC34A' },
    { name: 'Investimentos', icon: 'trending_up', color: '#2E7D32' },
    { name: 'Vendas', icon: 'store', color: '#66BB6A' },
    { name: 'Outros Ganhos', icon: 'add_circle', color: '#388E3C' },
  ],
  expense: [
    { name: 'Alimentação', icon: 'restaurant', color: '#FF5722' },
    { name: 'Transporte', icon: 'directions_car', color: '#FF9800' },
    { name: 'Moradia', icon: 'home', color: '#F44336' },
    { name: 'Saúde', icon: 'local_hospital', color: '#E91E63' },
    { name: 'Educação', icon: 'school', color: '#9C27B0' },
    { name: 'Lazer', icon: 'sports_esports', color: '#673AB7' },
    { name: 'Compras', icon: 'shopping_cart', color: '#3F51B5' },
    { name: 'Serviços', icon: 'build', color: '#2196F3' },
    { name: 'Impostos', icon: 'receipt_long', color: '#795548' },
    { name: 'Outros Gastos', icon: 'remove_circle', color: '#607D8B' },
  ],
};

// Contas padrão
export const DEFAULT_ACCOUNTS = [
  { name: 'Conta Corrente', type: 'checking', color: '#2196F3', icon: 'account_balance' },
  { name: 'Poupança', type: 'savings', color: '#4CAF50', icon: 'savings' },
  { name: 'Cartão de Crédito', type: 'credit', color: '#FF9800', icon: 'credit_card' },
  { name: 'Dinheiro', type: 'cash', color: '#795548', icon: 'attach_money' },
  { name: 'Investimentos', type: 'investment', color: '#9C27B0', icon: 'trending_up' },
];

// Períodos de recorrência
export const RECURRING_PERIODS = [
  { value: 'daily', label: 'Diário' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'monthly', label: 'Mensal' },
  { value: 'yearly', label: 'Anual' },
];

// Moedas suportadas
export const SUPPORTED_CURRENCIES = [
  { code: 'BRL', symbol: 'R$', name: 'Real Brasileiro' },
  { code: 'USD', symbol: '$', name: 'Dólar Americano' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'Libra Esterlina' },
];

// Idiomas suportados
export const SUPPORTED_LANGUAGES = [
  { code: 'pt', name: 'Português' },
  { code: 'en', name: 'English' },
];

// Temas disponíveis
export const AVAILABLE_THEMES = [
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Escuro' },
  { value: 'system', label: 'Sistema' },
];

// Tipos de contas
export const ACCOUNT_TYPES = [
  { value: 'checking', label: 'Conta Corrente', icon: 'account_balance' },
  { value: 'savings', label: 'Poupança', icon: 'savings' },
  { value: 'credit', label: 'Cartão de Crédito', icon: 'credit_card' },
  { value: 'cash', label: 'Dinheiro', icon: 'attach_money' },
  { value: 'investment', label: 'Investimentos', icon: 'trending_up' },
];

// Prioridades para metas
export const GOAL_PRIORITIES = [
  { value: 'low', label: 'Baixa', color: '#4CAF50' },
  { value: 'medium', label: 'Média', color: '#FF9800' },
  { value: 'high', label: 'Alta', color: '#F44336' },
];

// Períodos para orçamentos
export const BUDGET_PERIODS = [
  { value: 'monthly', label: 'Mensal' },
  { value: 'yearly', label: 'Anual' },
];

// Cores para gráficos
export const CHART_COLORS = [
  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
  '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF',
  '#4BC0C0', '#FF6384', '#36A2EB', '#FFCE56'
];

// Configurações padrão do dashboard
export const DEFAULT_DASHBOARD_CONFIG = {
  showBalance: true,
  defaultPeriod: 'month',
  quickStats: ['balance', 'monthlyIncome', 'monthlyExpenses', 'savings'],
  chartTypes: {
    categoryBreakdown: 'doughnut',
    monthlyTrend: 'line',
    accountBalance: 'bar',
  },
};

// Configurações de paginação
export const PAGINATION_CONFIG = {
  defaultPageSize: 10,
  pageSizeOptions: [5, 10, 25, 50, 100],
  maxVisiblePages: 5,
};

// Configurações de notificação
export const NOTIFICATION_TYPES = {
  success: { color: '#4CAF50', icon: 'check_circle' },
  error: { color: '#F44336', icon: 'error' },
  warning: { color: '#FF9800', icon: 'warning' },
  info: { color: '#2196F3', icon: 'info' },
};

// Breakpoints responsivos
export const BREAKPOINTS = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
};

// Configurações da API
export const API_CONFIG = {
  timeout: 10000,
  retryAttempts: 3,
  retryDelay: 1000,
};

// Regex patterns
export const PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
  cpf: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
  cnpj: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
  currency: /^\d+([.,]\d{2})?$/,
};

// Limites do sistema
export const LIMITS = {
  maxTransactionAmount: 1000000,
  maxDescriptionLength: 255,
  maxNoteLength: 1000,
  maxCategoryNameLength: 50,
  maxAccountNameLength: 50,
  maxFileSize: 5 * 1024 * 1024, // 5MB
  supportedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
};
