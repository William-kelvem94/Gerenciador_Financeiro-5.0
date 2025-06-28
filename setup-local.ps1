# =====================================
# Will Finance 5.0 - Setup PowerShell Script
# Autor: William
# Versão: 5.0.0
# =====================================

param(
    [switch]$Quick,
    [switch]$Docker,
    [switch]$SkipDB,
    [switch]$DevOnly,
    [string]$Environment = "development"
)

# Cores para output
$colors = @{
    Info = "Cyan"
    Success = "Green"
    Warning = "Yellow"
    Error = "Red"
    Header = "Magenta"
}

function Write-ColoredOutput {
    param([string]$Message, [string]$Color = "White")
    Write-Host $Message -ForegroundColor $colors[$Color]
}

function Show-Header {
    Clear-Host
    Write-ColoredOutput "████████████████████████████████████████████████████████████" "Header"
    Write-ColoredOutput "█                                                          █" "Header"
    Write-ColoredOutput "█         🚀 WILL FINANCE 5.0 - SETUP AUTOMÁTICO          █" "Header"
    Write-ColoredOutput "█                                                          █" "Header"
    Write-ColoredOutput "████████████████████████████████████████████████████████████" "Header"
    Write-Host ""
}

function Test-Prerequisites {
    Write-ColoredOutput "🔍 Verificando pré-requisitos..." "Info"
    
    # Verificar Node.js
    try {
        $nodeVersion = node --version
        Write-ColoredOutput "✅ Node.js $nodeVersion encontrado" "Success"
    }
    catch {
        Write-ColoredOutput "❌ Node.js não encontrado! Instale Node.js 18+" "Error"
        Write-ColoredOutput "💡 Download: https://nodejs.org/" "Info"
        exit 1
    }
    
    # Verificar npm
    try {
        $npmVersion = npm --version
        Write-ColoredOutput "✅ npm $npmVersion encontrado" "Success"
    }
    catch {
        Write-ColoredOutput "❌ npm não encontrado!" "Error"
        exit 1
    }
    
    # Verificar Git (opcional)
    try {
        $gitVersion = git --version
        Write-ColoredOutput "✅ Git encontrado: $gitVersion" "Success"
    }
    catch {
        Write-ColoredOutput "⚠️ Git não encontrado (opcional)" "Warning"
    }
    
    # Verificar Docker (se necessário)
    if ($Docker) {
        try {
            $dockerVersion = docker --version
            Write-ColoredOutput "✅ Docker encontrado: $dockerVersion" "Success"
        }
        catch {
            Write-ColoredOutput "❌ Docker não encontrado!" "Error"
            Write-ColoredOutput "💡 Instale Docker Desktop primeiro" "Info"
            exit 1
        }
    }
}

function Install-Dependencies {
    Write-ColoredOutput "📦 Instalando dependências..." "Info"
    
    if ($Quick) {
        Write-ColoredOutput "⚡ Modo rápido: usando npm install" "Info"
        npm run install:quick
    } else {
        Write-ColoredOutput "🔒 Modo seguro: usando npm ci" "Info"
        npm run install:all
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-ColoredOutput "✅ Dependências instaladas com sucesso!" "Success"
    } else {
        Write-ColoredOutput "❌ Erro na instalação de dependências!" "Error"
        exit 1
    }
}

function Setup-Environment {
    Write-ColoredOutput "🔧 Configurando ambiente..." "Info"
    
    # Criar arquivo .env se não existir
    if (!(Test-Path ".env")) {
        Copy-Item ".env.example" ".env"
        Write-ColoredOutput "📄 Arquivo .env criado a partir do template" "Success"
        Write-ColoredOutput "💡 Edite o arquivo .env com suas configurações" "Info"
    } else {
        Write-ColoredOutput "📄 Arquivo .env já existe" "Info"
    }
    
    # Criar diretórios necessários
    $directories = @("logs", "uploads", "temp", "data")
    foreach ($dir in $directories) {
        if (!(Test-Path $dir)) {
            New-Item -ItemType Directory -Path $dir -Force | Out-Null
            Write-ColoredOutput "📁 Diretório $dir criado" "Success"
        }
    }
}

function Setup-Database {
    if ($SkipDB) {
        Write-ColoredOutput "⏭️ Configuração do banco de dados ignorada" "Warning"
        return
    }
    
    Write-ColoredOutput "🗄️ Configurando banco de dados..." "Info"
    
    try {
        npm run db:setup
        Write-ColoredOutput "✅ Banco de dados configurado!" "Success"
    }
    catch {
        Write-ColoredOutput "❌ Erro na configuração do banco de dados!" "Error"
        Write-ColoredOutput "💡 Tente executar manualmente: npm run db:setup" "Info"
    }
}

function Start-Development {
    if (!$DevOnly) {
        return
    }
    
    Write-ColoredOutput "🚀 Iniciando ambiente de desenvolvimento..." "Info"
    
    if ($Docker) {
        Write-ColoredOutput "🐳 Usando Docker..." "Info"
        npm run docker:dev
    } else {
        Write-ColoredOutput "💻 Modo local..." "Info"
        npm run dev
    }
}

function Show-Summary {
    Write-Host ""
    Write-ColoredOutput "🎉 SETUP COMPLETO!" "Success"
    Write-Host ""
    Write-ColoredOutput "🌐 URLs disponíveis:" "Info"
    Write-Host "   Frontend:  http://localhost:5173" -ForegroundColor White
    Write-Host "   Backend:   http://localhost:8080" -ForegroundColor White
    Write-Host "   Database:  http://localhost:5555" -ForegroundColor White
    Write-Host ""
    Write-ColoredOutput "📋 Próximos passos:" "Info"
    Write-Host "   1. Execute: npm run dev" -ForegroundColor White
    Write-Host "   2. Acesse: http://localhost:5173" -ForegroundColor White
    Write-Host "   3. Divirta-se! 🎉" -ForegroundColor White
    Write-Host ""
    
    if (!$DevOnly) {
        Write-ColoredOutput "💡 Para iniciar o desenvolvimento:" "Info"
        Write-Host "   npm run dev" -ForegroundColor Yellow
    }
}

function Main {
    Show-Header
    
    try {
        Test-Prerequisites
        Install-Dependencies
        Setup-Environment
        Setup-Database
        Start-Development
        Show-Summary
    }
    catch {
        Write-ColoredOutput "❌ Erro durante o setup: $_" "Error"
        exit 1
    }
}

# Executar script principal
Main
