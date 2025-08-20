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
  AlertCircle
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

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClass: string;
  borderClass: string;
  gradientClass: string;
  rightIcon?: React.ReactNode;
  delay?: number;
}

function StatCard({
  icon,
  label,
  value,
  valueClass,
  borderClass,
  gradientClass,
  rightIcon,
  delay = 0
}: StatCardProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 }
  };
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.6, delay }}
      className={clsx(
        'glass p-6 rounded-xl border relative overflow-hidden group hover:shadow-glow transition-all duration-300',
        borderClass
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={clsx('w-12 h-12 rounded-lg flex items-center justify-center', gradientClass)}>
          {icon}
        </div>
        {rightIcon}
      </div>
      <h3 className="text-sm font-mono text-white-muted mb-1">{label}</h3>
      <p className={clsx('text-2xl font-bold', valueClass)}>{value}</p>
      <div className="absolute top-0 right-0 w-20 h-20 bg-cyber-primary/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500"></div>
    </motion.div>
  );
}

function SavingProgress({ stats, progress }: { stats: DashboardStats; progress: number }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.6, delay: 0.5 }}
      className="glass p-6 rounded-xl border border-cyber-primary/20"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-cyber text-cyber-primary">Meta de Poupança</h3>
        <Target className="w-6 h-6 text-cyber-primary" />
      </div>
      <div className="space-y-4">
        <div className="flex justify-between text-sm font-mono">
          <span className="text-white-muted">Progresso</span>
          <span className="text-cyber-primary">{progress.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-black-tertiary rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.5, delay: 1 }}
            className="h-full bg-gradient-to-r from-cyber-primary to-cyber-accent relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
          </motion.div>
        </div>
        <div className="flex justify-between text-sm font-mono">
          <span className="text-white-secondary">
            {formatCurrency(stats.balance)}
          </span>
          <span className="text-cyber-accent">
            Saldo Total
          </span>
        </div>
      </div>
    </motion.div>
  );
}

interface QuickActionsHandlers {
  handleNewTransaction: () => void;
  handleViewReports: () => void;
  handleSetGoal: () => void;
  handleExportData: () => void;
}

function QuickActions({
  handlers
}: {
  handlers: QuickActionsHandlers;
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.6, delay: 0.6 }}
      className="glass p-6 rounded-xl border border-cyber-secondary/20"
    >
      <h3 className="text-lg font-cyber text-cyber-secondary mb-6">Ações Rápidas</h3>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={handlers.handleNewTransaction}
          className="btn-primary group relative overflow-hidden"
          aria-label="Nova Transação"
        >
          <span className="relative z-10 font-mono">Nova Transação</span>
          <div className="absolute inset-0 bg-gradient-to-r from-cyber-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </button>
        <button
          onClick={handlers.handleViewReports}
          className="btn-outline group relative overflow-hidden"
          aria-label="Ver Relatórios"
        >
          <span className="relative z-10 font-mono">Ver Relatórios</span>
          <div className="absolute inset-0 bg-gradient-to-r from-cyber-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </button>
        <button
          onClick={handlers.handleSetGoal}
          className="btn-secondary group relative overflow-hidden"
          aria-label="Definir Meta"
        >
          <span className="relative z-10 font-mono">Definir Meta</span>
          <div className="absolute inset-0 bg-gradient-to-r from-cyber-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </button>
        <button
          onClick={handlers.handleExportData}
          className="btn-ghost group relative overflow-hidden border border-cyber-accent/30 hover:border-cyber-accent"
          aria-label="Exportar Dados"
        >
          <span className="relative z-10 font-mono text-cyber-accent">Exportar Dados</span>
          <div className="absolute inset-0 bg-gradient-to-r from-cyber-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </button>
      </div>
    </motion.div>
  );
}

