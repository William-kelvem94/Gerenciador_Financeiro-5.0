import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import DashboardPage from './pages/Dashboard/DashboardPage';
import './styles/index.css';

const App = () => (
  <BrowserRouter>
    <DashboardPage />
  </BrowserRouter>
);

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
