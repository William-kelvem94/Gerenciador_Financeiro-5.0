import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  PieChart,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Wallet,
  Calendar,
  Filter,
  X
} from 'lucide-react';
import { useAnalytics } from '../hooks/useApi';
import { useSettings } from '../contexts/SettingsContext';

interface AnalyticsData {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  monthlyGrowth: number;
  topCategories: Array<{
    name: string;
    amount: number;
    percentage: number;
    color: string;
  }>;
  monthlyData: Array<{
    month: string;
    income: number;
    expenses: number;
    net: number;
  }>;
}

// Dados reais serão carregados da API
const emptyAnalyticsData: AnalyticsData = {
  totalIncome: 0,
  totalExpenses: 0,
  netIncome: 0,
  monthlyGrowth: 0,
  topCategories: [],
  monthlyData: []
};

export function AnalyticsPage() {
  const { settings } = useSettings();
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y' | 'custom'>('30d');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [customPeriodValid, setCustomPeriodValid] = useState(false);

  // Validar período personalizado
  useEffect(() => {
    if (customStartDate && customEndDate) {
      const start = new Date(customStartDate);
      const end = new Date(customEndDate);
      setCustomPeriodValid(start <= end && start <= new Date());
    } else {
      setCustomPeriodValid(false);
    }
  }, [customStartDate, customEndDate]);

  // Calcular datas baseadas no período selecionado
  const getDateRange = () => {
    const endDate = new Date();
    const startDate = new Date();

    if (selectedPeriod === 'custom') {
      return {
        startDate: customStartDate,
        endDate: customEndDate
      };
    }

    switch (selectedPeriod) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
    }

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };
  };

  const dateRange = getDateRange();
  const { analytics: analyticsData, loading, error, refresh } = useAnalytics({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate
  });

  // Dados padrão quando não há dados
  const defaultData = {
    totalIncome: 0,
    totalExpenses: 0,
    netIncome: 0,
    monthlyGrowth: 0,
    topCategories: [],
    monthlyData: []
  };

  const data = analyticsData ?? defaultData;

  useEffect(() => {
    if (selectedPeriod === 'custom' && customStartDate && customEndDate) {
      refresh();
    }
  }, [customStartDate, customEndDate, refresh]);

  const handlePeriodChange = (period: typeof selectedPeriod) => {
    setSelectedPeriod(period);
    if (period === 'custom') {
      setShowCustomDatePicker(true);
      // Definir datas padrão para o período personalizado
      if (!customStartDate || !customEndDate) {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 30);
        
        setCustomEndDate(end.toISOString().split('T')[0]);
        setCustomStartDate(start.toISOString().split('T')[0]);
      }
    } else {
      setShowCustomDatePicker(false);
    }
  };

  const handleApplyCustomPeriod = () => {
    if (customPeriodValid) {
      refresh();
    }
  };

  const handleCancelCustomPeriod = () => {
    setShowCustomDatePicker(false);
    setSelectedPeriod('30d');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  const savingsRate = data.totalIncome > 0 ? (data.netIncome / data.totalIncome) * 100 : 0;
  const expenseRatio = data.totalIncome > 0 ? (data.totalExpenses / data.totalIncome) * 100 : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
        <p className="text-red-400">Erro ao carregar dados: {error}</p>
        <button 
          onClick={refresh}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-cyan-100">Analytics</h1>
          <p className="text-gray-400">Visualize suas finanças em detalhes</p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Period Selector */}
          <div className="relative">
            <select
              value={selectedPeriod}
              onChange={(e) => handlePeriodChange(e.target.value as typeof selectedPeriod)}
              className={`bg-gray-800/70 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 appearance-none pr-8 ${
                settings.theme === 'light' ? 'bg-white/70 text-gray-900 border-gray-300' : ''
              }`}
            >
              <option value="7d">Últimos 7 dias</option>
              <option value="30d">Últimos 30 dias</option>
              <option value="90d">Últimos 90 dias</option>
              <option value="1y">Último ano</option>
              <option value="custom">Personalizado</option>
            </select>
            <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>
          
          {/* Custom Date Picker Modal */}
          {showCustomDatePicker && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className={`bg-gray-800 border border-gray-700 rounded-xl p-6 max-w-md w-full mx-4 ${
                settings.theme === 'light' ? 'bg-white border-gray-300' : ''
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-cyan-100">Período Personalizado</h3>
                  <button
                    onClick={handleCancelCustomPeriod}
                    className="text-gray-400 hover:text-gray-300"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="start-date" className="block text-sm font-medium text-gray-400 mb-2">
                      Data de Início
                    </label>
                    <div className="relative">
                      <input
                        id="start-date"
                        type="date"
                        value={customStartDate}
                        onChange={(e) => setCustomStartDate(e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                        className={`w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                          settings.theme === 'light' ? 'bg-gray-100 text-gray-900 border-gray-300' : ''
                        }`}
                      />
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="end-date" className="block text-sm font-medium text-gray-400 mb-2">
                      Data de Fim
                    </label>
                    <div className="relative">
                      <input
                        id="end-date"
                        type="date"
                        value={customEndDate}
                        onChange={(e) => setCustomEndDate(e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                        min={customStartDate}
                        className={`w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                          settings.theme === 'light' ? 'bg-gray-100 text-gray-900 border-gray-300' : ''
                        }`}
                      />
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  
                  {!customPeriodValid && customStartDate && customEndDate && (
                    <p className="text-red-400 text-sm">
                      Data de início deve ser anterior ou igual à data de fim
                    </p>
                  )}
                  
                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={handleCancelCustomPeriod}
                      className="flex-1 px-4 py-2 bg-gray-600 text-gray-100 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleApplyCustomPeriod}
                      disabled={!customPeriodValid}
                      className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Aplicar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Receita Total</p>
              <p className="text-2xl font-bold text-green-400">{formatCurrency(data.totalIncome)}</p>
              <p className="text-xs text-green-400 flex items-center mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                {formatPercentage(data.monthlyGrowth)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-500/20 rounded-lg">
              <TrendingDown className="h-6 w-6 text-red-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Gastos Totais</p>
              <p className="text-2xl font-bold text-red-400">{formatCurrency(data.totalExpenses)}</p>
              <p className="text-xs text-gray-400 mt-1">
                {expenseRatio.toFixed(1)}% da receita
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-cyan-500/20 rounded-lg">
              <DollarSign className="h-6 w-6 text-cyan-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Lucro Líquido</p>
              <p className="text-2xl font-bold text-cyan-400">{formatCurrency(data.netIncome)}</p>
              <p className="text-xs text-cyan-400 flex items-center mt-1">
                <Target className="h-3 w-3 mr-1" />
                {savingsRate.toFixed(1)}% poupança
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <BarChart3 className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Crescimento</p>
              <p className="text-2xl font-bold text-purple-400">{formatPercentage(data.monthlyGrowth)}</p>
              <p className="text-xs text-gray-400 mt-1">
                vs. mês anterior
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend Chart */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-cyan-100">Tendência Mensal</h2>
            <LineChart className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {data.monthlyData?.map((month: any) => (
              <div key={month.month} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 text-sm text-gray-400">{month.month}</div>
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    <div className="w-2 h-2 rounded-full bg-red-400"></div>
                    <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                  </div>
                </div>
                <div className="flex space-x-4 text-sm">
                  <span className="text-green-400">R$ {(month.income / 1000).toFixed(1)}k</span>
                  <span className="text-red-400">R$ {(month.expenses / 1000).toFixed(1)}k</span>
                  <span className="text-cyan-400">R$ {(month.net / 1000).toFixed(1)}k</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-center space-x-6 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span className="text-gray-400">Receita</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <span className="text-gray-400">Gastos</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
              <span className="text-gray-400">Líquido</span>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-cyan-100">Gastos por Categoria</h2>
            <PieChart className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {data.topCategories?.map((category: any) => (
              <div key={category.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className="text-gray-300">{category.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-gray-400 text-sm">{category.percentage}%</span>
                  <span className="text-gray-100 font-semibold">
                    {formatCurrency(category.amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Progress bars */}
          <div className="mt-6 space-y-3">
            {data.topCategories?.map((category: any) => (
              <div key={category.name} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">{category.name}</span>
                  <span className="text-gray-400">{category.percentage}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${category.percentage}%`,
                      backgroundColor: category.color
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Financial Health Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <Target className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-cyan-100">Taxa de Poupança</h3>
              <p className="text-gray-400 text-sm">Percentual economizado</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-2xl font-bold text-green-400">{savingsRate.toFixed(1)}%</span>
              <span className="text-sm text-gray-400">Meta: 20%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className="h-3 rounded-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-300"
                style={{ width: `${Math.min(savingsRate, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Wallet className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-cyan-100">Controle de Gastos</h3>
              <p className="text-gray-400 text-sm">Gastos vs. receita</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-2xl font-bold text-blue-400">{expenseRatio.toFixed(1)}%</span>
              <span className="text-sm text-gray-400">Meta: &lt;80%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-300 ${
                  (() => {
                    if (expenseRatio <= 60) return 'bg-gradient-to-r from-green-500 to-green-400';
                    if (expenseRatio <= 80) return 'bg-gradient-to-r from-yellow-500 to-yellow-400';
                    return 'bg-gradient-to-r from-red-500 to-red-400';
                  })()
                }`}
                style={{ width: `${Math.min(expenseRatio, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-cyan-100">Crescimento</h3>
              <p className="text-gray-400 text-sm">Tendência mensal</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className={`text-2xl font-bold ${
                data.monthlyGrowth >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {formatPercentage(data.monthlyGrowth)}
              </span>
              <span className="text-sm text-gray-400">vs. anterior</span>
            </div>
            <div className="flex items-center space-x-2">
              {data.monthlyGrowth >= 0 ? (
                <ArrowUpRight className="h-4 w-4 text-green-400" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-400" />
              )}
              <span className="text-sm text-gray-400">
                {data.monthlyGrowth >= 0 ? 'Crescimento positivo' : 'Crescimento negativo'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-cyan-100 mb-4">Insights Financeiros</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-700/30 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <h4 className="font-semibold text-green-400">Ótima taxa de poupança!</h4>
                <p className="text-gray-400 text-sm">
                  Você está poupando {savingsRate.toFixed(1)}% da sua receita, acima da média nacional.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-700/30 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <PieChart className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <h4 className="font-semibold text-yellow-400">Atenção aos gastos com alimentação</h4>
                <p className="text-gray-400 text-sm">
                  Alimentação representa 32% dos seus gastos. Considere otimizar este valor.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