function SysStatus({
  transactionsCount,
  syncStatus,
  lastSyncTime
}: {
  transactionsCount: number;
  syncStatus: 'syncing' | 'synced' | 'error';
  lastSyncTime: Date | null;
}) {
  const getStatusText = () => {
    switch (syncStatus) {
      case 'syncing':
        return 'Sincronizando...';
      case 'synced':
        return `${transactionsCount} transações processadas`;
      case 'error':
        return 'Erro na sincronização';
      default:
        return 'Status desconhecido';
    }
  };

  const getStatusColor = () => {
    switch (syncStatus) {
      case 'syncing':
        return 'bg-cyber-accent animate-pulse';
      case 'synced':
        return 'bg-cyber-primary';
      case 'error':
        return 'bg-cyber-danger animate-pulse';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.6, delay: 0.7 }}
      className="glass p-4 rounded-xl border border-cyber-accent/20 bg-gradient-to-r from-background-secondary/50 to-background-tertiary/30"
      aria-live="polite"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={clsx('w-3 h-3 rounded-full', getStatusColor())}></div>
          <span className="text-sm font-mono text-white-secondary">
            Sistema Phoenix operacional • {getStatusText()}
          </span>
        </div>
        <div className="text-xs font-mono text-white-muted">
          {lastSyncTime
            ? `Última sincronização: ${lastSyncTime.toLocaleTimeString('pt-BR')}`
            : 'Aguardando sincronização...'
          }
        </div>
      </div>
    </motion.div>
  );
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [stats, setStats] = useState<DashboardStats>(INITIAL_STATS_STATE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<'syncing' | 'synced' | 'error'>('syncing');
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  // Remover funcionalidade de savings goal por enquanto
  const savingsProgress = 0; // stats.balance > 0 ? 100 : 0;
  const netIncome = stats.income - stats.expenses;

  const handleNewTransaction = useCallback(() => navigate('/transactions'), [navigate]);
  const handleViewReports = useCallback(() => navigate('/reports'), [navigate]);
  const handleSetGoal = useCallback(() => navigate('/budgets'), [navigate]);
  const handleExportData = useCallback(() => navigate('/import-export'), [navigate]);

  const fetchDashboardData = useCallback(
    async (signal?: AbortSignal) => {
      try {
        setLoading(true);
        setError(null);
        setSyncStatus('syncing');

        if (!navigator.onLine) {
          throw new Error('Sem conexão com a internet');
        }

        console.log('📊 Carregando dados do dashboard...');

        // Tentar buscar dados da API
        try {
          const response = await fetch('/api/dashboard/stats', {
            signal,
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
          }

          const data = await response.json();
          
          if (data.success && data.data) {
            setStats(data.data);
            setSyncStatus('synced');
            setLastSyncTime(new Date());
            console.log('✅ Dados da API carregados:', data.data);
            return;
          }
        } catch (apiError) {
          console.warn('⚠️ API indisponível, usando dados mock:', apiError);
        }

        // Fallback para dados mock se API falhar
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockData = {
          income: 15750.50,
          expenses: 8920.30,
          balance: 6830.20,
          transactionCount: 47
        };

        setStats(mockData);
        setSyncStatus('synced');
        setLastSyncTime(new Date());

        console.log('✅ Dados mock carregados:', mockData);
      } catch (err: any) {
        let errorMessage = 'Erro desconhecido';
        if (err instanceof Error) {
          errorMessage = err.message;
        } else if (typeof err === 'string') {
          errorMessage = err;
        }
        if (err?.name !== 'AbortError') {
          console.error('❌ Erro ao carregar dados:', err);
          setError(errorMessage);
          setSyncStatus('error');
          setStats(INITIAL_STATS_STATE);
        }
      } finally {
        setLoading(false);
      }
    },
    [user?.id]
  );

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    let isMounted = true;
    let hasLoaded = false;
    const controller = new AbortController();
    
    const timeoutId = setTimeout(() => {
      if (isMounted && loading) {
        controller.abort();
        setError('Tempo limite excedido ao carregar dados');
        setLoading(false);
      }
    }, TIMEOUT_DURATION);

    const fetchData = async () => {
      if (!hasLoaded && isMounted) {
        hasLoaded = true;
        try {
          await fetchDashboardData(controller.signal);
        } catch (err: any) {
          if (err?.name !== 'AbortError') {
            // Outros erros já tratados em fetchDashboardData
          }
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [navigate]); // Remover user das dependências

  if (loading) {
    return (
      <div className="min-h-screen bg-black-primary flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center glass-strong p-8 rounded-2xl"
        >
          <div className="relative mb-6">
            <div className="w-20 h-20 border-4 border-cyber-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-cyber-secondary border-b-transparent rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <h3 className="text-xl font-semibold text-cyber-primary mb-2">Iniciando Sistema Phoenix</h3>
          <p className="text-white-muted animate-pulse">Carregando dados financeiros...</p>
          <div className="mt-4 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-cyber-primary rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-cyber-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-cyber-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong p-8 max-w-md w-full text-center"
        >
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Sistema Indisponível</h2>
          <p className="text-white-muted mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-cyber-primary text-cyber-dark rounded-lg hover:bg-cyber-accent transition-colors"
            aria-label="Tentar novamente"
          >
            Tentar novamente
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-4xl font-cyber text-cyber-primary mb-2 text-glow">
          Centro de Comando Financeiro
        </h1>
        <p className="text-white-muted font-mono">
          Monitoramento em tempo real dos seus ativos digitais
        </p>
      </motion.div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<DollarSign className="w-6 h-6 text-cyber-dark" />}
          label="Saldo Total"
          value={formatCurrency(stats.balance)}
          valueClass="text-cyber-primary"
          borderClass="border-cyber-primary/30"
          gradientClass="bg-gradient-to-br from-cyber-primary to-cyber-secondary"
          rightIcon={<TrendingUp className="w-5 h-5 text-cyber-accent" />}
          delay={0.1}
        />
        <StatCard
          icon={<TrendingUp className="w-6 h-6 text-cyber-dark" />}
          label="Receitas"
          value={formatCurrency(stats.income)}
          valueClass="text-cyber-accent"
          borderClass="border-cyber-accent/30"
          gradientClass="bg-gradient-to-br from-cyber-accent to-cyber-primary"
          rightIcon={<Activity className="w-5 h-5 text-cyber-accent" />}
          delay={0.2}
        />
        <StatCard
          icon={<TrendingDown className="w-6 h-6 text-cyber-dark" />}
          label="Despesas"
          value={formatCurrency(stats.expenses)}
          valueClass="text-cyber-danger"
          borderClass="border-cyber-danger/30"
          gradientClass="bg-gradient-to-br from-cyber-danger to-cyber-secondary"
          rightIcon={<CreditCard className="w-5 h-5 text-cyber-danger" />}
          delay={0.3}
        />
        <StatCard
          icon={<Zap className="w-6 h-6 text-cyber-dark" />}
          label="Lucro Líquido"
          value={formatCurrency(netIncome)}
          valueClass="text-cyber-secondary"
          borderClass="border-cyber-secondary/30"
          gradientClass="bg-gradient-to-br from-cyber-secondary to-cyber-primary"
          rightIcon={<PiggyBank className="w-5 h-5 text-cyber-secondary" />}
          delay={0.4}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SavingProgress stats={stats} progress={savingsProgress} />
        <QuickActions
          handlers={{
            handleNewTransaction,
            handleViewReports,
            handleSetGoal,
            handleExportData
          }}
        />
      </div>

      {/* System Status */}
      <SysStatus
        transactionsCount={stats.transactionCount}
        syncStatus={syncStatus}
        lastSyncTime={lastSyncTime}
      />
    </div>
  );
}
