#!/usr/bin/env powershell
# 🔍 Script de Validação Final - Will Finance 5.0

Write-Host "🎯 Will Finance 5.0 - Validação Final do Sistema" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Yellow

# Função para logging
function Write-Log {
    param($Message, $Color = "White")
    Write-Host "$(Get-Date -Format 'HH:mm:ss') $Message" -ForegroundColor $Color
}

# Função para fazer requests HTTP
function Test-Endpoint {
    param($Url, $ExpectedStatus = 200, $Description)
    
    try {
        $response = Invoke-WebRequest -Uri $Url -Method GET -TimeoutSec 10 -UseBasicParsing
        if ($response.StatusCode -eq $ExpectedStatus) {
            Write-Log "✅ $Description - OK ($($response.StatusCode))" "Green"
            return $true
        } else {
            Write-Log "⚠️ $Description - Status inesperado: $($response.StatusCode)" "Yellow"
            return $false
        }
    } catch {
        Write-Log "❌ $Description - FALHOU: $($_.Exception.Message)" "Red"
        return $false
    }
}

# Verificar se os serviços estão rodando
Write-Log "🔍 Verificando status dos serviços Docker..." "Yellow"

$dockerServices = @("client", "server", "ia-service", "postgres")
$allServicesUp = $true

foreach ($service in $dockerServices) {
    $status = docker-compose ps -q $service 2>$null
    if ($status) {
        $running = docker inspect --format='{{.State.Running}}' $status 2>$null
        if ($running -eq "true") {
            Write-Log "✅ Serviço $service está rodando" "Green"
        } else {
            Write-Log "❌ Serviço $service não está rodando" "Red"
            $allServicesUp = $false
        }
    } else {
        Write-Log "❌ Serviço $service não foi encontrado" "Red"
        $allServicesUp = $false
    }
}

# Health checks dos serviços
Write-Log "🏥 Executando health checks..." "Yellow"

$healthChecks = @(
    @{ Url = "http://localhost:3000/health"; Description = "Backend API Health" },
    @{ Url = "http://localhost:8000/health"; Description = "IA Service Health" },
    @{ Url = "http://localhost:80"; Description = "Frontend Application"; ExpectedStatus = 200 }
)

$healthOk = $true
foreach ($check in $healthChecks) {
    $status = if ($check.ExpectedStatus) { $check.ExpectedStatus } else { 200 }
    $result = Test-Endpoint -Url $check.Url -ExpectedStatus $status -Description $check.Description
    if (-not $result) { $healthOk = $false }
}

# Testar funcionalidades críticas
Write-Log "🧪 Testando funcionalidades críticas..." "Yellow"

# Teste de autenticação (criar usuário demo)
Write-Log "🔐 Testando sistema de autenticação..." "Yellow"
try {
    $authPayload = @{
        email = "demo@willfinance.com"
        password = "demo123"
        name = "Usuário Demo"
    } | ConvertTo-Json

    $authResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" -Method POST -Body $authPayload -ContentType "application/json" -TimeoutSec 10
    
    if ($authResponse.success) {
        Write-Log "✅ Autenticação - Registro funcionando" "Green"
        
        # Tentar fazer login
        $loginPayload = @{
            email = "demo@willfinance.com"
            password = "demo123"
        } | ConvertTo-Json
        
        $loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -Body $loginPayload -ContentType "application/json" -TimeoutSec 10
        
        if ($loginResponse.token) {
            Write-Log "✅ Autenticação - Login funcionando" "Green"
            $authToken = $loginResponse.token
        } else {
            Write-Log "❌ Autenticação - Login falhou" "Red"
        }
    } else {
        Write-Log "❌ Autenticação - Registro falhou" "Red"
    }
} catch {
    Write-Log "❌ Autenticação - Erro: $($_.Exception.Message)" "Red"
}

# Teste de importação (se temos token)
if ($authToken) {
    Write-Log "📄 Testando importação de dados..." "Yellow"
    
    # Verificar se endpoint de importação responde
    try {
        $headers = @{ Authorization = "Bearer $authToken" }
        $importResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/import/banks" -Method GET -Headers $headers -TimeoutSec 10 -UseBasicParsing
        
        if ($importResponse.StatusCode -eq 200) {
            Write-Log "✅ Import - Endpoint de bancos funcionando" "Green"
        } else {
            Write-Log "⚠️ Import - Endpoint com status: $($importResponse.StatusCode)" "Yellow"
        }
    } catch {
        Write-Log "❌ Import - Erro: $($_.Exception.Message)" "Red"
    }
}

# Teste de IA
Write-Log "🤖 Testando integração com IA..." "Yellow"
try {
    $iaPayload = @{
        text = "Pagamento Restaurante McDonald's"
        amount = 25.50
    } | ConvertTo-Json

    $iaResponse = Invoke-RestMethod -Uri "http://localhost:8000/classify" -Method POST -Body $iaPayload -ContentType "application/json" -TimeoutSec 15
    
    if ($iaResponse.category) {
        Write-Log "✅ IA - Classificação funcionando (categoria: $($iaResponse.category))" "Green"
    } else {
        Write-Log "⚠️ IA - Resposta sem categoria" "Yellow"
    }
} catch {
    Write-Log "❌ IA - Erro: $($_.Exception.Message)" "Red"
}

# Verificar banco de dados
Write-Log "🗄️ Testando conexão com banco de dados..." "Yellow"
try {
    if ($authToken) {
        $headers = @{ Authorization = "Bearer $authToken" }
        $dbResponse = Invoke-WebRequest -Uri "http://localhost:3000/api/transactions" -Method GET -Headers $headers -TimeoutSec 10 -UseBasicParsing
        
        if ($dbResponse.StatusCode -eq 200) {
            Write-Log "✅ Database - Conexão funcionando" "Green"
        } else {
            Write-Log "⚠️ Database - Status: $($dbResponse.StatusCode)" "Yellow"
        }
    } else {
        Write-Log "⚠️ Database - Pulando teste (sem token de auth)" "Yellow"
    }
} catch {
    Write-Log "❌ Database - Erro: $($_.Exception.Message)" "Red"
}

