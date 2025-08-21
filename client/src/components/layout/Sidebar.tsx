import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => (
  <aside className="w-64 bg-background-secondary text-foreground-primary flex flex-col shadow-lg glass">
    <nav className="flex-1 p-4">
      <ul className="space-y-4">
        <li><Link to="/dashboard" className="text-neon">Dashboard</Link></li>
        <li><Link to="/transactions">Transações</Link></li>
        <li><Link to="/budgets">Orçamentos</Link></li>
        <li><Link to="/reports">Relatórios</Link></li>
        <li><Link to="/settings">Configurações</Link></li>
        <li><Link to="/admin">Admin</Link></li>
      </ul>
    </nav>
  </aside>
);

export default Sidebar;
