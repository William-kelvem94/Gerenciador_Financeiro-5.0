import type { ReactNode } from 'react';
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children }: { children: ReactNode }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="layout-container premium-layout min-h-screen font-family-primary">
      <Header onMenuClick={() => setMobileOpen(true)} />
      <div className="layout-main flex">
        <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
        {/* main: aplicar margem esquerda quando sidebar estiver visível em md+ */}
        <main className="main-content glass premium-main flex-1 main-with-sidebar p-6 md:p-10">
          <div className="container">
            {children}
          </div>
        </main>
      </div>
      <footer className="footer glass premium-footer mt-8 py-4 text-center text-muted-foreground">© 2025 Will Finance. Todos os direitos reservados.</footer>
    </div>
  );
};

export default Layout;
