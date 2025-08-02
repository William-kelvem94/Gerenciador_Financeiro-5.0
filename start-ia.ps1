#!/usr/bin/env pwsh

Write-Host "🤖 INICIANDO IA SERVICE - WILL FINANCE 5.0" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green

Set-Location IA

# Verificar se Python está instalado
try {
    $pythonVersion = python --version 2>&1
    Write-Host "🐍 Python encontrado: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python não encontrado! Instale Python 3.8+ primeiro" -ForegroundColor Red
    Read-Host "Pressione Enter para sair"
    exit 1
}

# Verificar se venv existe
if (!(Test-Path "venv")) {
    Write-Host "📦 Criando ambiente virtual..." -ForegroundColor Yellow
    python -m venv venv
}

# Ativar venv
Write-Host "🔌 Ativando ambiente virtual..." -ForegroundColor Yellow
if (Test-Path "venv\Scripts\Activate.ps1") {
    & .\venv\Scripts\Activate.ps1
} else {
    Write-Host "❌ Erro ao ativar ambiente virtual" -ForegroundColor Red
    exit 1
}

# Instalar dependências
if (!(Test-Path "requirements.txt")) {
    Write-Host "📋 Criando requirements.txt..." -ForegroundColor Yellow
    @"
fastapi==0.104.1
uvicorn==0.24.0
pandas==2.1.3
numpy==1.24.3
scikit-learn==1.3.2
pydantic==2.5.0
python-multipart==0.0.6
"@ | Out-File -FilePath "requirements.txt" -Encoding UTF8
}

Write-Host "📦 Instalando dependências Python..." -ForegroundColor Yellow
pip install -r requirements.txt

Write-Host "🚀 Iniciando serviço de IA..." -ForegroundColor Green
Write-Host "📍 URL: http://localhost:8001" -ForegroundColor Green
Write-Host "📋 API Docs: http://localhost:8001/docs" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️ Para parar o serviço, pressione Ctrl+C" -ForegroundColor Yellow
Write-Host ""

python -m uvicorn src.main:app --reload --port 8001
