#!/bin/bash
# 🚀 WILL FINANCE 5.0 - DOCKER DEPLOY SCRIPT
# Deploys the complete application stack

set -e

echo "🚀 Deploying Will Finance 5.0..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if docker-compose exists
if ! command -v docker-compose &> /dev/null; then
    print_error "docker-compose is not installed. Please install it and try again."
    exit 1
fi

# Load environment variables
if [ -f .env ]; then
    print_status "Loading environment variables..."
    export $(cat .env | grep -v '#' | xargs)
else
    print_warning ".env file not found. Creating default environment file..."
    cp .env.example .env 2>/dev/null || print_warning "No .env.example found"
fi

# Stop existing containers
print_status "Stopping existing containers..."
docker-compose down --remove-orphans

# Pull latest base images
print_status "Pulling latest base images..."
docker-compose pull

# Build and start services
print_status "Building and starting services..."
docker-compose up -d --build

# Wait for services to be ready
print_status "Waiting for services to start..."
sleep 30

# Check service health
print_status "Checking service health..."

# Check database
if docker-compose exec -T postgres pg_isready -U ${DB_USER:-postgres} >/dev/null 2>&1; then
    print_success "✅ Database is ready"
else
    print_error "❌ Database health check failed"
fi

# Check Redis
if docker-compose exec -T redis redis-cli ping >/dev/null 2>&1; then
    print_success "✅ Redis is ready"
else
    print_error "❌ Redis health check failed"
fi

# Check backend
if curl -f http://localhost:${BACKEND_PORT:-3001}/health >/dev/null 2>&1; then
    print_success "✅ Backend is ready"
else
    print_warning "⚠️  Backend health check failed (may still be starting...)"
fi

# Check frontend
if curl -f http://localhost:${FRONTEND_PORT:-3000}/health >/dev/null 2>&1; then
    print_success "✅ Frontend is ready"
else
    print_warning "⚠️  Frontend health check failed (may still be starting...)"
fi

# Check main proxy
if curl -f http://localhost:${HTTP_PORT:-80}/health >/dev/null 2>&1; then
    print_success "✅ Nginx proxy is ready"
else
    print_warning "⚠️  Nginx proxy health check failed (may still be starting...)"
fi

echo ""
print_success "🎉 Will Finance 5.0 deployed successfully!"
echo ""
print_status "📊 Service Status:"
docker-compose ps
echo ""
print_status "🌐 Access URLs:"
echo "  • Frontend: http://localhost:${HTTP_PORT:-80}"
echo "  • Backend API: http://localhost:${BACKEND_PORT:-3001}"
echo "  • Database: localhost:${DB_PORT:-5432}"
echo "  • Redis: localhost:${REDIS_PORT:-6379}"
echo ""
print_status "📝 View logs with:"
echo "  docker-compose logs -f [service_name]"
echo ""
print_status "🛑 Stop services with:"
echo "  docker-compose down"
echo ""
print_status "🔄 Update services with:"
echo "  docker-compose pull && docker-compose up -d"
