# Script PowerShell para configuração local do Gerenciador Financeiro 4.0
Write-Host "🚀 Configurando Gerenciador Financeiro 4.0 - Desenvolvimento Local" -ForegroundColor Green

# Verificar se o PostgreSQL está instalado
Write-Host "📋 Verificando PostgreSQL..." -ForegroundColor Yellow
$pgPath = Get-Command psql -ErrorAction SilentlyContinue
if (-not $pgPath) {
    Write-Host "❌ PostgreSQL não encontrado. Instalando via Chocolatey..." -ForegroundColor Red
    if (-not (Get-Command choco -ErrorAction SilentlyContinue)) {
        Write-Host "📦 Instalando Chocolatey primeiro..." -ForegroundColor Yellow
        Set-ExecutionPolicy Bypass -Scope Process -Force
        [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
        iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
    }
    choco install postgresql --params '/Password:financeiro' -y
    Write-Host "✅ PostgreSQL instalado! Reinicie o terminal e execute novamente." -ForegroundColor Green
    exit
}

# Verificar se o Node.js está instalado
Write-Host "📋 Verificando Node.js..." -ForegroundColor Yellow
$nodePath = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodePath) {
    Write-Host "❌ Node.js não encontrado. Instale via https://nodejs.org/" -ForegroundColor Red
    exit
}

# Configurar banco de dados
Write-Host "🗄️ Configurando banco de dados..." -ForegroundColor Yellow
$env:PGPASSWORD = "financeiro"

# Tentar conectar e criar banco se necessário
try {
    psql -U postgres -h localhost -c "CREATE DATABASE financeiro;" 2>$null
    psql -U postgres -h localhost -c "CREATE USER financeiro WITH PASSWORD 'financeiro';" 2>$null
    psql -U postgres -h localhost -c "GRANT ALL PRIVILEGES ON DATABASE financeiro TO financeiro;" 2>$null
    Write-Host "✅ Banco de dados configurado!" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Banco pode já existir, continuando..." -ForegroundColor Yellow
}

# Instalar dependências do backend
Write-Host "📦 Instalando dependências do backend..." -ForegroundColor Yellow
Set-Location backend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao instalar dependências do backend" -ForegroundColor Red
    exit
}

# Instalar dependências do frontend  
Write-Host "📦 Instalando dependências do frontend..." -ForegroundColor Yellow
Set-Location ../frontend
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao instalar dependências do frontend" -ForegroundColor Red
    exit
}

Set-Location ..

Write-Host "✅ Configuração concluída!" -ForegroundColor Green
Write-Host "🎯 Para iniciar o desenvolvimento:" -ForegroundColor Cyan
Write-Host "   npm run dev:all    # Inicia backend + frontend + banco" -ForegroundColor White
Write-Host "   npm run dev:backend # Apenas backend" -ForegroundColor White  
Write-Host "   npm run dev:frontend# Apenas frontend" -ForegroundColor White
