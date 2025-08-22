const cards = [
  { title: 'Saldo Atual', value: 'R$ 12.500,00', icon: '💰', color: 'bg-cyber-primary/10' },
  { title: 'Receitas do Mês', value: 'R$ 8.000,00', icon: '🟢', color: 'bg-cyber-success/10' },
  { title: 'Despesas do Mês', value: 'R$ 5.500,00', icon: '🔴', color: 'bg-cyber-danger/10' },
  { title: 'Orçamento', value: 'R$ 10.000,00', icon: '📋', color: 'bg-cyber-secondary/10' },
];

const DashboardCards = () => (
  <div className="grid grid-cols-2 gap-6 mb-8">
    {cards.map(card => (
      <div key={card.title} className={`card flex items-center gap-4 ${card.color}`}>
        <span className="text-3xl">{card.icon}</span>
        <div>
          <h3 className="card-title text-neon text-lg">{card.title}</h3>
          <p className="text-xl font-bold">{card.value}</p>
        </div>
      </div>
    ))}
  </div>
);

export default DashboardCards;
