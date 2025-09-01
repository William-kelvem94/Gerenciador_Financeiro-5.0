import { describe, it, expect } from 'vitest';

describe('Setup básico de testes', () => {
  it('deve configurar o ambiente de testes corretamente', () => {
    expect(true).toBe(true);
  });

  it('deve ter access ao localStorage', () => {
    expect(localStorage).toBeDefined();
    expect(localStorage.getItem).toBeDefined();
  });

  it('deve ter access ao fetch', () => {
    expect(fetch).toBeDefined();
  });

  it('deve conseguir executar testes básicos', () => {
    const soma = 2 + 2;
    expect(soma).toBe(4);
  });
});
