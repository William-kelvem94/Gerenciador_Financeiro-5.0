import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './contexts/ThemeContext.tsx';
import './styles/cyberpunk-themes.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BrowserRouter>
          {/* Rotas e layout principal */}
          <div className="bg-background-primary min-h-screen text-foreground-primary">
            <h1 className="text-neon text-3xl font-bold p-8 text-center">Will Finance 5.0</h1>
            {/* TODO: Adicionar rotas e componentes principais */}
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
