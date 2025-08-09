import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  PiggyBank,
  Activity,
  Target,
  Zap,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  BarChart3,
  Users,
  Globe
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

interface DashboardStats {
  income: number;
  expenses: number;
  balance: number;
  transactionCount: number;
}

const TIMEOUT_DURATION = 10000; // 10 segundos

const INITIAL_STATS_STATE: DashboardStats = {
  income: 0,
  expenses: 0,
  balance: 0,
  transactionCount: 0
};

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function validateDashboardData(data: any): data is DashboardStats {
  return (
    data &&
    typeof data.income === 'number' && Number.isFinite(data.income) &&
    typeof data.expenses === 'number' && Number.isFinite(data.expenses) &&
    typeof data.balance === 'number' && Number.isFinite(data.balance) &&
    typeof data.transactionCount === 'number' && Number.isInteger(data.transactionCount) && data.transactionCount >= 0
  );
}

interface CyberStatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  color?: 'cyan' | 'pink' | 'green' | 'purple';
  delay?: number;
}

const CyberStatCard: React.FC<CyberStatCardProps> = ({
  icon,
  label,
  value,
  change,
  changeType = 'neutral',
  color = 'cyan',
  delay = 0
}) => {
  const colorClasses = {
    cyan: 'border-cyan-400/30 hover:border-cyan-400/60 text-cyan-400',
    pink: 'border-pink-400/30 hover:border-pink-400/60 text-pink-400',
    green: 'border-green-400/30 hover:border-green-400/60 text-green-400',
    purple: 'border-purple-400/30 hover:border-purple-400/60 text-purple-400'
  };

  const changeColors = {
    positive: 'text-green-400',
    negative: 'text-red-400',
    neutral: 'text-gray-400'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={clsx(
        'group relative bg-gray-900/60 backdrop-blur-lg border rounded-xl p-6',
        'transition-all duration-300 ease-in-out transform hover:scale-105',
        'hover:shadow-2xl cursor-pointer overflow-hidden',
        colorClasses[color]
      )}
      style={{
        boxShadow: `0 8px 32px rgba(0, 255, 255, 0.1)`,
      }}
    >
      {/* Glow Effect Background */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className={clsx(
          'absolute inset-0 bg-gradient-to-br opacity-5',
          color === 'cyan' && 'from-cyan-400/20 to-blue-600/20',
          color === 'pink' && 'from-pink-400/20 to-purple-600/20',
          color === 'green' && 'from-green-400/20 to-emerald-600/20',
          color === 'purple' && 'from-purple-400/20 to-indigo-600/20'
        )} />
      </div>

      {/* Top Border Glow */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-70" />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon and Change Indicator */}
        <div className="flex items-start justify-between mb-4">
          <div className={clsx(
            'p-3 rounded-lg bg-gray-800/50 backdrop-blur border border-current/20',
            'group-hover:bg-current/10 transition-colors duration-300'
          )}>
            {React.cloneElement(icon as React.ReactElement, {
              className: 'w-6 h-6 text-current'
            })}
          </div>
          
          {change && (
            <div className={clsx(
              'flex items-center space-x-1 text-sm font-mono',
              changeColors[changeType]
            )}>
              {changeType === 'positive' && <ArrowUpRight className="w-4 h-4" />}
              {changeType === 'negative' && <ArrowDownRight className="w-4 h-4" />}
              <span>{change}</span>
            </div>
          )}
        </div>

        {/* Label */}
        <h3 className="text-gray-300 text-sm font-medium mb-2 group-hover:text-white transition-colors duration-300">
          {label}
        </h3>

        {/* Value */}
        <div className="space-y-1">
          <p className={clsx(
            'text-2xl font-bold font-mono tracking-tight',
            'group-hover:text-glow transition-all duration-300'
          )}>
            {value}
          </p>
        </div>
      </div>

      {/* Animated Border */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 rounded-xl border border-current/50 animate-pulse" />
      </div>

      {/* Scan Line Effect */}
      <div className="absolute inset-0 overflow-hidden rounded-xl">
        <div className={clsx(
          'absolute top-0 left-0 w-full h-px bg-current opacity-0',
          'group-hover:opacity-100 group-hover:animate-pulse'
        )} />
      </div>
    </motion.div>
  );
};

// Quick Action Button Component
interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick: () => void;
  color?: 'cyan' | 'pink' | 'green' | 'purple';
}

const QuickAction: React.FC<QuickActionProps> = ({
  icon,
  label,
  description,
  onClick,
  color = 'cyan'
}) => {
  const colorClasses = {
    cyan: 'border-cyan-400/30 hover:border-cyan-400 hover:bg-cyan-400/10 text-cyan-400',
    pink: 'border-pink-400/30 hover:border-pink-400 hover:bg-pink-400/10 text-pink-400',
    green: 'border-green-400/30 hover:border-green-400 hover:bg-green-400/10 text-green-400',
    purple: 'border-purple-400/30 hover:border-purple-400 hover:bg-purple-400/10 text-purple-400'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={clsx(
        'group w-full p-4 bg-gray-900/40 backdrop-blur-lg border rounded-lg',
        'transition-all duration-300 text-left hover:shadow-lg',
        colorClasses[color]
      )}
    >
      <div className="flex items-start space-x-3">
        <div className="p-2 rounded-lg bg-current/10 border border-current/20">
          {React.cloneElement(icon as React.ReactElement, {
            className: 'w-5 h-5 text-current'
          })}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white group-hover:text-current transition-colors">
            {label}
          </h3>
          <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
            {description}
          </p>
        </div>
        <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-current transition-colors" />
      </div>
    </motion.button>
  );
};

export default function CyberDashboard() {
  const [stats, setStats] = useState<DashboardStats>(INITIAL_STATS_STATE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeoutReached, setTimeoutReached] = useState(false);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const fetchDashboardData = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      setTimeoutReached(true);
      setLoading(false);
      setError('Timeout: A requisição demorou mais que o esperado');
    }, TIMEOUT_DURATION);

    try {
      setError(null);
      setTimeoutReached(false);
      
      // Simulated API call with demo data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData = {
        income: 15750.00,
        expenses: 8920.50,
        balance: 6829.50,
        transactionCount: 47
      };

      clearTimeout(timeoutId);
      
      if (validateDashboardData(mockData)) {
        setStats(mockData);
      } else {
        throw new Error('Dados do dashboard inválidos recebidos do servidor');
      }
    } catch (err) {
      clearTimeout(timeoutId);
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao carregar dados';
      setError(errorMessage);
      console.error('Erro ao buscar dados do dashboard:', err);
    } finally {
      if (!timeoutReached) {
        setLoading(false);
      }
    }
  }, [user?.id, timeoutReached]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const quickActions = [
    {
      icon: <DollarSign />,
      label: 'Nova Transação',
      description: 'Adicionar receita ou despesa',
      onClick: () => navigate('/transactions/new'),
      color: 'cyan' as const
    },
    {
      icon: <Target />,
      label: 'Metas Financeiras',
      description: 'Gerenciar objetivos',
      onClick: () => navigate('/goals'),
      color: 'green' as const
    },
    {
      icon: <BarChart3 />,
      label: 'Relatórios',
      description: 'Visualizar análises',
      onClick: () => navigate('/reports'),
      color: 'purple' as const
    },
    {
      icon: <CreditCard />,
      label: 'Cartões',
      description: 'Gerenciar cartões',
      onClick: () => navigate('/cards'),
      color: 'pink' as const
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-cyan-400 font-mono">Carregando dados financeiros...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-red-900/20 border border-red-500/30 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-400 mb-2">Erro no Sistema</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="btn-cyberpunk text-sm"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-400/5 rounded-full blur-3xl" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl md:text-6xl font-cyber font-black text-glow animate-pulse-glow">
            WILL FINANCE 5.0
          </h1>
          <p className="text-xl text-gray-400 font-mono">
            Bem-vindo, <span className="text-cyan-400">{user?.name || 'Usuário'}</span>
          </p>
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto" />
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <CyberStatCard
            icon={<TrendingUp />}
            label="Receitas Totais"
            value={formatCurrency(stats.income)}
            change="+12.5%"
            changeType="positive"
            color="green"
            delay={0.1}
          />
          <CyberStatCard
            icon={<TrendingDown />}
            label="Despesas Totais"
            value={formatCurrency(stats.expenses)}
            change="-5.2%"
            changeType="negative"
            color="pink"
            delay={0.2}
          />
          <CyberStatCard
            icon={<Wallet />}
            label="Saldo Atual"
            value={formatCurrency(stats.balance)}
            change="+8.7%"
            changeType="positive"
            color="cyan"
            delay={0.3}
          />
          <CyberStatCard
            icon={<Activity />}
            label="Transações"
            value={stats.transactionCount.toString()}
            change="+3"
            changeType="positive"
            color="purple"
            delay={0.4}
          />
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="space-y-6"
        >
          <div className="text-center">
            <h2 className="text-2xl font-cyber font-bold text-cyan-400 mb-2">
              Ações Rápidas
            </h2>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <QuickAction
                key={action.label}
                {...action}
              />
            ))}
          </div>
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center space-y-2"
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-900/20 border border-green-400/30 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400 font-mono text-sm">Sistema Online</span>
          </div>
          <p className="text-gray-500 text-sm font-mono">
            Última atualização: {new Date().toLocaleTimeString('pt-BR')}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
