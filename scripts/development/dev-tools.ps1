#!/usr/bin/env pwsh
# Will Finance - Dev Tools Cyberpunk 🚀
# Ferramentas de desenvolvimento integradas

param(
    [string]$Command = "help",
    [switch]$Background = $false
)

# Cores cyberpunk
$Green = "Green"
$Cyan = "Cyan" 
$Magenta = "Magenta"
$Yellow = "Yellow"
$Red = "Red"

function Show-Logo {
    Write-Host "
    ██╗    ██╗██╗██╗     ██╗         ███████╗██╗███╗   ██╗ █████╗ ███╗   ██╗ ██████╗███████╗
    ██║    ██║██║██║     ██║         ██╔════╝██║████╗  ██║██╔══██╗████╗  ██║██╔════╝██╔════╝
    ██║ █╗ ██║██║██║     ██║         █████╗  ██║██╔██╗ ██║███████║██╔██╗ ██║██║     █████╗  
    ██║███╗██║██║██║     ██║         ██╔══╝  ██║██║╚██╗██║██╔══██║██║╚██╗██║██║     ██╔══╝  
    ╚███╔███╔╝██║███████╗███████╗    ██║     ██║██║ ╚████║██║  ██║██║ ╚████║╚██████╗███████╗
     ╚══╝╚══╝ ╚═╝╚══════╝╚══════╝    ╚═╝     ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝╚══════╝
    " -ForegroundColor $Cyan
    Write-Host "🚀 Cyberpunk Financial Management System - Dev Tools v2.0" -ForegroundColor $Magenta
    Write-Host ""
}

function Start-AllServices {
    param([switch]$Background)
    
    Write-Host "🚀 Iniciando Will Finance..." -ForegroundColor $Cyan
    
    # Verificar portas
    $ports = @(8080, 5173, 5174)
    foreach ($port in $ports) {
        $process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
        if ($process) {
            Write-Host "⚠️  Porta $port está ocupada. Finalizando processo..." -ForegroundColor $Yellow
            $processId = (Get-Process -Id $process.OwningProcess -ErrorAction SilentlyContinue).Id
            if ($processId) {
                Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
                Start-Sleep -Seconds 1
            }
        }
    }
    
    # Iniciar Backend
    Write-Host "⚡ Iniciando Backend (porta 8080)..." -ForegroundColor $Green
    if ($Background) {
        Start-Process powershell -ArgumentList "-WindowStyle Hidden -Command `"cd server; npm run dev`"" -WindowStyle Hidden
    } else {
        Start-Job -Name "backend" -ScriptBlock { Set-Location server; npm run dev } | Out-Null
    }
    
    Start-Sleep -Seconds 3
    
    # Iniciar Frontend
    Write-Host "🌐 Iniciando Frontend (porta 5173/5174)..." -ForegroundColor $Magenta
    if ($Background) {
        Start-Process powershell -ArgumentList "-WindowStyle Hidden -Command `"cd client; npm run dev`"" -WindowStyle Hidden
    } else {
        Start-Job -Name "frontend" -ScriptBlock { Set-Location client; npm run dev } | Out-Null
    }
    
    Start-Sleep -Seconds 2
    
    # Abrir navegador
    Write-Host "🌐 Abrindo navegador..." -ForegroundColor $Cyan
    Start-Sleep -Seconds 3
    Start-Process "http://localhost:5173"
    
    Write-Host "✅ Will Finance iniciado com sucesso!" -ForegroundColor $Green
    Write-Host "📱 Frontend: http://localhost:5173" -ForegroundColor $Cyan
    Write-Host "🔧 Backend: http://localhost:8080" -ForegroundColor $Cyan
    Write-Host ""
}

