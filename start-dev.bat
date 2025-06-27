@echo off
echo.
echo 🚀 GERENCIADOR FINANCEIRO 4.0 - DESENVOLVIMENTO LOCAL
echo =====================================================
echo.

:: Verificar se o Docker está instalado e rodando
where docker >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker não encontrado. Instale via https://www.docker.com/
    pause
    exit /b 1
)

docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker não está rodando. Inicie o Docker Desktop primeiro.
    pause
    exit /b 1
)

:: Verificar se o Node.js está instalado
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js não encontrado. Instale via https://nodejs.org/
    pause
    exit /b 1
)

:: Verificar se o npm está instalado
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm não encontrado. Reinstale o Node.js
    pause
    exit /b 1
)

echo ✅ Docker encontrado e rodando
echo ✅ Node.js encontrado
node --version
npm --version
echo.

:: Instalar dependências se necessário
if not exist "node_modules" (
    echo 📦 Instalando dependências raiz...
    call npm install
)

if not exist "backend\node_modules" (
    echo 📦 Instalando dependências do backend...
    cd backend
    call npm install
    cd ..
)

if not exist "frontend\node_modules" (
    echo 📦 Instalando dependências do frontend...
    cd frontend
    call npm install
    cd ..
)

echo.
echo 🗄️ Iniciando PostgreSQL (Docker)...
call npm run dev:db

echo.
echo ⏳ Aguardando banco de dados ficar pronto...
timeout /t 5 /nobreak >nul

echo.
echo 🎯 Iniciando aplicação...
echo   - PostgreSQL: localhost:5432 (Docker)
echo   - Backend: http://localhost:3000 (Local)
echo   - Frontend: http://localhost:4000 (Local)
echo.
echo 💡 Use Ctrl+C para parar todos os serviços
echo.

:: Iniciar backend e frontend em paralelo
start /B cmd /c "cd backend && npm run start:dev"
timeout /t 3 /nobreak >nul
start /B cmd /c "cd frontend && npm run dev"

echo.
echo ✅ Aplicação iniciada! Acesse: http://localhost:4000
echo.
echo 🛑 Para parar tudo:
echo    - Feche este terminal (Ctrl+C)
echo    - Execute: npm run dev:db:stop
echo.
pause
