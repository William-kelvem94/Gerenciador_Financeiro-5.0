# Script de instalação das dependências para o sistema de importação/exportação
# Execute: .\install-import-deps.ps1

Write-Host "🚀 Instalando dependências para o sistema de importação/exportação..." -ForegroundColor Green
Write-Host "=================================================================" -ForegroundColor Green

# Verificar se estamos no diretório correto
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Erro: Execute este script na raiz do projeto Will Finance" -ForegroundColor Red
    exit 1
}

Write-Host "📦 Instalando dependências do backend..." -ForegroundColor Yellow
Set-Location server

# Verificar se package.json existe
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Erro: package.json não encontrado no diretório server" -ForegroundColor Red
    exit 1
}

# Instalar dependências principais se não estiverem instaladas
Write-Host "Verificando dependências necessárias..." -ForegroundColor Cyan

# Lista de dependências críticas para importação/exportação
$deps = @(
    "multer@^1.4.5-lts.1",
    "pdf-parse@^1.1.1",
    "xlsx@^0.18.5",
    "@types/multer@^1.4.13",
    "@types/pdf-parse@^1.1.5"
)

foreach ($dep in $deps) {
    $packageName = $dep.Split('@')[0]
    $checkResult = npm list $packageName 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ $packageName já instalado" -ForegroundColor Green
    } else {
        Write-Host "📦 Instalando $dep..." -ForegroundColor Yellow
        npm install $dep
    }
}

Write-Host ""
Write-Host "🎯 Verificando instalação..." -ForegroundColor Cyan
npm list multer pdf-parse xlsx "@types/multer" "@types/pdf-parse"

Set-Location ..

Write-Host ""
Write-Host "📦 Instalando dependências do frontend..." -ForegroundColor Yellow
Set-Location client

if (-not (Test-Path "package.json")) {
    Write-Host "❌ Erro: package.json não encontrado no diretório client" -ForegroundColor Red
    exit 1
}

npm install

Set-Location ..

Write-Host ""
Write-Host "✅ Instalação concluída!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Para testar o sistema:" -ForegroundColor Cyan
Write-Host "1. Inicie o backend: cd server && npm run dev" -ForegroundColor White
Write-Host "2. Inicie o frontend: cd client && npm run dev" -ForegroundColor White
Write-Host "3. Execute o teste: node test-import-export.js" -ForegroundColor White
Write-Host ""
Write-Host "📚 Consulte IMPORT-EXPORT-DOCS.md para documentação completa" -ForegroundColor Yellow
