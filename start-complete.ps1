# 🚀 Will Finance 5.0 - Inicializador Completo
# Script que garante que tudo está funcionando antes de iniciar

Write-Host "🚀 WILL FINANCE 5.0 - INICIALIZAÇÃO COMPLETA" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# Função para verificar se um comando foi bem-sucedido
function Test-CommandSuccess {
    param($ExitCode, $Description)
    if ($ExitCode -eq 0) {
        Write-Host "✅ $Description" -ForegroundColor Green
        return $true
    } else {
        Write-Host "❌ $Description (Código: $ExitCode)" -ForegroundColor Red
        return $false
    }
}

# Função para verificar se um serviço está rodando (não utilizada, mas mantida)
function Test-ServiceRunning {
    param($Url, $ServiceName)
    try {
        $response = Invoke-RestMethod -Uri $Url -Method Get -TimeoutSec 5
        Write-Host "✅ $ServiceName está rodando" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "❌ $ServiceName não está respondendo" -ForegroundColor Red
        return $false
    }
}

Write-Host "📋 VERIFICANDO DEPENDÊNCIAS..." -ForegroundColor Yellow
Write-Host ""

# Verificar Node.js
Write-Host "🔍 Verificando Node.js..."
try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        # Verificar versão mínima
        $requiredNodeVersion = [version]"16.0.0"
        $currentNodeVersion = [version]($nodeVersion.Substring(1))
        if ($currentNodeVersion -lt $requiredNodeVersion) {
            Write-Host "❌ Versão do Node.js ($nodeVersion) é inferior à requerida (v$requiredNodeVersion)" -ForegroundColor Red
            exit 1
        }
        Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
    } else {
        throw "Node.js não encontrado"
    }
} catch {
    Write-Host "❌ Node.js não está instalado!" -ForegroundColor Red
    Write-Host "   Baixe em: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Verificar NPM
Write-Host "🔍 Verificando NPM..."
try {
    $npmVersion = npm --version 2>$null
    if ($npmVersion) {
        Write-Host "✅ NPM: v$npmVersion" -ForegroundColor Green
    } else {
        throw "NPM não encontrado"
    }
} catch {
    Write-Host "❌ NPM não está instalado!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🔧 CONFIGURANDO PROJETO..." -ForegroundColor Yellow
Write-Host ""

# Instalar dependências do projeto principal
Write-Host "📦 Instalando dependências do projeto principal..."
npm install 2>&1 | Out-Null
Test-CommandSuccess $LASTEXITCODE "Dependências do projeto principal instaladas"

# Instalar dependências do servidor
Write-Host "📦 Instalando dependências do servidor..."
try {
    Set-Location "server" -ErrorAction Stop
} catch {
    Write-Host "❌ Diretório 'server' não encontrado!" -ForegroundColor Red
    exit 1
}
npm install 2>&1 | Out-Null
$serverInstallResult = Test-CommandSuccess $LASTEXITCODE "Dependências do servidor instaladas"

if ($serverInstallResult) {
    # Configurar banco de dados
    Write-Host "🗄️ Configurando banco de dados..."

    # Gerar cliente Prisma
    Write-Host "   Gerando cliente Prisma..."
    npx prisma generate 2>&1 | Out-Null
    Test-CommandSuccess $LASTEXITCODE "Cliente Prisma gerado"

    # Aplicar schema ao banco
    Write-Host "   Aplicando schema ao banco..."
    npx prisma db push 2>&1 | Out-Null
    Test-CommandSuccess $LASTEXITCODE "Schema aplicado ao banco"

    # Popular banco com dados iniciais
    Write-Host "   Populando banco com dados iniciais..."
    npm run db:seed 2>&1 | Out-Null
    Test-CommandSuccess $LASTEXITCODE "Dados iniciais inseridos"
}

Set-Location ".."

# Instalar dependências do cliente
Write-Host "📦 Instalando dependências do cliente..."
try {
    Set-Location "client" -ErrorAction Stop
} catch {
    Write-Host "❌ Diretório 'client' não encontrado!" -ForegroundColor Red
    exit 1
}
npm install 2>&1 | Out-Null
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

    # Iniciar Prisma Studio em segundo plano e monitorar encerramento
    $prismaProcess = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\server'; npx prisma studio" -WindowStyle Minimized -PassThru
    Register-ObjectEvent -InputObject $prismaProcess -EventName Exited -Action {
        Write-Host "Prisma Studio foi encerrado." -ForegroundColor Yellow
    }
    Start-Sleep 2

    # Iniciar desenvolvimento principal
    npm run dev
} else {
    Write-Host ""
    Write-Host "❌ ERRO: Falha na configuração!" -ForegroundColor Red
    Write-Host "   Por favor, verifique os erros acima e tente novamente." -ForegroundColor Yellow
    Write-Host ""
    exit 1
}
