import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  CreditCard, 
  PiggyBank,
  Activity,
  Target,
  Zap
} from 'lucide-react';

interface DashboardStats {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsGoal: number;
  transactions: number;
}

export function DashboardPage() {
  const [stats] = useState<DashboardStats>({
    totalBalance: 15750.89,
    monthlyIncome: 8500.00,
    monthlyExpenses: 4250.75,
    savingsGoal: 25000.00,
    transactions: 127
  });

  const savingsProgress = (stats.totalBalance / stats.savingsGoal) * 100;
  const netIncome = stats.monthlyIncome - stats.monthlyExpenses;

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 }
  };

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
        <p className="text-foreground-muted font-mono">
          Monitoramento em tempo real dos seus ativos digitais
        </p>
      </motion.div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Balance */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass p-6 rounded-xl border border-cyber-primary/30 relative overflow-hidden group hover:shadow-glow transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyber-primary to-cyber-secondary rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-cyber-dark" />
            </div>
            <TrendingUp className="w-5 h-5 text-cyber-accent" />
          </div>
          <h3 className="text-sm font-mono text-foreground-muted mb-1">Saldo Total</h3>
          <p className="text-2xl font-bold text-cyber-primary">
            R$ {stats.totalBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <div className="absolute top-0 right-0 w-20 h-20 bg-cyber-primary/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500"></div>
        </motion.div>

        {/* Monthly Income */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass p-6 rounded-xl border border-cyber-accent/30 relative overflow-hidden group hover:shadow-[0_0_20px_#39FF14] transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyber-accent to-cyber-primary rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-cyber-dark" />
            </div>
            <Activity className="w-5 h-5 text-cyber-accent" />
          </div>
          <h3 className="text-sm font-mono text-foreground-muted mb-1">Receita Mensal</h3>
          <p className="text-2xl font-bold text-cyber-accent">
            R$ {stats.monthlyIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <div className="absolute top-0 right-0 w-20 h-20 bg-cyber-accent/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500"></div>
        </motion.div>

        {/* Monthly Expenses */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, delay: 0.3 }}
          className="glass p-6 rounded-xl border border-cyber-danger/30 relative overflow-hidden group hover:shadow-[0_0_20px_#FF0040] transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyber-danger to-cyber-secondary rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-cyber-dark" />
            </div>
            <CreditCard className="w-5 h-5 text-cyber-danger" />
          </div>
          <h3 className="text-sm font-mono text-foreground-muted mb-1">Gastos Mensais</h3>
          <p className="text-2xl font-bold text-cyber-danger">
            R$ {stats.monthlyExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <div className="absolute top-0 right-0 w-20 h-20 bg-cyber-danger/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500"></div>
        </motion.div>

        {/* Net Income */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, delay: 0.4 }}
          className="glass p-6 rounded-xl border border-cyber-secondary/30 relative overflow-hidden group hover:shadow-[0_0_20px_#FF00FF] transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyber-secondary to-cyber-primary rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-cyber-dark" />
            </div>
            <PiggyBank className="w-5 h-5 text-cyber-secondary" />
          </div>
          <h3 className="text-sm font-mono text-foreground-muted mb-1">Lucro Líquido</h3>
          <p className="text-2xl font-bold text-cyber-secondary">
            R$ {netIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <div className="absolute top-0 right-0 w-20 h-20 bg-cyber-secondary/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500"></div>
        </motion.div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Savings Progress */}
        <motion.div
          variants={cardVariants}
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
              <span className="text-foreground-muted">Progresso</span>
              <span className="text-cyber-primary">{savingsProgress.toFixed(1)}%</span>
            </div>
            
            <div className="w-full bg-background-tertiary rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${savingsProgress}%` }}
                transition={{ duration: 1.5, delay: 1 }}
                className="h-full bg-gradient-to-r from-cyber-primary to-cyber-accent relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
              </motion.div>
            </div>
            
            <div className="flex justify-between text-sm font-mono">
              <span className="text-foreground-secondary">
                R$ {stats.totalBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-cyber-accent">
                R$ {stats.savingsGoal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, delay: 0.6 }}
          className="glass p-6 rounded-xl border border-cyber-secondary/20"
        >
          <h3 className="text-lg font-cyber text-cyber-secondary mb-6">Ações Rápidas</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <button className="btn-primary group relative overflow-hidden">
              <span className="relative z-10 font-mono">Nova Transação</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyber-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
            
            <button className="btn-outline group relative overflow-hidden">
              <span className="relative z-10 font-mono">Ver Relatórios</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyber-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
            
            <button className="btn-secondary group relative overflow-hidden">
              <span className="relative z-10 font-mono">Definir Meta</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyber-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
            
            <button className="btn-ghost group relative overflow-hidden border border-cyber-accent/30 hover:border-cyber-accent">
              <span className="relative z-10 font-mono text-cyber-accent">Exportar Dados</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyber-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          </div>
        </motion.div>
      </div>

      {/* System Status */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.6, delay: 0.7 }}
        className="glass p-4 rounded-xl border border-cyber-accent/20 bg-gradient-to-r from-background-secondary/50 to-background-tertiary/30"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-3 h-3 bg-cyber-accent rounded-full animate-pulse"></div>
            <span className="text-sm font-mono text-foreground-secondary">
              Sistema Phoenix operacional • {stats.transactions} transações processadas
            </span>
          </div>
          <div className="text-xs font-mono text-foreground-muted">
            Última sincronização: {new Date().toLocaleTimeString('pt-BR')}
          </div>
        </div>
      </motion.div>
    </div>
  );
}