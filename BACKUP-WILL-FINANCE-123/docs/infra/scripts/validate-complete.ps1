# 🔍 Validação Completa do Sistema - Will Finance 5.0
# Script master que executa todas as validações necessárias

param(
    [switch]$Fix,
    [switch]$Verbose,
    [switch]$SkipTests
)

# Verificar se o script está sendo executado no PowerShell
if (-not $PSVersionTable) {
    Write-Error "Este script deve ser executado no PowerShell"
    exit 1
}

Write-Host "🎯 Will Finance 5.0 - Validação Completa do Sistema" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Gray

# =====================================================
# 🔧 Configurações Iniciais
# =====================================================
$ErrorActionPreference = "Continue"
$projectRoot = $PSScriptRoot
$logFile = Join-Path $projectRoot "system-validation-complete.log"
$hasErrors = $false
$hasWarnings = $false

function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] [$Level] $Message"
    Add-Content -Path $logFile -Value $logEntry
    
    switch ($Level) {
        "ERROR" { 
            Write-Host "❌ $Message" -ForegroundColor Red
            $script:hasErrors = $true
        }
        "WARN" { 
            Write-Host "⚠️ $Message" -ForegroundColor Yellow
            $script:hasWarnings = $true
        }
        "SUCCESS" { Write-Host "✅ $Message" -ForegroundColor Green }
        default { 
            if ($Verbose) {
                Write-Host "ℹ️ $Message" -ForegroundColor White 
            }
        }
    }
}

# =====================================================
# 🛠️ 1. Executar Correções (se solicitado)
# =====================================================
if ($Fix) {
    Write-Host "`n🛠️ 1. Aplicando Correções Automáticas..." -ForegroundColor Yellow
    
    $fixScript = Join-Path $projectRoot "scripts\fix-security-issues.ps1"
    if (Test-Path $fixScript) {
        try {
            & $fixScript
            Write-Log "Correções automáticas aplicadas com sucesso" "SUCCESS"
        } catch {
            Write-Log "Erro ao aplicar correções: $($_.Exception.Message)" "ERROR"
        }
    } else {
        Write-Log "Script de correções não encontrado: $fixScript" "ERROR"
    }
} else {
    Write-Host "`n⏭️ 1. Pulando Correções (use -Fix para aplicar)" -ForegroundColor Gray
}

# =====================================================
# 🔒 2. Validação de Segurança
# =====================================================
Write-Host "`n🔒 2. Executando Validação de Segurança..." -ForegroundColor Yellow

$securityScript = Join-Path $projectRoot "scripts\validate-security.ps1"
if (Test-Path $securityScript) {
    try {
        $securityResult = & $securityScript
        if ($LASTEXITCODE -eq 0) {
            Write-Log "Validação de segurança: APROVADA" "SUCCESS"
        } else {
            Write-Log "Validação de segurança: FALHOU" "ERROR"
        }
    } catch {
        Write-Log "Erro na validação de segurança: $($_.Exception.Message)" "ERROR"
    }
} else {
    Write-Log "Script de validação de segurança não encontrado" "ERROR"
}

# =====================================================
# 📦 3. Verificação de Dependências
# =====================================================
Write-Host "`n📦 3. Verificando Dependências..." -ForegroundColor Yellow

$packageFiles = @(
    "package.json",
    "server\package.json", 
    "client\package.json"
)

foreach ($packageFile in $packageFiles) {
    $packagePath = Join-Path $projectRoot $packageFile
    if (Test-Path $packagePath) {
        Write-Log "Verificando $packageFile..." "INFO"
        
        try {
            $package = Get-Content $packagePath | ConvertFrom-Json
            $depCount = 0
            
            if ($package.dependencies) {
                $depCount += ($package.dependencies.PSObject.Properties | Measure-Object).Count
            }
            if ($package.devDependencies) {
                $depCount += ($package.devDependencies.PSObject.Properties | Measure-Object).Count
            }
            
            Write-Log "$packageFile: $depCount dependências encontradas" "SUCCESS"
        } catch {
            Write-Log "Erro ao ler $packageFile: $($_.Exception.Message)" "ERROR"
        }
    } else {
        Write-Log "$packageFile não encontrado" "ERROR"
    }
}

