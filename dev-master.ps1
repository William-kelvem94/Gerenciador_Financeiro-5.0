#!/usr/bin/env pwsh

param(
    [string]$Mode = "full",
    [switch]$SkipIA,
    [switch]$SkipHealth,
    [switch]$Help
)

if ($Help) {
    Write-Host "🎮 WILL FINANCE 5.0 - SCRIPT MASTER" -ForegroundColor Cyan
    Write-Host "==================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "MODOS DE USO:" -ForegroundColor Yellow
    Write-Host "  .\dev-master.ps1                    # Modo completo (padrão)"
    Write-Host "  .\dev-master.ps1 -Mode frontend     # Apenas frontend"
    Write-Host "  .\dev-master.ps1 -Mode backend      # Apenas backend"
    Write-Host "  .\dev-master.ps1 -SkipIA            # Sem serviço IA"
    Write-Host "  .\dev-master.ps1 -SkipHealth        # Sem health check"
    Write-Host ""
    Write-Host "OPÇÕES:" -ForegroundColor Yellow
    Write-Host "  -Mode [full|frontend|backend]       # Modo de execução"
    Write-Host "  -SkipIA                             # Pular serviço de IA"
    Write-Host "  -SkipHealth                         # Pular verificação de saúde"
    Write-Host "  -Help                               # Mostrar esta ajuda"
    exit 0
}

Write-Host "🎮 WILL FINANCE 5.0 - DESENVOLVIMENTO LOCAL" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Verificar PowerShell Execution Policy
$executionPolicy = Get-ExecutionPolicy
if ($executionPolicy -eq "Restricted") {
    Write-Host "⚠️ Execution Policy restritiva detectada" -ForegroundColor Yellow
    Write-Host "Execute: Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser" -ForegroundColor Yellow
    $continue = Read-Host "Continuar mesmo assim? (y/N)"
    if ($continue -ne "y") { exit 1 }
}

# Função para verificar porta
function Test-Port {
    param([int]$Port)
    try {
        $connection = New-Object System.Net.Sockets.TcpClient
        $connection.Connect("localhost", $Port)
        $connection.Close()
        return $true
    } catch {
        return $false
    }
}

# Verificar se há serviços rodando
Write-Host "🔍 Verificando portas em uso..." -ForegroundColor Yellow
$ports = @(3000, 5173, 8001)
$portsInUse = @()

foreach ($port in $ports) {
    if (Test-Port $port) {
        $portsInUse += $port
    }
}

if ($portsInUse.Count -gt 0) {
    Write-Host "⚠️ Portas em uso: $($portsInUse -join ', ')" -ForegroundColor Yellow
    $continue = Read-Host "Continuar mesmo assim? (y/N)"
    if ($continue -ne "y") { exit 1 }
}

# Verificar dependências
Write-Host "📦 Verificando dependências..." -ForegroundColor Yellow

# Node.js
try {
    $nodeVersion = node --version 2>$null
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js não encontrado!" -ForegroundColor Red
    exit 1
}

# Python (apenas se não for skip IA)
if (-not $SkipIA -and ($Mode -eq "full")) {
    try {
        $pythonVersion = python --version 2>$null
        Write-Host "✅ Python: $pythonVersion" -ForegroundColor Green
    } catch {
        Write-Host "⚠️ Python não encontrado - IA será desabilitada" -ForegroundColor Yellow
        $SkipIA = $true
    }
}

Write-Host ""
Write-Host "🚀 INICIANDO SERVIÇOS..." -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan

# Configurar terminais baseado no modo
switch ($Mode) {
    "frontend" {
        Write-Host "🎨 Modo: Apenas Frontend" -ForegroundColor Magenta
        Write-Host ""
        Write-Host "Execute em um terminal separado:" -ForegroundColor Yellow
        Write-Host "  .\start-frontend.ps1" -ForegroundColor White
    }
    "backend" {
        Write-Host "🖥️ Modo: Apenas Backend" -ForegroundColor Blue
        Write-Host ""
        Write-Host "Execute em um terminal separado:" -ForegroundColor Yellow
        Write-Host "  .\start-backend.ps1" -ForegroundColor White
    }
    default {
        Write-Host "🎯 Modo: Desenvolvimento Completo" -ForegroundColor Green
        Write-Host ""
        Write-Host "📋 INSTRUÇÕES DE EXECUÇÃO:" -ForegroundColor Yellow
        Write-Host "=========================" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "1️⃣ TERMINAL 1 - Backend:" -ForegroundColor Blue
        Write-Host "   .\start-backend.ps1" -ForegroundColor White
        Write-Host ""
        Write-Host "2️⃣ TERMINAL 2 - Frontend:" -ForegroundColor Magenta
        Write-Host "   .\start-frontend.ps1" -ForegroundColor White
        
        if (-not $SkipIA) {
            Write-Host ""
            Write-Host "3️⃣ TERMINAL 3 - IA Service:" -ForegroundColor Green
            Write-Host "   .\start-ia.ps1" -ForegroundColor White
        }
        
        if (-not $SkipHealth) {
            Write-Host ""
            Write-Host "🏥 HEALTH CHECK:" -ForegroundColor Cyan
            Write-Host "   .\health-check-local.ps1" -ForegroundColor White
        }
    }
}

Write-Host ""
Write-Host "📱 URLS DE ACESSO:" -ForegroundColor Cyan
Write-Host "==================" -ForegroundColor Cyan
Write-Host "🌐 Frontend:  http://localhost:5173" -ForegroundColor Magenta
Write-Host "🖥️ Backend:   http://localhost:3000" -ForegroundColor Blue
Write-Host "📋 API Docs:  http://localhost:3000/api/docs" -ForegroundColor Blue
if (-not $SkipIA) {
    Write-Host "🤖 IA Service: http://localhost:8001" -ForegroundColor Green
    Write-Host "📋 IA Docs:   http://localhost:8001/docs" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎮 COMANDOS ÚTEIS:" -ForegroundColor Yellow
Write-Host "==================" -ForegroundColor Yellow
Write-Host ".\health-check-local.ps1                # Verificar status"
Write-Host ".\dev-master.ps1 -Mode frontend         # Apenas frontend"
Write-Host ".\dev-master.ps1 -Mode backend          # Apenas backend"
Write-Host ".\dev-master.ps1 -SkipIA                # Sem IA"
Write-Host ".\dev-master.ps1 -Help                  # Ajuda"

Write-Host ""
Write-Host "✨ Ambiente configurado com sucesso!" -ForegroundColor Green
Write-Host "Happy coding! 🚀" -ForegroundColor Cyan
