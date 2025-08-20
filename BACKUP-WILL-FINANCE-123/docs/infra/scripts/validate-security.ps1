# 🔍 Script de Validação de Segurança - Will Finance 5.0
# Valida todas as configurações de segurança e dependências

# Verificar se o script está sendo executado no PowerShell
if (-not $PSVersionTable) {
    Write-Error "Este script deve ser executado no PowerShell"
    exit 1
}

Write-Host "🛡️ Iniciando Validação de Segurança - Will Finance 5.0" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Gray

# =====================================================
# 🔧 Configurações Iniciais
# =====================================================
$ErrorActionPreference = "Continue"
$projectRoot = Split-Path $PSScriptRoot -Parent  # Volta ao diretório raiz do projeto
$logFile = Join-Path $projectRoot "security-validation.log"
$hasErrors = $false

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
# 🔐 1. Validação de Variáveis de Ambiente
# =====================================================
Write-Host "`n🔐 1. Validando Variáveis de Ambiente..." -ForegroundColor Yellow

$envFiles = @("configs\.env.example", "configs\server.env.example", "configs\client.env.example")
foreach ($envFile in $envFiles) {
    $envPath = Join-Path $projectRoot $envFile
    if (Test-Path $envPath) {
        Write-Log "Arquivo $envFile encontrado" "SUCCESS"
        
        # Verificar se contém variáveis essenciais
        $content = Get-Content $envPath -Raw
        if ($envFile -match "server") {
            $requiredVars = @("DATABASE_URL", "JWT_SECRET", "NODE_ENV", "PORT")
        } elseif ($envFile -match "client") {
            $requiredVars = @("VITE_API_URL")
        } else {
            $requiredVars = @("DATABASE_URL", "JWT_SECRET", "NODE_ENV")
        }
        
        foreach ($var in $requiredVars) {
            if ($content -match $var) {
                Write-Log "Variável $var configurada em $envFile" "SUCCESS"
            } else {
                Write-Log "Variável $var AUSENTE em $envFile" "ERROR"
                $hasErrors = $true
            }
        }
    } else {
        Write-Log "Arquivo $envFile NÃO ENCONTRADO" "ERROR"
        $hasErrors = $true
    }
}

# =====================================================
# 🔒 2. Validação de Dependências de Segurança
# =====================================================
Write-Host "`n🔒 2. Validando Dependências de Segurança..." -ForegroundColor Yellow

# Backend
$serverPackageJson = Join-Path $projectRoot "server\package.json"
if (Test-Path $serverPackageJson) {
    $serverPackage = Get-Content $serverPackageJson | ConvertFrom-Json
    
    $securityDeps = @("helmet", "express-rate-limit", "bcryptjs", "jsonwebtoken")
    foreach ($dep in $securityDeps) {
        if ($serverPackage.dependencies.$dep) {
            Write-Log "Dependência de segurança $dep instalada: $($serverPackage.dependencies.$dep)" "SUCCESS"
        } else {
            Write-Log "Dependência de segurança $dep AUSENTE" "ERROR"
            $hasErrors = $true
        }
    }
} else {
    Write-Log "server/package.json NÃO ENCONTRADO" "ERROR"
    $hasErrors = $true
}

# Frontend
$clientPackageJson = Join-Path $projectRoot "client\package.json"
if (Test-Path $clientPackageJson) {
    $clientPackage = Get-Content $clientPackageJson | ConvertFrom-Json
    
    # Verificar se há dependências com versões fixas (não chapadas)
    $dependencies = $clientPackage.dependencies
    $looseDeps = @()
    
    foreach ($dep in $dependencies.PSObject.Properties) {
        if ($dep.Value -match "^\^" -or $dep.Value -match "^~") {
            $looseDeps += "$($dep.Name): $($dep.Value)"
        }
    }
    
    if ($looseDeps.Count -eq 0) {
        Write-Log "Todas as dependências têm versões fixas" "SUCCESS"
    } else {
        Write-Log "Dependências com versões 'chapadas' encontradas: $($looseDeps -join ', ')" "WARN"
    }
} else {
    Write-Log "client/package.json NÃO ENCONTRADO" "ERROR"
    $hasErrors = $true
}

# =====================================================
# 🐳 3. Validação de Configuração Docker
# =====================================================
Write-Host "`n🐳 3. Validando Configuração Docker..." -ForegroundColor Yellow

$dockerFiles = @("docker\docker-compose.yml", "docker\docker-compose.prod.yml")
foreach ($dockerFile in $dockerFiles) {
    $dockerPath = Join-Path $projectRoot $dockerFile
    if (Test-Path $dockerPath) {
        Write-Log "Arquivo $dockerFile encontrado" "SUCCESS"
        
        $content = Get-Content $dockerPath -Raw
        
        # Verificar health checks
        if ($content -match "healthcheck:") {
            Write-Log "Health checks configurados em $dockerFile" "SUCCESS"
        } else {
            Write-Log "Health checks AUSENTES em $dockerFile" "WARN"
        }
        
        # Verificar restart policies
        if ($content -match "restart:") {
            Write-Log "Restart policies configuradas em $dockerFile" "SUCCESS"
        } else {
            Write-Log "Restart policies AUSENTES em $dockerFile" "WARN"
        }
        
        # Verificar volumes persistentes
        if ($content -match "volumes:") {
            Write-Log "Volumes persistentes configurados em $dockerFile" "SUCCESS"
        } else {
            Write-Log "Volumes persistentes podem estar ausentes em $dockerFile" "WARN"
        }
    } else {
        Write-Log "Arquivo $dockerFile NÃO ENCONTRADO" "ERROR"
        $hasErrors = $true
    }
}

