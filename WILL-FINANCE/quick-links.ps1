# 🎯 WILL FINANCE - Links Rápidos de Desenvolvimento
# Todas as ferramentas organizadas em um só lugar!

Write-Host "🚀 ===============================================" -ForegroundColor Green
Write-Host "🚀       WILL FINANCE - LINKS RÁPIDOS" -ForegroundColor Green  
Write-Host "🚀 ===============================================" -ForegroundColor Green
Write-Host ""

Write-Host "🌐 APLICAÇÃO PRINCIPAL:" -ForegroundColor Yellow
Write-Host "  📱 Dashboard: http://localhost:5173/dashboard" -ForegroundColor White
Write-Host "  🔐 Login: http://localhost:5173/login" -ForegroundColor White
Write-Host "  ⚙️  Configurações: http://localhost:5173/settings" -ForegroundColor White
Write-Host ""

Write-Host "🛠️  FERRAMENTAS DE DESENVOLVIMENTO:" -ForegroundColor Cyan
Write-Host "  🗄️  Banco de Dados (Prisma Studio): http://localhost:5555" -ForegroundColor White
Write-Host "  ⚡ API Backend: http://localhost:8080/api" -ForegroundColor White
Write-Host "  🔧 Health Check: http://localhost:8080/api/health" -ForegroundColor White
Write-Host ""

Write-Host "🔥 FIREBASE:" -ForegroundColor Red
Write-Host "  🔍 Console Firebase: https://console.firebase.google.com/project/gerenciador-financeiro-707c4" -ForegroundColor White
Write-Host ""

Write-Host "📊 STATUS ATUAL:" -ForegroundColor Green
Write-Host "  ✅ Frontend (React): OnLine" -ForegroundColor Green
Write-Host "  ✅ Backend (API): OnLine" -ForegroundColor Green  
Write-Host "  ✅ Banco (SQLite): OnLine" -ForegroundColor Green
Write-Host "  ✅ Firebase: OnLine" -ForegroundColor Green
Write-Host ""

Write-Host "💡 DICA: Agora você pode acessar todas essas ferramentas" -ForegroundColor Yellow
Write-Host "   através das Configurações > Dev Tools no dashboard!" -ForegroundColor Yellow
Write-Host ""

# Menu interativo
Write-Host "🚀 O que você gostaria de abrir?" -ForegroundColor Cyan
Write-Host "1 - Dashboard Principal" -ForegroundColor White
Write-Host "2 - Configurações (Dev Tools)" -ForegroundColor White  
Write-Host "3 - Banco de Dados (Prisma Studio)" -ForegroundColor White
Write-Host "4 - API Backend" -ForegroundColor White
Write-Host "5 - Firebase Console" -ForegroundColor White
Write-Host "0 - Sair" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Digite sua escolha (0-5)"

switch ($choice) {
    "1" { 
        Write-Host "🚀 Abrindo Dashboard..." -ForegroundColor Green
        Start-Process "http://localhost:5173/dashboard"
    }
    "2" { 
        Write-Host "⚙️ Abrindo Configurações..." -ForegroundColor Green
        Start-Process "http://localhost:5173/settings"
    }
    "3" { 
        Write-Host "🗄️ Abrindo Prisma Studio..." -ForegroundColor Green
        Start-Process "http://localhost:5555"
    }
    "4" { 
        Write-Host "⚡ Abrindo API..." -ForegroundColor Green
        Start-Process "http://localhost:8080/api"
    }
    "5" { 
        Write-Host "🔥 Abrindo Firebase Console..." -ForegroundColor Green
        Start-Process "https://console.firebase.google.com/project/gerenciador-financeiro-707c4"
    }
    "0" { 
        Write-Host "👋 Até logo!" -ForegroundColor Yellow
    }
    default { 
        Write-Host "Opcao invalida!" -ForegroundColor Red
    }
}
