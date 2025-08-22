import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-background-primary">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-8">{children}</main>
        <footer className="mt-8 text-center text-muted-foreground">
          &copy; {new Date().getFullYear()} Will Finance. Todos os direitos reservados.
        </footer>
      </div>
    </div>
  );
};
export default Layout;
