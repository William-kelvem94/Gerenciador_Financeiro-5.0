import { Card, CardContent, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, Skeleton, Box, Chip } from '@mui/material';
import { Receipt, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { formatCurrency, formatDate, getCategoryColor } from '../utils/helpers.js';
import { Transaction } from '../types/index.js';

interface RecentTransactionsProps {
  transactions: Transaction[];
  loading?: boolean;
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions = [], loading = false }) => {
  if (loading) {
    return (
      <Card elevation={2}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Transações Recentes
          </Typography>
          <List>
            {[...Array(5)].map((_, i) => (
              <ListItem key={`recent-skeleton-${i + 1}`} divider>
                <ListItemAvatar>
                  <Skeleton variant="circular" width={40} height={40} />
                </ListItemAvatar>
                <ListItemText
                  primary={<Skeleton variant="text" width="70%" />}
                  secondary={<Skeleton variant="text" width="50%" />}
                />
                <Skeleton variant="text" width={80} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Transações Recentes
        </Typography>
        
        {transactions.length === 0 ? (
          <Box 
            display="flex" 
            flexDirection="column" 
            alignItems="center" 
            justifyContent="center" 
            py={4}
            color="text.secondary"
          >
            <Receipt sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
            <Typography variant="body1">
              Nenhuma transação encontrada
            </Typography>
          </Box>
        ) : (
          <List>
            {transactions.slice(0, 5).map((transaction) => (
              <ListItem key={transaction.id} divider sx={{ px: 0 }}>
                <ListItemAvatar>
                  <Avatar 
                    sx={{ 
                      bgcolor: transaction.type === 'income' ? 'success.main' : 'error.main',
                      color: 'white'
                    }}
                  >
                    {transaction.type === 'income' ? (
                      <ArrowUpward />
                    ) : (
                      <ArrowDownward />
                    )}
                  </Avatar>
                </ListItemAvatar>
                
                <ListItemText
                  primary={
                    <Typography variant="subtitle2" fontWeight={500}>
                      {transaction.description}
                    </Typography>
                  }
                  secondary={
                    <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(transaction.date)}
                      </Typography>
                      <Chip
                        label={transaction.category}
                        size="small"
                        sx={{
                          bgcolor: getCategoryColor(transaction.category) + '20',
                          color: getCategoryColor(transaction.category),
                          fontSize: 10,
                          height: 20,
                        }}
                      />
                    </Box>
                  }
                />
                
                <Typography 
                  variant="subtitle2" 
                  fontWeight="bold"
                  color={transaction.type === 'income' ? 'success.main' : 'error.main'}
                >
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                </Typography>
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
