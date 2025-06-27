@echo off
echo 🚀 Installing WILL-FINANCE Dependencies...
echo.

echo 📦 Installing root dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install root dependencies
    pause
    exit /b 1
)

echo 📦 Installing client dependencies...
cd client
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install client dependencies
    pause
    exit /b 1
)

echo 📦 Installing server dependencies...
cd ..\server
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install server dependencies
    pause
    exit /b 1
)

cd ..

echo.
echo ✅ All dependencies installed successfully!
echo.
echo 📋 Next steps:
echo 1. Copy .env.example to .env and configure your environment variables
echo 2. Make sure PostgreSQL and Redis are running
echo 3. Run: npm run db:migrate
echo 4. Run: npm run db:seed
echo 5. Run: npm run dev
echo.
echo 📖 For detailed instructions, see SETUP.md
echo.
pause
