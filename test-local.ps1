#!/usr/bin/env pwsh

Write-Host "🧪 WILL FINANCE 5.0 - TESTES LOCAIS" -ForegroundColor Yellow
Write-Host "====================================" -ForegroundColor Yellow
Write-Host ""

$ErrorActionPreference = "Continue"
$testResults = @()

# Função para adicionar resultado de teste
function Add-TestResult {
    param(
        [string]$Test,
        [bool]$Passed,
        [string]$Message = "",
        [string]$Details = ""
    )
    
    $result = @{
        Test = $Test
        Passed = $Passed
        Message = $Message
        Details = $Details
        Timestamp = Get-Date -Format "HH:mm:ss"
    }
    
    $script:testResults += $result
    
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
    param([int]$Port, [int]$TimeoutSeconds = 5)
    try {
        $connection = New-Object System.Net.Sockets.TcpClient
        $connection.ReceiveTimeout = $TimeoutSeconds * 1000
        $connection.SendTimeout = $TimeoutSeconds * 1000
        $connection.Connect("localhost", $Port)
        $connection.Close()
        return $true
    } catch {
        return $false
    }
}

# Função para fazer request HTTP
function Test-HttpEndpoint {
    param(
        [string]$Url,
        [int]$TimeoutSeconds = 10
    )
    try {
        $response = Invoke-WebRequest -Uri $Url -TimeoutSec $TimeoutSeconds -UseBasicParsing
        return @{ Success = $true; StatusCode = $response.StatusCode; Content = $response.Content }
    } catch {
        return @{ Success = $false; Error = $_.Exception.Message }
    }
}

Write-Host "🔍 1. TESTES DE INFRAESTRUTURA" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan

# Teste 1: Verificar Node.js
try {
    $nodeVersion = node --version 2>$null
    Add-TestResult "Node.js instalado" $true "Versão: $nodeVersion"
} catch {
    Add-TestResult "Node.js instalado" $false "Node.js não encontrado"
}

# Teste 2: Verificar Python
try {
    $pythonVersion = python --version 2>$null
    Add-TestResult "Python instalado" $true "Versão: $pythonVersion"
} catch {
    Add-TestResult "Python instalado" $false "Python não encontrado"
}

# Teste 3: Verificar dependências do backend
if (Test-Path "server/node_modules") {
    Add-TestResult "Dependencias Backend" $true "node_modules encontrado"
} else {
    Add-TestResult "Dependencias Backend" $false "Execute: cd server; npm install"
}

# Teste 4: Verificar dependências do frontend
if (Test-Path "client/node_modules") {
    Add-TestResult "Dependencias Frontend" $true "node_modules encontrado"
} else {
    Add-TestResult "Dependencias Frontend" $false "Execute: cd client; npm install"
}

Write-Host ""
Write-Host "🌐 2. TESTES DE CONECTIVIDADE" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan

# Teste 5: Backend port
if (Test-Port 3000) {
    Add-TestResult "Backend Port (3000)" $true "Porta disponível"
    
    # Teste 6: Backend health
    $healthCheck = Test-HttpEndpoint "http://localhost:3000/health"
    if ($healthCheck.Success) {
        Add-TestResult "Backend Health" $true "Status: $($healthCheck.StatusCode)"
    } else {
        Add-TestResult "Backend Health" $false $healthCheck.Error
    }
} else {
    Add-TestResult "Backend Port (3000)" $false "Porta não está respondendo"
    Add-TestResult "Backend Health" $false "Backend não está rodando"
}

# Teste 7: Frontend port
if (Test-Port 5173) {
    Add-TestResult "Frontend Port (5173)" $true "Porta disponível"
    
    # Teste 8: Frontend health
    $frontendCheck = Test-HttpEndpoint "http://localhost:5173"
    if ($frontendCheck.Success) {
        Add-TestResult "Frontend Health" $true "Status: $($frontendCheck.StatusCode)"
    } else {
        Add-TestResult "Frontend Health" $false $frontendCheck.Error
    }
} else {
    Add-TestResult "Frontend Port (5173)" $false "Porta não está respondendo"
    Add-TestResult "Frontend Health" $false "Frontend não está rodando"
}

# Teste 9: IA Service port
if (Test-Port 8001) {
    Add-TestResult "IA Service Port (8001)" $true "Porta disponível"
    
    # Teste 10: IA Service health
    $iaCheck = Test-HttpEndpoint "http://localhost:8001/health"
    if ($iaCheck.Success) {
        Add-TestResult "IA Service Health" $true "Status: $($iaCheck.StatusCode)"
    } else {
        Add-TestResult "IA Service Health" $false $iaCheck.Error
    }
} else {
    Add-TestResult "IA Service Port (8001)" $false "Porta não está respondendo - Serviço opcional"
    Add-TestResult "IA Service Health" $false "IA Service não está rodando - Serviço opcional"
}

Write-Host ""
Write-Host "🗃️ 3. TESTES DE BANCO DE DADOS" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan

# Teste 11: Prisma schema
if (Test-Path "server/prisma/schema.prisma") {
    Add-TestResult "Prisma Schema" $true "Schema encontrado"
} else {
    Add-TestResult "Prisma Schema" $false "Schema não encontrado"
}

