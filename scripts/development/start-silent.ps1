# 🚀 Will Finance - Inicialização Rápida e Silenciosa
# Script otimizado para rodar em segundo plano sem abrir janelas

Write-Host "🚀 Iniciando Will Finance (modo silencioso)..." -ForegroundColor Green

# Função para testar se porta está ocupada
function Test-Port {
    param([int]$Port)
    try {
        $connection = New-Object System.Net.Sockets.TcpClient
        $connection.Connect("127.0.0.1", $Port)
        $connection.Close()
        return $true
    } catch {
        return $false
    }
}

# Matar processos Node existentes silenciosamente
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

Write-Host "🔧 Limpando processos anteriores..." -ForegroundColor Yellow
Start-Sleep -Seconds 2

# Navegar para o diretório do servidor
$serverPath = Join-Path $PSScriptRoot "server"
Set-Location $serverPath

Write-Host "📦 Instalando dependências do servidor..." -ForegroundColor Cyan
Start-Process -FilePath "npm" -ArgumentList "install" -Wait -WindowStyle Hidden

Write-Host "🏗️ Aplicando migrações do banco..." -ForegroundColor Cyan
Start-Process -FilePath "npm" -ArgumentList "run", "db:push" -Wait -WindowStyle Hidden

Write-Host "🚀 Iniciando servidor backend..." -ForegroundColor Green
$serverProcess = Start-Process -FilePath "npm" -ArgumentList "run", "dev" -WindowStyle Hidden -PassThru

# Aguardar servidor inicializar
Start-Sleep -Seconds 5

# Navegar para o diretório do cliente
$clientPath = Join-Path $PSScriptRoot "client"
Set-Location $clientPath

Write-Host "📦 Instalando dependências do cliente..." -ForegroundColor Cyan
Start-Process -FilePath "npm" -ArgumentList "install" -Wait -WindowStyle Hidden

Write-Host "🎨 Iniciando frontend..." -ForegroundColor Green
$clientProcess = Start-Process -FilePath "npm" -ArgumentList "run", "dev" -WindowStyle Hidden -PassThru

# Aguardar serviços subirem
Write-Host "⏳ Aguardando serviços iniciarem..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Testar se os serviços estão rodando
$backendUp = Test-Port -Port 8080
$frontendUp = Test-Port -Port 5173

Write-Host ""
Write-Host "🎯 ===============================================" -ForegroundColor Green
Write-Host "🎯        WILL FINANCE - STATUS SERVIÇOS" -ForegroundColor Green
Write-Host "🎯 ===============================================" -ForegroundColor Green
Write-Host ""

if ($backendUp) {
    Write-Host "✅ Backend API: http://localhost:8080" -ForegroundColor Green
} else {
    Write-Host "❌ Backend API: OFFLINE" -ForegroundColor Red
}

if ($frontendUp) {
    Write-Host "✅ Frontend Web: http://localhost:5173" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend Web: OFFLINE" -ForegroundColor Red
}

Write-Host ""
Write-Host "🔥 SISTEMA PRONTO PARA TESTES!" -ForegroundColor Yellow
Write-Host ""
Write-Host "📋 FUNCIONALIDADES DISPONÍVEIS:" -ForegroundColor Cyan
Write-Host "   🏦 Importação de extratos: CSV, TXT, PDF" -ForegroundColor White
Write-Host "   🔐 Autenticação: admin@willfinance.com / admin123" -ForegroundColor White
Write-Host "   👥 Isolamento de dados por usuário" -ForegroundColor White
Write-Host "   🤖 Chatbot IA Fênix" -ForegroundColor White
Write-Host "   📊 Dashboard cyberpunk" -ForegroundColor White
Write-Host ""
Write-Host "🧪 TESTE RÁPIDO DA API:" -ForegroundColor Magenta
Write-Host "   curl http://localhost:8080/health" -ForegroundColor White
Write-Host ""
Write-Host "📱 ACESSO DIRETO:" -ForegroundColor Yellow
Write-Host "   Dashboard: http://localhost:5173" -ForegroundColor White
Write-Host "   Login: http://localhost:5173/login" -ForegroundColor White
Write-Host ""

# Voltar ao diretório original
Set-Location $PSScriptRoot

Write-Host "🎮 Pressione qualquer tecla para continuar..." -ForegroundColor Green
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
