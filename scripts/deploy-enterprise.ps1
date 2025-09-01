# === 🚀 WILL FINANCE 5.0 PRO - ENTERPRISE DEPLOYMENT SCRIPT === #
# PowerShell script para deployment completo com validações e monitoramento

param(
    [string]$Environment = "production",
    [switch]$Build = $false,
    [switch]$NoPull = $false,
    [switch]$Verbose = $false,
    [switch]$HealthCheck = $false,
    [string]$Service = "all"
)

# === CONFIGURAÇÕES === #
$ErrorActionPreference = "Stop"
$ProjectName = "Will Finance 5.0 Pro"
$ComposeFile = "docker-compose.yml"
$EnvFile = ".env.production"
$LogFile = "logs/deployment.log"

# === CORES PARA OUTPUT === #
function Write-Banner {
    param([string]$Message)
    Write-Host "`n╔══════════════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║  $($Message.PadRight(74))  ║" -ForegroundColor Cyan
    Write-Host "╚══════════════════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ️  $Message" -ForegroundColor Blue
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

function Write-Step {
    param([string]$Message)
    Write-Host "`n🔄 $Message" -ForegroundColor Magenta
}

# === LOGGING === #
function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $LogEntry = "[$Timestamp] [$Level] $Message"
    
    # Create logs directory if it doesn't exist
    if (!(Test-Path "logs")) {
        New-Item -ItemType Directory -Path "logs" -Force | Out-Null
    }
    
    Add-Content -Path $LogFile -Value $LogEntry
    
    if ($Verbose) {
        Write-Host $LogEntry -ForegroundColor Gray
    }
}

# === VALIDAÇÕES === #
function Test-Prerequisites {
    Write-Step "Validando pré-requisitos..."
    
    # Docker
    try {
        $dockerVersion = docker --version
        Write-Success "Docker encontrado: $dockerVersion"
        Write-Log "Docker validation successful: $dockerVersion"
    }
    catch {
        Write-Error "Docker não encontrado. Instale o Docker Desktop."
        Write-Log "Docker validation failed" "ERROR"
        exit 1
    }
    
    # Docker Compose
    try {
        $composeVersion = docker-compose --version
        Write-Success "Docker Compose encontrado: $composeVersion"
        Write-Log "Docker Compose validation successful: $composeVersion"
    }
    catch {
        Write-Error "Docker Compose não encontrado."
        Write-Log "Docker Compose validation failed" "ERROR"
        exit 1
    }
    
    # Arquivos necessários
    $requiredFiles = @($ComposeFile, $EnvFile, "server/Dockerfile", "client/Dockerfile")
    foreach ($file in $requiredFiles) {
        if (Test-Path $file) {
            Write-Success "Arquivo encontrado: $file"
            Write-Log "Required file found: $file"
        } else {
            Write-Error "Arquivo obrigatório não encontrado: $file"
            Write-Log "Required file missing: $file" "ERROR"
            exit 1
        }
    }
}

function Test-DiskSpace {
    Write-Step "Verificando espaço em disco..."
    
    $drive = Get-PSDrive -Name ($PWD.Path.Split(':')[0])
    $freeGB = [math]::Round($drive.Free / 1GB, 2)
    
    if ($freeGB -lt 5) {
        Write-Warning "Pouco espaço em disco: ${freeGB}GB livres. Recomendado: 5GB+"
        Write-Log "Low disk space warning: ${freeGB}GB free" "WARN"
    } else {
        Write-Success "Espaço em disco adequado: ${freeGB}GB livres"
        Write-Log "Adequate disk space: ${freeGB}GB free"
    }
}

function Test-NetworkPorts {
    Write-Step "Verificando portas de rede..."
    
    $ports = @(80, 443, 3000, 3001, 5432, 6379)
    $portsInUse = @()
    
    foreach ($port in $ports) {
        $connection = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
        if ($connection) {
            $portsInUse += $port
            Write-Warning "Porta $port já está em uso"
            Write-Log "Port $port already in use" "WARN"
        } else {
            Write-Success "Porta $port disponível"
        }
    }
    
    if ($portsInUse.Count -gt 0) {
        Write-Warning "As seguintes portas estão em uso: $($portsInUse -join ', ')"
        Write-Warning "Isso pode causar conflitos durante o deployment."
        
        $continue = Read-Host "Continuar mesmo assim? (y/N)"
        if ($continue -ne 'y' -and $continue -ne 'Y') {
            Write-Info "Deployment cancelado pelo usuário."
            exit 0
        }
    }
}

