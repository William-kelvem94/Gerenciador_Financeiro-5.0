#!/usr/bin/env pwsh

Write-Host "🎨 INICIANDO FRONTEND - WILL FINANCE 5.0" -ForegroundColor Magenta
Write-Host "=======================================" -ForegroundColor Magenta

Set-Location client

# Verificar se dependências estão instaladas
if (!(Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
    npm install
}

Write-Host "🌐 Iniciando cliente frontend..." -ForegroundColor Green
Write-Host "📍 URL: http://localhost:5173" -ForegroundColor Magenta
Write-Host "🔥 Hot Reload: Ativado" -ForegroundColor Magenta
Write-Host ""
Write-Host "⚠️ Para parar o servidor, pressione Ctrl+C" -ForegroundColor Yellow
Write-Host ""

npm run dev
