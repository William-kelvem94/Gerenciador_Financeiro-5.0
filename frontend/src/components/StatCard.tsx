import { Card, CardContent, Typography, Box, useTheme, Skeleton } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';
import { formatCurrency } from '../utils/helpers.js';

interface StatCardProps {
  title: string;
  value: number;
  change?: number;
  changePercent?: number;
  icon: React.ReactNode;
  color: string;
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  change = 0, 
  changePercent = 0, 
  icon, 
  color, 
  loading = false 
}) => {
  const theme = useTheme();
  const isPositive = change >= 0;

  if (loading) {
    return (
      <Card 
        elevation={2}
        sx={{ 
          height: '100%',
          background: `linear-gradient(135deg, ${color}15, ${color}25)`,
          border: `1px solid ${color}30`,
        }}
      >
        <CardContent>
          <Skeleton variant="text" width="60%" height={24} />
          <Skeleton variant="text" width="80%" height={32} sx={{ mt: 1 }} />
          <Skeleton variant="text" width="40%" height={20} sx={{ mt: 1 }} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      elevation={2}
      sx={{ 
        height: '100%',
        background: `linear-gradient(135deg, ${color}15, ${color}25)`,
        border: `1px solid ${color}30`,
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        }
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
          <Typography variant="subtitle2" color="textSecondary" fontWeight={500}>
            {title}
          </Typography>
          <Box sx={{ color, fontSize: 24 }}>
            {icon}
          </Box>
        </Box>
        
        <Typography variant="h4" fontWeight="bold" color="textPrimary" mb={1}>
          {formatCurrency(value)}
        </Typography>
        
        <Box display="flex" alignItems="center" gap={0.5}>
          {isPositive ? (
            <TrendingUp sx={{ color: theme.palette.success.main, fontSize: 18 }} />
          ) : (
            <TrendingDown sx={{ color: theme.palette.error.main, fontSize: 18 }} />
          )}
          
          <Typography 
            variant="body2" 
            color={isPositive ? theme.palette.success.main : theme.palette.error.main}
            fontWeight={500}
          >
            {isPositive ? '+' : ''}{changePercent.toFixed(1)}%
          </Typography>
          
          <Typography variant="body2" color="textSecondary" ml={1}>
            ({isPositive ? '+' : ''}{formatCurrency(change)})
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;