# === CLEANUP === #
function Stop-ExistingContainers {
    Write-Step "Parando containers existentes..."
    
    try {
        docker-compose -f $ComposeFile down --volumes --remove-orphans 2>&1 | Out-Null
        Write-Success "Containers parados com sucesso"
        Write-Log "Existing containers stopped successfully"
    }
    catch {
        Write-Warning "Erro ao parar containers (pode ser normal se não existissem)"
        Write-Log "Warning during container stop: $($_.Exception.Message)" "WARN"
    }
}

function Remove-UnusedResources {
    Write-Step "Limpando recursos não utilizados..."
    
    try {
        # Remove unused images (keep last 3)
        $unusedImages = docker images --filter "dangling=true" -q
        if ($unusedImages) {
            docker rmi $unusedImages 2>&1 | Out-Null
            Write-Success "Imagens não utilizadas removidas"
        }
        
        # Prune system (but keep volumes)
        docker system prune -f 2>&1 | Out-Null
        Write-Success "Sistema Docker otimizado"
        Write-Log "Docker system cleanup completed"
    }
    catch {
        Write-Warning "Erro durante limpeza: $($_.Exception.Message)"
        Write-Log "Cleanup warning: $($_.Exception.Message)" "WARN"
    }
}

# === BUILD === #
function Build-Images {
    Write-Step "Construindo imagens Docker..."
    
    if ($Build) {
        $services = if ($Service -eq "all") { @("backend", "frontend") } else { @($Service) }
        
        foreach ($svc in $services) {
            Write-Info "Construindo $svc..."
            try {
                docker-compose -f $ComposeFile build --no-cache $svc
                Write-Success "Imagem $svc construída com sucesso"
                Write-Log "Image $svc built successfully"
            }
            catch {
                Write-Error "Falha ao construir $svc : $($_.Exception.Message)"
                Write-Log "Build failed for $svc : $($_.Exception.Message)" "ERROR"
                exit 1
            }
        }
    } else {
        Write-Info "Pulando build de imagens (use -Build para forçar rebuild)"
    }
}

# === DEPLOYMENT === #
function Start-Services {
    Write-Step "Iniciando serviços..."
    
    try {
        # Start infrastructure services first
        Write-Info "Iniciando serviços de infraestrutura..."
        docker-compose -f $ComposeFile up -d postgres redis
        
        # Wait for database
        Write-Info "Aguardando banco de dados..."
        $timeout = 60
        $elapsed = 0
        
        do {
            Start-Sleep -Seconds 2
            $elapsed += 2
            $dbStatus = docker-compose -f $ComposeFile exec postgres pg_isready -U postgres 2>&1
            
            if ($dbStatus -match "accepting connections") {
                Write-Success "Banco de dados pronto!"
                break
            }
            
            if ($elapsed % 10 -eq 0) {
                Write-Info "Ainda aguardando banco... ($elapsed/${timeout}s)"
            }
        } while ($elapsed -lt $timeout)
        
        if ($elapsed -ge $timeout) {
            Write-Error "Timeout aguardando banco de dados"
            Write-Log "Database startup timeout" "ERROR"
            exit 1
        }
        
        # Start application services
        Write-Info "Iniciando serviços de aplicação..."
        docker-compose -f $ComposeFile up -d backend frontend nginx
        
        Write-Success "Todos os serviços iniciados"
        Write-Log "All services started successfully"
        
    }
    catch {
        Write-Error "Falha ao iniciar serviços: $($_.Exception.Message)"
        Write-Log "Service startup failed: $($_.Exception.Message)" "ERROR"
        exit 1
    }
}

function Test-ServiceHealth {
    Write-Step "Verificando saúde dos serviços..."
    
    $services = @(
        @{ Name = "PostgreSQL"; URL = ""; Command = "docker-compose exec postgres pg_isready -U postgres" },
        @{ Name = "Redis"; URL = ""; Command = "docker-compose exec redis redis-cli ping" },
        @{ Name = "Backend"; URL = "http://localhost:3001/health" },
        @{ Name = "Frontend"; URL = "http://localhost:3000" },
        @{ Name = "Nginx"; URL = "http://localhost:80" }
    )
    
    $allHealthy = $true
    
    foreach ($service in $services) {
        Write-Info "Testando $($service.Name)..."
        
        try {
            if ($service.URL) {
                # HTTP health check
                $response = Invoke-WebRequest -Uri $service.URL -TimeoutSec 10 -UseBasicParsing
                if ($response.StatusCode -eq 200) {
                    Write-Success "$($service.Name) saudável"
                    Write-Log "$($service.Name) health check passed"
                } else {
                    throw "HTTP $($response.StatusCode)"
                }
            } elseif ($service.Command) {
                # Command health check
                $result = Invoke-Expression $service.Command 2>&1
                if ($LASTEXITCODE -eq 0) {
                    Write-Success "$($service.Name) saudável"
                    Write-Log "$($service.Name) health check passed"
                } else {
                    throw "Command failed: $result"
                }
            }
        }
        catch {
            Write-Error "$($service.Name) não saudável: $($_.Exception.Message)"
            Write-Log "$($service.Name) health check failed: $($_.Exception.Message)" "ERROR"
            $allHealthy = $false
        }
        
        Start-Sleep -Seconds 2
    }
    
    return $allHealthy
}

