<<<<<<< HEAD
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Calendar, Download } from 'lucide-react';
import { LoadingScreen } from '../../components/ui/LoadingScreen';

export const ReportsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [_dateRange, _setDateRange] = useState({
    startDate: '',
    endDate: '',
  });

  // This would be implemented with a reports store
  const isLoading = false;
  const mockReports = {
    overview: {
      totalIncome: 15000,
      totalExpenses: 8500,
      netIncome: 6500,
      transactionCount: 45,
    },
    monthlyTrends: [
      { month: '2024-01', income: 12000, expenses: 7000 },
      { month: '2024-02', income: 14000, expenses: 8000 },
      { month: '2024-03', income: 15000, expenses: 8500 },
    ],
  };

  if (isLoading) {
    return <LoadingScreen message="Generating reports..." />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-cyber text-cyber-primary mb-2">
            Financial Reports
          </h1>
          <p className="text-foreground-secondary">
            Analyze your financial data and trends
          </p>
        </div>

        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 bg-background-secondary border border-border rounded-lg focus:ring-2 focus:ring-cyber-primary"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          
          <button className="flex items-center space-x-2 px-4 py-2 bg-cyber-primary text-cyber-dark rounded-lg hover:bg-cyber-secondary transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div className="bg-background-secondary border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Total Income</h3>
            <TrendingUp className="w-6 h-6 text-cyber-accent" />
          </div>
          <div className="text-3xl font-cyber text-cyber-accent mb-2">
            ${mockReports.overview.totalIncome.toLocaleString()}
          </div>
          <p className="text-sm text-foreground-secondary">+12% from last period</p>
        </div>

        <div className="bg-background-secondary border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Total Expenses</h3>
            <BarChart3 className="w-6 h-6 text-cyber-danger" />
          </div>
          <div className="text-3xl font-cyber text-cyber-danger mb-2">
            ${mockReports.overview.totalExpenses.toLocaleString()}
          </div>
          <p className="text-sm text-foreground-secondary">-5% from last period</p>
        </div>

        <div className="bg-background-secondary border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Net Income</h3>
            <TrendingUp className="w-6 h-6 text-cyber-primary" />
          </div>
          <div className="text-3xl font-cyber text-cyber-primary mb-2">
            ${mockReports.overview.netIncome.toLocaleString()}
          </div>
          <p className="text-sm text-foreground-secondary">+25% from last period</p>
        </div>

        <div className="bg-background-secondary border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Transactions</h3>
            <Calendar className="w-6 h-6 text-cyber-warning" />
          </div>
          <div className="text-3xl font-cyber text-cyber-warning mb-2">
            {mockReports.overview.transactionCount}
          </div>
          <p className="text-sm text-foreground-secondary">This period</p>
        </div>
      </motion.div>

      {/* Chart Placeholders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-background-secondary border border-border rounded-xl p-6"
        >
          <h3 className="text-xl font-semibold text-foreground mb-6">Income vs Expenses</h3>
          <div className="h-64 flex items-center justify-center border border-border-secondary rounded-lg">
            <p className="text-foreground-muted">Chart will be implemented here</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-background-secondary border border-border rounded-xl p-6"
        >
          <h3 className="text-xl font-semibold text-foreground mb-6">Category Breakdown</h3>
          <div className="h-64 flex items-center justify-center border border-border-secondary rounded-lg">
            <p className="text-foreground-muted">Pie chart will be implemented here</p>
          </div>
        </motion.div>
      </div>

      {/* Monthly Trends */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-background-secondary border border-border rounded-xl p-6"
      >
        <h3 className="text-xl font-semibold text-foreground mb-6">Monthly Trends</h3>
        <div className="h-80 flex items-center justify-center border border-border-secondary rounded-lg">
          <p className="text-foreground-muted">Line chart will be implemented here</p>
        </div>
      </motion.div>
    </div>
  );
};
    try {
      const response = await fetch('/api/reports', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setReports(data.reports || INITIAL_REPORT_DATA);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar relatórios');
      setReports(INITIAL_REPORT_DATA);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    let hasLoaded = false;

    const loadReports = async () => {
      if (!hasLoaded && isMounted && user && token) {
        hasLoaded = true;
        await fetchReports();
      }
    };

    loadReports();

    return () => {
      isMounted = false;
    };
  }, [user, token]);

  if (isLoading) {
    return <LoadingScreen message="🔍 Analisando dados financeiros..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      {/* Cyber Grid Background */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="relative z-10 space-y-8">
        {/* Header with Cyber Effects */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <div className="relative bg-gray-900/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-6 lg:mb-0">
                <h1 className="text-3xl font-bold text-cyan-400 mb-2 flex items-center">
                  <BarChart3 className="mr-3" size={32} />
                  Sistema de Relatórios
                  <Zap className="ml-2 text-yellow-400" size={20} />
                </h1>
                <p className="text-purple-300 text-lg">
                  Análise Financeira com IA • Insights Preditivos • Performance Neural
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <div className="flex gap-2">
                  {['overview', 'trends', 'categories'].map((mode) => (
                    <motion.button
                      key={mode}
                      onClick={() => setAnalysisMode(mode)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        analysisMode === mode
                          ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/25'
                          : 'bg-gray-800/50 border border-cyan-500/30 text-cyan-400 hover:border-cyan-500/50 hover:bg-gray-800/80'
                      }`}
                    >
                      {mode === 'overview' && 'Visão Geral'}
                      {mode === 'trends' && 'Tendências'}
                      {mode === 'categories' && 'Categorias'}
                    </motion.button>
                  ))}
                </div>

                <div className="flex gap-2">
                  {['weekly', 'monthly', 'yearly'].map((period) => (
                    <motion.button
                      key={period}
                      onClick={() => setSelectedPeriod(period)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        selectedPeriod === period
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                          : 'bg-gray-800/50 border border-purple-500/30 text-purple-400 hover:border-purple-500/50 hover:bg-gray-800/80'
                      }`}
                    >
                      {period === 'weekly' && 'Semanal'}
                      {period === 'monthly' && 'Mensal'}
                      {period === 'yearly' && 'Anual'}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Error state */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 bg-red-900/50 backdrop-blur border border-red-500/30 rounded-xl p-4"
              >
                <div className="flex items-center gap-3">
                  <Settings className="text-red-400" size={24} />
                  <div>
                    <h3 className="text-red-400 font-semibold">Erro ao carregar relatórios</h3>
                    <p className="text-red-300 text-sm">{error}</p>
                    <button
                      onClick={fetchReports}
                      className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Tentar Novamente
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Financial Overview Cards with Real Data */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Receita Total',
              value: reports.overview.totalIncome,
              icon: TrendingUp,
              color: 'text-green-400',
              bgGradient: 'bg-gradient-to-br from-green-900/40 via-green-800/30 to-emerald-900/40',
              borderColor: 'border-green-500/30',
              glowColor: 'shadow-green-500/20'
            },
            {
              title: 'Despesas Totais', 
              value: reports.overview.totalExpenses,
              icon: DollarSign,
              color: 'text-red-400',
              bgGradient: 'bg-gradient-to-br from-red-900/40 via-red-800/30 to-rose-900/40',
              borderColor: 'border-red-500/30',
              glowColor: 'shadow-red-500/20'
            },
            {
              title: 'Lucro Líquido',
              value: reports.overview.netIncome,
              icon: Target,
              color: 'text-cyan-400',
              bgGradient: 'bg-gradient-to-br from-cyan-900/40 via-cyan-800/30 to-teal-900/40',
              borderColor: 'border-cyan-500/30', 
              glowColor: 'shadow-cyan-500/20'
            },
            {
              title: 'Transações',
              value: reports.overview.transactionCount,
              icon: Activity,
              color: 'text-purple-400',
              bgGradient: 'bg-gradient-to-br from-purple-900/40 via-purple-800/30 to-violet-900/40',
              borderColor: 'border-purple-500/30',
              glowColor: 'shadow-purple-500/20',
              isCount: true
            }
          ].map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative group cursor-pointer ${card.bgGradient} backdrop-blur border ${card.borderColor} rounded-xl p-6 hover:shadow-2xl ${card.glowColor} hover:border-opacity-80 hover:scale-105 transition-all duration-300`}
            >
              {/* Holographic Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-400 text-sm font-medium uppercase tracking-wide">{card.title}</p>
                  <card.icon className={`${card.color} group-hover:scale-110 transition-transform`} size={24} />
                </div>
                
                <div className="space-y-2">
                  <p className={`text-2xl lg:text-3xl font-bold ${card.color} group-hover:text-white transition-colors`}>
                    {card.isCount
                      ? card.value.toLocaleString('pt-BR')
                      : card.value.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })
                    }
                  </p>
                  
                  {/* Neural Activity Indicator */}
                  <div className="flex items-center space-x-1">
                    <div className={`w-2 h-2 rounded-full ${card.color} animate-pulse`} />
                    <div className={`w-2 h-2 rounded-full ${card.color} animate-pulse`} style={{ animationDelay: '0.5s' }} />
                    <div className={`w-2 h-2 rounded-full ${card.color} animate-pulse`} style={{ animationDelay: '1s' }} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Advanced Analysis Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-900/80 backdrop-blur border border-purple-500/30 rounded-2xl p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-purple-400 flex items-center">
              <Eye className="mr-3" size={28} />
              Análise Detalhada
              <div className="ml-3 px-3 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                Real Time
              </div>
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all"
            >
              <Download size={18} />
              Exportar
            </motion.button>
          </div>

          <div className="text-center py-12 text-gray-400">
            <Activity className="mx-auto mb-4" size={48} />
            <p className="text-lg">Análise avançada disponível com dados reais</p>
            <p className="text-sm mt-2">Sistema aguardando dados do backend para gerar insights</p>
          </div>
        </motion.div>

        {/* Trends Section - Basic Implementation */}
        {reports.monthlyTrends.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-900/80 backdrop-blur border border-cyan-500/30 rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-cyan-400 flex items-center mb-6">
              <TrendingUp className="mr-3" size={28} />
              Tendências Mensais
            </h2>
            
            <div className="space-y-4">
              {reports.monthlyTrends.map((trend, index) => (
                <div key={trend.month} className="bg-gray-800/50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">{trend.month}</span>
                    <div className="flex gap-4">
                      <span className="text-green-400">
                        Receitas: {trend.income.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                      <span className="text-red-400">
                        Despesas: {trend.expenses.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Categories Section - Basic Implementation */}
        {reports.categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gray-900/80 backdrop-blur border border-yellow-500/30 rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold text-yellow-400 flex items-center mb-6">
              <BarChart3 className="mr-3" size={28} />
              Análise por Categorias
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reports.categories.map((category, index) => (
                <div key={category.name} className="bg-gray-800/50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">{category.name}</span>
                    <span className="text-sm text-gray-400">{category.percentage}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-white font-semibold">
                      {category.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
=======
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Calendar, Download } from 'lucide-react';
import { LoadingScreen } from '../../components/ui/LoadingScreen';

export const ReportsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [_dateRange, _setDateRange] = useState({
    startDate: '',
    endDate: '',
  });

  // This would be implemented with a reports store
  const isLoading = false;
  const mockReports = {
    overview: {
      totalIncome: 15000,
      totalExpenses: 8500,
      netIncome: 6500,
      transactionCount: 45,
    },
    monthlyTrends: [
      { month: '2024-01', income: 12000, expenses: 7000 },
      { month: '2024-02', income: 14000, expenses: 8000 },
      { month: '2024-03', income: 15000, expenses: 8500 },
    ],
  };

  if (isLoading) {
    return <LoadingScreen message="Generating reports..." />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-cyber text-cyber-primary mb-2">
            Financial Reports
          </h1>
          <p className="text-foreground-secondary">
            Analyze your financial data and trends
          </p>
        </div>

        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 bg-background-secondary border border-border rounded-lg focus:ring-2 focus:ring-cyber-primary"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
          
          <button className="flex items-center space-x-2 px-4 py-2 bg-cyber-primary text-cyber-dark rounded-lg hover:bg-cyber-secondary transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <div className="bg-background-secondary border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Total Income</h3>
            <TrendingUp className="w-6 h-6 text-cyber-accent" />
          </div>
          <div className="text-3xl font-cyber text-cyber-accent mb-2">
            ${mockReports.overview.totalIncome.toLocaleString()}
          </div>
          <p className="text-sm text-foreground-secondary">+12% from last period</p>
        </div>

        <div className="bg-background-secondary border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Total Expenses</h3>
            <BarChart3 className="w-6 h-6 text-cyber-danger" />
          </div>
          <div className="text-3xl font-cyber text-cyber-danger mb-2">
            ${mockReports.overview.totalExpenses.toLocaleString()}
          </div>
          <p className="text-sm text-foreground-secondary">-5% from last period</p>
        </div>

        <div className="bg-background-secondary border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Net Income</h3>
            <TrendingUp className="w-6 h-6 text-cyber-primary" />
          </div>
          <div className="text-3xl font-cyber text-cyber-primary mb-2">
            ${mockReports.overview.netIncome.toLocaleString()}
          </div>
          <p className="text-sm text-foreground-secondary">+25% from last period</p>
        </div>

        <div className="bg-background-secondary border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Transactions</h3>
            <Calendar className="w-6 h-6 text-cyber-warning" />
          </div>
          <div className="text-3xl font-cyber text-cyber-warning mb-2">
            {mockReports.overview.transactionCount}
          </div>
          <p className="text-sm text-foreground-secondary">This period</p>
        </div>
      </motion.div>

      {/* Chart Placeholders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-background-secondary border border-border rounded-xl p-6"
        >
          <h3 className="text-xl font-semibold text-foreground mb-6">Income vs Expenses</h3>
          <div className="h-64 flex items-center justify-center border border-border-secondary rounded-lg">
            <p className="text-foreground-muted">Chart will be implemented here</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-background-secondary border border-border rounded-xl p-6"
        >
          <h3 className="text-xl font-semibold text-foreground mb-6">Category Breakdown</h3>
          <div className="h-64 flex items-center justify-center border border-border-secondary rounded-lg">
            <p className="text-foreground-muted">Pie chart will be implemented here</p>
          </div>
        </motion.div>
      </div>

      {/* Monthly Trends */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-background-secondary border border-border rounded-xl p-6"
      >
        <h3 className="text-xl font-semibold text-foreground mb-6">Monthly Trends</h3>
        <div className="h-80 flex items-center justify-center border border-border-secondary rounded-lg">
          <p className="text-foreground-muted">Line chart will be implemented here</p>
        </div>
      </motion.div>
    </div>
  );
};
>>>>>>> 19ae9cf82eb63c5cfccf5974311e9c254540a7d3
