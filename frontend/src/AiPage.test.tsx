import { render, screen } from '@testing-library/react';
import AiPage from './AiPage';
import '@testing-library/jest-dom';

describe('AiPage', () => {
  it('deve renderizar o título da IA', () => {
    render(<AiPage />);
    expect(screen.getByText(/intelig[êe]ncia artificial|ia/i)).toBeInTheDocument();
  });

  it('deve exibir o componente de chat', () => {
    render(<AiPage />);
    expect(screen.getByTestId('ai-chat')).toBeInTheDocument();
  });
});
