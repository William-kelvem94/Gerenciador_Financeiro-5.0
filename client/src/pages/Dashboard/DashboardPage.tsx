import DashboardCards from './DashboardCards';

const DashboardPage = () => {
  return (
    <div>
      <h1 className="text-3xl text-neon font-bold mb-4">Dashboard Financeiro</h1>
      <DashboardCards />
      <p className="card-description mb-4">Bem-vindo ao Will Finance 5.0!</p>
      {/* Aqui podem entrar gráficos, widgets, etc. */}
    </div>
  );
};
export default DashboardPage;
