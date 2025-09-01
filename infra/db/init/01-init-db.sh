#!/bin/bash
# 🗄️ WILL FINANCE 5.0 - DATABASE INITIALIZATION SCRIPT
# Creates database, user and sets up initial configuration

set -e

echo "🚀 Initializing Will Finance 5.0 Database..."

# Create database if it doesn't exist
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Create extensions
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    CREATE EXTENSION IF NOT EXISTS "btree_gin";
    
    -- Create application user (if different from POSTGRES_USER)
    DO \$\$
    BEGIN
        IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'will_finance_app') THEN
            CREATE USER will_finance_app WITH PASSWORD 'will_finance_app_password';
        END IF;
    END
    \$\$;
    
    -- Grant permissions
    GRANT CONNECT ON DATABASE "$POSTGRES_DB" TO will_finance_app;
    GRANT USAGE ON SCHEMA public TO will_finance_app;
    GRANT CREATE ON SCHEMA public TO will_finance_app;
    GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO will_finance_app;
    GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO will_finance_app;
    
    -- Set default privileges for future tables
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO will_finance_app;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO will_finance_app;
    
    -- Performance optimizations
    ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';
    ALTER SYSTEM SET log_statement = 'mod';
    ALTER SYSTEM SET log_min_duration_statement = 1000;
    ALTER SYSTEM SET work_mem = '16MB';
    ALTER SYSTEM SET maintenance_work_mem = '256MB';
    ALTER SYSTEM SET effective_cache_size = '1GB';
    
EOSQL

echo "✅ Database initialization completed successfully!"

# Run Prisma migrations (will be handled by the backend container)
echo "📝 Database ready for Prisma migrations..."
