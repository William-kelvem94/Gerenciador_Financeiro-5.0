import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  CreditCard,
  PlusCircle,
  Calendar,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useFinance } from '@/contexts/FinanceContext';

interface DashboardStats {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsRate: number;
}

interface RecentTransaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  category: string;
  date: string;
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { transactions, accounts, loading } = useFinance();
  const [showBalance, setShowBalance] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    savingsRate: 0
  });
  const [recentTransactions, setRecentTransactions] = useState<RecentTransaction[]>([]);

  useEffect(() => {
    calculateStats();
    loadRecentTransactions();
  }, [transactions, accounts]);

  const calculateStats = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    // Calcular saldo total das contas
    const totalBalance = accounts?.reduce((sum, account) => sum + account.balance, 0) || 0;

    // Calcular receitas e despesas do mês atual
    const monthlyTransactions = transactions?.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.getMonth() === currentMonth && 
             transactionDate.getFullYear() === currentYear;
    }) ?? [];

    const monthlyIncome = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const monthlyExpenses = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0;

    setStats({
      totalBalance,
      monthlyIncome,
      monthlyExpenses,
      savingsRate
    });
  };

  const loadRecentTransactions = () => {
    if (!transactions) {
      setRecentTransactions([]);
      return;
    }
    
    const sortedTransactions = [...transactions].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    const recent = sortedTransactions
      .slice(0, 5)
      .map(t => ({
        id: t.id,
        description: t.description,
        amount: t.amount,
        type: t.type,
        category: typeof t.category === 'string' ? t.category : t.category?.name ?? 'Sem categoria',
        date: new Date(t.date).toLocaleDateString('pt-BR')
      }));

    setRecentTransactions(recent);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const toggleBalanceVisibility = () => {
    setShowBalance(!showBalance);
  };

  const maskBalance = (amount: number) => {
    return showBalance ? formatCurrency(amount) : '****';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Olá, {user?.firstName ?? 'Usuário'}! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Aqui está um resumo das suas finanças
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <PlusCircle size={16} />
          Nova Transação
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Saldo Total */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleBalanceVisibility}
                className="h-6 w-6 p-0"
              >
                {showBalance ? <Eye size={14} /> : <EyeOff size={14} />}
              </Button>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {maskBalance(stats.totalBalance)}
            </div>
            <p className="text-xs text-muted-foreground">
              Soma de todas as contas
            </p>
          </CardContent>
        </Card>

        {/* Receitas do Mês */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receitas do Mês</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {maskBalance(stats.monthlyIncome)}
            </div>
            <p className="text-xs text-muted-foreground">
              +12% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        {/* Despesas do Mês */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas do Mês</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {maskBalance(stats.monthlyExpenses)}
            </div>
            <p className="text-xs text-muted-foreground">
              -5% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        {/* Taxa de Poupança */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Poupança</CardTitle>
            <CreditCard className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {showBalance ? `${stats.savingsRate.toFixed(1)}%` : '**%'}
            </div>
            <p className="text-xs text-muted-foreground">
              Meta: 20%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Gastos por Categoria */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar size={16} />
              Gastos por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Alimentação</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <span className="text-sm font-medium">R$ 800</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Transporte</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                  <span className="text-sm font-medium">R$ 400</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Lazer</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                  <span className="text-sm font-medium">R$ 300</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transações Recentes */}
        <Card>
          <CardHeader>
            <CardTitle>Transações Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.length > 0 ? (
                recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        transaction.type === 'income' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {transaction.type === 'income' ? (
                          <TrendingUp size={14} />
                        ) : (
                          <TrendingDown size={14} />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{transaction.description}</p>
                        <p className="text-xs text-gray-500">{transaction.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium text-sm ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(Math.abs(transaction.amount))}
                      </p>
                      <p className="text-xs text-gray-500">{transaction.date}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-4">
                  <p>Nenhuma transação encontrada</p>
                  <p className="text-xs">Adicione sua primeira transação!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contas */}
      <Card>
        <CardHeader>
          <CardTitle>Minhas Contas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts && accounts.length > 0 ? (
              accounts.map((account) => (
                <div key={account.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{account.name}</h3>
                    <Badge variant={account.type === 'CHECKING' ? 'default' : 'secondary'}>
                      {account.type === 'CHECKING' ? 'Corrente' : 'Poupança'}
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold">
                    {maskBalance(account.balance)}
                  </p>
                  <p className="text-sm text-gray-500">{account.bankName ?? 'Banco não informado'}</p>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 py-8">
                <CreditCard size={48} className="mx-auto mb-4 opacity-50" />
                <p>Nenhuma conta cadastrada</p>
                <Button variant="outline" className="mt-2">
                  Adicionar Conta
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
