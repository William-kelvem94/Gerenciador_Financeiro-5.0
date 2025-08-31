import React, { useEffect, useState, useMemo } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
import { useTransactionStore } from '../../stores/transactionStore';
import { useAuthStore } from '../../stores/authStore';
import { CyberpunkProgress } from '../ui/CyberpunkProgress';
import CyberpunkCard from '../ui/CyberpunkCard';
import { format, startOfMonth, endOfMonth, subMonths, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  monthlyGrowth: number;
  averageTransaction: number;
  transactionCount: number;
}

// Cores cyberpunk para gráficos
const cyberpunkColors = [
  '#00ffea', '#ff0080', '#8000ff', '#00ff80', 
  '#ff8000', '#0080ff', '#ff4000', '#40ff00',
  '#ff0040', '#4000ff', '#00ff40', '#ff8040'
];

const FinancialDashboard: React.FC = () => {
  const { transactions, isLoading } = useTransactionStore();
  const { user } = useAuthStore();
  const [summary, setSummary] = useState<FinancialSummary | null>(null);

  useEffect(() => {
    // Dados serão carregados automaticamente pela store
  }, [user]);

  // Processar dados para o resumo financeiro
  const processedSummary = useMemo(() => {
    if (!transactions.length) return null;

    const currentDate = new Date();
    const currentMonthStart = startOfMonth(currentDate);
    const currentMonthEnd = endOfMonth(currentDate);
    const lastMonthStart = startOfMonth(subMonths(currentDate, 1));
    const lastMonthEnd = endOfMonth(subMonths(currentDate, 1));

    const currentMonthTransactions = transactions.filter(tx => {
      const txDate = parseISO(tx.date);
      return txDate >= currentMonthStart && txDate <= currentMonthEnd;
    });

    const lastMonthTransactions = transactions.filter(tx => {
      const txDate = parseISO(tx.date);
      return txDate >= lastMonthStart && txDate <= lastMonthEnd;
    });

    const currentIncome = currentMonthTransactions
      .filter(tx => tx.type === 'income')
      .reduce((sum, tx) => sum + tx.amount, 0);

    const currentExpenses = currentMonthTransactions
      .filter(tx => tx.type === 'expense')
      .reduce((sum, tx) => sum + tx.amount, 0);

    const lastMonthIncome = lastMonthTransactions
      .filter(tx => tx.type === 'income')
      .reduce((sum, tx) => sum + tx.amount, 0);

    const lastMonthExpenses = lastMonthTransactions
      .filter(tx => tx.type === 'expense')
      .reduce((sum, tx) => sum + tx.amount, 0);

    const currentBalance = currentIncome - currentExpenses;
    const lastBalance = lastMonthIncome - lastMonthExpenses;
    const monthlyGrowth = lastBalance !== 0 ? ((currentBalance - lastBalance) / Math.abs(lastBalance)) * 100 : 0;

    return {
      totalIncome: currentIncome,
      totalExpenses: currentExpenses,
      balance: currentBalance,
      monthlyGrowth,
      averageTransaction: currentMonthTransactions.length > 0 
        ? (currentIncome + currentExpenses) / currentMonthTransactions.length 
        : 0,
      transactionCount: currentMonthTransactions.length,
    };
  }, [transactions]);

  useEffect(() => {
    setSummary(processedSummary);
  }, [processedSummary]);

  // Dados para gráfico de barras (gastos mensais)
  const barChartData = useMemo(() => {
    if (!transactions.length) return null;

    const monthlyData = transactions.reduce((acc, tx) => {
      const month = format(parseISO(tx.date), 'MMM/yy', { locale: ptBR });
      if (!acc[month]) {
        acc[month] = { income: 0, expenses: 0 };
      }
      
      if (tx.type === 'income') {
        acc[month].income += tx.amount;
      } else {
        acc[month].expenses += tx.amount;
      }
      
      return acc;
    }, {} as Record<string, { income: number; expenses: number }>);

    const sortedMonths = Object.keys(monthlyData).sort((a, b) => {
      const [monthA, yearA] = a.split('/');
      const [monthB, yearB] = b.split('/');
      return new Date(`20${yearA}-${monthA}-01`).getTime() - new Date(`20${yearB}-${monthB}-01`).getTime();
    }).slice(-6); // Últimos 6 meses

    return {
      labels: sortedMonths,
      datasets: [
        {
          label: 'Receitas',
          data: sortedMonths.map(month => monthlyData[month].income),
          backgroundColor: 'rgba(0, 255, 234, 0.7)',
          borderColor: 'rgba(0, 255, 234, 1)',
          borderWidth: 2,
        },
        {
          label: 'Despesas',
          data: sortedMonths.map(month => monthlyData[month].expenses),
          backgroundColor: 'rgba(255, 0, 128, 0.7)',
          borderColor: 'rgba(255, 0, 128, 1)',
          borderWidth: 2,
        },
      ],
    };
  }, [transactions]);

  // Dados para gráfico de pizza (categorias)
  const pieChartData = useMemo(() => {
    if (!transactions.length) return null;

    const categoryData = transactions
      .filter(tx => tx.type === 'expense')
      .reduce((acc, tx) => {
        const category = tx.category?.name || 'Outros';
        acc[category] = (acc[category] || 0) + tx.amount;
        return acc;
      }, {} as Record<string, number>);

    const sortedCategories = Object.entries(categoryData)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8); // Top 8 categorias

    return {
      labels: sortedCategories.map(([category]) => category),
      datasets: [
        {
          data: sortedCategories.map(([, amount]) => amount),
          backgroundColor: cyberpunkColors.slice(0, sortedCategories.length),
          borderColor: cyberpunkColors.slice(0, sortedCategories.length).map(color => color + '40'),
          borderWidth: 2,
        },
      ],
    };
  }, [transactions]);

  // Dados para gráfico de linha (tendência)
  const lineChartData = useMemo(() => {
    if (!transactions.length) return null;

    const dailyBalance = transactions
      .slice()
      .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .reduce((acc: { date: string; balance: number }[], tx: any) => {
        const date = format(parseISO(tx.date), 'dd/MM');
        const lastBalance = acc.length > 0 ? acc[acc.length - 1].balance : 0;
        
        acc.push({
          date,
          balance: lastBalance + (tx.type === 'income' ? tx.amount : -tx.amount),
        });
        
        return acc;
      }, [] as { date: string; balance: number }[])
      .slice(-30); // Últimos 30 dias

    return {
      labels: dailyBalance.map((item: { date: string; balance: number }) => item.date),
      datasets: [
        {
          label: 'Saldo Acumulado',
          data: dailyBalance.map((item: { date: string; balance: number }) => item.balance),
          borderColor: 'rgba(0, 255, 128, 1)',
          backgroundColor: 'rgba(0, 255, 128, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
        },
      ],
    };
  }, [transactions]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#fff',
          font: {
            family: "'Orbitron', sans-serif",
            size: 12,
          },
        },
      },
      title: {
        display: true,
        color: '#00ffea',
        font: {
          size: 16,
          family: "'Orbitron', sans-serif",
          weight: 'bold',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#fff',
          callback: function(value: any) {
            return 'R$ ' + new Intl.NumberFormat('pt-BR').format(value);
          },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      x: {
        ticks: {
          color: '#fff',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: '#fff',
          font: {
            family: "'Orbitron', sans-serif",
            size: 11,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((context.raw / total) * 100).toFixed(1);
            return `${context.label}: R$ ${new Intl.NumberFormat('pt-BR').format(context.raw)} (${percentage}%)`;
          },
        },
      },
    },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <CyberpunkProgress value={0} />
      </div>
    );
  }

  return (
    <div className="dashboard-container p-6 space-y-8 bg-gradient-cyber rounded-xl shadow-cyber border border-cyber-primary/20 animate-float">
      {/* Cards de Resumo Cyberpunk */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <CyberpunkCard className="stat-card glass animate-glow">
          <div className="stat-content">
            <h3 className="stat-title text-cyber-primary text-lg font-bold mb-2">Saldo (Mês)</h3>
            <p className={`stat-value text-3xl font-mono ${summary && summary.balance >= 0 ? 'text-cyber-accent' : 'text-cyber-danger'}`}>R$ {new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(summary?.balance ?? 0)}</p>
            <span className="stat-change text-cyber-secondary text-sm font-mono">
              {summary?.monthlyGrowth !== undefined && (
                <>
                  {summary.monthlyGrowth >= 0 ? '↗' : '↘'} {Math.abs(summary.monthlyGrowth).toFixed(1)}%
                </>
              )}
            </span>
          </div>
        </CyberpunkCard>

        <CyberpunkCard className="stat-card glass animate-glow">
          <div className="stat-content">
            <h3 className="stat-title text-cyber-primary text-lg font-bold mb-2">Receitas (Mês)</h3>
            <p className="stat-value text-3xl font-mono text-cyber-accent">R$ {new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(summary?.totalIncome || 0)}</p>
            <span className="stat-subtitle text-cyber-primary text-xs font-mono">{summary?.transactionCount || 0} transações</span>
          </div>
        </CyberpunkCard>

        <CyberpunkCard className="stat-card glass animate-glow">
          <div className="stat-content">
            <h3 className="stat-title text-cyber-primary text-lg font-bold mb-2">Despesas (Mês)</h3>
            <p className="stat-value text-3xl font-mono text-cyber-danger">R$ {new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(summary?.totalExpenses || 0)}</p>
            <span className="stat-subtitle text-cyber-secondary text-xs font-mono">Média: R$ {new Intl.NumberFormat('pt-BR').format(summary?.averageTransaction || 0)}</span>
          </div>
        </CyberpunkCard>

        <CyberpunkCard className="stat-card glass animate-glow">
          <div className="stat-content">
            <h3 className="stat-title text-cyber-primary text-lg font-bold mb-2">Meta do Mês</h3>
            <p className="stat-value text-2xl font-mono text-cyber-warning">R$ 2.500,00</p>
            <div className="progress-bar w-full h-3 bg-cyber-primary/10 rounded-full mt-2">
              <div 
                className="progress-fill bg-gradient-to-r from-cyber-danger to-cyber-accent h-3 rounded-full animate-pulse-neon"
                style={{ width: `${Math.min((summary?.totalExpenses || 0) / 2500 * 100, 100)}%` }}
              />
            </div>
          </div>
        </CyberpunkCard>
      </div>

      {/* Gráficos Cyberpunk */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de Barras - Receitas vs Despesas */}
        <CyberpunkCard className="chart-card glass animate-float">
          <h3 className="chart-title text-cyber-primary text-lg font-bold mb-4">Receitas vs Despesas (6 meses)</h3>
          <div className="chart-container" style={{ height: '300px' }}>
            {barChartData && (
              <Bar data={barChartData} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { display: false } } }} />
            )}
          </div>
        </CyberpunkCard>

        {/* Gráfico de Pizza - Gastos por Categoria */}
        <CyberpunkCard className="chart-card glass animate-float">
          <h3 className="chart-title text-cyber-primary text-lg font-bold mb-4">Gastos por Categoria</h3>
          <div className="chart-container" style={{ height: '300px' }}>
            {pieChartData && (
              <Pie data={pieChartData} options={pieOptions} />
            )}
          </div>
        </CyberpunkCard>
      </div>

      {/* Gráfico de Linha - Evolução do Saldo */}
      <CyberpunkCard className="chart-card glass animate-float">
        <h3 className="chart-title text-cyber-primary text-lg font-bold mb-4">Evolução do Saldo (30 dias)</h3>
        <div className="chart-container" style={{ height: '400px' }}>
          {lineChartData && (
            <Line data={lineChartData} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { display: false } } }} />
          )}
        </div>
      </CyberpunkCard>

      {/* Alertas e Insights Cyberpunk */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <CyberpunkCard className="alert-card glass animate-pulse-neon">
          <h3 className="alert-title text-cyber-accent text-lg font-bold mb-2">🤖 Insights da IA</h3>
          <div className="alert-content text-white-muted font-mono space-y-1">
            <p>• Você gastou <span className="text-cyber-accent">15% menos</span> em alimentação este mês</p>
            <p>• Maior gasto: <span className="text-cyber-danger">Compras online (R$ 890,00)</span></p>
            <p>• Sugestão: <span className="text-cyber-warning">Considere investir R$ 500,00 extras</span></p>
          </div>
        </CyberpunkCard>

        <CyberpunkCard className="alert-card glass animate-pulse-neon">
          <h3 className="alert-title text-cyber-danger text-lg font-bold mb-2">⚠️ Alertas</h3>
          <div className="alert-content text-white-muted font-mono space-y-1">
            <p>• Fatura do cartão vence em <span className="text-cyber-warning">3 dias</span></p>
            <p>• Meta de gastos em <span className="text-cyber-danger">85%</span> (restam <span className="text-cyber-accent">R$ 375,00</span>)</p>
            <p>• <span className="text-cyber-secondary">2 transações não categorizadas</span></p>
          </div>
        </CyberpunkCard>
      </div>
    </div>
  );
};

export default FinancialDashboard;