# Verificar performance
Write-Log "⚡ Testando performance..." "Yellow"
$performanceTests = @(
    @{ Url = "http://localhost:80"; Name = "Frontend" },
    @{ Url = "http://localhost:3000/health"; Name = "Backend" }
)

foreach ($test in $performanceTests) {
    try {
        $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
        $response = Invoke-WebRequest -Uri $test.Url -UseBasicParsing -TimeoutSec 5
        $stopwatch.Stop()
        
        $responseTime = $stopwatch.ElapsedMilliseconds
        if ($responseTime -lt 1000) {
            Write-Log "✅ Performance $($test.Name) - ${responseTime}ms (Excelente)" "Green"
        } elseif ($responseTime -lt 3000) {
            Write-Log "⚠️ Performance $($test.Name) - ${responseTime}ms (Aceitável)" "Yellow"
        } else {
            Write-Log "❌ Performance $($test.Name) - ${responseTime}ms (Lento)" "Red"
        }
    } catch {
        Write-Log "❌ Performance $($test.Name) - Falhou" "Red"
    }
}

# Verificar logs por erros críticos
Write-Log "📋 Verificando logs por erros..." "Yellow"
try {
    $logs = docker-compose logs --tail=50 server 2>$null
    $errorCount = ($logs | Select-String -Pattern "ERROR|FATAL|CRITICAL").Count
    
    if ($errorCount -eq 0) {
        Write-Log "✅ Logs - Nenhum erro crítico encontrado" "Green"
    } else {
        Write-Log "⚠️ Logs - $errorCount erros encontrados nos logs" "Yellow"
    }
} catch {
    Write-Log "⚠️ Logs - Não foi possível verificar logs" "Yellow"
}

# Verificar espaço em disco e recursos
Write-Log "💾 Verificando recursos do sistema..." "Yellow"

# Verificar espaço em disco
$disk = Get-WmiObject -Class Win32_LogicalDisk -Filter "DeviceID='C:'" | Select-Object Size, FreeSpace
$freeSpaceGB = [math]::Round($disk.FreeSpace / 1GB, 2)
$totalSpaceGB = [math]::Round($disk.Size / 1GB, 2)
$freeSpacePercent = [math]::Round(($disk.FreeSpace / $disk.Size) * 100, 1)

if ($freeSpacePercent -gt 20) {
    Write-Log "✅ Disco - ${freeSpaceGB}GB livres de ${totalSpaceGB}GB ($freeSpacePercent%)" "Green"
} else {
    Write-Log "⚠️ Disco - Pouco espaço: ${freeSpaceGB}GB livres ($freeSpacePercent%)" "Yellow"
}

# Verificar memória
$memory = Get-WmiObject -Class Win32_OperatingSystem
$totalMemoryGB = [math]::Round($memory.TotalVisibleMemorySize / 1MB, 2)
$freeMemoryGB = [math]::Round($memory.FreePhysicalMemory / 1MB, 2)
$usedMemoryPercent = [math]::Round((($totalMemoryGB - $freeMemoryGB) / $totalMemoryGB) * 100, 1)

if ($usedMemoryPercent -lt 80) {
    Write-Log "✅ Memória - ${freeMemoryGB}GB livres de ${totalMemoryGB}GB (${usedMemoryPercent}% usado)" "Green"
} else {
    Write-Log "⚠️ Memória - Alto uso: ${usedMemoryPercent}% de ${totalMemoryGB}GB" "Yellow"
}

# Resumo final
Write-Log "" "White"
Write-Log "📊 RESUMO DA VALIDAÇÃO:" "Cyan"
Write-Log "========================" "Yellow"

if ($allServicesUp -and $healthOk) {
    Write-Log "🎉 SISTEMA FUNCIONANDO CORRETAMENTE!" "Green"
    Write-Log "" "White"
    Write-Log "✅ Todos os serviços estão rodando" "Green"
    Write-Log "✅ Health checks passaram" "Green"
    Write-Log "✅ Funcionalidades básicas testadas" "Green"
    Write-Log "" "White"
    Write-Log "🔗 Acesse o sistema:" "Cyan"
    Write-Log "   Frontend: http://localhost" "White"
    Write-Log "   API:      http://localhost:3000" "White"
    Write-Log "   IA:       http://localhost:8000" "White"
    Write-Log "" "White"
    Write-Log "📚 Próximos passos:" "Cyan"
    Write-Log "   1. Faça login em http://localhost" "White"
    Write-Log "   2. Importe um extrato PDF para testar IA" "White"
    Write-Log "   3. Explore o dashboard com dados reais" "White"
    Write-Log "   4. Configure conexões Open Finance" "White"
} else {
    Write-Log "⚠️ SISTEMA COM PROBLEMAS" "Yellow"
    Write-Log "" "White"
    Write-Log "🔧 Ações recomendadas:" "Yellow"
    Write-Log "   1. Execute: docker-compose down && docker-compose up -d" "White"
    Write-Log "   2. Aguarde 2-3 minutos para inicialização" "White"
    Write-Log "   3. Execute este script novamente" "White"
    Write-Log "   4. Verifique logs: docker-compose logs -f" "White"
}

Write-Log "" "White"
Write-Log "🔍 Para monitoramento contínuo, execute:" "Cyan"
Write-Log "   docker-compose ps" "White"
Write-Log "   docker-compose logs -f" "White"
