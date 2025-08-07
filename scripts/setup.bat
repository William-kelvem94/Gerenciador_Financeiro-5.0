@echo off
setlocal enabledelayedexpansion

:: =====================================
:: Will Finance 5.0 - Setup Script
:: Autor: William
:: Versão: 5.0.0
:: =====================================

color 0a
title Will Finance 5.0 - Setup e Desenvolvimento

echo.
echo ████████████████████████████████████████████████████████████
echo █                                                          █
echo █         🚀 WILL FINANCE 5.0 - SETUP COMPLETO           █
echo █                                                          █
echo ████████████████████████████████████████████████████████████
echo.

:: Verificar Node.js
echo [INFO] Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js não encontrado! Instale Node.js 18+ primeiro.
    echo [INFO] Download: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [OK] Node.js %NODE_VERSION% encontrado

:: Verificar npm
echo [INFO] Verificando npm...
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm não encontrado!
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo [OK] npm %NPM_VERSION% encontrado

:: Menu de opções
:menu
echo.
echo ═══════════════════════════════════════════════════════════════
echo                          MENU DE SETUP
echo ═══════════════════════════════════════════════════════════════
echo.
echo [1] 🚀 Setup Completo (Recomendado)
echo [2] 📦 Instalar Dependências
echo [3] 🗄️  Configurar Banco de Dados
echo [4] 🐳 Setup com Docker
echo [5] ⚡ Desenvolvimento Local
echo [6] 🧪 Executar Testes
echo [7] 🔧 Apenas Frontend
echo [8] 🛡️  Apenas Backend
echo [9] 📊 Status do Sistema
echo [0] ❌ Sair
echo.
set /p choice="Escolha uma opção [0-9]: "

if "%choice%"=="1" goto setup_completo
if "%choice%"=="2" goto install_deps
if "%choice%"=="3" goto setup_db
if "%choice%"=="4" goto setup_docker
if "%choice%"=="5" goto dev_local
if "%choice%"=="6" goto run_tests
if "%choice%"=="7" goto frontend_only
if "%choice%"=="8" goto backend_only
if "%choice%"=="9" goto system_status
if "%choice%"=="0" goto exit
echo [ERROR] Opção inválida!
goto menu

:setup_completo
echo.
echo [INFO] 🚀 Iniciando setup completo...
echo.

echo [STEP 1/4] 📦 Instalando dependências...
call npm run install:all
if errorlevel 1 (
    echo [ERROR] Falha na instalação de dependências!
    pause
    goto menu
)

echo [STEP 2/4] 📁 Criando arquivos de configuração...
if not exist ".env" (
    copy ".env.example" ".env"
    echo [OK] Arquivo .env criado
)

echo [STEP 3/4] 🗄️ Configurando banco de dados...
call npm run db:setup
if errorlevel 1 (
    echo [ERROR] Falha na configuração do banco!
    pause
    goto menu
)

echo [STEP 4/4] ✅ Verificando instalação...
call npm run health
if errorlevel 1 (
    echo [WARNING] Alguns serviços podem não estar funcionando
)

echo.
echo ✅ SETUP COMPLETO!
echo.
echo 🌐 URLs disponíveis:
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:8080
echo   Database: http://localhost:5555
echo.
echo 📋 Próximos passos:
echo   1. Execute: npm run dev
echo   2. Acesse: http://localhost:5173
echo   3. Divirta-se! 🎉
echo.
pause
goto menu

:install_deps
echo.
echo [INFO] 📦 Instalando dependências...
call npm run install:all
echo [OK] Dependências instaladas!
pause
goto menu

:setup_db
echo.
echo [INFO] 🗄️ Configurando banco de dados...
call npm run db:setup
echo [OK] Banco configurado!
pause
goto menu

:setup_docker
echo.
echo [INFO] 🐳 Verificando Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker não encontrado!
    echo [INFO] Instale Docker Desktop primeiro
    pause
    goto menu
)

echo [INFO] Iniciando containers...
call npm run docker:up
echo [OK] Containers iniciados!
pause
goto menu

:dev_local
echo.
echo [INFO] ⚡ Iniciando desenvolvimento local...
echo [INFO] Pressione Ctrl+C para parar
call npm run dev
pause
goto menu

:run_tests
echo.
echo [INFO] 🧪 Executando testes...
call npm run test:all
pause
goto menu

:frontend_only
echo.
echo [INFO] 🔧 Iniciando apenas frontend...
cd client
npm run dev
cd ..
pause
goto menu

:backend_only
echo.
echo [INFO] 🛡️ Iniciando apenas backend...
cd server
npm run dev
cd ..
pause
goto menu

:system_status
echo.
echo [INFO] 📊 Verificando status do sistema...
echo.

:: Verificar services
echo [CHECK] Verificando serviços...
netstat -an | find "5173" >nul 2>&1
if not errorlevel 1 (
    echo [OK] Frontend rodando na porta 5173
) else (
    echo [INFO] Frontend não está rodando
)

netstat -an | find "8080" >nul 2>&1
if not errorlevel 1 (
    echo [OK] Backend rodando na porta 8080
) else (
    echo [INFO] Backend não está rodando
)

netstat -an | find "5432" >nul 2>&1
if not errorlevel 1 (
    echo [OK] PostgreSQL rodando na porta 5432
) else (
    echo [INFO] PostgreSQL não está rodando
)

echo.
pause
goto menu

:exit
echo.
echo [INFO] 👋 Obrigado por usar Will Finance 5.0!
echo [INFO] Para mais informações: https://github.com/william/will-finance-5.0
echo.
pause
exit /b 0