# =====================================================
# 🧪 4. Executar Testes (se não pulado)
# =====================================================
if (-not $SkipTests) {
    Write-Host "`n🧪 4. Executando Testes..." -ForegroundColor Yellow
    
    try {
        # Testes do servidor
        Write-Log "Executando testes do servidor..." "INFO"
        Set-Location (Join-Path $projectRoot "server")
        $serverTestResult = npm test 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Log "Testes do servidor: APROVADOS" "SUCCESS"
        } else {
            Write-Log "Testes do servidor: FALHARAM" "WARN"
            if ($Verbose) {
                Write-Log $serverTestResult "INFO"
            }
        }
        
        # Testes do cliente
        Write-Log "Executando testes do cliente..." "INFO"
        Set-Location (Join-Path $projectRoot "client")
        $clientTestResult = npm test -- --run 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Log "Testes do cliente: APROVADOS" "SUCCESS"
        } else {
            Write-Log "Testes do cliente: FALHARAM" "WARN"
            if ($Verbose) {
                Write-Log $clientTestResult "INFO"
            }
        }
        
        Set-Location $projectRoot
    } catch {
        Write-Log "Erro ao executar testes: $($_.Exception.Message)" "ERROR"
    }
} else {
    Write-Host "`n⏭️ 4. Pulando Testes (use sem -SkipTests para executar)" -ForegroundColor Gray
}

# =====================================================
# 🐳 5. Validação Docker
# =====================================================
Write-Host "`n🐳 5. Validando Configuração Docker..." -ForegroundColor Yellow

$dockerFiles = @("docker\docker-compose.yml", "docker\docker-compose.prod.yml")
foreach ($dockerFile in $dockerFiles) {
    $dockerPath = Join-Path $projectRoot $dockerFile
    if (Test-Path $dockerPath) {
        Write-Log "Validando $dockerFile..." "INFO"
        
        try {
            # Verificar se o docker-compose está disponível
            $composeCheck = docker-compose config -f $dockerPath 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-Log "$dockerFile: Configuração válida" "SUCCESS"
            } else {
                Write-Log "$dockerFile: Configuração inválida" "WARN"
                if ($Verbose) {
                    Write-Log $composeCheck "INFO"
                }
            }
        } catch {
            Write-Log "Docker Compose não disponível para validar $dockerFile" "WARN"
        }
    } else {
        Write-Log "$dockerFile não encontrado" "ERROR"
    }
}

# =====================================================
# 🌐 6. Validação de Configuração Web
# =====================================================
Write-Host "`n🌐 6. Validando Configurações Web..." -ForegroundColor Yellow

$webConfigs = @(
    "nginx\nginx.conf",
    "nginx\nginx.prod.conf",
    "client\vite.config.ts",
    "server\tsconfig.json"
)

foreach ($config in $webConfigs) {
    $configPath = Join-Path $projectRoot $config
    if (Test-Path $configPath) {
        Write-Log "Configuração $config encontrada" "SUCCESS"
    } else {
        Write-Log "Configuração $config não encontrada" "WARN"
    }
}

# =====================================================
# 📊 7. Verificação de Performance
# =====================================================
Write-Host "`n📊 7. Verificando Configurações de Performance..." -ForegroundColor Yellow

# Verificar se há configurações de cache, compressão, etc.
$performanceChecks = @{
    "client\vite.config.ts" = @("build", "rollupOptions")
    "nginx\nginx.conf" = @("gzip", "compression")
    "server\package.json" = @("compression", "helmet")
}

foreach ($file in $performanceChecks.Keys) {
    $filePath = Join-Path $projectRoot $file
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw
        $checks = $performanceChecks[$file]
        
        foreach ($check in $checks) {
            if ($content -match $check) {
                Write-Log "$file: $check configurado" "SUCCESS"
            } else {
                Write-Log "$file: $check não encontrado" "WARN"
            }
        }
    }
}

