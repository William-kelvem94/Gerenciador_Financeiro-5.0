# Script para iniciar Prisma Studio sem abrir navegador
# Este script é usado internamente pelo start.ps1

$env:BROWSER = "none"
$env:NO_BROWSER = "1"

Set-Location server
npx prisma studio --browser none --port 5555 --hostname 127.0.0.1