function Show-GoogleCloudSetup {
    Write-Host "🔥 GOOGLE CLOUD CONSOLE - CONFIGURAÇÃO RÁPIDA" -ForegroundColor $Cyan
    Write-Host "=============================================" -ForegroundColor $Cyan
    Write-Host ""
    
    Write-Host "📋 PASSO 1: Acesse o Google Cloud Console" -ForegroundColor $Yellow
    Write-Host "   🌐 https://console.cloud.google.com/" -ForegroundColor $Green
    Write-Host ""
    
    Write-Host "📋 PASSO 2: OAuth Consent Screen" -ForegroundColor $Yellow
    Write-Host "   🔧 APIs & Services → OAuth consent screen" -ForegroundColor $Green
    Write-Host "   ✅ User Type: External" -ForegroundColor $Green
    Write-Host "   ✅ App name: Will Finance" -ForegroundColor $Green
    Write-Host "   ✅ Authorized domains: localhost" -ForegroundColor $Green
    Write-Host ""
    
    Write-Host "📋 PASSO 3: Criar OAuth 2.0 Client ID" -ForegroundColor $Yellow
    Write-Host "   🔧 APIs & Services → Credentials → + CREATE CREDENTIALS" -ForegroundColor $Green
    Write-Host "   ✅ Application type: Web application" -ForegroundColor $Green
    Write-Host "   ✅ Name: Will Finance Web Client" -ForegroundColor $Green
    Write-Host ""
    Write-Host "   📍 Authorized JavaScript origins:" -ForegroundColor $Magenta
    Write-Host "      http://localhost:5173" -ForegroundColor $Green
    Write-Host "      http://localhost:5174" -ForegroundColor $Green
    Write-Host ""
    Write-Host "   📍 Authorized redirect URIs:" -ForegroundColor $Magenta
    Write-Host "      http://localhost:5173/auth/google/callback" -ForegroundColor $Green
    Write-Host "      http://localhost:5174/auth/google/callback" -ForegroundColor $Green
    Write-Host ""
    
    Write-Host "📋 PASSO 4: Copiar Credenciais" -ForegroundColor $Yellow
    Write-Host "   🔑 Client ID: 845096565411-xxxxxxxxxx.apps.googleusercontent.com" -ForegroundColor $Green
    Write-Host "   🔑 Client Secret: GOCSPX-xxxxxxxxxx" -ForegroundColor $Green
    Write-Host ""
    
    Write-Host "📋 PASSO 5: Configurar no Projeto" -ForegroundColor $Yellow
    Write-Host "   📝 Execute: .\dev-tools.ps1 google-config" -ForegroundColor $Green
    Write-Host ""
    
    $openConsole = Read-Host "🚀 Deseja abrir o Google Cloud Console agora? (Y/N)"
    if ($openConsole -eq "Y" -or $openConsole -eq "y") {
        Start-Process "https://console.cloud.google.com/"
        Write-Host "🌐 Google Cloud Console aberto!" -ForegroundColor $Green
    }
}

function Set-GoogleConfig {
    Write-Host "🔧 CONFIGURAÇÃO GOOGLE OAUTH" -ForegroundColor $Cyan
    Write-Host "=============================" -ForegroundColor $Cyan
    Write-Host ""
    
    $clientId = Read-Host "🔑 Digite o Google Client ID"
    $clientSecret = Read-Host "🔑 Digite o Google Client Secret"
    
    if ($clientId -and $clientSecret) {
        # Atualizar frontend .env
        $frontendEnv = Get-Content "client\.env" -Raw
        $frontendEnv = $frontendEnv -replace "VITE_GOOGLE_CLIENT_ID=.*", "VITE_GOOGLE_CLIENT_ID=$clientId"
        $frontendEnv | Set-Content "client\.env"
        
        # Atualizar backend .env
        $backendEnv = Get-Content "server\.env" -Raw
        $backendEnv = $backendEnv -replace "GOOGLE_CLIENT_ID=.*", "GOOGLE_CLIENT_ID=$clientId"
        $backendEnv = $backendEnv -replace "GOOGLE_CLIENT_SECRET=.*", "GOOGLE_CLIENT_SECRET=$clientSecret"
        $backendEnv | Set-Content "server\.env"
        
        Write-Host "✅ Configuração atualizada com sucesso!" -ForegroundColor $Green
        Write-Host "🔄 Reinicie os serviços: .\dev-tools.ps1 restart" -ForegroundColor $Yellow
    } else {
        Write-Host "❌ Credenciais não fornecidas." -ForegroundColor $Red
    }
}