# =====================================================
# 🔍 8. Verificação de Estrutura de Arquivos
# =====================================================
Write-Host "`n🔍 8. Verificando Estrutura de Arquivos..." -ForegroundColor Yellow

$requiredDirs = @(
    "client\src\components",
    "client\src\services", 
    "server\src",
    "server\prisma",
    "IA\src",
    "docs",
    "scripts"
)

foreach ($dir in $requiredDirs) {
    $dirPath = Join-Path $projectRoot $dir
    if (Test-Path $dirPath -PathType Container) {
        Write-Log "Diretório $dir existe" "SUCCESS"
    } else {
        Write-Log "Diretório $dir não encontrado" "WARN"
    }
}

# =====================================================
# 📋 9. Relatório Final
# =====================================================
Write-Host "`n📋 Relatório Final da Validação" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Gray

$totalChecks = 50  # Estimativa do número total de verificações
$errorCount = (Get-Content $logFile | Select-String "ERROR").Count
$warnCount = (Get-Content $logFile | Select-String "WARN").Count
$successCount = (Get-Content $logFile | Select-String "SUCCESS").Count

Write-Host "`n📊 Estatísticas:" -ForegroundColor White
Write-Host "   ✅ Sucessos: $successCount" -ForegroundColor Green
Write-Host "   ⚠️ Avisos: $warnCount" -ForegroundColor Yellow
Write-Host "   ❌ Erros: $errorCount" -ForegroundColor Red

$scorePercentage = [math]::Round((($successCount / ($successCount + $warnCount + $errorCount)) * 100), 1)
Write-Host "`n🎯 Score Geral: $scorePercentage%" -ForegroundColor $(
    if ($scorePercentage -ge 90) { "Green" }
    elseif ($scorePercentage -ge 75) { "Yellow" }
    else { "Red" }
)

# Status final
if ($hasErrors) {
    Write-Log "VALIDAÇÃO FALHOU - Erros críticos encontrados!" "ERROR"
    Write-Host "`n🔧 Para corrigir automaticamente:" -ForegroundColor Yellow
    Write-Host "   .\validate-complete.ps1 -Fix" -ForegroundColor White
    $exitCode = 1
} elseif ($hasWarnings) {
    Write-Log "VALIDAÇÃO CONCLUÍDA - Avisos encontrados" "WARN"
    Write-Host "`n✨ Sistema funcional com melhorias recomendadas" -ForegroundColor Yellow
    $exitCode = 0
} else {
    Write-Log "VALIDAÇÃO APROVADA - Sistema 100% validado!" "SUCCESS"
    Write-Host "`n🎉 Sistema pronto para produção!" -ForegroundColor Green
    $exitCode = 0
}

# =====================================================
# 📝 Salvar relatório final
# =====================================================
$reportSummary = @"
🎯 WILL FINANCE 5.0 - RELATÓRIO DE VALIDAÇÃO COMPLETA
====================================================
Data: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
Score: $scorePercentage%

Estatísticas:
✅ Sucessos: $successCount
⚠️ Avisos: $warnCount  
❌ Erros: $errorCount

Status: $(if ($hasErrors) { "FALHOU" } elseif ($hasWarnings) { "APROVADO COM AVISOS" } else { "APROVADO" })

Próximos passos:
$(if ($hasErrors) { "1. Execute: .\validate-complete.ps1 -Fix" } else { "1. Sistema pronto para uso" })
$(if ($hasWarnings) { "2. Verifique avisos no log detalhado" } else { "2. Inicie com: npm run dev" })

Log detalhado: $logFile
"@

$reportFile = Join-Path $projectRoot "validation-report.txt"
Set-Content -Path $reportFile -Value $reportSummary

Write-Host "`n📝 Relatório completo salvo em: $reportFile" -ForegroundColor Gray
Write-Host "📝 Log detalhado em: $logFile" -ForegroundColor Gray

exit $exitCode
