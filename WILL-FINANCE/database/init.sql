-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS will_finance_db;

-- Use the database
\c will_finance_db;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Set timezone
SET timezone = 'UTC';

-- Create custom types for better performance
CREATE TYPE account_type AS ENUM ('CHECKING', 'SAVINGS', 'CREDIT_CARD', 'INVESTMENT', 'CASH', 'LOAN', 'OTHER');
CREATE TYPE category_type AS ENUM ('INCOME', 'EXPENSE', 'TRANSFER');
CREATE TYPE transaction_type AS ENUM ('INCOME', 'EXPENSE', 'TRANSFER');
CREATE TYPE transaction_status AS ENUM ('PENDING', 'COMPLETED', 'CANCELLED', 'FAILED');
CREATE TYPE budget_period AS ENUM ('WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY');
CREATE TYPE notification_type AS ENUM ('BUDGET_ALERT', 'GOAL_MILESTONE', 'UNUSUAL_SPENDING', 'BILL_REMINDER', 'AI_INSIGHT', 'SECURITY_ALERT', 'SYSTEM');
CREATE TYPE insight_type AS ENUM ('SPENDING_PATTERN', 'BUDGET_OPTIMIZATION', 'SAVINGS_OPPORTUNITY', 'UNUSUAL_TRANSACTION', 'GOAL_PROGRESS', 'CASHFLOW_PREDICTION', 'EXPENSE_CATEGORY_ANALYSIS');

-- Create indexes for better performance (these will be created automatically by Prisma, but listing here for reference)
-- CREATE INDEX idx_users_email ON users(email);
-- CREATE INDEX idx_users_username ON users(username);
-- CREATE INDEX idx_transactions_user_id ON transactions(user_id);
-- CREATE INDEX idx_transactions_date ON transactions(date);
-- CREATE INDEX idx_transactions_account_id ON transactions(account_id);
-- CREATE INDEX idx_accounts_user_id ON accounts(user_id);
-- CREATE INDEX idx_categories_user_id ON categories(user_id);
-- CREATE INDEX idx_budgets_user_id ON budgets(user_id);
-- CREATE INDEX idx_goals_user_id ON goals(user_id);
-- CREATE INDEX idx_notifications_user_id ON notifications(user_id);
-- CREATE INDEX idx_ai_insights_user_id ON ai_insights(user_id);
-- CREATE INDEX idx_sessions_user_id ON sessions(user_id);
-- CREATE INDEX idx_sessions_token ON sessions(token);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- This trigger will be applied after Prisma creates the tables
-- CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create a function for generating secure random passwords
CREATE OR REPLACE FUNCTION generate_random_password(length INTEGER DEFAULT 12)
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    result TEXT := '';
    i INTEGER := 0;
BEGIN
    WHILE i < length LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
        i := i + 1;
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Create a function to calculate account balance
CREATE OR REPLACE FUNCTION calculate_account_balance(account_id_param UUID)
RETURNS DECIMAL(12, 2) AS $$
DECLARE
    balance DECIMAL(12, 2) := 0;
BEGIN
    SELECT 
        COALESCE(SUM(
            CASE 
                WHEN type = 'INCOME' THEN amount
                WHEN type = 'EXPENSE' THEN -amount
                ELSE 0
            END
        ), 0)
    INTO balance
    FROM transactions
    WHERE account_id = account_id_param AND status = 'COMPLETED';
    
    RETURN balance;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get user's total net worth
CREATE OR REPLACE FUNCTION get_user_net_worth(user_id_param UUID)
RETURNS DECIMAL(12, 2) AS $$
DECLARE
    net_worth DECIMAL(12, 2) := 0;
BEGIN
    SELECT COALESCE(SUM(balance), 0)
    INTO net_worth
    FROM accounts
    WHERE user_id = user_id_param AND is_active = true;
    
    RETURN net_worth;
END;
$$ LANGUAGE plpgsql;

-- Create a view for transaction summaries
CREATE OR REPLACE VIEW transaction_summary AS
SELECT 
    t.user_id,
    DATE_TRUNC('month', t.date) as month,
    t.type,
    COUNT(*) as transaction_count,
    SUM(t.amount) as total_amount,
    AVG(t.amount) as average_amount,
    c.name as category_name
FROM transactions t
LEFT JOIN categories c ON t.category_id = c.id
WHERE t.status = 'COMPLETED'
GROUP BY t.user_id, DATE_TRUNC('month', t.date), t.type, c.name;

-- Create a view for budget performance
CREATE OR REPLACE VIEW budget_performance AS
SELECT 
    b.id as budget_id,
    b.user_id,
    b.name as budget_name,
    b.amount as budget_amount,
    b.spent as amount_spent,
    b.period,
    b.start_date,
    b.end_date,
    CASE 
        WHEN b.amount > 0 THEN (b.spent / b.amount * 100)
        ELSE 0
    END as percentage_used,
    CASE 
        WHEN b.spent > b.amount THEN true
        ELSE false
    END as is_over_budget,
    c.name as category_name
FROM budgets b
LEFT JOIN categories c ON b.category_id = c.id
WHERE b.is_active = true;

-- Insert default system categories (these will be created by the seed script)
-- INSERT INTO categories (id, name, description, color, icon, type, is_system, user_id) VALUES 
-- (uuid_generate_v4(), 'Salary', 'Monthly salary income', '#39FF14', 'dollar-sign', 'INCOME', true, null),
-- (uuid_generate_v4(), 'Food & Dining', 'Restaurants, groceries, food delivery', '#FF6B6B', 'utensils', 'EXPENSE', true, null),
-- (uuid_generate_v4(), 'Transportation', 'Gas, parking, public transport', '#4ECDC4', 'car', 'EXPENSE', true, null),
-- (uuid_generate_v4(), 'Shopping', 'Clothing, electronics, miscellaneous', '#45B7D1', 'shopping-bag', 'EXPENSE', true, null),
-- (uuid_generate_v4(), 'Entertainment', 'Movies, concerts, games', '#96CEB4', 'gamepad-2', 'EXPENSE', true, null),
-- (uuid_generate_v4(), 'Bills & Utilities', 'Electricity, water, internet, phone', '#FFEAA7', 'zap', 'EXPENSE', true, null),
-- (uuid_generate_v4(), 'Healthcare', 'Medical expenses, insurance', '#DDA0DD', 'heart', 'EXPENSE', true, null),
-- (uuid_generate_v4(), 'Transfer', 'Money transfers between accounts', '#FFD93D', 'arrow-right-left', 'TRANSFER', true, null);

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON DATABASE will_finance_db TO will_finance;
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO will_finance;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO will_finance;

-- Create indexes for full-text search
-- CREATE INDEX idx_transactions_description_search ON transactions USING gin(to_tsvector('english', description));
-- CREATE INDEX idx_users_search ON users USING gin(to_tsvector('english', first_name || ' ' || last_name || ' ' || email));

-- Set up database settings for better performance
ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';
ALTER SYSTEM SET track_activity_query_size = 2048;
ALTER SYSTEM SET pg_stat_statements.track = 'all';

-- Reload configuration
SELECT pg_reload_conf();