# =====================================================
# 🧪 4. Validação de Configuração de Testes
# =====================================================
Write-Host "`n🧪 4. Validando Configuração de Testes..." -ForegroundColor Yellow

# Jest (Backend)
$jestConfig = Join-Path $projectRoot "server\jest.config.js"
if (Test-Path $jestConfig) {
    Write-Log "Configuração Jest encontrada" "SUCCESS"
    
    $content = Get-Content $jestConfig -Raw
    if ($content -match "coverageThreshold") {
        Write-Log "Coverage thresholds configurados no Jest" "SUCCESS"
    } else {
        Write-Log "Coverage thresholds AUSENTES no Jest" "WARN"
    }
} else {
    Write-Log "jest.config.js NÃO ENCONTRADO" "ERROR"
    $hasErrors = $true
}

# Vitest (Frontend)
$vitestConfig = Join-Path $projectRoot "client\vitest.config.ts"
if (Test-Path $vitestConfig) {
    Write-Log "Configuração Vitest encontrada" "SUCCESS"
} else {
    Write-Log "vitest.config.ts NÃO ENCONTRADO" "ERROR"
    $hasErrors = $true
}

# =====================================================
# 🌐 5. Validação de Configuração Nginx
# =====================================================
Write-Host "`n🌐 5. Validando Configuração Nginx..." -ForegroundColor Yellow

$nginxConfigs = @("nginx\nginx.conf", "nginx\nginx.prod.conf")
foreach ($nginxConfig in $nginxConfigs) {
    $nginxPath = Join-Path $projectRoot $nginxConfig
    if (Test-Path $nginxPath) {
        Write-Log "Configuração $nginxConfig encontrada" "SUCCESS"
        
        $content = Get-Content $nginxPath -Raw
        
        # Verificar headers de segurança
        if ($content -match "X-Frame-Options" -and $content -match "X-Content-Type-Options") {
            Write-Log "Headers de segurança configurados em $nginxConfig" "SUCCESS"
        } else {
            Write-Log "Headers de segurança INCOMPLETOS em $nginxConfig" "WARN"
        }
        
        # Verificar rate limiting
        if ($content -match "limit_req_zone") {
            Write-Log "Rate limiting configurado em $nginxConfig" "SUCCESS"
        } else {
            Write-Log "Rate limiting AUSENTE em $nginxConfig" "WARN"
        }
    } else {
        Write-Log "Configuração $nginxConfig NÃO ENCONTRADA" "WARN"
    }
}

# =====================================================
# 📊 6. Executar Audit de Segurança
# =====================================================
Write-Host "`n📊 6. Executando Audit de Segurança..." -ForegroundColor Yellow

try {
    # Audit do servidor
    Set-Location (Join-Path $projectRoot "server")
    Write-Log "Executando npm audit no servidor..." "INFO"
    $auditResult = npm audit --audit-level high 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Log "Audit do servidor: Nenhuma vulnerabilidade crítica encontrada" "SUCCESS"
    } else {
        Write-Log "Audit do servidor: Vulnerabilidades encontradas" "WARN"
        Write-Log $auditResult "WARN"
    }
    
    # Audit do cliente
    Set-Location (Join-Path $projectRoot "client")
    Write-Log "Executando npm audit no cliente..." "INFO"
    $auditResult = npm audit --audit-level high 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Log "Audit do cliente: Nenhuma vulnerabilidade crítica encontrada" "SUCCESS"
    } else {
        Write-Log "Audit do cliente: Vulnerabilidades encontradas" "WARN"
        Write-Log $auditResult "WARN"
    }
    
    Set-Location $projectRoot
} catch {
    Write-Log "Erro ao executar audit: $($_.Exception.Message)" "ERROR"
    $hasErrors = $true
}

# =====================================================
# 📋 7. Relatório Final
# =====================================================
Write-Host "`n📋 Relatório Final de Validação" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Gray

if ($hasErrors) {
    Write-Log "Validação FALHOU - Erros críticos encontrados!" "ERROR"
    Write-Host "`n🔧 Para corrigir os problemas, execute:" -ForegroundColor Yellow
    Write-Host "   .\scripts\fix-security-issues.ps1" -ForegroundColor White
    
    # Salvar relatório resumido
    $summary = @"
🛡️ RELATÓRIO DE VALIDAÇÃO DE SEGURANÇA
=======================================
Data: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
Status: FALHOU

Para mais detalhes, consulte: $logFile
"@
    $summaryFile = Join-Path $projectRoot "security-validation-summary.txt"
    Set-Content -Path $summaryFile -Value $summary
    Write-Host "`n📝 Relatório resumido salvo em: $summaryFile" -ForegroundColor Gray
    
    exit 1
} else {
    Write-Log "Validação SUCESSO - Sistema seguro e pronto para produção!" "SUCCESS"
    Write-Host "`n🚀 Sistema validado com sucesso!" -ForegroundColor Green
    Write-Host "   Log detalhado: $logFile" -ForegroundColor Gray
    
    # Salvar relatório resumido
    $summary = @"
🛡️ RELATÓRIO DE VALIDAÇÃO DE SEGURANÇA
=======================================
Data: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
Status: SUCESSO

Para mais detalhes, consulte: $logFile
"@
    $summaryFile = Join-Path $projectRoot "security-validation-summary.txt"
    Set-Content -Path $summaryFile -Value $summary
    Write-Host "`n📝 Relatório resumido salvo em: $summaryFile" -ForegroundColor Gray
    
    exit 0
}
