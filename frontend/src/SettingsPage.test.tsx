import { render, screen } from '@testing-library/react';
import SettingsPage from './SettingsPage';
import '@testing-library/jest-dom';

describe('SettingsPage', () => {
  it('deve renderizar o título de configurações', () => {
    render(<SettingsPage />);
    expect(screen.getByText(/configura[cç][aã]o/i)).toBeInTheDocument();
  });

  it('deve exibir opções de configuração', () => {
    render(<SettingsPage />);
    expect(screen.getByTestId('settings-options')).toBeInTheDocument();
  });
});