# === MONITORING === #
function Show-ServiceStatus {
    Write-Step "Status dos serviços:"
    
    try {
        docker-compose -f $ComposeFile ps --format table
        Write-Log "Service status displayed"
    }
    catch {
        Write-Error "Erro ao obter status dos serviços: $($_.Exception.Message)"
        Write-Log "Failed to get service status: $($_.Exception.Message)" "ERROR"
    }
}

function Show-ServiceLogs {
    param([string]$ServiceName = "all", [int]$Lines = 50)
    
    Write-Step "Logs dos serviços (últimas $Lines linhas):"
    
    try {
        if ($ServiceName -eq "all") {
            docker-compose -f $ComposeFile logs --tail=$Lines
        } else {
            docker-compose -f $ComposeFile logs --tail=$Lines $ServiceName
        }
        Write-Log "Service logs displayed for $ServiceName"
    }
    catch {
        Write-Error "Erro ao obter logs: $($_.Exception.Message)"
        Write-Log "Failed to get logs: $($_.Exception.Message)" "ERROR"
    }
}

# === MAIN EXECUTION === #
function Main {
    Clear-Host
    
    Write-Banner "🚀 $ProjectName - Enterprise Deployment 🚀"
    
    Write-Info "Ambiente: $Environment"
    Write-Info "Build: $($Build -eq $true)"
    Write-Info "Serviço: $Service"
    Write-Info "Arquivo de configuração: $EnvFile"
    Write-Log "Deployment started - Environment: $Environment, Build: $Build, Service: $Service"
    
    # Pré-requisitos
    Test-Prerequisites
    Test-DiskSpace
    Test-NetworkPorts
    
    # Cleanup
    Stop-ExistingContainers
    Remove-UnusedResources
    
    # Build
    Build-Images
    
    # Deploy
    Start-Services
    
    # Aguardar inicialização
    Write-Step "Aguardando inicialização completa..."
    Start-Sleep -Seconds 30
    
    # Health checks
    $isHealthy = Test-ServiceHealth
    
    if ($isHealthy) {
        Write-Banner "✅ DEPLOYMENT CONCLUÍDO COM SUCESSO! ✅"
        
        Write-Host "`n🌐 URLs de Acesso:" -ForegroundColor Green
        Write-Host "   • Frontend: http://localhost:3000" -ForegroundColor White
        Write-Host "   • Backend API: http://localhost:3001" -ForegroundColor White
        Write-Host "   • Nginx Proxy: http://localhost:80" -ForegroundColor White
        Write-Host "   • Health Check: http://localhost:3001/health" -ForegroundColor White
        
        Write-Host "`n📊 Comandos úteis:" -ForegroundColor Yellow
        Write-Host "   • Status: docker-compose ps" -ForegroundColor White
        Write-Host "   • Logs: docker-compose logs -f" -ForegroundColor White
        Write-Host "   • Parar: docker-compose down" -ForegroundColor White
        
        Write-Log "Deployment completed successfully"
        
    } else {
        Write-Banner "❌ DEPLOYMENT COM PROBLEMAS"
        Write-Warning "Alguns serviços podem não estar funcionando corretamente."
        Write-Info "Execute '$($MyInvocation.MyCommand.Name) -HealthCheck' para verificar novamente."
        Write-Log "Deployment completed with issues" "WARN"
    }
    
    # Show final status
    Show-ServiceStatus
    
    if ($Verbose) {
        Write-Host "`n📋 Logs recentes:"
        Show-ServiceLogs -Lines 20
    }
    
    Write-Host "`n🎉 Will Finance 5.0 Pro está rodando!" -ForegroundColor Green
    Write-Log "Deployment script finished"
}

# === HEALTH CHECK ONLY === #
if ($HealthCheck) {
    Write-Banner "🏥 VERIFICAÇÃO DE SAÚDE DOS SERVIÇOS"
    $isHealthy = Test-ServiceHealth
    Show-ServiceStatus
    
    if ($isHealthy) {
        Write-Success "Todos os serviços estão saudáveis!"
    } else {
        Write-Warning "Alguns serviços apresentam problemas."
    }
    
    exit 0
}

# Execute main function
Main
