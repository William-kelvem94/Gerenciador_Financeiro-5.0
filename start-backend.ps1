#!/usr/bin/env pwsh

Write-Host "🚀 INICIANDO BACKEND - WILL FINANCE 5.0" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan

Set-Location server

# Verificar se dependências estão instaladas
if (!(Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
    npm install
}

# Verificar banco de dados
if (!(Test-Path "dev.db") -and !(Test-Path ".env")) {
    Write-Host "🗃️ Configurando banco de dados..." -ForegroundColor Yellow
    npx prisma generate
    npx prisma migrate dev --name init
}

Write-Host "🖥️ Iniciando servidor backend..." -ForegroundColor Green
Write-Host "📍 URL: http://localhost:3000" -ForegroundColor Cyan
Write-Host "📋 API Docs: http://localhost:3000/api/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️ Para parar o servidor, pressione Ctrl+C" -ForegroundColor Yellow
Write-Host ""

npm run start:dev
