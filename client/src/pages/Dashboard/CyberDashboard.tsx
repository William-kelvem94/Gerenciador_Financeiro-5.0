import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Activity,
  Target,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  BarChart3,
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
  transactionCount: 0,
};

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function validateDashboardData(data: any): data is DashboardStats {
  return (
    data &&
    typeof data.income === 'number' &&
    Number.isFinite(data.income) &&
    typeof data.expenses === 'number' &&
    Number.isFinite(data.expenses) &&
    typeof data.balance === 'number' &&
    Number.isFinite(data.balance) &&
    typeof data.transactionCount === 'number' &&
    Number.isInteger(data.transactionCount) &&
    data.transactionCount >= 0
  );
}

interface CyberStatCardProps {
  icon: React.ReactElement;
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
  delay = 0,
}) => {
  const colorClasses = {
    cyan: 'border-cyan-400/30 hover:border-cyan-400/60 text-cyan-400',
    pink: 'border-pink-400/30 hover:border-pink-400/60 text-pink-400',
    green: 'border-green-400/30 hover:border-green-400/60 text-green-400',
    purple: 'border-purple-400/30 hover:border-purple-400/60 text-purple-400',
  };

  const changeColors = {
    positive: 'text-green-400',
    negative: 'text-red-400',
    neutral: 'text-gray-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={clsx(
        'group relative rounded-xl border bg-gray-900/60 p-6 backdrop-blur-lg',
        'transform transition-all duration-300 ease-in-out hover:scale-105',
        'cursor-pointer overflow-hidden hover:shadow-2xl',
        colorClasses[color]
      )}
      style={{
        boxShadow: `0 8px 32px rgba(0, 255, 255, 0.1)`,
      }}
    >
      {/* Glow Effect Background */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div
          className={clsx(
            'absolute inset-0 bg-gradient-to-br opacity-5',
            color === 'cyan' && 'from-cyan-400/20 to-blue-600/20',
            color === 'pink' && 'from-pink-400/20 to-purple-600/20',
            color === 'green' && 'from-green-400/20 to-emerald-600/20',
            color === 'purple' && 'from-purple-400/20 to-indigo-600/20'
          )}
        />
      </div>

      {/* Top Border Glow */}
      <div className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-current to-transparent opacity-70" />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon and Change Indicator */}
        <div className="mb-4 flex items-start justify-between">
          <div
            className={clsx(
              'rounded-lg border border-current/20 bg-gray-800/50 p-3 backdrop-blur',
              'transition-colors duration-300 group-hover:bg-current/10'
            )}
          >
            {React.cloneElement(icon as React.ReactElement, {
              className: 'w-6 h-6 text-current',
            })}
          </div>

          {change && (
            <div
              className={clsx(
                'flex items-center space-x-1 font-mono text-sm',
                changeColors[changeType]
              )}
            >
              {changeType === 'positive' && <ArrowUpRight className="h-4 w-4" />}
              {changeType === 'negative' && <ArrowDownRight className="h-4 w-4" />}
              <span>{change}</span>
            </div>
          )}
        </div>

        {/* Label */}
        <h3 className="mb-2 text-sm font-medium text-gray-300 transition-colors duration-300 group-hover:text-white">
          {label}
        </h3>

        {/* Value */}
        <div className="space-y-1">
          <p
            className={clsx(
              'font-mono text-2xl font-bold tracking-tight',
              'group-hover:text-glow transition-all duration-300'
            )}
          >
            {value}
          </p>
        </div>
      </div>

      {/* Animated Border */}
      <div className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute inset-0 animate-pulse rounded-xl border border-current/50" />
      </div>

      {/* Scan Line Effect */}
      <div className="absolute inset-0 overflow-hidden rounded-xl">
        <div
          className={clsx(
            'absolute top-0 left-0 h-px w-full bg-current opacity-0',
            'group-hover:animate-pulse group-hover:opacity-100'
          )}
        />
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
  color = 'cyan',
}) => {
  const colorClasses = {
    cyan: 'border-cyan-400/30 hover:border-cyan-400 hover:bg-cyan-400/10 text-cyan-400',
    pink: 'border-pink-400/30 hover:border-pink-400 hover:bg-pink-400/10 text-pink-400',
    green: 'border-green-400/30 hover:border-green-400 hover:bg-green-400/10 text-green-400',
    purple: 'border-purple-400/30 hover:border-purple-400 hover:bg-purple-400/10 text-purple-400',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={clsx(
        'group w-full rounded-lg border bg-gray-900/40 p-4 backdrop-blur-lg',
        'text-left transition-all duration-300 hover:shadow-lg',
        colorClasses[color]
      )}
    >
      <div className="flex items-start space-x-3">
        <div className="rounded-lg border border-current/20 bg-current/10 p-2">
          {React.cloneElement(icon as React.ReactElement, {
            className: 'w-5 h-5 text-current',
          })}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-white transition-colors group-hover:text-current">
            {label}
          </h3>
          <p className="text-sm text-gray-400 transition-colors group-hover:text-gray-300">
            {description}
          </p>
        </div>
        <ArrowUpRight className="h-4 w-4 text-gray-500 transition-colors group-hover:text-current" />
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
        income: 15750.0,
        expenses: 8920.5,
        balance: 6829.5,
        transactionCount: 47,
      };

      clearTimeout(timeoutId);

      if (validateDashboardData(mockData)) {
        setStats(mockData);
      } else {
        throw new Error('Dados do dashboard inválidos recebidos do servidor');
      }
    } catch (err) {
      clearTimeout(timeoutId);
      const errorMessage =
        err instanceof Error ? err.message : 'Erro desconhecido ao carregar dados';
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
      color: 'cyan' as const,
    },
    {
      icon: <Target />,
      label: 'Metas Financeiras',
      description: 'Gerenciar objetivos',
      onClick: () => navigate('/goals'),
      color: 'green' as const,
    },
    {
      icon: <BarChart3 />,
      label: 'Relatórios',
      description: 'Visualizar análises',
      onClick: () => navigate('/reports'),
      color: 'purple' as const,
    },
    {
      icon: <CreditCard />,
      label: 'Cartões',
      description: 'Gerenciar cartões',
      onClick: () => navigate('/cards'),
      color: 'pink' as const,
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="space-y-4 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
          <p className="font-mono text-cyan-400">Carregando dados financeiros...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black p-4">
        <div className="w-full max-w-md rounded-lg border border-red-500/30 bg-red-900/20 p-6 text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-400" />
          <h2 className="mb-2 text-xl font-bold text-red-400">Erro no Sistema</h2>
          <p className="mb-4 text-gray-300">{error}</p>
          <button onClick={fetchDashboardData} className="btn-cyberpunk text-sm">
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-cyan-400/5 blur-3xl" />
        <div className="absolute right-1/4 bottom-0 h-96 w-96 rounded-full bg-pink-400/5 blur-3xl" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 space-y-8 p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4 text-center"
        >
          <h1 className="font-cyber text-glow animate-pulse-glow text-4xl font-black md:text-6xl">
            WILL FINANCE 5.0
          </h1>
          <p className="font-mono text-xl text-gray-400">
            Bem-vindo, <span className="text-cyan-400">{user?.name || 'Usuário'}</span>
          </p>
          <div className="mx-auto h-px w-32 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
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
            <h2 className="font-cyber mb-2 text-2xl font-bold text-cyan-400">Ações Rápidas</h2>
            <div className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map(action => (
              <QuickAction key={action.label} {...action} />
            ))}
          </div>
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="space-y-2 text-center"
        >
          <div className="inline-flex items-center space-x-2 rounded-full border border-green-400/30 bg-green-900/20 px-4 py-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
            <span className="font-mono text-sm text-green-400">Sistema Online</span>
          </div>
          <p className="font-mono text-sm text-gray-500">
            Última atualização: {new Date().toLocaleTimeString('pt-BR')}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
