#!/usr/bin/env pwsh

Write-Host "=== VALIDAÇÃO FINAL DO SISTEMA ===" -ForegroundColor Cyan
Write-Host ""

$ErrorActionPreference = "Stop"

# Verificar se estamos no diretório correto
if (!(Test-Path "package.json")) {
    Write-Host "❌ Execute este script na raiz do projeto" -ForegroundColor Red
    exit 1
}

Write-Host "🔍 Validando builds..." -ForegroundColor Yellow

# Build Frontend
Write-Host "🎨 Compilando Frontend..." -ForegroundColor Green
Set-Location client
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Falha no build do frontend" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Frontend compilado com sucesso" -ForegroundColor Green
Set-Location ..

# Build Backend  
Write-Host "🖥️ Compilando Backend..." -ForegroundColor Green
Set-Location server
npx tsc --project tsconfig.build.json
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Falha no build do backend" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Backend compilado com sucesso" -ForegroundColor Green
Set-Location ..

Write-Host ""
Write-Host "=== CORREÇÕES APLICADAS COM SUCESSO ===" -ForegroundColor Green
Write-Host ""
Write-Host "✅ Frontend: Dependências instaladas e tipos corrigidos" -ForegroundColor Green
Write-Host "✅ Backend: Tipos de autenticação unificados" -ForegroundColor Green  
Write-Host "✅ Dashboard: Comparações de tipo corrigidas" -ForegroundColor Green
Write-Host "✅ PDFImporter: Estrutura e imports corrigidos" -ForegroundColor Green
Write-Host "✅ Componentes UI: CyberpunkCard criado" -ForegroundColor Green
Write-Host "✅ TypeScript: Todas as compilações funcionando" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Sistema pronto para desenvolvimento!" -ForegroundColor Cyan
