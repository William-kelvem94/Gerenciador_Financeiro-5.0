# 🚀 WILL FINANCE - INICIAR TUDO DE UMA VEZ
# Script para iniciar todos os serviços automaticamente

Write-Host "🚀 ===============================================" -ForegroundColor Green
Write-Host "🚀    WILL FINANCE - INICIANDO TODOS OS SERVIÇOS" -ForegroundColor Green
Write-Host "🚀 ===============================================" -ForegroundColor Green
Write-Host ""

# Função para verificar se uma porta está ocupada
function Test-Port {
    param($port)
    try {
        $connection = New-Object System.Net.Sockets.TcpClient
        $connection.Connect("localhost", $port)
        $connection.Close()
        return $true
    }
    catch {
        return $false
    }
}

# Verificar se as portas estão livres
Write-Host "🔍 Verificando portas..." -ForegroundColor Yellow

$ports = @{
    "8080" = "Backend API"
    "5173" = "Frontend Vite"
    "5555" = "Prisma Studio"
}

$portsInUse = @()
foreach ($port in $ports.Keys) {
    if (Test-Port $port) {
        $portsInUse += "$port ($($ports[$port]))"
    }
}

if ($portsInUse.Count -gt 0) {
    Write-Host "⚠️  ATENÇÃO: As seguintes portas estão ocupadas:" -ForegroundColor Yellow
    foreach ($portInfo in $portsInUse) {
        Write-Host "   - $portInfo" -ForegroundColor Red
    }
    Write-Host ""
    $kill = Read-Host "Deseja finalizar os processos e continuar? (Y/N)"
    
    if ($kill -eq "Y" -or $kill -eq "y") {
        Write-Host "🔧 Finalizando processos..." -ForegroundColor Yellow
        Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
        Start-Sleep -Seconds 2
        Write-Host "✅ Processos finalizados!" -ForegroundColor Green
    } else {
        Write-Host "❌ Operação cancelada pelo usuário." -ForegroundColor Red
        exit
    }
}

Write-Host "✅ Portas verificadas!" -ForegroundColor Green
Write-Host ""

# Iniciar Backend
Write-Host "⚡ Iniciando Backend (Node.js + Express)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-WindowStyle", "Hidden", "-Command", "cd server; npm run dev" -WindowStyle Hidden

# Aguardar um pouco para o backend inicializar
Write-Host "⏳ Aguardando backend inicializar..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Iniciar Frontend
Write-Host "🌐 Iniciando Frontend (React + Vite)..." -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-WindowStyle", "Hidden", "-Command", "cd client; npm run dev" -WindowStyle Hidden

# Aguardar um pouco para o frontend inicializar
Write-Host "⏳ Aguardando frontend inicializar..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Iniciar Prisma Studio por último (sem abrir navegador)
Write-Host "🗄️  Iniciando Prisma Studio..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-WindowStyle", "Hidden", "-File", "start-prisma.ps1" -WindowStyle Hidden

Write-Host ""
Write-Host "🎉 ===============================================" -ForegroundColor Green
Write-Host "🎉    TODOS OS SERVIÇOS FORAM INICIADOS!" -ForegroundColor Green
Write-Host "🎉 ===============================================" -ForegroundColor Green
Write-Host ""

Write-Host "📱 SERVIÇOS DISPONÍVEIS:" -ForegroundColor Yellow
Write-Host "   🌐 Frontend: http://localhost:5173 (será aberto automaticamente)" -ForegroundColor White
Write-Host "   ⚡ Backend:  http://localhost:8080 (rodando em segundo plano)" -ForegroundColor Gray
Write-Host "   🗄️  Database: http://localhost:5555 (rodando em segundo plano)" -ForegroundColor Gray
Write-Host ""

Write-Host "⏳ Aguardando todos os serviços ficarem online..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

# Verificar se tudo está rodando
Write-Host "🔍 Verificando status dos serviços..." -ForegroundColor Cyan

$services = @()
if (Test-Port 8080) { 
    $services += "✅ Backend (8080)"
} else { 
    $services += "❌ Backend (8080)"
}

if (Test-Port 5173) { 
    $services += "✅ Frontend (5173)"
} else { 
    $services += "❌ Frontend (5173)"
}

if (Test-Port 5555) { 
    $services += "✅ Prisma Studio (5555)"
} else { 
    $services += "❌ Prisma Studio (5555)"
}

Write-Host ""
Write-Host "📊 STATUS DOS SERVIÇOS:" -ForegroundColor Green
foreach ($service in $services) {
    Write-Host "   $service" -ForegroundColor White
}

Write-Host ""
Write-Host "🚀 PRONTO! Apenas o frontend será aberto automaticamente!" -ForegroundColor Green
Write-Host "   🌐 Acessando: http://localhost:5173" -ForegroundColor White
Write-Host "   📝 Login demo: demo@willfinance.com / cyberpunk2077" -ForegroundColor White
Write-Host "   ⚙️  Dev Tools disponíveis em Configurações" -ForegroundColor Gray
Write-Host ""

# Abrir automaticamente APENAS o frontend (domínio principal)
Write-Host "🚀 Abrindo http://localhost:5173..." -ForegroundColor Green

# Aguardar um pouco mais para garantir que outros serviços não abram primeiro
Start-Sleep -Seconds 2

# Abrir APENAS o frontend
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "✨ WILL FINANCE está rodando!" -ForegroundColor Green
Write-Host "   📱 Frontend: Aberto automaticamente no navegador" -ForegroundColor Green
Write-Host "   ⚡ Backend: Rodando em segundo plano (não abre)" -ForegroundColor Gray
Write-Host "   🗄️  Database: Rodando em segundo plano (não abre)" -ForegroundColor Gray
Write-Host ""
Write-Host "💡 Para parar tudo: .\stop.ps1" -ForegroundColor Yellow
Write-Host "🛠️ Para acessar outros serviços: use os Dev Tools na interface" -ForegroundColor Gray
