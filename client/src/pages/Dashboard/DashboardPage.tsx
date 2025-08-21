import React from 'react';
import Layout from '../../components/layout/Layout';

const DashboardPage: React.FC = () => (
  <Layout>
    <section className="card">
      <h2 className="text-xl font-bold text-neon mb-4">Resumo Financeiro</h2>
      {/* Gráficos, métricas, widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-background-secondary p-4 rounded-lg shadow-neon">
          <span className="text-cyber-primary">Receitas</span>
          <h3 className="text-2xl font-bold">R$ 12.500,00</h3>
        </div>
        <div className="bg-background-secondary p-4 rounded-lg shadow-neon">
          <span className="text-cyber-danger">Despesas</span>
          <h3 className="text-2xl font-bold">R$ 8.200,00</h3>
        </div>
      </div>
      <div className="mt-8">
        {/* Gráfico de tendências, widgets IA, alertas */}
        <p className="text-muted-foreground">Gráficos e insights automáticos aqui...</p>
      </div>
    </section>
  </Layout>
);

export default DashboardPage;
