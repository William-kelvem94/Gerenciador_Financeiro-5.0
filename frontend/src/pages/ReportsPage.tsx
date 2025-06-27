import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  useTheme,
  IconButton,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart,
  Timeline,
  Download,
  Share,
  Print,
  Refresh,
  Category,
  AttachMoney,
} from '@mui/icons-material';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  Line,
  ComposedChart,
  Bar,
} from 'recharts';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useDashboard } from '../hooks/useDashboard.js';
import { formatCurrency, formatPercentage, getCategoryColor } from '../utils/helpers.js';
import { CHART_COLORS } from '../utils/constants.js';

// Helper functions
const getProgressColor = (percentage: number, theme: any) => {
  if (percentage > 90) return theme.palette.error.main;
  if (percentage > 75) return theme.palette.warning.main;
  return theme.palette.success.main;
};

// Componente StatCard
interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
  trend?: 'up' | 'down';
  trendValue?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color,
  trend,
  trendValue 
}) => {
  const theme = useTheme();
  
  return (
    <Card elevation={2} sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar sx={{ bgcolor: color, mr: 2 }}>
            {icon}
          </Avatar>
          <Box flex={1}>
            <Typography variant="h6" fontWeight="bold">
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
          </Box>
          {trend && (
            <Box display="flex" alignItems="center">
              {trend === 'up' ? (
                <TrendingUp sx={{ color: theme.palette.success.main, mr: 0.5 }} />
              ) : (
                <TrendingDown sx={{ color: theme.palette.error.main, mr: 0.5 }} />
              )}
              <Typography 
                variant="caption" 
                color={trend === 'up' ? 'success.main' : 'error.main'}
                fontWeight="bold"
              >
                {trendValue}
              </Typography>
            </Box>
          )}
        </Box>
        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

// Componente BudgetProgress
interface BudgetProgressProps {
  budgetData: Array<{
    category: string;
    budget: number;
    spent: number;
    percentage: number;
  }>;
}

const BudgetProgress: React.FC<BudgetProgressProps> = ({ budgetData }) => {
  const theme = useTheme();
  
  return (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Orçamento vs Gasto
        </Typography>
        <List>
          {budgetData.map((item, index) => (
            <React.Fragment key={item.category}>
              <ListItem sx={{ px: 0 }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: getCategoryColor(item.category) }}>
                    <Category />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" fontWeight="medium">
                        {item.category}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatCurrency(item.spent)} / {formatCurrency(item.budget)}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box mt={1}>
                      <LinearProgress
                        variant="determinate"
                        value={item.percentage}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: 'grey.200',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: getProgressColor(item.percentage, theme),
                          },
                        }}
                      />
                      <Typography variant="caption" color="text.secondary" mt={0.5}>
                        {item.percentage.toFixed(1)}% do orçamento
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              {index < budgetData.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

// Componente CategoryTrendChart
interface CategoryTrendChartProps {
  categoryTrendData: Array<{
    month: string;
    [key: string]: string | number;
  }>;
}

const CategoryTrendChart: React.FC<CategoryTrendChartProps> = ({ categoryTrendData }) => (
  <Card elevation={2}>
    <CardContent>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Tendência de Gastos por Categoria
      </Typography>
      <Box height={300}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={categoryTrendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <RechartsTooltip formatter={(value) => formatCurrency(Number(value))} />
            <Legend />
            <Area type="monotone" dataKey="Alimentação" stackId="1" stroke={CHART_COLORS[0]} fill={CHART_COLORS[0]} />
            <Area type="monotone" dataKey="Transporte" stackId="1" stroke={CHART_COLORS[1]} fill={CHART_COLORS[1]} />
            <Area type="monotone" dataKey="Moradia" stackId="1" stroke={CHART_COLORS[2]} fill={CHART_COLORS[2]} />
            <Area type="monotone" dataKey="Lazer" stackId="1" stroke={CHART_COLORS[3]} fill={CHART_COLORS[3]} />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </CardContent>
  </Card>
);

// Componente IncomeVsExpenseChart
interface IncomeVsExpenseChartProps {
  incomeVsExpenseData: Array<{
    month: string;
    receita: number;
    despesa: number;
  }>;
}

const IncomeVsExpenseChart: React.FC<IncomeVsExpenseChartProps> = ({ incomeVsExpenseData }) => (
  <Card elevation={2}>
    <CardContent>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Receitas vs Despesas
      </Typography>
      <Box height={300}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={incomeVsExpenseData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <RechartsTooltip formatter={(value) => formatCurrency(Number(value))} />
            <Legend />
            <Bar dataKey="receita" fill="#4caf50" name="Receita" />
            <Bar dataKey="despesa" fill="#f44336" name="Despesa" />
            <Line type="monotone" dataKey="receita" stroke="#4caf50" strokeWidth={2} />
            <Line type="monotone" dataKey="despesa" stroke="#f44336" strokeWidth={2} />
          </ComposedChart>
        </ResponsiveContainer>
      </Box>
    </CardContent>
  </Card>
);

// Componente ExpenseDistributionChart
interface ExpenseDistributionChartProps {
  expenseDistributionData: Array<{
    name: string;
    value: number;
  }>;
}

const ExpenseDistributionChart: React.FC<ExpenseDistributionChartProps> = ({ expenseDistributionData }) => (
  <Card elevation={2}>
    <CardContent>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Distribuição de Gastos
      </Typography>
      <Box height={300}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={expenseDistributionData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {expenseDistributionData.map((entry, index) => (
                <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Pie>
            <RechartsTooltip formatter={(value) => formatCurrency(Number(value))} />
          </RechartsPieChart>
        </ResponsiveContainer>
      </Box>
    </CardContent>
  </Card>
);

const ReportsPage: React.FC = () => {
  const theme = useTheme();
  const { data, loading, refresh } = useDashboard();

  // Estado
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReportType, setSelectedReportType] = useState('overview');
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    end: new Date(),
  });

  // Dados mock para demonstração
  const categoryTrendData = [
    { month: 'Jan', Alimentação: 800, Transporte: 300, Moradia: 1200, Lazer: 200 },
    { month: 'Fev', Alimentação: 900, Transporte: 250, Moradia: 1200, Lazer: 150 },
    { month: 'Mar', Alimentação: 750, Transporte: 400, Moradia: 1200, Lazer: 300 },
    { month: 'Abr', Alimentação: 850, Transporte: 350, Moradia: 1200, Lazer: 250 },
    { month: 'Mai', Alimentação: 700, Transporte: 300, Moradia: 1200, Lazer: 400 },
    { month: 'Jun', Alimentação: 950, Transporte: 280, Moradia: 1200, Lazer: 180 },
  ];

  const incomeVsExpenseData = [
    { month: 'Jan', receita: 5000, despesa: 2500 },
    { month: 'Fev', receita: 5200, despesa: 2500 },
    { month: 'Mar', receita: 4800, despesa: 2650 },
    { month: 'Abr', receita: 5100, despesa: 2650 },
    { month: 'Mai', receita: 5300, despesa: 2600 },
    { month: 'Jun', receita: 5000, despesa: 2610 },
  ];

  const expenseDistributionData = [
    { name: 'Alimentação', value: 850 },
    { name: 'Transporte', value: 350 },
    { name: 'Moradia', value: 1200 },
    { name: 'Lazer', value: 250 },
    { name: 'Outros', value: 180 },
  ];

  const budgetData = [
    { category: 'Alimentação', budget: 1000, spent: 850, percentage: 85 },
    { category: 'Transporte', budget: 400, spent: 350, percentage: 87.5 },
    { category: 'Moradia', budget: 1200, spent: 1200, percentage: 100 },
    { category: 'Lazer', budget: 300, spent: 250, percentage: 83.3 },
    { category: 'Saúde', budget: 200, spent: 150, percentage: 75 },
  ];

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Carregando relatórios...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Relatórios Financeiros
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Análise detalhada das suas finanças
          </Typography>
        </Box>
        <Box display="flex" gap={1}>
          <Tooltip title="Baixar Relatório">
            <IconButton>
              <Download />
            </IconButton>
          </Tooltip>
          <Tooltip title="Compartilhar">
            <IconButton>
              <Share />
            </IconButton>
          </Tooltip>
          <Tooltip title="Imprimir">
            <IconButton>
              <Print />
            </IconButton>
          </Tooltip>
          <Tooltip title="Atualizar">
            <IconButton onClick={refresh}>
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Filtros */}
      <Card elevation={2} sx={{ mb: 3 }}>
        <CardContent>
          <Box 
            display="flex" 
            flexWrap="wrap" 
            gap={2}
            alignItems="center"
          >
            <Box sx={{ minWidth: 200, flex: '1 1 200px' }}>
              <FormControl fullWidth size="small">
                <InputLabel>Período</InputLabel>
                <Select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  label="Período"
                >
                  <MenuItem value="week">Esta Semana</MenuItem>
                  <MenuItem value="month">Este Mês</MenuItem>
                  <MenuItem value="quarter">Este Trimestre</MenuItem>
                  <MenuItem value="year">Este Ano</MenuItem>
                  <MenuItem value="custom">Personalizado</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <Box sx={{ minWidth: 200, flex: '1 1 200px' }}>
              <FormControl fullWidth size="small">
                <InputLabel>Tipo de Relatório</InputLabel>
                <Select
                  value={selectedReportType}
                  onChange={(e) => setSelectedReportType(e.target.value)}
                  label="Tipo de Relatório"
                >
                  <MenuItem value="overview">Visão Geral</MenuItem>
                  <MenuItem value="categories">Por Categoria</MenuItem>
                  <MenuItem value="accounts">Por Conta</MenuItem>
                  <MenuItem value="trends">Tendências</MenuItem>
                  <MenuItem value="budget">Orçamento</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            {selectedPeriod === 'custom' && (
              <>
                <Box sx={{ minWidth: 200, flex: '1 1 200px' }}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Data Inicial"
                      value={dateRange.start}
                      onChange={(date) => setDateRange(prev => ({ ...prev, start: date }))}
                      slotProps={{ textField: { size: 'small', fullWidth: true } }}
                    />
                  </LocalizationProvider>
                </Box>
                <Box sx={{ minWidth: 200, flex: '1 1 200px' }}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Data Final"
                      value={dateRange.end}
                      onChange={(date) => setDateRange(prev => ({ ...prev, end: date }))}
                      slotProps={{ textField: { size: 'small', fullWidth: true } }}
                    />
                  </LocalizationProvider>
                </Box>
              </>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Estatísticas Principais */}
      <Box 
        display="flex" 
        flexWrap="wrap" 
        gap={3}
        sx={{ 
          mb: 4,
          '& > *': {
            flex: '1 1 250px',
            minWidth: 250
          }
        }}
      >
        <StatCard
          title="Receita Total"
          value={formatCurrency(data?.totalIncome ?? 0)}
          subtitle="No período selecionado"
          icon={<TrendingUp />}
          color={theme.palette.success.main}
          trend="up"
          trendValue="12%"
        />
        <StatCard
          title="Despesa Total"
          value={formatCurrency(data?.totalExpenses ?? 0)}
          subtitle="No período selecionado"
          icon={<TrendingDown />}
          color={theme.palette.error.main}
          trend="down"
          trendValue="5%"
        />
        <StatCard
          title="Economia"
          value={formatCurrency(data?.balance ?? 0)}
          subtitle="Diferença entre receitas e despesas"
          icon={<AttachMoney />}
          color={theme.palette.primary.main}
          trend="up"
          trendValue="23%"
        />
        <StatCard
          title="Taxa de Economia"
          value={formatPercentage(((data?.balance ?? 0) / (data?.totalIncome ?? 1)) * 100)}
          subtitle="Percentual economizado"
          icon={<PieChart />}
          color={theme.palette.secondary.main}
          trend="up"
          trendValue="8%"
        />
      </Box>

      {/* Gráficos */}
      <Box 
        display="flex" 
        flexDirection="column" 
        gap={3}
        sx={{ mb: 3 }}
      >
        <Box 
          display="flex" 
          flexWrap="wrap" 
          gap={3}
          sx={{
            '& > *': {
              flex: '1 1 400px',
              minWidth: 400
            }
          }}
        >
          <ExpenseDistributionChart expenseDistributionData={expenseDistributionData} />
          <BudgetProgress budgetData={budgetData} />
        </Box>
        <Box>
          <IncomeVsExpenseChart incomeVsExpenseData={incomeVsExpenseData} />
        </Box>
        <Box>
          <CategoryTrendChart categoryTrendData={categoryTrendData} />
        </Box>
      </Box>

      {/* Insights e Recomendações */}
      <Card elevation={2} sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Insights e Recomendações
          </Typography>
          <Box 
            display="flex" 
            flexWrap="wrap" 
            gap={2}
            sx={{
              '& > *': {
                flex: '1 1 250px',
                minWidth: 250
              }
            }}
          >
            <Paper sx={{ p: 2, bgcolor: theme.palette.success.main + '10' }}>
              <Box display="flex" alignItems="center" mb={1}>
                <TrendingUp sx={{ color: theme.palette.success.main, mr: 1 }} />
                <Typography variant="subtitle2" fontWeight="bold">
                  Ponto Positivo
                </Typography>
              </Box>
              <Typography variant="body2">
                Suas receitas aumentaram 12% em relação ao mês anterior. Continue assim!
              </Typography>
            </Paper>
            <Paper sx={{ p: 2, bgcolor: theme.palette.warning.main + '10' }}>
              <Box display="flex" alignItems="center" mb={1}>
                <Timeline sx={{ color: theme.palette.warning.main, mr: 1 }} />
                <Typography variant="subtitle2" fontWeight="bold">
                  Atenção
                </Typography>
              </Box>
              <Typography variant="body2">
                Gastos com alimentação estão 15% acima do orçamento mensal.
              </Typography>
            </Paper>
            <Paper sx={{ p: 2, bgcolor: theme.palette.info.main + '10' }}>
              <Box display="flex" alignItems="center" mb={1}>
                <BarChart sx={{ color: theme.palette.info.main, mr: 1 }} />
                <Typography variant="subtitle2" fontWeight="bold">
                  Recomendação
                </Typography>
              </Box>
              <Typography variant="body2">
                Considere criar uma meta de economia de 20% para o próximo mês.
              </Typography>
            </Paper>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ReportsPage;
