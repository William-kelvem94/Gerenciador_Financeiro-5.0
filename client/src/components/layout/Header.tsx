import React from 'react';

const Header: React.FC = () => (
  <header className="w-full bg-background-tertiary text-cyber-primary shadow-neon flex items-center justify-between px-8 py-4">
    <h1 className="text-2xl font-bold text-neon">Will Finance 5.0</h1>
    <div>
      {/* Search, user info, notifications, etc */}
    </div>
  </header>
);

export default Header;
