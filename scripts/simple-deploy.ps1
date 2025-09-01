# WILL FINANCE 5.0 PRO - ENTERPRISE DEPLOY
# Script simplificado para deployment rapido

param(
    [switch]$Build = $false
)

Write-Host "
===============================================================
        WILL FINANCE 5.0 PRO - ENTERPRISE DEPLOY 
===============================================================
" -ForegroundColor Cyan

# Validate Docker
try {
    $dockerVersion = docker --version
    Write-Host "[OK] Docker encontrado: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Docker nao encontrado!" -ForegroundColor Red
    exit 1
}

# Stop existing containers
Write-Host "`n[INFO] Parando containers existentes..." -ForegroundColor Yellow
docker-compose down --volumes --remove-orphans 2>$null

# Clean up
Write-Host "[INFO] Limpando recursos..." -ForegroundColor Yellow
docker system prune -f 2>$null

# Build images if requested
if ($Build) {
    Write-Host "`n[BUILD] Construindo imagens..." -ForegroundColor Yellow
    docker-compose build --no-cache
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Erro no build!" -ForegroundColor Red
        exit 1
    }
}

# Start services
Write-Host "`n[DEPLOY] Iniciando servicos..." -ForegroundColor Yellow

# Start infrastructure first
Write-Host "[INFO] Iniciando PostgreSQL e Redis..." -ForegroundColor Blue
docker-compose up -d postgres redis

# Wait for database
Write-Host "[WAIT] Aguardando banco de dados..." -ForegroundColor Blue
$timeout = 60
$elapsed = 0
do {
    Start-Sleep -Seconds 3
    $elapsed += 3
    $dbReady = docker-compose exec postgres pg_isready -U postgres 2>$null
    if ($dbReady -match "accepting connections") {
        Write-Host "[OK] Banco de dados pronto!" -ForegroundColor Green
        break
    }
    if ($elapsed % 15 -eq 0) {
        Write-Host "   Ainda aguardando... ($elapsed/${timeout}s)" -ForegroundColor Gray
    }
} while ($elapsed -lt $timeout)

if ($elapsed -ge $timeout) {
    Write-Host "[ERROR] Timeout aguardando banco!" -ForegroundColor Red
    docker-compose logs postgres
    exit 1
}

# Start backend
Write-Host "`n[INFO] Iniciando Backend..." -ForegroundColor Blue
docker-compose up -d backend

# Wait for backend
Write-Host "[WAIT] Aguardando backend..." -ForegroundColor Blue
Start-Sleep -Seconds 20

# Start frontend and nginx
Write-Host "`n[INFO] Iniciando Frontend e Nginx..." -ForegroundColor Blue
docker-compose up -d frontend nginx

Write-Host "`n[SUCCESS] DEPLOYMENT CONCLUIDO!" -ForegroundColor Green

Write-Host "
URLs de Acesso:
   * Frontend: http://localhost:4000
   * Backend API: http://localhost:4001
   * Nginx Proxy: http://localhost:4080
   * Health Check: http://localhost:4001/health
" -ForegroundColor White

Write-Host "Status dos servicos:" -ForegroundColor Yellow
docker-compose ps

Write-Host "`nWill Finance 5.0 Pro esta rodando!" -ForegroundColor Green
