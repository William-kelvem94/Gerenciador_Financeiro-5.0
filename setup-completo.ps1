Write-Host "🚀 Will Finance 5.0 - Setup Automático" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green

# 1. Instalar dependências
Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
npm run install:all

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao instalar dependências!" -ForegroundColor Red
    exit 1
}

# 2. Configurar banco
Write-Host "🗄️ Configurando banco de dados..." -ForegroundColor Yellow
npm run db:setup

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao configurar banco!" -ForegroundColor Red
    exit 1
}

# 3. Verificar se o sistema está pronto
Write-Host "✅ Sistema configurado com sucesso!" -ForegroundColor Green
Write-Host "" 
Write-Host "🎯 Para iniciar o sistema, execute:" -ForegroundColor Cyan
Write-Host "npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "🌐 Acesse: http://localhost:5173" -ForegroundColor Cyan
Write-Host "👤 Email: demo@willfinance.com" -ForegroundColor White
Write-Host "🔑 Senha: cyberpunk2077" -ForegroundColor White
