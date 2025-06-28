@echo off
echo.
echo 🚀 WILL FINANCE 5.0 - INICIALIZAÇÃO COMPLETA
echo ============================================
echo.

echo ⚡ Iniciando Backend (porta 8080)...
start /B cmd /c "cd server && npm run dev > nul 2>&1"

timeout /t 3 /nobreak >nul

echo 🎨 Iniciando Frontend (porta 5173)...
start /B cmd /c "cd client && npm run dev > nul 2>&1"

timeout /t 3 /nobreak >nul

echo 🗄️ Iniciando Prisma Studio (porta 5555)...
start /B cmd /c "cd server && npx prisma studio > nul 2>&1"

timeout /t 5 /nobreak >nul

echo.
echo ✅ TUDO INICIADO COM SUCESSO!
echo.
echo 📱 Aplicação: http://localhost:5173
echo 🔧 Backend:   http://localhost:8080
echo 🗄️ Banco:     http://localhost:5555
echo.
echo 🌐 Abrindo aplicação...
start http://localhost:5173

echo.
echo 💡 Para parar tudo, feche esta janela ou use Ctrl+C
echo.
pause
