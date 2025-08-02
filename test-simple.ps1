#!/usr/bin/env pwsh

Write-Host "WILL FINANCE 5.0 - TESTES LOCAIS" -ForegroundColor Yellow
Write-Host "==================================" -ForegroundColor Yellow
Write-Host ""

$ErrorActionPreference = "Continue"
$testResults = @()

# Função para adicionar resultado de teste
function Add-TestResult {
    param(
        [string]$Test,
        [bool]$Passed,
        [string]$Message = ""
    )
    
    $script:testResults += @{
        Test = $Test
        Passed = $Passed
        Message = $Message
    }
    
    if ($Passed) {
        Write-Host "✅ $Test" -ForegroundColor Green
        if ($Message) { Write-Host "   $Message" -ForegroundColor Gray }
    } else {
        Write-Host "❌ $Test" -ForegroundColor Red
        if ($Message) { Write-Host "   $Message" -ForegroundColor Red }
    }
}

# Função para testar porta
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

Write-Host "1. TESTES DE INFRAESTRUTURA" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan

# Teste Node.js
try {
    $nodeVersion = node --version 2>$null
    Add-TestResult "Node.js instalado" $true "Versao: $nodeVersion"
} catch {
    Add-TestResult "Node.js instalado" $false "Node.js nao encontrado"
}

# Teste Python
try {
    $pythonVersion = python --version 2>$null
    Add-TestResult "Python instalado" $true "Versao: $pythonVersion"
} catch {
    Add-TestResult "Python instalado" $false "Python nao encontrado"
}

# Dependências Backend
if (Test-Path "server/node_modules") {
    Add-TestResult "Dependencias Backend" $true "node_modules encontrado"
} else {
    Add-TestResult "Dependencias Backend" $false "Execute: cd server; npm install"
}

# Dependências Frontend
if (Test-Path "client/node_modules") {
    Add-TestResult "Dependencias Frontend" $true "node_modules encontrado"
} else {
    Add-TestResult "Dependencias Frontend" $false "Execute: cd client; npm install"
}

Write-Host ""
Write-Host "2. TESTES DE CONECTIVIDADE" -ForegroundColor Cyan
Write-Host "===========================" -ForegroundColor Cyan

# Backend Port
if (Test-Port 3000) {
    Add-TestResult "Backend Port (3000)" $true "Porta disponivel"
} else {
    Add-TestResult "Backend Port (3000)" $false "Porta nao esta respondendo"
}

# Frontend Port
if (Test-Port 5173) {
    Add-TestResult "Frontend Port (5173)" $true "Porta disponivel"
} else {
    Add-TestResult "Frontend Port (5173)" $false "Porta nao esta respondendo"
}

# IA Service Port
if (Test-Port 8001) {
    Add-TestResult "IA Service Port (8001)" $true "Porta disponivel"
} else {
    Add-TestResult "IA Service Port (8001)" $false "Porta nao esta respondendo - Servico opcional"
}

Write-Host ""
Write-Host "3. TESTES DE BANCO DE DADOS" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan

# Prisma Schema
if (Test-Path "server/prisma/schema.prisma") {
    Add-TestResult "Prisma Schema" $true "Schema encontrado"
} else {
    Add-TestResult "Prisma Schema" $false "Schema nao encontrado"
}

# Database SQLite
if (Test-Path "server/dev.db") {
    Add-TestResult "Database SQLite" $true "dev.db encontrado"
} else {
    Add-TestResult "Database SQLite" $false "Execute: cd server; npx prisma migrate dev"
}

Write-Host ""
Write-Host "RELATORIO FINAL" -ForegroundColor Yellow
Write-Host "===============" -ForegroundColor Yellow

$totalTests = $testResults.Count
$passedTests = ($testResults | Where-Object { $_.Passed }).Count
$failedTests = $totalTests - $passedTests
$successRate = if ($totalTests -gt 0) { [math]::Round(($passedTests / $totalTests) * 100, 1) } else { 0 }

Write-Host ""
Write-Host "Estatisticas:" -ForegroundColor White
Write-Host "   Total de testes: $totalTests" -ForegroundColor Gray
Write-Host "   Testes passando: $passedTests" -ForegroundColor Green
Write-Host "   Testes falhando: $failedTests" -ForegroundColor Red
Write-Host "   Taxa de sucesso: $successRate%" -ForegroundColor $(if ($successRate -ge 80) { "Green" } elseif ($successRate -ge 60) { "Yellow" } else { "Red" })

Write-Host ""
if ($failedTests -eq 0) {
    Write-Host "TODOS OS TESTES PASSARAM!" -ForegroundColor Green
    Write-Host "Sistema pronto para desenvolvimento!" -ForegroundColor Green
} elseif ($successRate -ge 70) {
    Write-Host "SISTEMA PARCIALMENTE FUNCIONAL" -ForegroundColor Yellow
    Write-Host "Alguns componentes precisam de atencao." -ForegroundColor Yellow
} else {
    Write-Host "SISTEMA COM PROBLEMAS" -ForegroundColor Red
    Write-Host "Multiplos componentes precisam de correcao." -ForegroundColor Red
}

Write-Host ""
Write-Host "ACOES RECOMENDADAS:" -ForegroundColor Cyan

$failedInfra = $testResults | Where-Object { -not $_.Passed -and ($_.Test -like "*instalado*" -or $_.Test -like "*Dependencias*") }
if ($failedInfra) {
    Write-Host "1. Instalar dependencias faltantes:" -ForegroundColor Yellow
    foreach ($test in $failedInfra) {
        Write-Host "   - $($test.Message)" -ForegroundColor Gray
    }
}

$failedServices = $testResults | Where-Object { -not $_.Passed -and $_.Test -like "*Port*" }
if ($failedServices) {
    Write-Host "2. Iniciar servicos:" -ForegroundColor Yellow
    Write-Host "   - .\start-backend.ps1" -ForegroundColor Gray
    Write-Host "   - .\start-frontend.ps1" -ForegroundColor Gray
    Write-Host "   - .\start-ia.ps1 (opcional)" -ForegroundColor Gray
}

$failedDB = $testResults | Where-Object { -not $_.Passed -and $_.Test -like "*Database*" }
if ($failedDB) {
    Write-Host "3. Configurar banco de dados:" -ForegroundColor Yellow
    Write-Host "   - cd server; npx prisma migrate dev" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Teste concluido!" -ForegroundColor Cyan
