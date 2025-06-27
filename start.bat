@echo off
echo =====================================
echo    WILL FINANCE - INICIO RAPIDO
echo =====================================
echo.

echo Finalizando processos anteriores...
taskkill /f /im node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo Iniciando Backend em segundo plano...
start /min cmd /c "cd server && npm run dev"
timeout /t 5 /nobreak >nul

echo Iniciando Frontend em segundo plano...
start /min cmd /c "cd client && npm run dev"
timeout /t 5 /nobreak >nul

echo Iniciando Database em segundo plano...
set BROWSER=none
start /min cmd /c "cd server && npx prisma studio --browser none --port 5555"

echo.
echo Aguardando servicos ficarem online...
timeout /t 8 /nobreak >nul

echo.
echo =====================================
echo        TUDO PRONTO!
echo =====================================
echo.
echo Abrindo APENAS: http://localhost:5173

echo.
echo WILL FINANCE rodando!
echo Frontend: Aberto automaticamente
echo Backend: Segundo plano (porta 8080)
echo Database: Segundo plano (porta 5555)
echo.
echo Para parar: .\stop.ps1 ou taskkill /f /im node.exe
pause
