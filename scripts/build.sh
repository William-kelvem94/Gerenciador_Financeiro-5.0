#!/bin/bash
# 🐳 WILL FINANCE 5.0 - DOCKER BUILD SCRIPT
# Builds all containers for production deployment

set -e

echo "🚀 Building Will Finance 5.0 Docker Containers..."

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

# Check if Docker is running
if ! docker info >/dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Load environment variables
if [ -f .env ]; then
    print_status "Loading environment variables from .env file..."
    export $(cat .env | grep -v '#' | xargs)
else
    print_warning ".env file not found. Using default values."
fi

# Build backend
print_status "Building backend container..."
docker build \
    --tag will-finance-backend:latest \
    --tag will-finance-backend:5.0 \
    --file server/Dockerfile \
    --build-arg NODE_VERSION=20 \
    server/

if [ $? -eq 0 ]; then
    print_success "Backend container built successfully!"
else
    print_error "Failed to build backend container"
    exit 1
fi

# Build frontend
print_status "Building frontend container..."
docker build \
    --tag will-finance-frontend:latest \
    --tag will-finance-frontend:5.0 \
    --file client/Dockerfile \
    --build-arg VITE_API_URL="${VITE_API_URL:-http://localhost:3001}" \
    --build-arg VITE_APP_NAME="${VITE_APP_NAME:-Will Finance 5.0}" \
    --build-arg VITE_APP_VERSION="${VITE_APP_VERSION:-5.0.0}" \
    client/

if [ $? -eq 0 ]; then
    print_success "Frontend container built successfully!"
else
    print_error "Failed to build frontend container"
    exit 1
fi

# Build with docker-compose for validation
print_status "Validating build with docker-compose..."
docker-compose build --no-cache

if [ $? -eq 0 ]; then
    print_success "All containers built and validated successfully!"
    echo ""
    print_status "Available images:"
    docker images | grep will-finance
    echo ""
    print_status "To start the application, run:"
    echo "  docker-compose up -d"
    echo ""
    print_status "To view logs, run:"
    echo "  docker-compose logs -f"
else
    print_error "Docker-compose build validation failed"
    exit 1
fi

print_success "🎉 Build completed successfully!"
