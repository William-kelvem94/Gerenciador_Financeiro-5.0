@echo off
echo 🏦 Will Finance 5.0 - Iniciando Dashboard de Análise
echo.

echo 📦 Verificando Python...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python não encontrado! Instale o Python primeiro.
    pause
    exit /b 1
)

echo ✅ Python encontrado!
echo.

echo 📦 Instalando dependências...
cd /d "%~dp0"
python -m pip install -r requirements.txt

if %errorlevel% neq 0 (
    echo ❌ Erro ao instalar dependências!
    pause
    exit /b 1
)

echo ✅ Dependências instaladas!
echo.

echo 🚀 Iniciando servidor...
echo 🌐 O dashboard será aberto em: http://localhost:5001
echo ⚠️  Para parar o servidor, pressione Ctrl+C
echo.

python app.py

pause
