import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  PieChart,
  Activity,
  Plus,
  BarChart3,
  Target,
  Zap
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { ModernCard } from '../../components/ui/ModernCard';
import { ModernButton } from '../../components/ui/ModernButton';
import toast from 'react-hot-toast';

interface DashboardStats {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  transactionCount: number;
}

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    transactionCount: 0
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Mock data for now - in real app would fetch from API
      const mockStats = {
        totalBalance: 15750.45,
        monthlyIncome: 8500.00,
        monthlyExpenses: 3200.75,
        transactionCount: 42
      };
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats(mockStats);
    } catch {
      toast.error('Failed to load dashboard data');
      // Error handled, no need to log
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
            Welcome back, {user?.name || 'User'}! 👋
          </h1>
          <p className="text-text-secondary">
            Here's what's happening with your finances today.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <ModernButton
            onClick={loadDashboardData}
            disabled={loading}
            loading={loading}
            variant="primary"
            glow
          >
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </ModernButton>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ModernCard
          title="Total Balance"
          value={formatCurrency(stats.totalBalance)}
          icon={DollarSign}
          color="green"
          trend={{ direction: 'up', percentage: 12.5 }}
          isLoading={loading}
          glassmorphism
          neonBorder
        />
        <ModernCard
          title="Monthly Income"
          value={formatCurrency(stats.monthlyIncome)}
          icon={TrendingUp}
          color="blue"
          trend={{ direction: 'up', percentage: 8.2 }}
          isLoading={loading}
          glassmorphism
          neonBorder
        />
        <ModernCard
          title="Monthly Expenses"
          value={formatCurrency(stats.monthlyExpenses)}
          icon={TrendingDown}
          color="red"
          trend={{ direction: 'down', percentage: 5.1 }}
          isLoading={loading}
          glassmorphism
          neonBorder
        />
        <ModernCard
          title="Transactions"
          value={stats.transactionCount.toString()}
          icon={Activity}
          color="purple"
          isLoading={loading}
          glassmorphism
          neonBorder
        />
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card/30 backdrop-blur-sm border border-primary/20 rounded-xl p-6"
      >
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
          <PieChart className="w-5 h-5 mr-2" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ModernButton
            variant="ghost"
            size="lg"
            icon={Plus}
            className="!justify-start !h-auto !p-4 !flex-col !items-start"
            onClick={() => toast.success('Add Transaction clicked!')}
          >
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-6 h-6 text-blue-400" />
              <span className="font-medium text-white">Add Transaction</span>
            </div>
            <span className="text-sm text-gray-400">Record income or expense</span>
          </ModernButton>
          
          <ModernButton
            variant="ghost"
            size="lg"
            icon={BarChart3}
            className="!justify-start !h-auto !p-4 !flex-col !items-start"
            onClick={() => toast.success('View Reports clicked!')}
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-6 h-6 text-green-400" />
              <span className="font-medium text-white">View Reports</span>
            </div>
            <span className="text-sm text-gray-400">Analyze your spending</span>
          </ModernButton>
          
          <ModernButton
            variant="ghost"
            size="lg"
            icon={Target}
            className="!justify-start !h-auto !p-4 !flex-col !items-start"
            onClick={() => toast.success('Manage Budgets clicked!')}
          >
            <div className="flex items-center gap-2 mb-2">
              <PieChart className="w-6 h-6 text-purple-400" />
              <span className="font-medium text-white">Manage Budgets</span>
            </div>
            <span className="text-sm text-gray-400">Set spending limits</span>
          </ModernButton>
          
          <ModernButton
            variant="ghost"
            size="lg"
            icon={Zap}
            className="!justify-start !h-auto !p-4 !flex-col !items-start"
            onClick={() => toast.success('Set Goals clicked!')}
          >
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-6 h-6 text-yellow-400" />
              <span className="font-medium text-white">Set Goals</span>
            </div>
            <span className="text-sm text-gray-400">Plan your savings</span>
          </ModernButton>
        </div>
      </motion.div>

      {/* Recent Activity Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card/30 backdrop-blur-sm border border-primary/20 rounded-xl p-6"
      >
        <h2 className="text-xl font-semibold text-white mb-4">Recent Transactions</h2>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-300 rounded animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="text-text-secondary text-center py-8">
            <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No recent transactions</p>
            <p className="text-sm">Add your first transaction to get started!</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}