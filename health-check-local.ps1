#!/usr/bin/env pwsh

Write-Host "🏥 WILL FINANCE 5.0 - HEALTH CHECK LOCAL" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

function Test-Service {
    param (
        [string]$Name,
        [string]$Url,
        [int]$Port
    )
    
    try {
        $response = Invoke-RestMethod -Uri $Url -TimeoutSec 5
        Write-Host "✅ $Name ($Url) - OK" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "❌ $Name ($Url) - FALHOU" -ForegroundColor Red
        Write-Host "   Erro: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

function Test-Port {
    param (
        [string]$Name,
        [int]$Port
    )
    
    try {
        $tcpClient = New-Object System.Net.Sockets.TcpClient
        $tcpClient.Connect("localhost", $Port)
        $tcpClient.Close()
        Write-Host "✅ $Name (porta $Port) - Ativa" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "❌ $Name (porta $Port) - Inativa" -ForegroundColor Red
        return $false
    }
}

# Testar serviços
Write-Host "🔍 Verificando serviços..." -ForegroundColor Yellow
Write-Host ""

$backendOk = Test-Service "Backend API" "http://localhost:3000/api/health" 3000
$frontendOk = Test-Port "Frontend Dev Server" 5173
$aiOk = Test-Service "IA Service" "http://localhost:8001/health" 8001

Write-Host ""
Write-Host "📊 Resumo do sistema:" -ForegroundColor Yellow

if ($backendOk) {
    Write-Host "🖥️ Backend: FUNCIONANDO" -ForegroundColor Green
} else {
    Write-Host "🖥️ Backend: PARADO" -ForegroundColor Red
    Write-Host "   💡 Execute: cd server && npm run start:dev" -ForegroundColor Yellow
}

if ($frontendOk) {
    Write-Host "🎨 Frontend: FUNCIONANDO" -ForegroundColor Green
} else {
    Write-Host "🎨 Frontend: PARADO" -ForegroundColor Red
    Write-Host "   💡 Execute: cd client && npm run dev" -ForegroundColor Yellow
}

if ($aiOk) {
    Write-Host "🤖 IA Service: FUNCIONANDO" -ForegroundColor Green
} else {
    Write-Host "🤖 IA Service: PARADO" -ForegroundColor Red
    Write-Host "   💡 Execute: cd IA && python -m uvicorn src.main:app --reload --port 8001" -ForegroundColor Yellow
}

Write-Host ""

if ($backendOk -and $frontendOk) {
    Write-Host "🎉 Sistema pronto para uso!" -ForegroundColor Green
    Write-Host "🌐 Acesse: http://localhost:5173" -ForegroundColor Cyan
    Write-Host "👤 Login: demo@willfinance.com / demo123" -ForegroundColor Cyan
} else {
    Write-Host "⚠️ Alguns serviços não estão funcionando" -ForegroundColor Yellow
    Write-Host "📋 Execute os comandos sugeridos acima" -ForegroundColor Yellow
}

Write-Host ""
