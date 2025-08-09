@echo off
REM Script movido para scripts/development/start-all.bat
@echo off
setlocal enabledelayedexpansion

echo.
echo 🚀 WILL FINANCE 5.0 - INICIALIZAÇÃO COMPLETA
echo =============================================
echo.

:: Verificar se estamos no diretório correto
if not exist "server\" (
    echo ❌ Erro: Execute este script a partir do diretório raiz do projeto
    pause
    exit /b 1
)

:: Configurar dependências
echo 📦 Configurando dependências...
call npm install
if !errorlevel! neq 0 (
    echo ❌ Falha na instalação das dependências do servidor
    pause
    exit /b 1
)

:: Configurar banco de dados
echo.
echo 🗄️ Configurando banco de dados...
cd server || exit /b 1

call npx prisma generate
if !errorlevel! neq 0 goto :db_error

call npx prisma db push
if !errorlevel! neq 0 goto :db_error

call npm run db:seed
if !errorlevel! neq 0 goto :db_error

cd ..

:: Configurar cliente
echo.
echo 📦 Configurando cliente...
cd client || exit /b 1

call npm install
if !errorlevel! neq 0 (
    echo ❌ Falha na instalação das dependências do cliente
    pause
    exit /b 1
)

cd ..

:: Iniciar serviços com verificações adicionais 
echo.
echo 🚀 Iniciando serviços...
echo.
echo 📡 SERVIÇOS DISPONÍVEIS:
echo    🔧 Backend API: http://localhost:8080/api/healthcheck (verifique status)
echo    🌐 Frontend: http://localhost:5173 (aguarde até carregar)
echo    📊 Prisma Studio: http://localhost:5555 (pode demorar alguns segundos)
echo.
echo ⚡ Pressione Ctrl+C para parar todos os serviços ou feche esta janela para encerrar tudo.
echo.

start "Prisma Studio" /B cmd /c "cd server && npx prisma studio"
timeout /t 5 /nobreak > nul

start "Frontend" /B cmd /c "cd client && npm run dev"
timeout /t 2 /nobreak > nul

start "Backend" /B cmd /k "cd server && npm run dev"

exit /b 0

:db_error
echo ❌ Erro na configuração do banco de dados. Verifique os logs acima.
pause
exit /b 1
Script migrado para scripts/development/start-all.bat em 08/08/2025. Utilize a nova versão para inicialização.
