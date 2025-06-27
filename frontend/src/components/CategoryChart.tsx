import { Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from '../utils/helpers.js';
import { CHART_COLORS } from '../utils/constants.js';

interface CategoryData {
  category: string;
  amount: number;
  color?: string;
  percentage?: number;
}

interface CategoryChartProps {
  data: CategoryData[];
  loading?: boolean;
}

const CategoryChart: React.FC<CategoryChartProps> = ({ data = [], loading = false }) => {
  if (loading) {
    return (
      <Card elevation={2}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Gastos por Categoria
          </Typography>
          <Box display="flex" justifyContent="center" alignItems="center" height={250}>
            <Skeleton variant="circular" width={200} height={200} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  const hasData = data && data.length > 0;

  return (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Gastos por Categoria
        </Typography>
        
        {!hasData ? (
          <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            height={250}
            color="text.secondary"
          >
            <Typography variant="body1">
              Nenhum dado disponível
            </Typography>
          </Box>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                dataKey="amount"
                label={({ category, percentage }) => `${category} (${percentage}%)`}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`category-${entry.category}-${index}`} 
                    fill={entry.color ?? CHART_COLORS[index % CHART_COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(label) => `Categoria: ${label}`}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryChart;
