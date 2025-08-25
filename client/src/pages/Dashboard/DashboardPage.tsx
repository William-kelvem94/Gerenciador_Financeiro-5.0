import DashboardCards from './DashboardCards';
import RevenueChart from '../../components/dashboard/RevenueChart';
import Sparkline from '../../components/dashboard/Sparkline';
import RecentTransactions from '../../components/dashboard/RecentTransactions';
import useDashboardData from '../../hooks/useDashboardData';

const DashboardPage = () => {
  const { data } = useDashboardData();
  // fallback numbers for widgets
  const revenue = 8000;
  const expenses = 5500;
  const sparkData = [1200, 1500, 1800, 1600, 1900, 2200, 2100, 2400];

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1 className="page-title">Dashboard Financeiro</h1>
        <p className="card-description">Bem-vindo ao Will Finance 5.0!</p>
      </div>

      <div className="dashboard-grid">
        <main className="dashboard-main">
          <DashboardCards />

          <div className="widgets-row">
            <div className="widget card glass">
              <div className="widget-header">
                <h3 className="widget-title">Fluxo mensal</h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Sparkline points={sparkData} />
                <div>
                  <div className="muted">Receita média</div>
                  <div className="card-value">R$ {Math.round(revenue).toLocaleString('pt-BR')}</div>
                </div>
              </div>
            </div>

            <div className="widget card glass">
              <div className="widget-header">
                <h3 className="widget-title">Receitas x Despesas</h3>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <RevenueChart revenue={revenue} expenses={expenses} />
              </div>
            </div>
          </div>
        </main>

        <aside className="dashboard-aside">
          <RecentTransactions />
          <div className="widget card glass">
            <div className="widget-header"><h3 className="widget-title">Atalhos</h3></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <button className="btn-primary">Nova Transação</button>
              <button className="btn-outline">Novo Orçamento</button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DashboardPage;
