import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../../icons/iconRegistry';

interface HeaderProps { onMenuClick?: () => void }

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="header glass premium-header" role="banner">
      <div className="header-inner">
        <button className="btn-outline menu-btn" onClick={onMenuClick} aria-label="Abrir menu">
          <Icon name="Menu" size={18} />
        </button>
        <div className="header-title-wrap">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div className="brand-mark" aria-hidden style={{ width: 36, height: 36, borderRadius: 8, background: 'linear-gradient(90deg, rgba(41,240,230,0.12), rgba(255,111,181,0.08))' }} />
            <div>
              <div className="header-title neon-text">Will Finance 5.0</div>
              <div className="header-sub" style={{ fontSize: '0.78rem', color: 'var(--foreground-muted)' }}>Enterprise</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
            <button className="btn-outline" aria-label="Pesquisar">
              <Icon name="Search" size={16} />
            </button>
            <button className="btn-outline" aria-label="Notificações">
              <Icon name="Bell" size={16} />
            </button>
            <button className="btn-outline" aria-label="Perfil" style={{ padding: '0.36rem', borderRadius: 999 }}>
              <Icon name="User" size={18} />
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
