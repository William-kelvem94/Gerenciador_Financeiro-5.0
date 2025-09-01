-- Will Finance 5.0 - Database Seed Data
-- This file contains demo data for development and testing

-- Insert demo user
INSERT INTO users (
  id, email, name, password, 
  theme, language, currency, timezone,
  budgetAlerts, emailNotifications, pushNotifications,
  createdAt, updatedAt
) VALUES (
  'demo-user-1',
  'demo@willfinance.com',
  'Demo User',
  '$2b$10$K7L/lQvxqnb5A.R5kQ1K2eQh6UY.6YvPyJgEJ5vZZ5G8yN2Z2Z2Z2',
  'dark',
  'pt-BR',
  'BRL',
  'America/Sao_Paulo',
  true,
  true,
  true,
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Insert demo categories
INSERT INTO categories (id, name, icon, color, type, userId, isSystem, createdAt, updatedAt) VALUES
('cat-income-1', 'Salário', 'dollar-sign', '#10B981', 'income', 'demo-user-1', false, NOW(), NOW()),
('cat-income-2', 'Freelance', 'briefcase', '#059669', 'income', 'demo-user-1', false, NOW(), NOW()),
('cat-income-3', 'Investimentos', 'trending-up', '#047857', 'income', 'demo-user-1', false, NOW(), NOW()),
('cat-expense-1', 'Alimentação', 'utensils', '#EF4444', 'expense', 'demo-user-1', false, NOW(), NOW()),
('cat-expense-2', 'Transporte', 'car', '#F97316', 'expense', 'demo-user-1', false, NOW(), NOW()),
('cat-expense-3', 'Moradia', 'home', '#8B5CF6', 'expense', 'demo-user-1', false, NOW(), NOW()),
('cat-expense-4', 'Saúde', 'heart', '#EC4899', 'expense', 'demo-user-1', false, NOW(), NOW()),
('cat-expense-5', 'Lazer', 'smile', '#06B6D4', 'expense', 'demo-user-1', false, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert demo accounts
INSERT INTO accounts (id, name, type, balance, currency, userId, color, icon, createdAt, updatedAt) VALUES
('acc-main-1', 'Conta Principal', 'checking', 5420.75, 'BRL', 'demo-user-1', '#3B82F6', 'credit-card', NOW(), NOW()),
('acc-savings-1', 'Poupança', 'savings', 12500.00, 'BRL', 'demo-user-1', '#10B981', 'piggy-bank', NOW(), NOW()),
('acc-credit-1', 'Cartão de Crédito', 'credit', -850.30, 'BRL', 'demo-user-1', '#F59E0B', 'credit-card', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert demo transactions (last 30 days)
INSERT INTO transactions (
  id, description, amount, type, date, userId, accountId, categoryId, status, createdAt, updatedAt
) VALUES
-- Income transactions
('tx-1', 'Salário Janeiro', 4500.00, 'INCOME', DATE('now', '-25 days'), 'demo-user-1', 'acc-main-1', 'cat-income-1', 'COMPLETED', NOW(), NOW()),
('tx-2', 'Projeto Freelance', 1200.00, 'INCOME', DATE('now', '-20 days'), 'demo-user-1', 'acc-main-1', 'cat-income-2', 'COMPLETED', NOW(), NOW()),
('tx-3', 'Dividendos', 85.50, 'INCOME', DATE('now', '-15 days'), 'demo-user-1', 'acc-savings-1', 'cat-income-3', 'COMPLETED', NOW(), NOW()),

-- Expense transactions
('tx-4', 'Supermercado', -320.75, 'EXPENSE', DATE('now', '-23 days'), 'demo-user-1', 'acc-main-1', 'cat-expense-1', 'COMPLETED', NOW(), NOW()),
('tx-5', 'Combustível', -180.00, 'EXPENSE', DATE('now', '-22 days'), 'demo-user-1', 'acc-main-1', 'cat-expense-2', 'COMPLETED', NOW(), NOW()),
('tx-6', 'Aluguel', -1200.00, 'EXPENSE', DATE('now', '-21 days'), 'demo-user-1', 'acc-main-1', 'cat-expense-3', 'COMPLETED', NOW(), NOW()),
('tx-7', 'Farmácia', -45.80, 'EXPENSE', DATE('now', '-18 days'), 'demo-user-1', 'acc-main-1', 'cat-expense-4', 'COMPLETED', NOW(), NOW()),
('tx-8', 'Cinema', -35.00, 'EXPENSE', DATE('now', '-16 days'), 'demo-user-1', 'acc-main-1', 'cat-expense-5', 'COMPLETED', NOW(), NOW()),
('tx-9', 'Restaurante', -125.90, 'EXPENSE', DATE('now', '-14 days'), 'demo-user-1', 'acc-credit-1', 'cat-expense-1', 'COMPLETED', NOW(), NOW()),
('tx-10', 'Uber', -28.50, 'EXPENSE', DATE('now', '-12 days'), 'demo-user-1', 'acc-credit-1', 'cat-expense-2', 'COMPLETED', NOW(), NOW()),
('tx-11', 'Supermercado', -220.30, 'EXPENSE', DATE('now', '-10 days'), 'demo-user-1', 'acc-main-1', 'cat-expense-1', 'COMPLETED', NOW(), NOW()),
('tx-12', 'Academia', -89.90, 'EXPENSE', DATE('now', '-8 days'), 'demo-user-1', 'acc-main-1', 'cat-expense-4', 'COMPLETED', NOW(), NOW()),
('tx-13', 'Netflix', -29.90, 'EXPENSE', DATE('now', '-6 days'), 'demo-user-1', 'acc-credit-1', 'cat-expense-5', 'COMPLETED', NOW(), NOW()),
('tx-14', 'Padaria', -15.70, 'EXPENSE', DATE('now', '-4 days'), 'demo-user-1', 'acc-main-1', 'cat-expense-1', 'COMPLETED', NOW(), NOW()),
('tx-15', 'Combustível', -190.00, 'EXPENSE', DATE('now', '-2 days'), 'demo-user-1', 'acc-main-1', 'cat-expense-2', 'COMPLETED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert demo budgets
INSERT INTO budgets (
  id, name, amount, spent, period, startDate, endDate, userId, categoryId, alertPercentage, createdAt, updatedAt
) VALUES
('budget-1', 'Alimentação Janeiro', 800.00, 577.65, 'monthly', DATE('now', 'start of month'), DATE('now', 'start of month', '+1 month', '-1 day'), 'demo-user-1', 'cat-expense-1', 80, NOW(), NOW()),
('budget-2', 'Transporte Janeiro', 500.00, 398.50, 'monthly', DATE('now', 'start of month'), DATE('now', 'start of month', '+1 month', '-1 day'), 'demo-user-1', 'cat-expense-2', 80, NOW(), NOW()),
('budget-3', 'Lazer Janeiro', 300.00, 64.90, 'monthly', DATE('now', 'start of month'), DATE('now', 'start of month', '+1 month', '-1 day'), 'demo-user-1', 'cat-expense-5', 80, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Insert demo goals
INSERT INTO goals (
  id, name, description, targetAmount, currentAmount, targetDate, userId, color, icon, createdAt, updatedAt
) VALUES
('goal-1', 'Fundo de Emergência', 'Reserva para 6 meses de gastos', 18000.00, 12500.00, DATE('now', '+6 months'), 'demo-user-1', '#10B981', 'shield', NOW(), NOW()),
('goal-2', 'Viagem Europa', 'Férias dos sonhos em 2025', 8000.00, 2300.00, DATE('now', '+10 months'), 'demo-user-1', '#3B82F6', 'map', NOW(), NOW()),
('goal-3', 'Notebook Novo', 'Upgrade para trabalho', 3500.00, 1200.00, DATE('now', '+3 months'), 'demo-user-1', '#8B5CF6', 'laptop', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;