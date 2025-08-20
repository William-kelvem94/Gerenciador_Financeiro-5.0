# Will Finance - Dev Tools
# Ferramentas de desenvolvimento integradas

param(
    [string]$Command = "help",
    [switch]$Background = $false
)

function Show-Logo {
    Write-Host "=============================================" -ForegroundColor Cyan
    Write-Host "    WILL FINANCE - DEV TOOLS v2.0" -ForegroundColor Magenta
    Write-Host "    Cyberpunk Financial Management System" -ForegroundColor Cyan
    Write-Host "=============================================" -ForegroundColor Cyan
    Write-Host ""
}

function Start-AllServices {
    param([switch]$Background)
    
    Write-Host "Iniciando Will Finance..." -ForegroundColor Cyan
    
    # Verificar e matar processos nas portas
    $ports = @(8080, 5173, 5174, 5555)
    foreach ($port in $ports) {
        try {
            $process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
            if ($process) {
                Write-Host "Porta $port ocupada. Finalizando processo..." -ForegroundColor Yellow
                $processId = (Get-Process -Id $process.OwningProcess -ErrorAction SilentlyContinue).Id
                if ($processId) {
                    Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
                    Start-Sleep -Seconds 1
                }
            }
        } catch {
            # Ignorar erros de porta
        }
    }
    
    # Iniciar Backend
    Write-Host "Iniciando Backend (porta 8080)..." -ForegroundColor Green
    if ($Background) {
        Start-Process powershell -ArgumentList "-WindowStyle Hidden -Command `"Set-Location server; npm run dev`"" -WindowStyle Hidden
    } else {
        Start-Job -Name "backend" -ScriptBlock { Set-Location server; npm run dev } | Out-Null
    }
    
    Start-Sleep -Seconds 3
    
    # Iniciar Prisma Studio
    Write-Host "Iniciando Prisma Studio (porta 5555)..." -ForegroundColor Blue
    if ($Background) {
        Start-Process powershell -ArgumentList "-WindowStyle Hidden -Command `"Set-Location server; npx prisma studio`"" -WindowStyle Hidden
    } else {
        Start-Job -Name "prisma" -ScriptBlock { Set-Location server; npx prisma studio } | Out-Null
    }
    
    Start-Sleep -Seconds 2
    
    # Iniciar Frontend
    Write-Host "Iniciando Frontend (porta 5173/5174)..." -ForegroundColor Magenta
    if ($Background) {
        Start-Process powershell -ArgumentList "-WindowStyle Hidden -Command `"Set-Location client; npm run dev`"" -WindowStyle Hidden
    } else {
        Start-Job -Name "frontend" -ScriptBlock { Set-Location client; npm run dev } | Out-Null
    }
    
    Start-Sleep -Seconds 3
    
    # Abrir navegadores
    Write-Host "Abrindo navegadores..." -ForegroundColor Cyan
    Start-Process "http://localhost:5173"  # App principal
    Start-Process "http://localhost:5555"  # Prisma Studio
    
    Write-Host "Will Finance iniciado com sucesso!" -ForegroundColor Green
    Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
    Write-Host "Backend: http://localhost:8080" -ForegroundColor Cyan
    Write-Host "Prisma Studio: http://localhost:5555" -ForegroundColor Blue
    Write-Host ""
}

function Show-GoogleCloudSetup {
    Write-Host "GOOGLE CLOUD CONSOLE - CONFIGURACAO RAPIDA" -ForegroundColor Cyan
    Write-Host "===========================================" -ForegroundColor Cyan
    Write-Host ""
    
    Write-Host "PASSO 1: Acesse o Google Cloud Console" -ForegroundColor Yellow
    Write-Host "  https://console.cloud.google.com/" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "PASSO 2: OAuth Consent Screen" -ForegroundColor Yellow
    Write-Host "  APIs & Services -> OAuth consent screen" -ForegroundColor Green
    Write-Host "  User Type: External" -ForegroundColor Green
    Write-Host "  App name: Will Finance" -ForegroundColor Green
    Write-Host "  Authorized domains: localhost" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "PASSO 3: Criar OAuth 2.0 Client ID" -ForegroundColor Yellow
    Write-Host "  APIs & Services -> Credentials -> + CREATE CREDENTIALS" -ForegroundColor Green
    Write-Host "  Application type: Web application" -ForegroundColor Green
    Write-Host "  Name: Will Finance Web Client" -ForegroundColor Green
    Write-Host ""
    Write-Host "  Authorized JavaScript origins:" -ForegroundColor Magenta
    Write-Host "    http://localhost:5173" -ForegroundColor Green
    Write-Host "    http://localhost:5174" -ForegroundColor Green
    Write-Host ""
    Write-Host "  Authorized redirect URIs:" -ForegroundColor Magenta
    Write-Host "    http://localhost:5173/auth/google/callback" -ForegroundColor Green
    Write-Host "    http://localhost:5174/auth/google/callback" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "PASSO 4: Copiar Credenciais" -ForegroundColor Yellow
    Write-Host "  Client ID: 845096565411-xxxxxxxxxx.apps.googleusercontent.com" -ForegroundColor Green
    Write-Host "  Client Secret: GOCSPX-xxxxxxxxxx" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "PASSO 5: Configurar no Projeto" -ForegroundColor Yellow
    Write-Host "  Execute: powershell dev-tools.ps1 google-config" -ForegroundColor Green
    Write-Host ""
    
    $openConsole = Read-Host "Deseja abrir o Google Cloud Console agora? (Y/N)"
    if ($openConsole -eq "Y" -or $openConsole -eq "y") {
        Start-Process "https://console.cloud.google.com/"
        Write-Host "Google Cloud Console aberto!" -ForegroundColor Green
    }
}

function Set-GoogleConfig {
    Write-Host "CONFIGURACAO GOOGLE OAUTH" -ForegroundColor Cyan
    Write-Host "=========================" -ForegroundColor Cyan
    Write-Host ""
    
    $clientId = Read-Host "Digite o Google Client ID"
    $clientSecret = Read-Host "Digite o Google Client Secret"
    
    if ($clientId -and $clientSecret) {
        # Atualizar frontend .env
        $frontendEnvPath = "client\.env"
        if (Test-Path $frontendEnvPath) {
            $frontendEnv = Get-Content $frontendEnvPath -Raw
            $frontendEnv = $frontendEnv -replace "VITE_GOOGLE_CLIENT_ID=.*", "VITE_GOOGLE_CLIENT_ID=$clientId"
            $frontendEnv | Set-Content $frontendEnvPath
        }
        
        # Atualizar backend .env
        $backendEnvPath = "server\.env"
        if (Test-Path $backendEnvPath) {
            $backendEnv = Get-Content $backendEnvPath -Raw
            $backendEnv = $backendEnv -replace "GOOGLE_CLIENT_ID=.*", "GOOGLE_CLIENT_ID=$clientId"
            $backendEnv = $backendEnv -replace "GOOGLE_CLIENT_SECRET=.*", "GOOGLE_CLIENT_SECRET=$clientSecret"
            $backendEnv | Set-Content $backendEnvPath
        }
        
        Write-Host "Configuracao atualizada com sucesso!" -ForegroundColor Green
        Write-Host "Reinicie os servicos: powershell dev-tools.ps1 restart" -ForegroundColor Yellow
    } else {
        Write-Host "Credenciais nao fornecidas." -ForegroundColor Red
    }
}

function Test-Services {
    Write-Host "TESTANDO SERVICOS..." -ForegroundColor Cyan
    Write-Host ""
    
    # Testar Backend
    try {
        $backendTest = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/google/auth-url" -Method GET -TimeoutSec 5
        Write-Host "Backend funcionando" -ForegroundColor Green
        Write-Host "  API: http://localhost:8080" -ForegroundColor Cyan
    } catch {
        Write-Host "Backend nao esta respondendo" -ForegroundColor Red
        Write-Host "  Inicie: powershell dev-tools.ps1 start" -ForegroundColor Yellow
    }
    
    # Testar Frontend
    try {
        $frontendTest = Invoke-WebRequest -Uri "http://localhost:5173" -Method HEAD -TimeoutSec 5 -ErrorAction SilentlyContinue
        if ($frontendTest.StatusCode -eq 200) {
            Write-Host "Frontend funcionando" -ForegroundColor Green
            Write-Host "  App: http://localhost:5173" -ForegroundColor Cyan
        }
    } catch {
        try {
            $frontendTest2 = Invoke-WebRequest -Uri "http://localhost:5174" -Method HEAD -TimeoutSec 5 -ErrorAction SilentlyContinue
            if ($frontendTest2.StatusCode -eq 200) {
                Write-Host "Frontend funcionando (porta 5174)" -ForegroundColor Green
                Write-Host "  App: http://localhost:5174" -ForegroundColor Cyan
            }
        } catch {
            Write-Host "Frontend nao esta respondendo" -ForegroundColor Red
            Write-Host "  Inicie: powershell dev-tools.ps1 start" -ForegroundColor Yellow
        }
    }
    
    # Testar login demo
    try {
        $body = @{
            email = "demo@willfinance.com"
            password = "cyberpunk2077"
        } | ConvertTo-Json
        
        $loginTest = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $body -ContentType "application/json" -TimeoutSec 5
        Write-Host "Login demo funcionando" -ForegroundColor Green
        Write-Host "  demo@willfinance.com / cyberpunk2077" -ForegroundColor Cyan
    } catch {
        Write-Host "Login demo nao funcionando" -ForegroundColor Red
    }
    
    Write-Host ""
}

function Stop-AllServices {
    Write-Host "Parando servicos..." -ForegroundColor Yellow
    
    # Parar jobs
    Get-Job | Stop-Job -ErrorAction SilentlyContinue
    Get-Job | Remove-Job -ErrorAction SilentlyContinue
    
    # Parar processos node
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
    
    Write-Host "Servicos parados!" -ForegroundColor Green
}

function Show-Help {
    Write-Host "COMANDOS DISPONIVEIS:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  start [-Background]   - Iniciar todos os servicos" -ForegroundColor Green
    Write-Host "  stop                  - Parar todos os servicos" -ForegroundColor Green
    Write-Host "  restart               - Reiniciar servicos" -ForegroundColor Green
    Write-Host "  test                  - Testar se servicos estao funcionando" -ForegroundColor Green
    Write-Host "  google-setup          - Guia do Google Cloud Console" -ForegroundColor Green
    Write-Host "  google-config         - Configurar credenciais Google" -ForegroundColor Green
    Write-Host "  open                  - Abrir app no navegador" -ForegroundColor Green
    Write-Host "  prisma                - Abrir apenas Prisma Studio" -ForegroundColor Green
    Write-Host "  status                - Ver status dos servicos" -ForegroundColor Green
    Write-Host "  help                  - Mostrar esta ajuda" -ForegroundColor Green
    Write-Host ""
    Write-Host "Exemplos:" -ForegroundColor Yellow
    Write-Host "  powershell dev-tools.ps1 start -Background" -ForegroundColor Cyan
    Write-Host "  powershell dev-tools.ps1 google-setup" -ForegroundColor Cyan
    Write-Host "  powershell dev-tools.ps1 test" -ForegroundColor Cyan
    Write-Host "  powershell dev-tools.ps1 prisma" -ForegroundColor Cyan
    Write-Host ""
}

function Start-PrismaOnly {
    Write-Host "Iniciando apenas Prisma Studio..." -ForegroundColor Blue
    
    # Verificar porta 5555
    try {
        $process = Get-NetTCPConnection -LocalPort 5555 -ErrorAction SilentlyContinue
        if ($process) {
            Write-Host "Porta 5555 ocupada. Finalizando processo..." -ForegroundColor Yellow
            $processId = (Get-Process -Id $process.OwningProcess -ErrorAction SilentlyContinue).Id
            if ($processId) {
                Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
                Start-Sleep -Seconds 1
            }
        }
    } catch {
        # Ignorar erro
    }
    
    # Iniciar Prisma Studio
    Start-Process powershell -ArgumentList "-WindowStyle Hidden -Command `"Set-Location server; npx prisma studio`"" -WindowStyle Hidden
    
    Start-Sleep -Seconds 3
    
    # Abrir Prisma Studio
    Start-Process "http://localhost:5555"
    
    Write-Host "Prisma Studio iniciado!" -ForegroundColor Green
    Write-Host "Database: http://localhost:5555" -ForegroundColor Blue
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
    "prisma" { Start-PrismaOnly }
    "status" { Test-Services }
    default { Show-Help }
}
