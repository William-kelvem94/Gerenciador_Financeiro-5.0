#!/bin/bash

# 🚀 Will Finance 5.0 - Iniciar todos os serviços nativamente
# Start script otimizado para desenvolvimento sem Docker

set -e

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
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

log_service() {
    echo -e "${CYAN}🔧 $1${NC}"
}

# Array para armazenar PIDs dos processos
PIDS=()

# Função para cleanup quando script é interrompido
cleanup() {
    echo ""
    log_warning "Parando todos os serviços..."
    
    for pid in "${PIDS[@]}"; do
        if kill -0 "$pid" 2>/dev/null; then
            kill "$pid" 2>/dev/null
            log_info "Processo $pid finalizado"
        fi
    done
    
    # Matar processos nas portas específicas se ainda estiverem rodando
    lsof -ti:5173 | xargs kill -9 2>/dev/null || true
    lsof -ti:8080 | xargs kill -9 2>/dev/null || true  
    lsof -ti:8001 | xargs kill -9 2>/dev/null || true
    lsof -ti:5555 | xargs kill -9 2>/dev/null || true
    
    log_success "Todos os serviços foram finalizados"
    exit 0
}

# Configurar trap para cleanup
trap cleanup SIGINT SIGTERM

# Verificar se as portas estão livres
check_ports() {
    local ports=(5173 8080 8001 5555)
    
    for port in "${ports[@]}"; do
        if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
            log_warning "Porta $port está em uso. Liberando..."
            lsof -ti:$port | xargs kill -9 2>/dev/null || true
            sleep 1
        fi
    done
    
    log_success "Portas verificadas e liberadas"
}

# Verificar dependências
check_dependencies() {
    if [ ! -d "node_modules" ]; then
        log_error "Dependências não instaladas. Execute: ./setup.sh"
        exit 1
    fi
    
    if [ ! -f "server/prisma/dev.db" ]; then
        log_warning "Banco de dados não encontrado. Configurando..."
        cd server
        npx prisma db push
        npm run seed 2>/dev/null || true
        cd ..
        log_success "Banco de dados configurado"
    fi
}

# Iniciar serviço do backend
start_backend() {
    log_service "Iniciando Backend API (porta 8080)..."
    
    cd server
    npm run start:dev > ../logs/backend.log 2>&1 &
    local backend_pid=$!
    PIDS+=($backend_pid)
    cd ..
    
    # Aguardar o backend inicializar
    log_info "Aguardando backend inicializar..."
    for i in {1..30}; do
        if curl -s http://localhost:8080/health >/dev/null 2>&1; then
            log_success "Backend online em http://localhost:8080"
            return 0
        fi
        sleep 1
    done
    
    log_error "Backend falhou ao inicializar"
    return 1
}

# Iniciar serviço de IA
start_ai_service() {
    if ! command -v python3 &> /dev/null; then
        log_warning "Python3 não encontrado. Serviço de IA desabilitado."
        return 0
    fi
    
    if [ ! -f "IA/requirements.txt" ]; then
        log_warning "Serviço de IA não configurado. Pulando..."
        return 0
    fi
    
    log_service "Iniciando Serviço de IA (porta 8001)..."
    
    cd IA
    python3 -m uvicorn api.main:app --host 0.0.0.0 --port 8001 --reload > ../logs/ai.log 2>&1 &
    local ai_pid=$!
    PIDS+=($ai_pid)
    cd ..
    
    # Aguardar o serviço de IA inicializar
    log_info "Aguardando serviço de IA inicializar..."
    for i in {1..20}; do
        if curl -s http://localhost:8001/health >/dev/null 2>&1; then
            log_success "Serviço de IA online em http://localhost:8001"
            return 0
        fi
        sleep 1
    done
    
    log_warning "Serviço de IA pode não estar totalmente funcional"
    return 0
}

# Iniciar frontend
start_frontend() {
    log_service "Iniciando Frontend (porta 5173)..."
    
    cd client
    npm run dev > ../logs/frontend.log 2>&1 &
    local frontend_pid=$!
    PIDS+=($frontend_pid)
    cd ..
    
    # Aguardar o frontend inicializar
    log_info "Aguardando frontend inicializar..."
    for i in {1..20}; do
        if curl -s http://localhost:5173 >/dev/null 2>&1; then
            log_success "Frontend online em http://localhost:5173"
            return 0
        fi
        sleep 1
    done
    
    log_error "Frontend falhou ao inicializar"
    return 1
}

# Iniciar Prisma Studio (opcional)
start_prisma_studio() {
    log_service "Iniciando Prisma Studio (porta 5555)..."
    
    cd server
    npx prisma studio > ../logs/prisma.log 2>&1 &
    local prisma_pid=$!
    PIDS+=($prisma_pid)
    cd ..
    
    log_success "Prisma Studio disponível em http://localhost:5555"
}

# Mostrar status dos serviços
show_status() {
    echo ""
    echo "🎉 Will Finance 5.0 está rodando!"
    echo ""
    echo "📋 URLs dos Serviços:"
    echo -e "   ${CYAN}🌐 Frontend:${NC}      http://localhost:5173"
    echo -e "   ${CYAN}🛡️  Backend API:${NC}   http://localhost:8080"
    echo -e "   ${CYAN}📚 API Docs:${NC}      http://localhost:8080/api/docs"
    echo -e "   ${CYAN}🗃️  Prisma Studio:${NC} http://localhost:5555"
    echo -e "   ${CYAN}🤖 Serviço IA:${NC}    http://localhost:8001"
    echo ""
    echo "👤 Credenciais de teste:"
    echo "   Email: demo@willfinance.com"
    echo "   Senha: demo123"
    echo ""
    echo "📊 Logs em tempo real:"
    echo "   tail -f logs/frontend.log"
    echo "   tail -f logs/backend.log"
    echo "   tail -f logs/ai.log"
    echo ""
    echo "⚠️  Pressione Ctrl+C para parar todos os serviços"
    echo ""
}

# Monitorar serviços
monitor_services() {
    while true; do
        sleep 5
        
        # Verificar se algum serviço caiu
        for i in "${!PIDS[@]}"; do
            if ! kill -0 "${PIDS[$i]}" 2>/dev/null; then
                log_warning "Serviço com PID ${PIDS[$i]} parou de funcionar"
                unset 'PIDS[$i]'
            fi
        done
        
        # Se todos os serviços pararam, sair
        if [ ${#PIDS[@]} -eq 0 ]; then
            log_error "Todos os serviços pararam. Finalizando..."
            break
        fi
    done
}

# Função principal
main() {
    echo "🚀 Iniciando Will Finance 5.0 - Modo Nativo"
    echo ""
    
    # Criar diretório de logs
    mkdir -p logs
    
    # Verificações iniciais
    check_ports
    check_dependencies
    
    # Iniciar serviços em ordem
    if start_backend; then
        start_ai_service
        
        if start_frontend; then
            start_prisma_studio
            show_status
            monitor_services
        else
            cleanup
            exit 1
        fi
    else
        cleanup
        exit 1
    fi
}

# Executar apenas se o script for chamado diretamente
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
