#!/bin/bash

# 🧪 Will Finance 5.0 - Health Check Completo
# Verificação de saúde de todos os serviços

set -e

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificar serviços
check_service() {
    local service_name=$1
    local url=$2
    local port=$3
    
    log_info "Verificando $service_name..."
    
    # Verificar se a porta está sendo usada
    if ! lsof -Pi :$port -sTCP:LISTEN >/dev/null 2>&1; then
        log_error "$service_name não está rodando (porta $port)"
        return 1
    fi
    
    # Verificar se o serviço responde
    if curl -sf "$url" >/dev/null 2>&1; then
        log_success "$service_name OK ($url)"
        return 0
    else
        log_error "$service_name não responde em $url"
        return 1
    fi
}

# Verificar arquivos essenciais
check_files() {
    log_info "Verificando arquivos essenciais..."
    
    local files=(
        ".env"
        "server/prisma/dev.db"
        "node_modules"
        "client/node_modules" 
        "server/node_modules"
    )
    
    local missing_files=()
    
    for file in "${files[@]}"; do
        if [ ! -e "$file" ]; then
            missing_files+=("$file")
        fi
    done
    
    if [ ${#missing_files[@]} -eq 0 ]; then
        log_success "Todos os arquivos essenciais estão presentes"
        return 0
    else
        log_error "Arquivos ausentes: ${missing_files[*]}"
        log_info "Execute: ./setup.sh para corrigir"
        return 1
    fi
}

# Verificar dependências do sistema
check_system_deps() {
    log_info "Verificando dependências do sistema..."
    
    local deps_ok=true
    
    if ! command -v node &> /dev/null; then
        log_error "Node.js não encontrado"
        deps_ok=false
    else
        local node_version=$(node --version | sed 's/v//')
        log_success "Node.js $node_version"
    fi
    
    if ! command -v npm &> /dev/null; then
        log_error "npm não encontrado"
        deps_ok=false
    else
        local npm_version=$(npm --version)
        log_success "npm $npm_version"
    fi
    
    if ! command -v python3 &> /dev/null; then
        log_warning "Python3 não encontrado (serviço de IA desabilitado)"
    else
        local python_version=$(python3 --version | cut -d' ' -f2)
        log_success "Python3 $python_version"
    fi
    
    if [ "$deps_ok" = false ]; then
        return 1
    fi
    
    return 0
}

# Relatório completo
generate_report() {
    echo ""
    echo "📊 RELATÓRIO DE SAÚDE - $(date)"
    echo "=========================================="
    
    # Verificar dependências
    echo ""
    echo "🔧 DEPENDÊNCIAS DO SISTEMA:"
    check_system_deps
    
    # Verificar arquivos
    echo ""
    echo "📁 ARQUIVOS ESSENCIAIS:"
    check_files
    
    # Verificar serviços
    echo ""
    echo "🌐 SERVIÇOS:"
    
    local services_status=0
    
    if check_service "Frontend" "http://localhost:5173" "5173"; then
        echo "   Frontend: ✅ http://localhost:5173"
    else
        echo "   Frontend: ❌ Não disponível"
        services_status=1
    fi
    
    if check_service "Backend API" "http://localhost:8080/health" "8080"; then
        echo "   Backend:  ✅ http://localhost:8080"
        echo "   API Docs: ✅ http://localhost:8080/api/docs"
    else
        echo "   Backend:  ❌ Não disponível"
        services_status=1
    fi
    
    if check_service "Serviço IA" "http://localhost:8001/health" "8001"; then
        echo "   IA:       ✅ http://localhost:8001"
    else
        echo "   IA:       ❌ Não disponível"
        # IA é opcional, não conta como falha crítica
    fi
    
    if lsof -Pi :5555 -sTCP:LISTEN >/dev/null 2>&1; then
        echo "   Prisma:   ✅ http://localhost:5555"
    else
        echo "   Prisma:   ❌ Studio não rodando"
    fi
    
    # Verificar logs
    echo ""
    echo "📋 LOGS:"
    if [ -d "logs" ]; then
        for log_file in logs/*.log; do
            if [ -f "$log_file" ]; then
                local size=$(du -h "$log_file" | cut -f1)
                echo "   $(basename "$log_file"): $size"
            fi
        done
    else
        echo "   Diretório de logs não encontrado"
    fi
    
    # Verificar uso de recursos
    echo ""
    echo "💾 RECURSOS DO SISTEMA:"
    echo "   CPU: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | awk -F'%' '{print $1}')% em uso"
    echo "   RAM: $(free -h | awk '/^Mem:/ {print $3 "/" $2}')"
    echo "   Disco: $(df -h . | awk 'NR==2 {print $3 "/" $2 " (" $5 " usado)"}')"
    
    echo ""
    echo "=========================================="
    
    if [ $services_status -eq 0 ]; then
        echo "🎉 SISTEMA SAUDÁVEL - Todos os serviços principais estão funcionando!"
        echo ""
        echo "📋 Acesse:"
        echo "   🌐 Aplicação: http://localhost:5173"
        echo "   📚 API Docs: http://localhost:8080/api/docs"
        echo "   🗃️  Database: http://localhost:5555"
        echo ""
        return 0
    else
        echo "⚠️  PROBLEMAS DETECTADOS - Alguns serviços não estão funcionando"
        echo ""
        echo "🔧 Para corrigir:"
        echo "   ./setup.sh    # Configurar dependências"
        echo "   ./start.sh    # Iniciar todos os serviços"
        echo ""
        return 1
    fi
}

# Executar verificação
main() {
    echo "🏥 Will Finance 5.0 - Health Check"
    generate_report
}

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
