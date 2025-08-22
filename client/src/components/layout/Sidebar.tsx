import { NavLink } from 'react-router-dom';

const menu = [
  { label: 'Dashboard', path: '/', icon: '📊' },
  { label: 'Transações', path: '/transactions', icon: '💸' },
  { label: 'Orçamentos', path: '/budgets', icon: '🗂️' },
  { label: 'Relatórios', path: '/reports', icon: '📈' },
  { label: 'Configurações', path: '/settings', icon: '⚙️' },
  { label: 'Sair', path: '/logout', icon: '🚪' },
];

const Sidebar = () => (
  <aside className="glass-strong w-64 min-h-screen p-6 flex flex-col gap-6 shadow-neon">
    <h2 className="text-neon text-2xl font-bold mb-8">Will Finance</h2>
    <nav className="flex flex-col gap-4">
      {menu.map(item => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-lg font-semibold transition-all text-lg ${isActive ? 'text-neon bg-background-secondary' : 'text-foreground-muted hover:text-neon hover:bg-background-secondary/50'}`
          }
        >
          <span className="text-xl">{item.icon}</span>
          {item.label}
        </NavLink>
      ))}
    </nav>
  </aside>
);

export default Sidebar;
