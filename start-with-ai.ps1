# Will Finance 5.0 - Inicialização Completa com IA
# Execute: .\start-with-ai.ps1

Write-Host "🚀 Will Finance 5.0 - Sistema Completo com IA" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
Write-Host ""

# Verificar se estamos no diretório correto
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Execute este script na raiz do projeto Will Finance" -ForegroundColor Red
    exit 1
}

Write-Host "🔧 Iniciando serviços..." -ForegroundColor Yellow
Write-Host ""

# Função para iniciar processos em background
function Start-BackgroundProcess {
    param(
        [string]$Name,
        [string]$Command,
        [string]$WorkingDirectory,
        [string]$Color = "Cyan"
    )
    
    Write-Host "▶️ Iniciando $Name..." -ForegroundColor $Color
    
    $process = Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd '$WorkingDirectory'; $Command" -WindowStyle Minimized -PassThru
    
    if ($process) {
        Write-Host "✅ $Name iniciado (PID: $($process.Id))" -ForegroundColor Green
        return $process
    } else {
        Write-Host "❌ Falha ao iniciar $Name" -ForegroundColor Red
        return $null
    }
}

$processes = @()

# 1. Backend (Servidor Principal)
$backendPath = Join-Path $PWD "server"
if (Test-Path $backendPath) {
    $process = Start-BackgroundProcess -Name "Backend API" -Command "npm run dev" -WorkingDirectory $backendPath -Color "Blue"
    if ($process) { $processes += $process }
} else {
    Write-Host "⚠️ Diretório server não encontrado" -ForegroundColor Yellow
}

Start-Sleep 2

# 2. n8n (se disponível)
Write-Host "🤖 Verificando n8n..." -ForegroundColor Cyan
try {
    $n8nCheck = Get-Command n8n -ErrorAction SilentlyContinue
    if ($n8nCheck) {
        Write-Host "▶️ Iniciando n8n para IA..." -ForegroundColor Cyan
        $n8nProcess = Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "n8n start" -WindowStyle Minimized -PassThru
        if ($n8nProcess) {
            Write-Host "✅ n8n iniciado (PID: $($n8nProcess.Id))" -ForegroundColor Green
            $processes += $n8nProcess
        }
    } else {
        Write-Host "⚠️ n8n não instalado. Para instalar: npm install -g n8n" -ForegroundColor Yellow
        Write-Host "ℹ️ Sistema funcionará em modo simulado" -ForegroundColor Gray
    }
} catch {
    Write-Host "⚠️ n8n não disponível, usando modo simulado" -ForegroundColor Yellow
}

Start-Sleep 2

# 3. Frontend (Interface Principal)
$frontendPath = Join-Path $PWD "client"
if (Test-Path $frontendPath) {
    Write-Host "▶️ Iniciando Frontend..." -ForegroundColor Green
    Start-Sleep 3
    Set-Location $frontendPath
    npm run dev
} else {
    Write-Host "❌ Diretório client não encontrado" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 Will Finance 5.0 iniciado com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "📱 Serviços Disponíveis:" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "🌐 Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "🔧 Backend API: http://localhost:3001" -ForegroundColor White
Write-Host "🤖 n8n (IA): http://localhost:5678" -ForegroundColor White
Write-Host "🗄️ Prisma Studio: http://localhost:5555" -ForegroundColor White
Write-Host ""
Write-Host "🔥 Recursos Novos:" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
Write-Host "• 🤖 Chatbot Fênix IA (canto inferior direito)" -ForegroundColor White
Write-Host "• 📊 Importação de extratos bancários" -ForegroundColor White
Write-Host "• 🏦 Suporte a 10+ bancos brasileiros" -ForegroundColor White
Write-Host "• 📤 Sistema de exportação avançado" -ForegroundColor White
Write-Host "• 🧠 Análise IA via n8n workflows" -ForegroundColor White
Write-Host ""
Write-Host "🧪 Para testar o sistema:" -ForegroundColor Magenta
Write-Host "node test-complete-system.js" -ForegroundColor Gray
Write-Host ""
Write-Host "📚 Documentação completa:" -ForegroundColor Magenta
Write-Host "IMPORT-EXPORT-DOCS.md" -ForegroundColor Gray
Write-Host ""
Write-Host "🛑 Para parar todos os serviços:" -ForegroundColor Red
Write-Host ".\stop.ps1" -ForegroundColor Gray
