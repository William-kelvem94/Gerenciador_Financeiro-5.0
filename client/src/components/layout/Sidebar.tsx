import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navLinks: { href: string; label: string }[] = [
  { href: '/dashboard', label: '🏠 Dashboard' },
  { href: '/transactions', label: '🪙 Transações' },
  { href: '/budgets', label: '📑 Orçamentos' },
  { href: '/reports', label: '📈 Relatórios' },
  { href: '/settings', label: '⚙️ Configurações' },
  { href: '/logout', label: '� Sair' },
];

export default function Sidebar({ mobileOpen, setMobileOpen }: { mobileOpen?: boolean; setMobileOpen?: (open: boolean) => void }) {
  const location = useLocation();
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sidebar-box sidebar-desktop glass-strong">
        <div className="sidebar-brand">
          <h2 className="sidebar-brand-title text-neon">Will Finance</h2>
        </div>
        <nav>
    <ul className="nav-list">
            {navLinks.map(link => (
              <li key={link.href} className="nav-item">
                <Link to={link.href} className={`nav-link ${location.pathname === link.href ? 'active' : ''}`}>
      <span aria-hidden>{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && setMobileOpen && (
        <>
          <div className="mobile-drawer-backdrop" onClick={() => setMobileOpen(false)} />
          <aside className="sidebar-box sidebar-mobile glass-strong">
            <div className="sidebar-brand sidebar-brand-mobile">
              <h2 className="sidebar-brand-title text-neon">Will Finance</h2>
              <button className="btn btn-secondary" onClick={() => setMobileOpen(false)} aria-label="Fechar menu">✖</button>
            </div>
            <nav>
              <ul className="nav-list">
                {navLinks.map(link => (
                  <li key={link.href} className="nav-item">
                    <Link to={link.href} className={`nav-link ${location.pathname === link.href ? 'active' : ''}`} onClick={() => setMobileOpen(false)}>
                      <span aria-hidden>{link.label}</span>
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
