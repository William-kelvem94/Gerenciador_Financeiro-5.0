import React, { useEffect, useState } from 'react';
import { Container, Typography, Grid, Card, CardContent } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import api from '../services/api';

export default function HomePage() {
  const [resumoContas, setResumoContas] = useState([]);
  const [evolucaoMensal, setEvolucaoMensal] = useState([]);
  const [despesasPorCategoria, setDespesasPorCategoria] = useState([]);

  useEffect(() => {
    // Buscar resumo das contas
    api.get('/reports/balance-by-account').then(res => setResumoContas(res.data));
    // Buscar evolução mensal
    api.get('/reports/dashboard/cashflow', { params: { year: new Date().getFullYear() } })
      .then(res => {
        // Transformar dados conforme necessário para o gráfico
        // Exemplo simples:
        setEvolucaoMensal(res.data);
      });
    // Buscar despesas por categoria
    api.get('/reports/dashboard/category-distribution').then(res => setDespesasPorCategoria(res.data));
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard Financeiro
      </Typography>
      <Grid container spacing={3}>
        {/* Resumo das Contas */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Resumo das Contas
              </Typography>
              {resumoContas.map((conta) => (
                <Typography key={conta.id || conta.name}>
                  {conta.name}: R$ {conta.balance ? Number(conta.balance).toFixed(2) : '0.00'}
                </Typography>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Evolução Mensal */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Evolução Mensal
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={evolucaoMensal}>
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="entradas" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="saidas" stroke="#ff6961" />
                  <Line type="monotone" dataKey="saldo" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Despesas por Categoria */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Despesas por Categoria
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={despesasPorCategoria}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {despesasPorCategoria.map((entry, index) => (
                      <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