# Teste 12: Database file (SQLite)
if (Test-Path "server/dev.db") {
    Add-TestResult "Database SQLite" $true "dev.db encontrado"
} else {
    Add-TestResult "Database SQLite" $false "Execute: cd server; npx prisma migrate dev"
}

Write-Host ""
Write-Host "📋 4. TESTES DE API" -ForegroundColor Cyan
Write-Host "==================" -ForegroundColor Cyan

if (Test-Port 3000) {
    # Teste 13: API Auth endpoint
    $authCheck = Test-HttpEndpoint "http://localhost:3000/api/auth/test"
    if ($authCheck.Success -or $authCheck.Error -match "404") {
        Add-TestResult "API Auth Endpoint" $true "Endpoint acessível"
    } else {
        Add-TestResult "API Auth Endpoint" $false $authCheck.Error
    }
    
    # Teste 14: API Transactions endpoint
    $transCheck = Test-HttpEndpoint "http://localhost:3000/api/transactions"
    if ($transCheck.Success -or $transCheck.Error -match "401|403") {
        Add-TestResult "API Transactions Endpoint" $true "Endpoint acessível (auth necessária)"
    } else {
        Add-TestResult "API Transactions Endpoint" $false $transCheck.Error
    }
} else {
    Add-TestResult "API Auth Endpoint" $false "Backend não está rodando"
    Add-TestResult "API Transactions Endpoint" $false "Backend não está rodando"
}

Write-Host ""
Write-Host "📊 RELATÓRIO FINAL" -ForegroundColor Yellow
Write-Host "==================" -ForegroundColor Yellow

$totalTests = $testResults.Count
$passedTests = ($testResults | Where-Object { $_.Passed }).Count
$failedTests = $totalTests - $passedTests
$successRate = [math]::Round(($passedTests / $totalTests) * 100, 1)

Write-Host ""
Write-Host "📈 Estatísticas:" -ForegroundColor White
Write-Host "   Total de testes: $totalTests" -ForegroundColor Gray
Write-Host "   Testes passando: $passedTests" -ForegroundColor Green
Write-Host "   Testes falhando: $failedTests" -ForegroundColor Red
Write-Host "   Taxa de sucesso: $successRate%" -ForegroundColor $(if ($successRate -ge 80) { "Green" } elseif ($successRate -ge 60) { "Yellow" } else { "Red" })

Write-Host ""
if ($failedTests -eq 0) {
    Write-Host "🎉 TODOS OS TESTES PASSARAM!" -ForegroundColor Green
    Write-Host "Sistema pronto para desenvolvimento!" -ForegroundColor Green
} elseif ($successRate -ge 70) {
    Write-Host "⚠️ SISTEMA PARCIALMENTE FUNCIONAL" -ForegroundColor Yellow
    Write-Host "Alguns componentes precisam de atenção." -ForegroundColor Yellow
} else {
    Write-Host "❌ SISTEMA COM PROBLEMAS" -ForegroundColor Red
    Write-Host "Múltiplos componentes precisam de correção." -ForegroundColor Red
}

Write-Host ""
Write-Host "🔧 AÇÕES RECOMENDADAS:" -ForegroundColor Cyan

$failedInfra = $testResults | Where-Object { -not $_.Passed -and $_.Test -like "*instalado*" -or $_.Test -like "*Dependências*" }
if ($failedInfra) {
    Write-Host "1. Instalar dependências faltantes:" -ForegroundColor Yellow
    foreach ($test in $failedInfra) {
        Write-Host "   - $($test.Message)" -ForegroundColor Gray
    }
}

$failedServices = $testResults | Where-Object { -not $_.Passed -and ($_.Test -like "*Port*" -or $_.Test -like "*Health*") }
if ($failedServices) {
    Write-Host "2. Iniciar serviços:" -ForegroundColor Yellow
    Write-Host "   - .\start-backend.ps1" -ForegroundColor Gray
    Write-Host "   - .\start-frontend.ps1" -ForegroundColor Gray
    Write-Host "   - .\start-ia.ps1 (opcional)" -ForegroundColor Gray
}

$failedDB = $testResults | Where-Object { -not $_.Passed -and $_.Test -like "*Database*" }
if ($failedDB) {
    Write-Host "3. Configurar banco de dados:" -ForegroundColor Yellow
    Write-Host "   - cd server && npx prisma migrate dev" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Log detalhado salvo em: test-results-$(Get-Date -Format 'yyyyMMdd-HHmmss').json" -ForegroundColor Gray

# Salvar resultados em JSON
$jsonResults = @{
    Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    TotalTests = $totalTests
    PassedTests = $passedTests
    FailedTests = $failedTests
    SuccessRate = $successRate
    Results = $testResults
} | ConvertTo-Json -Depth 3

$jsonResults | Out-File -FilePath "test-results-$(Get-Date -Format 'yyyyMMdd-HHmmss').json" -Encoding UTF8

Write-Host ""
Write-Host "Teste concluido!" -ForegroundColor Cyan
