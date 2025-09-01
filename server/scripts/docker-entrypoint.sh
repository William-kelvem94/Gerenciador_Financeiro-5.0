#!/bin/bash
# === 🚀 WILL FINANCE 5.0 PRO - ENTERPRISE DOCKER ENTRYPOINT === #
# Script de inicialização enterprise com logging avançado e error handling

set -euo pipefail  # Exit on error, undefined variables, pipe failures

# === CONFIGURAÇÕES === #
readonly LOG_FILE="/app/logs/startup.log"
readonly PID_FILE="/app/logs/app.pid"
readonly HEALTH_CHECK_URL="http://localhost:3001/health"
readonly MAX_STARTUP_TIME=120

# === LOGGING FUNCTIONS === #
log() {
    local level="$1"
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] [$level] $message" | tee -a "$LOG_FILE"
}

log_info() { log "INFO" "$@"; }
log_warn() { log "WARN" "$@"; }
log_error() { log "ERROR" "$@"; }
log_success() { log "SUCCESS" "$@"; }

# === STARTUP BANNER === #
echo "
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║        🚀 WILL FINANCE 5.0 PRO - ENTERPRISE BACKEND 🚀        ║
║                                                               ║
║        • Multi-stage Docker Build                             ║
║        • Production-grade Security                            ║
║        • Health Monitoring                                    ║
║        • Graceful Shutdown                                    ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
"

# === ENVIRONMENT VALIDATION === #
log_info "🔍 Validating environment..."

# Check required environment variables
required_vars=("DATABASE_URL" "JWT_SECRET")
for var in "${required_vars[@]}"; do
    if [[ -z "${!var:-}" ]]; then
        log_warn "Environment variable $var is not set, using defaults"
    else
        log_success "✓ $var is configured"
    fi
done

# === DATABASE SETUP === #
log_info "🗄️ Setting up database..."

# Wait for database to be ready
log_info "⏳ Waiting for database connection..."
timeout=30
while ! npx prisma db push --accept-data-loss 2>/dev/null; do
    log_info "Database not ready, waiting... ($timeout seconds remaining)"
    sleep 2
    ((timeout--))
    if [[ $timeout -le 0 ]]; then
        log_error "❌ Database connection timeout"
        exit 1
    fi
done

log_success "✅ Database connection established"

# === PRISMA MIGRATIONS === #
log_info "🔄 Running Prisma migrations..."

if npx prisma migrate deploy 2>/dev/null; then
    log_success "✅ Database migrations completed successfully"
else
    log_warn "⚠️ Migration failed or no migrations found, continuing..."
fi

# === PRISMA SEED (if exists) === #
if [[ -f "prisma/seed.ts" || -f "prisma/seed.js" ]]; then
    log_info "🌱 Running database seed..."
    if npx prisma db seed 2>/dev/null; then
        log_success "✅ Database seeded successfully"
    else
        log_warn "⚠️ Seeding failed or not needed, continuing..."
    fi
fi

# === APPLICATION STARTUP === #
log_info "🎯 Starting NestJS application..."

# Create PID file directory
mkdir -p "$(dirname "$PID_FILE")"

# Define cleanup function for graceful shutdown
cleanup() {
    log_info "🛑 Received shutdown signal, performing graceful shutdown..."
    
    if [[ -f "$PID_FILE" ]]; then
        local pid=$(cat "$PID_FILE")
        if kill -0 "$pid" 2>/dev/null; then
            log_info "Sending SIGTERM to process $pid..."
            kill -TERM "$pid"
            
            # Wait for graceful shutdown
            local countdown=30
            while kill -0 "$pid" 2>/dev/null && [[ $countdown -gt 0 ]]; do
                sleep 1
                ((countdown--))
            done
            
            # Force kill if still running
            if kill -0 "$pid" 2>/dev/null; then
                log_warn "Force killing process $pid..."
                kill -KILL "$pid"
            fi
        fi
        rm -f "$PID_FILE"
    fi
    
    log_info "✅ Graceful shutdown completed"
    exit 0
}

# Set up signal handlers
trap cleanup SIGTERM SIGINT SIGQUIT

# === START APPLICATION === #
log_info "🚀 Launching Will Finance 5.0 Backend..."

# Try different start commands based on availability
if [[ -f "dist/main.js" ]]; then
    log_info "Starting from compiled dist/main.js..."
    node dist/main.js &
    echo $! > "$PID_FILE"
elif npm run start:prod &>/dev/null; then
    log_info "Starting with npm run start:prod..."
    npm run start:prod &
    echo $! > "$PID_FILE"
elif npm start &>/dev/null; then
    log_info "Starting with npm start..."
    npm start &
    echo $! > "$PID_FILE"
else
    log_error "❌ No valid start command found"
    exit 1
fi

# === HEALTH CHECK MONITORING === #
log_info "🔍 Waiting for application to be ready..."

startup_time=0
while [[ $startup_time -lt $MAX_STARTUP_TIME ]]; do
    if curl -f "$HEALTH_CHECK_URL" &>/dev/null; then
        log_success "✅ Application is healthy and ready!"
        log_success "🌐 API available at: http://localhost:3001"
        log_success "🏥 Health check: $HEALTH_CHECK_URL"
        break
    fi
    
    sleep 2
    ((startup_time += 2))
    
    if [[ $((startup_time % 10)) -eq 0 ]]; then
        log_info "Still starting... ($startup_time/${MAX_STARTUP_TIME}s)"
    fi
done

if [[ $startup_time -ge $MAX_STARTUP_TIME ]]; then
    log_error "❌ Application failed to start within $MAX_STARTUP_TIME seconds"
    cleanup
    exit 1
fi

log_success "🎉 Will Finance 5.0 Backend started successfully!"
log_info "📊 Monitoring application health..."

# === KEEP ALIVE & MONITORING === #
# Monitor the application and restart if needed
while true; do
    if [[ -f "$PID_FILE" ]]; then
        local pid=$(cat "$PID_FILE")
        if ! kill -0 "$pid" 2>/dev/null; then
            log_error "❌ Application process died unexpectedly"
            exit 1
        fi
    fi
    
    # Health check every 30 seconds
    if ! curl -f "$HEALTH_CHECK_URL" &>/dev/null; then
        log_warn "⚠️ Health check failed"
    fi
    
    sleep 30
done
