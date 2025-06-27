# WILL FINANCE - START ALL
# Comando simples para iniciar tudo

Write-Host "INICIANDO WILL FINANCE..." -ForegroundColor Green

# Matar processos anteriores
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force

# Aguardar
Start-Sleep -Seconds 2

# Iniciar tudo em paralelo
Write-Host "Iniciando Backend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd server; npm run dev" -WindowStyle Normal

Start-Sleep -Seconds 5

Write-Host "Iniciando Frontend..." -ForegroundColor Yellow  
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd client; npm run dev" -WindowStyle Normal

Start-Sleep -Seconds 3

Write-Host "Iniciando Prisma Studio..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd server; npx prisma studio --browser none" -WindowStyle Normal

Write-Host ""
Write-Host "TUDO INICIADO!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "Backend:  http://localhost:8080" -ForegroundColor White  
Write-Host "Database: http://localhost:5555" -ForegroundColor White
Write-Host ""

Start-Sleep -Seconds 8
Start-Process "http://localhost:5173/dashboard"

Write-Host "Dashboard aberto automaticamente!" -ForegroundColor Green
