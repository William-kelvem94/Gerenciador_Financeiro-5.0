import { Box, CssBaseline, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, AppBar, Typography, Card, CardContent } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { BarChart, PieChart, LineChart, ScatterChart } from '@mui/x-charts';
import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import TransactionsPage from './TransactionsPage';
import ReportsPage from './ReportsPage';
import SettingsPage from './SettingsPage';
import AiPage from './AiPage';
import './App.css';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Transações', icon: <ReceiptLongIcon />, path: '/transacoes' },
  { text: 'Relatórios', icon: <BarChartIcon />, path: '/relatorios' },
  { text: 'Configurações', icon: <SettingsIcon />, path: '/configuracoes' },
  { text: 'Inteligência Artificial', icon: <SmartToyIcon />, path: '/ia' },
];

function App() {
  const [dashboard, setDashboard] = useState<any>(null);
  const navigate = useNavigate();

  const fetchDashboard = () => {
    // API local do backend (porta 3000 em desenvolvimento local)
    const apiUrl = window.location.port === '4000' 
      ? 'http://localhost:3000/dashboard'  // Desenvolvimento local
      : 'http://localhost:3001/dashboard'; // Docker
      
    fetch(apiUrl)
      .then(res => res.json())
      .then(setDashboard)
      .catch(() => setDashboard(null));
  };

  useEffect(() => {
    fetchDashboard();
    window.addEventListener('focus', fetchDashboard);
    window.addEventListener('dashboardUpdate', fetchDashboard);
    return () => {
      window.removeEventListener('focus', fetchDashboard);
      window.removeEventListener('dashboardUpdate', fetchDashboard);
    };
  }, []);

  // Dados reais: se não houver dados, gráficos ficam vazios
  type BarData = { name: string; valor: number };
  const barData: BarData[] = dashboard?.porCategoria?.map((c: any) => ({ name: c.category, valor: Number(c.total) })) || [];
  type PieData = { id: number; value: number; label: string };
  const pieData: PieData[] = dashboard?.porCategoria?.map((c: any, i: number) => ({ id: i, value: Number(c.total), label: c.category })) || [];
  type LineData = { x: number; y: number };
  const lineData: LineData[] = barData.map((d: BarData, i: number) => ({ x: i + 1, y: d.valor }));
  const scatterData = barData.map((d: BarData, i: number) => ({ x: i + 1, y: d.valor, z: d.valor / 10 }));

  // Cores para entrada e saída
  const entradaColor = '#4caf50'; // verde
  const saidaColor = '#f44336'; // vermelho
  // BarChart: cor por valor (positivo = entrada, negativo = saída)
  // O componente BarChart do @mui/x-charts não aceita colorByPoint, então usamos a propriedade 'color' na série
  // Para múltiplas cores, é necessário dividir a série em duas: entradas e saídas
  const entradaBarData = barData.map(d => d.valor >= 0 ? d.valor : null);
  const saidaBarData = barData.map(d => d.valor < 0 ? Math.abs(d.valor) : null);

  // PieChart: define cor única se todos forem entrada ou todos saída
  let pieColor: string | undefined = undefined;
  if (pieData.length > 0) {
    if (pieData.every(d => d.value >= 0)) pieColor = entradaColor;
    else if (pieData.every(d => d.value < 0)) pieColor = saidaColor;
  }
  // LineChart: cor única, mas pode ser verde/vermelho
  const lineColor = barData.some(d => d.valor < 0) ? saidaColor : entradaColor;
  // ScatterChart: cor única, mas pode ser verde/vermelho
  const scatterColor = barData.some(d => d.valor < 0) ? saidaColor : entradaColor;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Gerenciador Financeiro 3.0
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item) => (
              <ListItem disablePadding key={item.text}>
                <ListItemButton onClick={() => navigate(item.path)}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
        <Toolbar />
        <Routes>
          <Route path="/" element={
            barData.length === 0 && pieData.length === 0 ? (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h5" color="text.secondary">Nenhum dado cadastrado ainda!</Typography>
                <Typography variant="body1">Cadastre transações para visualizar os gráficos do seu financeiro.</Typography>
              </Box>
            ) : (
              <>
                <Typography variant="h4" gutterBottom>Dashboard</Typography>
                <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  <Card sx={{ minWidth: 340, maxWidth: 360, flex: 1 }}>
                    <CardContent>
                      <Typography variant="h6">Gráfico de Torre</Typography>
                      <BarChart
                        xAxis={[{ scaleType: 'band', data: barData.map(d => d.name) }]}
                        series={[
                          { data: entradaBarData, color: entradaColor, label: 'Entradas' },
                          { data: saidaBarData, color: saidaColor, label: 'Saídas' },
                        ]}
                        width={300}
                        height={200}
                      />
                    </CardContent>
                  </Card>
                  <Card sx={{ minWidth: 340, maxWidth: 360, flex: 1 }}>
                    <CardContent>
                      <Typography variant="h6">Gráfico de Pizza</Typography>
                      <PieChart
                        series={[{ data: pieData, color: pieColor }]}
                        width={300}
                        height={200}
                      />
                    </CardContent>
                  </Card>
                  <Card sx={{ minWidth: 340, maxWidth: 360, flex: 1 }}>
                    <CardContent>
                      <Typography variant="h6">Gráfico de Linha</Typography>
                      <LineChart
                        xAxis={[{ data: lineData.map(d => d.x) }]}
                        series={[{ data: lineData.map(d => d.y), color: lineColor }]}
                        width={300}
                        height={200}
                      />
                    </CardContent>
                  </Card>
                  <Card sx={{ minWidth: 340, maxWidth: 360, flex: 1 }}>
                    <CardContent>
                      <Typography variant="h6">Gráfico 3D (Simulado)</Typography>
                      <ScatterChart
                        series={[{ data: scatterData.map(d => ({ x: d.x, y: d.y, z: d.z })), color: scatterColor }]}
                        width={300}
                        height={200}
                      />
                    </CardContent>
                  </Card>
                </Box>
              </>
            )
          } />
          <Route path="/transacoes" element={<TransactionsPage />} />
          <Route path="/relatorios" element={<ReportsPage />} />
          <Route path="/configuracoes" element={<SettingsPage />} />
          <Route path="/ia" element={<AiPage />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
