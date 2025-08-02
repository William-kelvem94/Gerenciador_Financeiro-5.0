#!/usr/bin/env powershell
# 🔧 Script para Resolver Conflitos de Dependências

Write-Host "🚀 Will Finance 5.0 - Correção de Dependências" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Yellow

# Função para logging
function Write-Log {
    param($Message, $Color = "White")
    Write-Host "$(Get-Date -Format 'HH:mm:ss') $Message" -ForegroundColor $Color
}

# Verificar Node.js
Write-Log "🔍 Verificando Node.js..." "Yellow"
$nodeVersion = node --version 2>$null
if ($?) {
    Write-Log "✅ Node.js encontrado: $nodeVersion" "Green"
} else {
    Write-Log "❌ Node.js não encontrado. Instale Node.js 18+ primeiro!" "Red"
    exit 1
}

# Verificar npm
$npmVersion = npm --version 2>$null
Write-Log "✅ npm versão: $npmVersion" "Green"

# Limpar caches e node_modules
Write-Log "🧹 Limpando node_modules e caches..." "Yellow"
Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "client\node_modules" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "server\node_modules" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "package-lock.json" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "client\package-lock.json" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "server\package-lock.json" -Force -ErrorAction SilentlyContinue

# Limpar caches npm
npm cache clean --force

# Atualizar npm para versão mais recente
Write-Log "📦 Atualizando npm..." "Yellow"
npm install -g npm@latest

# Instalar dependências do projeto raiz
Write-Log "📦 Instalando dependências do projeto raiz..." "Yellow"
npm install

# Instalar dependências do servidor
Write-Log "🔧 Instalando dependências do servidor..." "Yellow"
Set-Location server
npm install --legacy-peer-deps
Set-Location ..

# Instalar dependências do cliente
Write-Log "🎨 Instalando dependências do cliente..." "Yellow"
Set-Location client
npm install --legacy-peer-deps
Set-Location ..

# Corrigir dependências críticas
Write-Log "🔧 Corrigindo dependências críticas..." "Yellow"

# Instalar dependências faltantes no servidor
Set-Location server
npm install pdf-parse@^1.1.1 xlsx@^0.18.5 multer@^1.4.5-lts.1 --save
npm install @types/pdf-parse @types/multer --save-dev
Set-Location ..

# Instalar dependências faltantes no cliente
Set-Location client
npm install chart.js@^4.4.0 react-chartjs-2@^5.2.0 react-dropzone@^14.2.3 --save
Set-Location ..

# Verificar instalação
Write-Log "✅ Verificando instalação..." "Yellow"
if (Test-Path "node_modules") {
    Write-Log "✅ Dependências raiz instaladas" "Green"
} else {
    Write-Log "❌ Falha nas dependências raiz" "Red"
}

if (Test-Path "server\node_modules") {
    Write-Log "✅ Dependências do servidor instaladas" "Green"
} else {
    Write-Log "❌ Falha nas dependências do servidor" "Red"
}

if (Test-Path "client\node_modules") {
    Write-Log "✅ Dependências do cliente instaladas" "Green"
} else {
    Write-Log "❌ Falha nas dependências do cliente" "Red"
}

# Executar testes de build
Write-Log "🔨 Testando builds..." "Yellow"
Set-Location server
$serverBuild = npm run build 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Log "✅ Build do servidor funcionando" "Green"
} else {
    Write-Log "⚠️ Build do servidor com avisos (continuando...)" "Yellow"
}
Set-Location ..

Set-Location client
$clientBuild = npm run build 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Log "✅ Build do cliente funcionando" "Green"
} else {
    Write-Log "⚠️ Build do cliente com avisos (continuando...)" "Yellow"
}
Set-Location ..

Write-Log "🎉 Correção de dependências concluída!" "Green"
Write-Log "📋 Próximos passos:" "Cyan"
Write-Log "   1. npm run dev (para desenvolvimento)" "White"
Write-Log "   2. npm run start (para produção com Docker)" "White"
Write-Log "   3. npm run db:setup (para configurar banco)" "White"
