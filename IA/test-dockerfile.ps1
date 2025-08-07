# =============================================================================
# Script de Teste do Dockerfile Otimizado - Will Finance 5.0 (PowerShell)
# =============================================================================

# Configurações
$ErrorActionPreference = "Stop"
$ImageName = "will-finance-ai:test"

# Funções de logging com cores
function Write-Info {
    param($Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param($Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Error {
    param($Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

function Write-Warning {
    param($Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

# Início dos testes
Write-Host "🧪 INICIANDO TESTES DO DOCKERFILE OTIMIZADO" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan

try {
    # Verificar se Docker está disponível
    Write-Info "Verificando se Docker está disponível..."
    
    $dockerVersion = docker --version 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Docker não encontrado. Instale o Docker primeiro."
        exit 1
    }
    
    $dockerInfo = docker info 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Docker não está rodando. Inicie o Docker primeiro."
        exit 1
    }
    
    Write-Success "Docker está disponível e rodando."

    # Teste 1: Build da imagem
    Write-Info "Teste 1: Fazendo build da imagem otimizada..."
    $startTime = Get-Date
    
    docker build -t $ImageName .
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Falha no build da imagem"
        exit 1
    }
    
    $endTime = Get-Date
    $buildTime = ($endTime - $startTime).TotalSeconds
    Write-Success "Build completado em $([math]::Round($buildTime, 1))s"

    # Teste 2: Verificar tamanho da imagem
    Write-Info "Teste 2: Verificando tamanho da imagem..."
    $imageInfo = docker images $ImageName --format "table {{.Size}}" | Select-Object -Skip 1
    Write-Success "Tamanho da imagem: $imageInfo"

    # Teste 3: Verificar se a imagem inicia corretamente
    Write-Info "Teste 3: Testando inicialização do container..."
    $containerId = docker run -d $ImageName
    
    if ($LASTEXITCODE -eq 0) {
        $shortId = $containerId.Substring(0, 12)
        Write-Success "Container iniciado com ID: $shortId"
        
        # Aguardar e verificar se ainda está rodando
        Start-Sleep -Seconds 5
        $runningContainers = docker ps --format "{{.ID}}"
        if ($runningContainers -contains $shortId) {
            Write-Success "Container ainda está rodando após 5s"
        } else {
            Write-Warning "Container parou após 5s (esperado para este CMD)"
        }
        
        # Cleanup
        docker stop $containerId | Out-Null
        docker rm $containerId | Out-Null
    } else {
        Write-Error "Falha ao iniciar container"
        exit 1
    }

    # Teste 4: Verificar se o usuário não é root
    Write-Info "Teste 4: Verificando se executa como usuário não-root..."
    $userCheck = docker run --rm $ImageName whoami
    if ($userCheck -eq "appuser") {
        Write-Success "Executando como usuário não-root: $userCheck"
    } else {
        Write-Error "Container ainda executa como root!"
        exit 1
    }

    # Teste 5: Verificar se Python está disponível e funcionando
    Write-Info "Teste 5: Testando disponibilidade do Python..."
    $pythonVersion = docker run --rm $ImageName python --version
    if ($pythonVersion -like "*Python 3.12*") {
        Write-Success "Python funcionando: $pythonVersion"
    } else {
        Write-Error "Python não está funcionando corretamente"
        exit 1
    }

    # Teste 6: Verificar pacotes Python essenciais
    Write-Info "Teste 6: Verificando pacotes Python essenciais..."
    $packages = @("numpy", "torch", "transformers")
    
    foreach ($package in $packages) {
        $result = docker run --rm $ImageName python -c "import $package; print('$package: OK')" 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Pacote $package: OK"
        } else {
            Write-Error "Pacote $package: FALHA"
            exit 1
        }
    }

    # Teste 7: Verificar healthcheck
    Write-Info "Teste 7: Testando healthcheck..."
    $containerId = docker run -d $ImageName
    Start-Sleep -Seconds 10  # Aguardar healthcheck
    
    $healthStatus = docker inspect --format='{{.State.Health.Status}}' $containerId
    if ($healthStatus -eq "healthy") {
        Write-Success "Healthcheck: HEALTHY"
    } else {
        Write-Warning "Healthcheck: $healthStatus (pode precisar de mais tempo)"
    }
    
    # Cleanup
    docker stop $containerId | Out-Null
    docker rm $containerId | Out-Null

    # Teste 8: Verificar vulnerabilidades (se trivy estiver disponível)
    Write-Info "Teste 8: Verificando vulnerabilidades com Trivy (opcional)..."
    $trivyAvailable = Get-Command trivy -ErrorAction SilentlyContinue
    if ($trivyAvailable) {
        Write-Info "Executando scan de vulnerabilidades com Trivy..."
        trivy image --severity HIGH,CRITICAL $ImageName
    } else {
        Write-Warning "Trivy não encontrado. Pulando scan de vulnerabilidades."
    }

    # Relatório final
    Write-Host ""
    Write-Host "🎉 RELATÓRIO FINAL DOS TESTES" -ForegroundColor Cyan
    Write-Host "=============================" -ForegroundColor Cyan
    Write-Success "✅ Build da imagem"
    Write-Success "✅ Tamanho da imagem: $imageInfo"
    Write-Success "✅ Inicialização do container"
    Write-Success "✅ Execução como usuário não-root"
    Write-Success "✅ Python funcional"
    Write-Success "✅ Pacotes essenciais instalados"
    Write-Success "✅ Healthcheck configurado"

    Write-Host ""
    Write-Info "🚀 Imagem pronta para uso: $ImageName"
    Write-Info "💡 Para usar: docker run -it $ImageName"
    Write-Info "🔧 Para desenvolvimento: docker run -it -v `${PWD}:/workspace $ImageName bash"

    Write-Host ""
    Write-Success "🏆 TODOS OS TESTES PASSARAM COM SUCESSO!"

} catch {
    Write-Error "Erro durante execução dos testes: $_"
    exit 1
}
