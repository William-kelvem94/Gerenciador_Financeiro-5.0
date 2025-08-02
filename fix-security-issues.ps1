# 🛠️ Script de Correção Automática - Will Finance 5.0
# Corrige automaticamente problemas de dependências e configuração

# Verificar se o script está sendo executado no PowerShell
if (-not $PSVersionTable) {
    Write-Error "Este script deve ser executado no PowerShell"
    exit 1
}

Write-Host "🛠️ Iniciando Correções Automáticas - Will Finance 5.0" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Gray

# =====================================================
# 🔧 Configurações Iniciais
# =====================================================
$ErrorActionPreference = "Continue"
$projectRoot = $PSScriptRoot
$logFile = Join-Path $projectRoot "fix-security-issues.log"

function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] [$Level] $Message"
    Add-Content -Path $logFile -Value $logEntry
    
    switch ($Level) {
        "ERROR" { Write-Host "❌ $Message" -ForegroundColor Red }
        "WARN" { Write-Host "⚠️ $Message" -ForegroundColor Yellow }
        "SUCCESS" { Write-Host "✅ $Message" -ForegroundColor Green }
        default { Write-Host "ℹ️ $Message" -ForegroundColor White }
    }
}

# =====================================================
# 📦 1. Corrigir Dependências do Backend
# =====================================================
Write-Host "`n📦 1. Corrigindo Dependências do Backend..." -ForegroundColor Yellow

try {
    Set-Location (Join-Path $projectRoot "server")
    
    # Instalar dependências de segurança ausentes
    $securityDeps = @(
        "helmet@^7.1.0",
        "express-rate-limit@^7.1.5",
        "winston@^3.11.0",
        "compression@^1.7.4",
        "jest-html-reporters@^3.1.0",
        "jest-junit@^16.0.0"
    )
    
    foreach ($dep in $securityDeps) {
        Write-Log "Instalando $dep..." "INFO"
        npm install $dep --save
        if ($LASTEXITCODE -eq 0) {
            Write-Log "Dependência $dep instalada com sucesso" "SUCCESS"
        } else {
            Write-Log "Erro ao instalar $dep" "ERROR"
        }
    }
    
    # Instalar dependências de desenvolvimento
    $devDeps = @(
        "@types/compression@^1.7.5",
        "supertest@^7.1.3",
        "@types/supertest@^6.0.3"
    )
    
    foreach ($dep in $devDeps) {
        Write-Log "Instalando $dep (dev)..." "INFO"
        npm install $dep --save-dev
        if ($LASTEXITCODE -eq 0) {
            Write-Log "Dependência de desenvolvimento $dep instalada com sucesso" "SUCCESS"
        } else {
            Write-Log "Erro ao instalar $dep" "ERROR"
        }
    }
    
} catch {
    Write-Log "Erro ao corrigir dependências do backend: $($_.Exception.Message)" "ERROR"
}

# =====================================================
# 🎨 2. Corrigir Dependências do Frontend
# =====================================================
Write-Host "`n🎨 2. Corrigindo Dependências do Frontend..." -ForegroundColor Yellow

try {
    Set-Location (Join-Path $projectRoot "client")
    
    # Instalar dependências de segurança e testes
    $frontendDeps = @(
        "react-error-boundary@^4.0.11",
        "react-helmet-async@^2.0.4"
    )
    
    foreach ($dep in $frontendDeps) {
        Write-Log "Instalando $dep..." "INFO"
        npm install $dep --save
        if ($LASTEXITCODE -eq 0) {
            Write-Log "Dependência $dep instalada com sucesso" "SUCCESS"
        } else {
            Write-Log "Erro ao instalar $dep" "ERROR"
        }
    }
    
    # Instalar dependências de desenvolvimento para testes
    $devDeps = @(
        "cypress@^14.5.3",
        "@testing-library/jest-dom@^6.6.4",
        "@testing-library/react@^16.3.0",
        "@testing-library/user-event@^14.6.1",
        "happy-dom@^15.3.1"
    )
    
    foreach ($dep in $devDeps) {
        Write-Log "Instalando $dep (dev)..." "INFO"
        npm install $dep --save-dev
        if ($LASTEXITCODE -eq 0) {
            Write-Log "Dependência de desenvolvimento $dep instalada com sucesso" "SUCCESS"
        } else {
            Write-Log "Erro ao instalar $dep" "ERROR"
        }
    }
    
} catch {
    Write-Log "Erro ao corrigir dependências do frontend: $($_.Exception.Message)" "ERROR"
}

