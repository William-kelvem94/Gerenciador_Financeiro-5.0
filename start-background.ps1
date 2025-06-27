# WILL FINANCE - INICIO RAPIDO EM SEGUNDO PLANO

Write-Host "INICIANDO WILL FINANCE..." -ForegroundColor Green
Write-Host ""

# Matar processos anteriores
Write-Host "Finalizando processos anteriores..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# Iniciar Backend em segundo plano
Write-Host "Iniciando Backend..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-WindowStyle", "Hidden", "-Command", "cd server; npm run dev" -WindowStyle Hidden
Start-Sleep -Seconds 5

# Iniciar Frontend em segundo plano
Write-Host "Iniciando Frontend..." -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-WindowStyle", "Hidden", "-Command", "cd client; npm run dev" -WindowStyle Hidden
Start-Sleep -Seconds 3

# Iniciar Prisma Studio em segundo plano
Write-Host "Iniciando Database..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-WindowStyle", "Hidden", "-Command", "cd server; npx prisma studio --browser none" -WindowStyle Hidden

Write-Host ""
Write-Host "AGUARDANDO SERVICOS FICAREM ONLINE..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

Write-Host ""
Write-Host "TUDO PRONTO!" -ForegroundColor Green
Write-Host "Abrindo APENAS: http://localhost:5173" -ForegroundColor Green

# Abrir APENAS o dominio principal
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "WILL FINANCE rodando!" -ForegroundColor Green
Write-Host "Frontend: Aberto automaticamente" -ForegroundColor Green
Write-Host "Backend: Segundo plano (porta 8080)" -ForegroundColor Gray
Write-Host "Database: Segundo plano (porta 5555)" -ForegroundColor Gray
Write-Host ""
Write-Host "Para parar: .\stop.ps1" -ForegroundColor Yellow
