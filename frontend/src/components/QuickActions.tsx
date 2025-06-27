import { Paper, Typography, Box, useTheme } from '@mui/material';
import { Add, Receipt, Assessment, Psychology } from '@mui/icons-material';

interface QuickActionsProps {
  onAddTransaction: () => void;
  onViewTransactions: () => void;
  onViewReports: () => void;
  onOpenAI: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  onAddTransaction,
  onViewTransactions,
  onViewReports,
  onOpenAI
}) => {
  const theme = useTheme();

  const actions = [
    {
      title: 'Adicionar Transação',
      icon: <Add />,
      color: theme.palette.success.main,
      onClick: onAddTransaction
    },
    {
      title: 'Ver Transações',
      icon: <Receipt />,
      color: theme.palette.primary.main,
      onClick: onViewTransactions
    },
    {
      title: 'Relatórios',
      icon: <Assessment />,
      color: theme.palette.warning.main,
      onClick: onViewReports
    },
    {
      title: 'IA Financeira',
      icon: <Psychology />,
      color: theme.palette.secondary.main,
      onClick: onOpenAI
    }
  ];

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" fontWeight="bold" mb={3}>
        Ações Rápidas
      </Typography>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }, gap: 2 }}>
        {actions.map((action) => (
          <Box 
            key={action.title.replace(/\s+/g, '-').toLowerCase()}
            onClick={action.onClick}
            sx={{ 
              p: 2, 
              textAlign: 'center', 
              borderRadius: 2, 
              bgcolor: action.color + '15',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: `2px solid ${action.color}20`,
              '&:hover': {
                bgcolor: action.color + '25',
                transform: 'translateY(-4px)',
                boxShadow: theme.shadows[8],
                border: `2px solid ${action.color}40`,
              }
            }}
          >
            <Box sx={{ color: action.color, fontSize: 32, mb: 1 }}>
              {action.icon}
            </Box>
            <Typography 
              variant="subtitle2" 
              fontWeight={600}
              color="textPrimary"
            >
              {action.title}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default QuickActions;