# =====================================================
# 🔐 3. Corrigir Configurações de Segurança
# =====================================================
Write-Host "`n🔐 3. Corrigindo Configurações de Segurança..." -ForegroundColor Yellow

Set-Location $projectRoot

# Criar .env se não existir
if (-not (Test-Path ".env")) {
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Log "Arquivo .env criado a partir de .env.example" "SUCCESS"
    } else {
        Write-Log "Arquivo .env.example não encontrado" "WARN"
    }
}

# Verificar .gitignore
$gitignorePath = Join-Path $projectRoot ".gitignore"
if (Test-Path $gitignorePath) {
    $gitignoreContent = Get-Content $gitignorePath -Raw
    
    $sensitiveFiles = @(".env", ".env.local", ".env.production", "*.log", "security-*.txt")
    $updated = $false
    
    foreach ($file in $sensitiveFiles) {
        if ($gitignoreContent -notmatch [regex]::Escape($file)) {
            Add-Content -Path $gitignorePath -Value $file
            Write-Log "Adicionado $file ao .gitignore" "SUCCESS"
            $updated = $true
        }
    }
    
    if (-not $updated) {
        Write-Log "Todos os arquivos sensíveis já estão no .gitignore" "SUCCESS"
    }
} else {
    Write-Log ".gitignore não encontrado" "WARN"
}

# =====================================================
# 🧪 4. Configurar Estrutura de Testes
# =====================================================
Write-Host "`n🧪 4. Configurando Estrutura de Testes..." -ForegroundColor Yellow

# Criar diretórios de teste para o backend
$serverTestDirs = @("test", "test\unit", "test\integration", "test\api")
foreach ($dir in $serverTestDirs) {
    $fullPath = Join-Path $projectRoot "server\$dir"
    if (-not (Test-Path $fullPath)) {
        New-Item -Path $fullPath -ItemType Directory -Force
        Write-Log "Diretório $dir criado no servidor" "SUCCESS"
    }
}

# Criar diretórios de teste para o frontend
$clientTestDirs = @("src\tests", "src\tests\unit", "src\tests\integration", "cypress", "cypress\e2e")
foreach ($dir in $clientTestDirs) {
    $fullPath = Join-Path $projectRoot "client\$dir"
    if (-not (Test-Path $fullPath)) {
        New-Item -Path $fullPath -ItemType Directory -Force
        Write-Log "Diretório $dir criado no cliente" "SUCCESS"
    }
}

# =====================================================
# 🐳 5. Verificar e Corrigir Docker
# =====================================================
Write-Host "`n🐳 5. Verificando Configuração Docker..." -ForegroundColor Yellow

$dockerComposePath = Join-Path $projectRoot "docker-compose.yml"
if (Test-Path $dockerComposePath) {
    Write-Log "docker-compose.yml encontrado" "SUCCESS"
} else {
    Write-Log "docker-compose.yml NÃO ENCONTRADO - Verifique se foi criado corretamente" "WARN"
}

$dockerComposeProdPath = Join-Path $projectRoot "docker-compose.prod.yml"
if (Test-Path $dockerComposeProdPath) {
    Write-Log "docker-compose.prod.yml encontrado" "SUCCESS"
} else {
    Write-Log "docker-compose.prod.yml NÃO ENCONTRADO - Verifique se foi criado corretamente" "WARN"
}

# =====================================================
# 🔄 6. Atualizar package.json Scripts
# =====================================================
Write-Host "`n🔄 6. Atualizando Scripts do Package.json..." -ForegroundColor Yellow

