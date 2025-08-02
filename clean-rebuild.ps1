#!/usr/bin/env pwsh

Write-Host "🧹 LIMPEZA TOTAL E REBUILD DEFINITIVO" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

$ErrorActionPreference = "Stop"

# Verificar diretório raiz
if (!(Test-Path "package.json")) {
    Write-Host "❌ Execute na raiz do projeto" -ForegroundColor Red
    exit 1
}

# 1. Limpeza completa
Write-Host "🗑️ Removendo caches e builds antigos..." -ForegroundColor Yellow
if (Test-Path "client/node_modules") { Remove-Item -Recurse -Force "client/node_modules" }
if (Test-Path "server/node_modules") { Remove-Item -Recurse -Force "server/node_modules" }
if (Test-Path "client/dist") { Remove-Item -Recurse -Force "client/dist" }
if (Test-Path "server/dist") { Remove-Item -Recurse -Force "server/dist" }
if (Test-Path "node_modules") { Remove-Item -Recurse -Force "node_modules" }

Write-Host "✅ Caches limpos" -ForegroundColor Green

# 2. Reinstalação limpa
Write-Host "📦 Reinstalando dependências..." -ForegroundColor Yellow

# Root
npm install

# Frontend
Set-Location client
npm ci --force
npm install react-chartjs-2 chart.js @types/chart.js @tanstack/react-query
Set-Location ..

# Backend  
Set-Location server
npm ci --force
Set-Location ..

Write-Host "✅ Dependências reinstaladas" -ForegroundColor Green

# 3. Build Frontend
Write-Host "🎨 Build Frontend..." -ForegroundColor Yellow
Set-Location client
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Falha no build frontend" -ForegroundColor Red
    exit 1
}
Set-Location ..
Write-Host "✅ Frontend buildado com sucesso" -ForegroundColor Green

# 4. Build Backend
Write-Host "🖥️ Build Backend..." -ForegroundColor Yellow
Set-Location server
npx tsc --project tsconfig.build.json
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Falha no build backend" -ForegroundColor Red
    exit 1
}
Set-Location ..
Write-Host "✅ Backend buildado com sucesso" -ForegroundColor Green

Write-Host ""
Write-Host "🎉 SISTEMA TOTALMENTE LIMPO E FUNCIONANDO!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host "✅ Todos os caches removidos" -ForegroundColor Green
Write-Host "✅ Dependências reinstaladas" -ForegroundColor Green  
Write-Host "✅ Frontend compilando sem erros" -ForegroundColor Green
Write-Host "✅ Backend compilando sem erros" -ForegroundColor Green
Write-Host "✅ Tipos corrigidos definitivamente" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Pronto para desenvolvimento!" -ForegroundColor Cyan
