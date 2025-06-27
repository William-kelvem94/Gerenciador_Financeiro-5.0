import { useState } from 'react';
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
  Wallet
} from 'lucide-react';

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

const mockAnalyticsData: AnalyticsData = {
  totalIncome: 12500.00,
  totalExpenses: 8750.30,
  netIncome: 3749.70,
  monthlyGrowth: 12.5,
  topCategories: [
    { name: 'Alimentação', amount: 2800.50, percentage: 32, color: '#06b6d4' },
    { name: 'Transporte', amount: 1950.00, percentage: 22, color: '#8b5cf6' },
    { name: 'Moradia', amount: 1800.80, percentage: 21, color: '#10b981' },
    { name: 'Entretenimento', amount: 1200.75, percentage: 14, color: '#f59e0b' },
    { name: 'Outros', amount: 998.25, percentage: 11, color: '#ef4444' }
  ],
  monthlyData: [
    { month: 'Jul', income: 10800, expenses: 7200, net: 3600 },
    { month: 'Ago', income: 11200, expenses: 7800, net: 3400 },
    { month: 'Set', income: 11800, expenses: 8100, net: 3700 },
    { month: 'Out', income: 12000, expenses: 8300, net: 3700 },
    { month: 'Nov', income: 12200, expenses: 8500, net: 3700 },
    { month: 'Dez', income: 12500, expenses: 8750, net: 3750 }
  ]
};

export function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [analyticsData] = useState<AnalyticsData>(mockAnalyticsData);

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

  const savingsRate = (analyticsData.netIncome / analyticsData.totalIncome) * 100;
  const expenseRatio = (analyticsData.totalExpenses / analyticsData.totalIncome) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-cyan-100">Analytics</h1>
          <p className="text-gray-400">Visualize suas finanças em detalhes</p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as typeof selectedPeriod)}
            className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="90d">Últimos 90 dias</option>
            <option value="1y">Último ano</option>
          </select>
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
              <p className="text-2xl font-bold text-green-400">{formatCurrency(analyticsData.totalIncome)}</p>
              <p className="text-xs text-green-400 flex items-center mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                {formatPercentage(analyticsData.monthlyGrowth)}
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
              <p className="text-2xl font-bold text-red-400">{formatCurrency(analyticsData.totalExpenses)}</p>
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
              <p className="text-2xl font-bold text-cyan-400">{formatCurrency(analyticsData.netIncome)}</p>
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
              <p className="text-2xl font-bold text-purple-400">{formatPercentage(analyticsData.monthlyGrowth)}</p>
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
            {analyticsData.monthlyData.map((month) => (
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
            {analyticsData.topCategories.map((category) => (
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
            {analyticsData.topCategories.map((category) => (
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
                  expenseRatio <= 60 ? 'bg-gradient-to-r from-green-500 to-green-400' :
                  expenseRatio <= 80 ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                  'bg-gradient-to-r from-red-500 to-red-400'
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
                analyticsData.monthlyGrowth >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {formatPercentage(analyticsData.monthlyGrowth)}
              </span>
              <span className="text-sm text-gray-400">vs. anterior</span>
            </div>
            <div className="flex items-center space-x-2">
              {analyticsData.monthlyGrowth >= 0 ? (
                <ArrowUpRight className="h-4 w-4 text-green-400" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-400" />
              )}
              <span className="text-sm text-gray-400">
                {analyticsData.monthlyGrowth >= 0 ? 'Crescimento positivo' : 'Crescimento negativo'}
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
