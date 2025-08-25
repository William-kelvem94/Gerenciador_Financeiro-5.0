import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Wallet, Layers, BarChart2, Settings, LogOut } from 'lucide-react';
import Icon from '../../icons/iconRegistry';

const navLinks: { href: string; label: string; icon: React.ReactNode }[] = [
  { href: '/dashboard', label: 'Dashboard', icon: <Home size={18} /> },
  { href: '/transactions', label: 'Transações', icon: <Wallet size={18} /> },
  { href: '/budgets', label: 'Orçamentos', icon: <Layers size={18} /> },
  { href: '/reports', label: 'Relatórios', icon: <BarChart2 size={18} /> },
  { href: '/settings', label: 'Configurações', icon: <Settings size={18} /> },
  { href: '/logout', label: 'Sair', icon: <LogOut size={18} /> },
];

export default function Sidebar({ mobileOpen, setMobileOpen }: { mobileOpen?: boolean; setMobileOpen?: (open: boolean) => void }) {
  const location = useLocation();
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sidebar-box sidebar-desktop glass-strong" role="navigation" aria-label="Navegação principal">
        <div className="sidebar-brand">
          <h2 className="sidebar-brand-title text-neon">Will Finance</h2>
        </div>
        <nav>
          <ul className="nav-list">
            {navLinks.slice(0,5).map(link => (
              <li key={link.href} className="nav-item">
                <Link to={link.href} className={`nav-link ${location.pathname === link.href ? 'active' : ''}`} aria-current={location.pathname === link.href ? 'page' : undefined}>
                  <span className="nav-icon" aria-hidden>{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div style={{ marginTop: '1rem', padding: '0 1rem' }}>
          <small className="text-muted-foreground">Conta</small>
          <div style={{ marginTop: '0.6rem' }}>
            <Link to="/settings" className="nav-link"><span className="nav-icon" aria-hidden><Icon name="Settings" size={16} /></span> Configurações</Link>
          </div>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && setMobileOpen && (
        <>
          <div className="mobile-drawer-backdrop" onClick={() => setMobileOpen(false)} />
          <aside className="sidebar-box sidebar-mobile glass-strong" role="dialog" aria-modal="true" aria-label="Menu de navegação">
            <div className="sidebar-brand sidebar-brand-mobile">
              <h2 className="sidebar-brand-title text-neon">Will Finance</h2>
              <button className="btn-outline" onClick={() => setMobileOpen(false)} aria-label="Fechar menu"><Icon name="LogOut" size={16} /></button>
            </div>
            <nav>
              <ul className="nav-list">
                {navLinks.map(link => (
                  <li key={link.href} className="nav-item">
                    <Link to={link.href} className={`nav-link ${location.pathname === link.href ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>
                      <span className="nav-icon" aria-hidden>{link.icon}</span>
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </>
      )}
    </>
  );
}
