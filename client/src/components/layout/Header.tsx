import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface HeaderProps { onMenuClick?: () => void }

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="header glass premium-header">
      <div className="header-inner">
        <button className="menu-btn" onClick={onMenuClick} aria-label="Abrir menu">☰</button>
        <div className="header-title-wrap">
          <span className="header-title neon-text">Will Finance 5.0 <span className="enterprise">Enterprise</span></span>
        </div>
      </div>
    </header>
  );
};

export default Header;