function Test-Services {
    Write-Host "🧪 TESTANDO SERVIÇOS..." -ForegroundColor $Cyan
    Write-Host ""
    
    # Testar Backend
    try {
        $backendTest = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/google/auth-url" -Method GET -TimeoutSec 5
        Write-Host "✅ Backend funcionando" -ForegroundColor $Green
        Write-Host "   🔧 API: http://localhost:8080" -ForegroundColor $Cyan
    } catch {
        Write-Host "❌ Backend não está respondendo" -ForegroundColor $Red
        Write-Host "   🔧 Inicie: .\dev-tools.ps1 start" -ForegroundColor $Yellow
    }
    
    # Testar Frontend
    try {
        $frontendTest = Invoke-WebRequest -Uri "http://localhost:5173" -Method HEAD -TimeoutSec 5 -ErrorAction SilentlyContinue
        if ($frontendTest.StatusCode -eq 200) {
            Write-Host "✅ Frontend funcionando" -ForegroundColor $Green
            Write-Host "   🌐 App: http://localhost:5173" -ForegroundColor $Cyan
        }
    } catch {
        try {
            $frontendTest2 = Invoke-WebRequest -Uri "http://localhost:5174" -Method HEAD -TimeoutSec 5 -ErrorAction SilentlyContinue
            if ($frontendTest2.StatusCode -eq 200) {
                Write-Host "✅ Frontend funcionando (porta 5174)" -ForegroundColor $Green
                Write-Host "   🌐 App: http://localhost:5174" -ForegroundColor $Cyan
            }
        } catch {
            Write-Host "❌ Frontend não está respondendo" -ForegroundColor $Red
            Write-Host "   🔧 Inicie: .\dev-tools.ps1 start" -ForegroundColor $Yellow
        }
    }
    
    # Testar login demo
    try {
        $loginTest = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -Body '{"email":"demo@willfinance.com","password":"cyberpunk2077"}' -ContentType "application/json" -TimeoutSec 5
        Write-Host "✅ Login demo funcionando" -ForegroundColor $Green
        Write-Host "   👤 demo@willfinance.com / cyberpunk2077" -ForegroundColor $Cyan
    } catch {
        Write-Host "❌ Login demo não funcionando" -ForegroundColor $Red
    }
    
    Write-Host ""
}

function Stop-AllServices {
    Write-Host "🛑 Parando serviços..." -ForegroundColor $Yellow
    
    # Parar jobs
    Get-Job | Stop-Job -ErrorAction SilentlyContinue
    Get-Job | Remove-Job -ErrorAction SilentlyContinue
    
    # Parar processos node
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
    
    Write-Host "✅ Serviços parados!" -ForegroundColor $Green
}

function Show-Help {
    Write-Host "🛠️  COMANDOS DISPONÍVEIS:" -ForegroundColor $Cyan
    Write-Host ""
    Write-Host "  🚀 start [-Background]   - Iniciar todos os serviços" -ForegroundColor $Green
    Write-Host "  🛑 stop                  - Parar todos os serviços" -ForegroundColor $Green
    Write-Host "  🔄 restart              - Reiniciar serviços" -ForegroundColor $Green
    Write-Host "  🧪 test                 - Testar se serviços estão funcionando" -ForegroundColor $Green
    Write-Host "  🔥 google-setup         - Guia do Google Cloud Console" -ForegroundColor $Green
    Write-Host "  🔧 google-config        - Configurar credenciais Google" -ForegroundColor $Green
    Write-Host "  🌐 open                 - Abrir app no navegador" -ForegroundColor $Green
    Write-Host "  📋 status              - Ver status dos serviços" -ForegroundColor $Green
    Write-Host "  📚 docs                - Abrir documentação" -ForegroundColor $Green
    Write-Host "  ❓ help                - Mostrar esta ajuda" -ForegroundColor $Green
    Write-Host ""
    Write-Host "💡 Exemplos:" -ForegroundColor $Yellow
    Write-Host "  .\dev-tools.ps1 start -Background    # Iniciar em segundo plano" -ForegroundColor $Cyan
    Write-Host "  .\dev-tools.ps1 google-setup         # Configurar Google OAuth" -ForegroundColor $Cyan
    Write-Host "  .\dev-tools.ps1 test                 # Testar tudo" -ForegroundColor $Cyan
    Write-Host ""
}

# Main
Show-Logo

switch ($Command.ToLower()) {
    "start" { Start-AllServices -Background:$Background }
    "stop" { Stop-AllServices }
    "restart" { Stop-AllServices; Start-Sleep 2; Start-AllServices -Background:$Background }
    "test" { Test-Services }
    "google-setup" { Show-GoogleCloudSetup }
    "google-config" { Set-GoogleConfig }
    "open" { Start-Process "http://localhost:5173" }
    "status" { Test-Services }
    "docs" { 
        Write-Host "📚 Abrindo documentação..." -ForegroundColor $Cyan
        Start-Process "README.md"
        Start-Process "GOOGLE_CLOUD_SETUP.md"
        Start-Process "PRISMA_GUIA_COMPLETO.md"
    }
    default { Show-Help }
}
