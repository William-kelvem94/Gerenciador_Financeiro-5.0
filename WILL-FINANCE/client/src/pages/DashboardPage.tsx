import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Target,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  PieChart,
  Loader2
} from 'lucide-react'
import { useTransactions, useGoals, useAnalytics } from '@/hooks/useApi'

export function DashboardPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  
  // Hooks da API
  const { transactions, loading: transactionsLoading } = useTransactions({ limit: 5 })
  const { goals, loading: goalsLoading } = useGoals()
  const { analytics, loading: analyticsLoading } = useAnalytics()

  // Aguarda todos os dados carregarem
  useEffect(() => {
    if (!transactionsLoading && !goalsLoading && !analyticsLoading) {
      setLoading(false)
    }
  }, [transactionsLoading, goalsLoading, analyticsLoading])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    })
  }

  // Fallback para dados não carregados
  const dashboardData = {
    balance: analytics?.balance ?? 0,
    income: analytics?.totalIncome ?? 0,
    expenses: analytics?.totalExpenses ?? 0,
    savings: (analytics?.totalIncome ?? 0) - (analytics?.totalExpenses ?? 0),
    recentTransactions: transactions ?? [],
    monthlyGoals: goals?.map(goal => ({
      name: goal.name,
      current: goal.currentAmount ?? 0,
      target: goal.targetAmount ?? 1,
      percentage: goal.targetAmount ? Math.round((goal.currentAmount / goal.targetAmount) * 100) : 0
    })) ?? []
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-green-400" />
        <span className="ml-2 text-gray-400">Carregando dashboard...</span>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard Financeiro</h1>
          <p className="text-gray-400">Visão geral das suas finanças em tempo real</p>
        </div>
        <div className="flex items-center space-x-2 text-gray-400">
          <Calendar className="h-5 w-5" />
          <span>{new Date().toLocaleDateString('pt-BR', { 
            day: '2-digit', 
            month: 'long', 
            year: 'numeric' 
          })}</span>
        </div>
      </motion.div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-black/20 backdrop-blur-md border border-green-500/30 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Wallet className="h-6 w-6 text-blue-400" />
            </div>
            <span className="text-xs text-gray-400 bg-blue-500/10 px-2 py-1 rounded">SALDO</span>
          </div>
          <h3 className="text-sm font-medium text-gray-400 mb-1">Saldo Total</h3>
          <p className="text-2xl font-bold text-white">{formatCurrency(dashboardData.balance)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-black/20 backdrop-blur-md border border-green-500/30 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-400" />
            </div>
            <span className="text-xs text-gray-400 bg-green-500/10 px-2 py-1 rounded">RECEITAS</span>
          </div>
          <h3 className="text-sm font-medium text-gray-400 mb-1">Receita Mensal</h3>
          <p className="text-2xl font-bold text-green-400">{formatCurrency(dashboardData.income)}</p>
          <div className="flex items-center mt-2">
            <ArrowUpRight className="h-4 w-4 text-green-400 mr-1" />
            <span className="text-xs text-green-400">+12.5% vs mês anterior</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-black/20 backdrop-blur-md border border-green-500/30 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
              <TrendingDown className="h-6 w-6 text-red-400" />
            </div>
            <span className="text-xs text-gray-400 bg-red-500/10 px-2 py-1 rounded">DESPESAS</span>
          </div>
          <h3 className="text-sm font-medium text-gray-400 mb-1">Despesas Mensais</h3>
          <p className="text-2xl font-bold text-red-400">{formatCurrency(dashboardData.expenses)}</p>
          <div className="flex items-center mt-2">
            <ArrowDownRight className="h-4 w-4 text-red-400 mr-1" />
            <span className="text-xs text-red-400">+3.2% vs mês anterior</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-black/20 backdrop-blur-md border border-green-500/30 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Target className="h-6 w-6 text-purple-400" />
            </div>
            <span className="text-xs text-gray-400 bg-purple-500/10 px-2 py-1 rounded">ECONOMIA</span>
          </div>
          <h3 className="text-sm font-medium text-gray-400 mb-1">Economia</h3>
          <p className="text-2xl font-bold text-purple-400">{formatCurrency(dashboardData.savings)}</p>
          <div className="flex items-center mt-2">
            <ArrowUpRight className="h-4 w-4 text-purple-400 mr-1" />
            <span className="text-xs text-purple-400">Meta: 74.6% atingida</span>
          </div>
        </motion.div>
      </div>

      {/* Grid com Transações Recentes e Metas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Transações Recentes */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-black/20 backdrop-blur-md border border-green-500/30 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Transações Recentes</h2>
            <CreditCard className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {dashboardData.recentTransactions.map((transaction: any) => (
              <div key={transaction.id ?? `tx-${Date.now()}-${Math.random()}`} className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    transaction.type === 'income' || transaction.amount > 0
                      ? 'bg-green-500/20' 
                      : 'bg-red-500/20'
                  }`}>
                    <DollarSign className={`h-5 w-5 ${
                      transaction.type === 'income' || transaction.amount > 0 ? 'text-green-400' : 'text-red-400'
                    }`} />
                  </div>
                  <div>
                    <p className="text-white font-medium">{transaction.description ?? transaction.title ?? 'Transação'}</p>
                    <p className="text-gray-400 text-sm">{formatDate(transaction.date ?? transaction.createdAt)}</p>
                  </div>
                </div>
                <span className={`font-bold ${
                  transaction.type === 'income' || transaction.amount > 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {transaction.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(transaction.amount))}
                </span>
              </div>
            ))}
          </div>

          <button 
            onClick={() => navigate('/transactions')}
            className="w-full mt-4 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
          >
            Ver Todas as Transações
          </button>
        </motion.div>

        {/* Metas Mensais */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-black/20 backdrop-blur-md border border-green-500/30 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Metas Mensais</h2>
            <PieChart className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-6">
            {dashboardData.monthlyGoals.map((goal: any, index: number) => (
              <div key={goal.name ?? `goal-${index}`} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">{goal.name}</span>
                  <span className="text-gray-400 text-sm">{goal.percentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-black/40 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${goal.percentage}%` }}
                    transition={{ duration: 1, delay: 0.7 + index * 0.1 }}
                    className="bg-gradient-to-r from-green-500 to-cyan-500 h-2 rounded-full"
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-green-400">{formatCurrency(goal.current)}</span>
                  <span className="text-gray-400">de {formatCurrency(goal.target)}</span>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={() => navigate('/goals')}
            className="w-full mt-6 px-4 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors"
          >
            Gerenciar Metas
          </button>
        </motion.div>
      </div>
    </div>
  )
}
