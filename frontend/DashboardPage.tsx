import { Box, Typography } from '@mui/material';

function DashboardPage({ dashboard }: { dashboard: any }) {
  if (!dashboard) return <Typography>Carregando...</Typography>;
  // Os gráficos serão renderizados no App.tsx, só repassando os dados aqui se necessário
  return null;
}

export default DashboardPage;
