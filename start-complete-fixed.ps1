# 🚀 Will Finance 5.0 - Inicializador Completo
# Requisitos mínimos: Node.js >= 16.0.0, npm >= 8.0.0, espaço em disco > 500MB
# Documentação: https://github.com/willfinance/docs

$ErrorActionPreference = "Stop"
$requiredNodeVersion = "16.0.0"
$requiredNpmVersion = "8.0.0"
$minDiskSpaceMB = 500
$logFile = "install.log"

function Test-CommandSuccess {
    param(
        [int]$ExitCode,
        [string]$Description,
        [string]$ErrorAction = "Continue"
    )
    if ($ExitCode -eq 0) {
        Write-Host "✅ $Description" -ForegroundColor Green
        return $true
    } else {
        Write-Host "❌ $Description (Código: $ExitCode)" -ForegroundColor Red
        if ($ErrorAction -eq "Stop") {
            throw "Falha crítica em: $Description"
        }
        return $false
    }
}

function Test-DiskSpace {
    param([int]$MinMB)
    $freeMB = [math]::Round((Get-PSDrive -Name C).Free/1MB)
    if ($freeMB -lt $MinMB) {
        Write-Host "❌ Espaço em disco insuficiente: $freeMB MB (mínimo: $MinMB MB)" -ForegroundColor Red
        exit 1
    } else {
        Write-Host "✅ Espaço em disco suficiente: $freeMB MB" -ForegroundColor Green
    }
}

function Test-EnvVar {
    param([string]$Name)
    if (-not $env:$Name) {
        Write-Host "❌ Variável de ambiente '$Name' não definida!" -ForegroundColor Red
        exit 1
    } else {
        Write-Host "✅ Variável de ambiente '$Name' encontrada" -ForegroundColor Green
    }
}

try {
    Write-Host "🚀 WILL FINANCE 5.0 - INICIALIZAÇÃO COMPLETA" -ForegroundColor Cyan
    Write-Host "=============================================" -ForegroundColor Cyan
    Write-Host ""

    Write-Host "📋 VERIFICANDO DEPENDÊNCIAS..." -ForegroundColor Yellow
    Write-Host ""

    # Espaço em disco
    Test-DiskSpace $minDiskSpaceMB

    # Node.js
    Write-Host "🔍 Verificando Node.js..."
    $nodeVersionRaw = node --version 2>$null
    if (-not $nodeVersionRaw) { throw "Node.js não encontrado" }
    $nodeVersion = $nodeVersionRaw.Trim('v')
    if ([version]$nodeVersion -lt [version]$requiredNodeVersion) {
        Write-Host "❌ Node.js versão $nodeVersion é inferior à requerida ($requiredNodeVersion)" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green

    # npm
    Write-Host "🔍 Verificando npm..."
    $npmVersionRaw = npm --version 2>$null
    if (-not $npmVersionRaw) { throw "npm não encontrado" }
    $npmVersion = $npmVersionRaw.Trim()
    if ([version]$npmVersion -lt [version]$requiredNpmVersion) {
        Write-Host "❌ npm versão $npmVersion é inferior à requerida ($requiredNpmVersion)" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ npm: $npmVersion" -ForegroundColor Green

    # Variáveis de ambiente essenciais
    Test-EnvVar "JWT_SECRET"

    Write-Host ""
    Write-Host "🔧 CONFIGURANDO PROJETO..." -ForegroundColor Yellow
    Write-Host ""

    # Instalar dependências do projeto principal
    Write-Host "📦 Instalando dependências do projeto principal..."
    npm install 2>&1 | Tee-Object -FilePath $logFile -Append
    Test-CommandSuccess $LASTEXITCODE "Dependências do projeto principal instaladas" "Stop"

    # Servidor
    if (-not (Test-Path "server")) {
        Write-Host "❌ Diretório 'server' não encontrado!" -ForegroundColor Red
        exit 1
    }
    Set-Location "server"
    Write-Host "📦 Instalando dependências do servidor..."
    npm install 2>&1 | Tee-Object -FilePath "..\$logFile" -Append
    $serverInstallResult = Test-CommandSuccess $LASTEXITCODE "Dependências do servidor instaladas"

    if ($serverInstallResult) {
        Write-Host "🗄️ Configurando banco de dados..."
        Write-Host "   Gerando cliente Prisma..."
        npx prisma generate 2>&1 | Tee-Object -FilePath "..\$logFile" -Append
        Test-CommandSuccess $LASTEXITCODE "Cliente Prisma gerado"

        Write-Host "   Aplicando schema ao banco..."
        npx prisma db push 2>&1 | Tee-Object -FilePath "..\$logFile" -Append
        Test-CommandSuccess $LASTEXITCODE "Schema aplicado ao banco"

        Write-Host "   Populando banco com dados iniciais..."
        npm run db:seed 2>&1 | Tee-Object -FilePath "..\$logFile" -Append
        Test-CommandSuccess $LASTEXITCODE "Dados iniciais inseridos"
    }
    Set-Location ".."

    # Cliente
    if (-not (Test-Path "client")) {
        Write-Host "❌ Diretório 'client' não encontrado!" -ForegroundColor Red
        exit 1
    }
    Set-Location "client"
    Write-Host "📦 Instalando dependências do cliente..."
    npm install 2>&1 | Tee-Object -FilePath "..\$logFile" -Append
    $clientInstallResult = Test-CommandSuccess $LASTEXITCODE "Dependências do cliente instaladas"
    Set-Location ".."

    Write-Host ""
    Write-Host "🚀 INICIANDO SERVIÇOS..." -ForegroundColor Yellow
    Write-Host ""

    if ($serverInstallResult -and $clientInstallResult) {
        Write-Host "🌟 Tudo configurado! Iniciando desenvolvimento..." -ForegroundColor Green
        Write-Host ""
        Write-Host "📡 SERVIÇOS QUE SERÃO INICIADOS:" -ForegroundColor Cyan
        Write-Host "   🔧 Backend API: http://localhost:8080" -ForegroundColor White
        Write-Host "   🌐 Frontend: http://localhost:5173" -ForegroundColor White
        Write-Host "   📊 Prisma Studio: http://localhost:5555" -ForegroundColor White
        Write-Host ""
        Write-Host "⚡ Pressione Ctrl+C para parar todos os serviços" -ForegroundColor Yellow
        Write-Host ""

        $prismaProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\server'; npx prisma studio" -WindowStyle Minimized -PassThru
        Start-Sleep 2
        npm run dev
        # Para encerrar: $prismaProcess | Stop-Process -Force
    } else {
        Write-Host ""
        Write-Host "❌ ERRO: Falha na configuração!" -ForegroundColor Red
        Write-Host "   Por favor, verifique os erros acima e tente novamente." -ForegroundColor Yellow
        Write-Host ""
        exit 1
    }
} catch {
    Write-Host "❌ ERRO CRÍTICO: $_" -ForegroundColor Red
    exit 1
}
Script migrado para scripts/development/start-complete-fixed.ps1 em 08/08/2025. Utilize a nova versão para inicialização.