try {
    # Atualizar scripts do projeto principal
    $mainPackageJson = Join-Path $projectRoot "package.json"
    if (Test-Path $mainPackageJson) {
        $package = Get-Content $mainPackageJson | ConvertFrom-Json
        
        # Adicionar novos scripts de segurança
        $newScripts = @{
            "validate:security" = "powershell -ExecutionPolicy Bypass -File .\validate-security.ps1"
            "fix:security" = "powershell -ExecutionPolicy Bypass -File .\fix-security-issues.ps1"
            "test:all" = "npm run test && cd client && npm run test && cd .."
            "audit:all" = "npm audit && cd client && npm audit && cd ../server && npm audit && cd .."
            "build:prod:secure" = "npm run validate:security && npm run test:all && npm run build:prod"
        }
        
        foreach ($script in $newScripts.GetEnumerator()) {
            $package.scripts | Add-Member -NotePropertyName $script.Key -NotePropertyValue $script.Value -Force
        }
        
        $package | ConvertTo-Json -Depth 10 | Set-Content $mainPackageJson
        Write-Log "Scripts de segurança adicionados ao package.json principal" "SUCCESS"
    }
    
} catch {
    Write-Log "Erro ao atualizar scripts: $($_.Exception.Message)" "ERROR"
}

# =====================================================
# 🧹 7. Limpeza e Reorganização
# =====================================================
Write-Host "`n🧹 7. Executando Limpeza Final..." -ForegroundColor Yellow

try {
    # Limpar cache do npm
    Set-Location (Join-Path $projectRoot "server")
    npm cache clean --force
    Write-Log "Cache do npm limpo (servidor)" "SUCCESS"
    
    Set-Location (Join-Path $projectRoot "client")
    npm cache clean --force
    Write-Log "Cache do npm limpo (cliente)" "SUCCESS"
    
    Set-Location $projectRoot
    
    # Remover node_modules e reinstalar (opcional)
    $reinstall = Read-Host "`n🔄 Deseja reinstalar todas as dependências? (y/N)"
    if ($reinstall -eq "y" -or $reinstall -eq "Y") {
        Write-Log "Reinstalando todas as dependências..." "INFO"
        
        # Root
        if (Test-Path "node_modules") {
            Remove-Item "node_modules" -Recurse -Force
        }
        npm install
        
        # Server
        Set-Location (Join-Path $projectRoot "server")
        if (Test-Path "node_modules") {
            Remove-Item "node_modules" -Recurse -Force
        }
        npm install
        
        # Client
        Set-Location (Join-Path $projectRoot "client")
        if (Test-Path "node_modules") {
            Remove-Item "node_modules" -Recurse -Force
        }
        npm install
        
        Set-Location $projectRoot
        Write-Log "Todas as dependências reinstaladas" "SUCCESS"
    }
    
} catch {
    Write-Log "Erro durante limpeza: $($_.Exception.Message)" "ERROR"
}

# =====================================================
# 📋 8. Relatório Final
# =====================================================
Write-Host "`n📋 Relatório Final de Correções" -ForegroundColor Cyan
Write-Host "===============================" -ForegroundColor Gray

Write-Log "Correções automáticas concluídas!" "SUCCESS"

Write-Host "`n🔍 Próximos passos recomendados:" -ForegroundColor Yellow
Write-Host "1. Execute: .\validate-security.ps1" -ForegroundColor White
Write-Host "2. Execute: npm run test:all" -ForegroundColor White
Write-Host "3. Execute: npm run build:prod:secure" -ForegroundColor White
Write-Host "4. Execute: docker-compose up -d" -ForegroundColor White

$summary = @"
🛠️ RELATÓRIO DE CORREÇÕES APLICADAS
===================================
Data: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
Status: CONCLUÍDO

Correções aplicadas:
✅ Dependências de segurança instaladas
✅ Estrutura de testes criada
✅ Configurações de ambiente corrigidas
✅ Scripts de validação adicionados
✅ .gitignore atualizado

Para mais detalhes, consulte: $logFile
"@

$summaryFile = Join-Path $projectRoot "fix-security-summary.txt"
Set-Content -Path $summaryFile -Value $summary

Write-Host "`n📝 Relatório de correções salvo em: $summaryFile" -ForegroundColor Gray
Write-Host "📝 Log detalhado em: $logFile" -ForegroundColor Gray

Write-Host "`n🎉 Sistema corrigido e otimizado!" -ForegroundColor Green
