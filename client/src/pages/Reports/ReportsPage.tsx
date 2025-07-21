import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Download,
  PieChart,
  Activity,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ModernCard } from '../../components/ui/ModernCard';
import { ModernButton } from '../../components/ui/ModernButton';

interface ReportData {
  overview: {
    totalIncome: number;
    totalExpenses: number;
    netIncome: number;
    transactionCount: number;
    avgTransaction: number;
  };
  monthlyData: Array<{
    month: string;
    income: number;
    expenses: number;
    net: number;
  }>;
  categoryBreakdown: Array<{
    category: string;
    amount: number;
    percentage: number;
    color: string;
  }>;
  trends: {
    incomeGrowth: number;
    expenseGrowth: number;
    topCategory: string;
  };
}

export const ReportsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadReports();
  }, [selectedPeriod]);

  const loadReports = async () => {
    setLoading(true);
    try {
      // Mock data - em app real viria da API
      const mockReports: ReportData = {
        overview: {
          totalIncome: 15000.00,
          totalExpenses: 8500.75,
          netIncome: 6499.25,
          transactionCount: 45,
          avgTransaction: 522.24
        },
        monthlyData: [
          { month: 'Jan', income: 12000, expenses: 7000, net: 5000 },
          { month: 'Feb', income: 13500, expenses: 7500, net: 6000 },
          { month: 'Mar', income: 14000, expenses: 8000, net: 6000 },
          { month: 'Apr', income: 14500, expenses: 8200, net: 6300 },
          { month: 'May', income: 15000, expenses: 8500, net: 6500 },
          { month: 'Jun', income: 15500, expenses: 8800, net: 6700 },
        ],
        categoryBreakdown: [
          { category: 'Alimentação', amount: 2500, percentage: 29.4, color: '#10B981' },
          { category: 'Transporte', amount: 1800, percentage: 21.2, color: '#F59E0B' },
          { category: 'Moradia', amount: 1200, percentage: 14.1, color: '#EF4444' },
          { category: 'Entretenimento', amount: 900, percentage: 10.6, color: '#8B5CF6' },
          { category: 'Utilidades', amount: 700, percentage: 8.2, color: '#06B6D4' },
          { category: 'Saúde', amount: 600, percentage: 7.1, color: '#EC4899' },
          { category: 'Outros', amount: 800, percentage: 9.4, color: '#6B7280' }
        ],
        trends: {
          incomeGrowth: 12.5,
          expenseGrowth: 8.3,
          topCategory: 'Alimentação'
        }
      };

      await new Promise(resolve => setTimeout(resolve, 1000));
      setReportData(mockReports);
    } catch (error) {
      // Error handled by toast notification
      toast.error('Erro ao carregar relatórios');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  if (loading || !reportData) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-300 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-300 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80 bg-gray-300 rounded-lg"></div>
            <div className="h-80 bg-gray-300 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Financial Reports
          </h1>
          <p className="text-text-secondary">
            Comprehensive analysis of your financial data
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 bg-background/50 border border-primary/20 rounded-lg text-white focus:outline-none focus:border-primary"
          >
            <option value="weekly">This Week</option>
            <option value="monthly">This Month</option>
            <option value="quarterly">This Quarter</option>
            <option value="yearly">This Year</option>
          </select>
          <ModernButton
            onClick={() => toast.success('Report downloaded!')}
            variant="primary"
            icon={Download}
            iconPosition="left"
          >
            Export PDF
          </ModernButton>
        </div>
      </motion.div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <ModernCard
          title="Total Income"
          value={formatCurrency(reportData.overview.totalIncome)}
          icon={ArrowUpRight}
          color="green"
          trend={{
            direction: reportData.trends.incomeGrowth >= 0 ? "up" : "down",
            percentage: Math.abs(reportData.trends.incomeGrowth)
          }}
          glassmorphism
          neonBorder
        />
        <ModernCard
          title="Total Expenses"
          value={formatCurrency(reportData.overview.totalExpenses)}
          icon={ArrowDownRight}
          color="red"
          trend={{
            direction: reportData.trends.expenseGrowth >= 0 ? "up" : "down",
            percentage: Math.abs(reportData.trends.expenseGrowth)
          }}
          glassmorphism
          neonBorder
        />
        <ModernCard
          title="Net Income"
          value={formatCurrency(reportData.overview.netIncome)}
          icon={DollarSign}
          color="blue"
          trend={{
            direction: (reportData.trends.incomeGrowth - reportData.trends.expenseGrowth) >= 0 ? "up" : "down",
            percentage: Math.abs(reportData.trends.incomeGrowth - reportData.trends.expenseGrowth)
          }}
          glassmorphism
          neonBorder
        />
        <ModernCard
          title="Avg Transaction"
          value={formatCurrency(reportData.overview.avgTransaction)}
          icon={Activity}
          color="purple"
          subtitle={`${reportData.overview.transactionCount} transactions`}
          glassmorphism
          neonBorder
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card/30 backdrop-blur-sm border border-primary/20 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Monthly Trends</h3>
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          
          <div className="space-y-4">
            {reportData.monthlyData.slice(-6).map((data) => (
              <div key={data.month} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">{data.month}</span>
                  <span className="text-white font-medium">{formatCurrency(data.net)}</span>
                </div>
                <div className="flex space-x-2 h-2">
                  <div 
                    className="bg-green-500 rounded"
                    style={{ width: `${(data.income / 20000) * 100}%` }}
                  ></div>
                  <div 
                    className="bg-red-500 rounded"
                    style={{ width: `${(data.expenses / 20000) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center space-x-6 mt-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-text-secondary">Income</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-text-secondary">Expenses</span>
            </div>
          </div>
        </motion.div>

        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-card/30 backdrop-blur-sm border border-primary/20 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Expense Categories</h3>
            <PieChart className="w-5 h-5 text-primary" />
          </div>
          
          <div className="space-y-3">
            {reportData.categoryBreakdown.map((category, index) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className="text-white text-sm">{category.category}</span>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium text-sm">{formatCurrency(category.amount)}</p>
                  <p className="text-text-secondary text-xs">{category.percentage}%</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Insights Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-card/30 backdrop-blur-sm border border-primary/20 rounded-xl p-6"
      >
        <div className="flex items-center space-x-3 mb-6">
          <FileText className="w-6 h-6 text-primary" />
          <h3 className="text-lg font-semibold text-white">Financial Insights</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-background/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <h4 className="font-medium text-white">Income Growth</h4>
            </div>
            <p className="text-green-400 text-2xl font-bold mb-1">{formatPercentage(reportData.trends.incomeGrowth)}</p>
            <p className="text-text-secondary text-sm">Compared to last period</p>
          </div>

          <div className="bg-background/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingDown className="w-5 h-5 text-red-400" />
              <h4 className="font-medium text-white">Expense Growth</h4>
            </div>
            <p className="text-red-400 text-2xl font-bold mb-1">{formatPercentage(reportData.trends.expenseGrowth)}</p>
            <p className="text-text-secondary text-sm">Keep an eye on spending</p>
          </div>

          <div className="bg-background/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <PieChart className="w-5 h-5 text-yellow-400" />
              <h4 className="font-medium text-white">Top Category</h4>
            </div>
            <p className="text-yellow-400 text-lg font-bold mb-1">{reportData.trends.topCategory}</p>
            <p className="text-text-secondary text-sm">Highest spending category</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};