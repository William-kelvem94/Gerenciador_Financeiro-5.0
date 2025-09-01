# 🐳 WILL FINANCE 5.0 - DOCKER POWERSHELL DEPLOY SCRIPT
# Deploys the complete application stack on Windows

param(
    [switch]$Build = $false,
    [switch]$Stop = $false,
    [switch]$Logs = $false,
    [string]$Service = ""
)

# Colors for output
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"
$Blue = "Cyan"

function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor $Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor $Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor $Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor $Red
}

# Check if Docker is running
try {
    docker info | Out-Null
} catch {
    Write-Error "Docker is not running. Please start Docker Desktop and try again."
    exit 1
}

# Check if docker-compose exists
try {
    docker-compose version | Out-Null
} catch {
    Write-Error "docker-compose is not available. Please install Docker Compose and try again."
    exit 1
}

# Handle different actions
if ($Stop) {
    Write-Status "Stopping Will Finance 5.0 services..."
    docker-compose down --remove-orphans
    Write-Success "✅ Services stopped successfully!"
    exit 0
}

if ($Logs) {
    if ($Service) {
        Write-Status "Showing logs for service: $Service"
        docker-compose logs -f $Service
    } else {
        Write-Status "Showing logs for all services..."
        docker-compose logs -f
    }
    exit 0
}

Write-Status "🚀 Deploying Will Finance 5.0..."

# Load environment variables if .env exists
if (Test-Path ".env") {
    Write-Status "Loading environment variables from .env file..."
    # Note: PowerShell doesn't load .env automatically like bash
    Write-Warning "Environment variables should be set manually in PowerShell or use docker-compose directly"
} else {
    Write-Warning ".env file not found. Using default values from docker-compose.yml"
}

# Stop existing containers
Write-Status "Stopping existing containers..."
docker-compose down --remove-orphans

if ($Build) {
    Write-Status "Building containers from scratch..."
    docker-compose build --no-cache
}

# Start services
Write-Status "Starting services..."
docker-compose up -d

# Wait for services
Write-Status "Waiting for services to initialize..."
Start-Sleep -Seconds 30

# Check service health
Write-Status "Checking service health..."

# Test database connection
try {
    $dbHealth = docker-compose exec -T postgres pg_isready -U postgres 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Success "✅ Database is ready"
    } else {
        Write-Warning "⚠️  Database might still be starting..."
    }
} catch {
    Write-Warning "⚠️  Could not check database health"
}

# Test Redis connection
try {
    $redisHealth = docker-compose exec -T redis redis-cli ping 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Success "✅ Redis is ready"
    } else {
        Write-Warning "⚠️  Redis might still be starting..."
    }
} catch {
    Write-Warning "⚠️  Could not check Redis health"
}

# Test backend health
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/health" -UseBasicParsing -TimeoutSec 5 2>$null
    if ($response.StatusCode -eq 200) {
        Write-Success "✅ Backend is ready"
    } else {
        Write-Warning "⚠️  Backend health check returned status: $($response.StatusCode)"
    }
} catch {
    Write-Warning "⚠️  Backend might still be starting..."
}

# Test frontend health
try {
    $response = Invoke-WebRequest -Uri "http://localhost:80/health" -UseBasicParsing -TimeoutSec 5 2>$null
    if ($response.StatusCode -eq 200) {
        Write-Success "✅ Frontend/Nginx is ready"
    } else {
        Write-Warning "⚠️  Frontend health check returned status: $($response.StatusCode)"
    }
} catch {
    Write-Warning "⚠️  Frontend/Nginx might still be starting..."
}

Write-Host ""
Write-Success "🎉 Will Finance 5.0 deployment completed!"
Write-Host ""
Write-Status "📊 Service Status:"
docker-compose ps
Write-Host ""
Write-Status "🌐 Access URLs:"
Write-Host "  • Frontend: http://localhost:80" -ForegroundColor White
Write-Host "  • Backend API: http://localhost:3001" -ForegroundColor White
Write-Host "  • Database: localhost:5432" -ForegroundColor White
Write-Host "  • Redis: localhost:6379" -ForegroundColor White
Write-Host ""
Write-Status "📝 Useful commands:"
Write-Host "  • View logs: .\scripts\deploy.ps1 -Logs" -ForegroundColor White
Write-Host "  • View specific service logs: .\scripts\deploy.ps1 -Logs -Service backend" -ForegroundColor White
Write-Host "  • Stop services: .\scripts\deploy.ps1 -Stop" -ForegroundColor White
Write-Host "  • Rebuild and deploy: .\scripts\deploy.ps1 -Build" -ForegroundColor White
