import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-background-primary">
    <Header />
    <div className="flex flex-1">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
    <Footer />
  </div>
);

export default Layout;
