#!/bin/bash

# 🧹 Will Finance 5.0 - Sistema de Limpeza Otimizado
# Remove cache, logs, builds e reseta o projeto para economia de espaço

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

# Parar todos os processos relacionados
stop_all_processes() {
    log_info "Parando todos os processos do Will Finance..."
    
    # Matar processos nas portas conhecidas
    local ports=(5173 8080 8001 5555)
    
    for port in "${ports[@]}"; do
        if lsof -ti:$port >/dev/null 2>&1; then
            log_warning "Matando processo na porta $port"
            lsof -ti:$port | xargs kill -9 2>/dev/null || true
        fi
    done
    
    # Matar processos por nome
    pkill -f "vite" 2>/dev/null || true
    pkill -f "nest" 2>/dev/null || true
    pkill -f "uvicorn" 2>/dev/null || true
    pkill -f "prisma" 2>/dev/null || true
    
    log_success "Processos finalizados"
}

# Calcular tamanho antes da limpeza
calculate_size_before() {
    echo ""
    log_info "Calculando uso de espaço antes da limpeza..."
    
    if command -v du &> /dev/null; then
        TOTAL_SIZE_BEFORE=$(du -sh . 2>/dev/null | cut -f1)
        echo "   📁 Tamanho total do projeto: $TOTAL_SIZE_BEFORE"
        
        # Detalhes por categoria
        if [ -d "node_modules" ]; then
            NODE_MODULES_SIZE=$(du -sh node_modules 2>/dev/null | cut -f1)
            echo "   📦 node_modules (root): $NODE_MODULES_SIZE"
        fi
        
        if [ -d "client/node_modules" ]; then
            CLIENT_MODULES_SIZE=$(du -sh client/node_modules 2>/dev/null | cut -f1)
            echo "   📦 client/node_modules: $CLIENT_MODULES_SIZE"
        fi
        
        if [ -d "server/node_modules" ]; then
            SERVER_MODULES_SIZE=$(du -sh server/node_modules 2>/dev/null | cut -f1)
            echo "   📦 server/node_modules: $SERVER_MODULES_SIZE"
        fi
        
        if [ -d "client/dist" ]; then
            CLIENT_DIST_SIZE=$(du -sh client/dist 2>/dev/null | cut -f1)
            echo "   🏗️  client/dist: $CLIENT_DIST_SIZE"
        fi
        
        if [ -d "server/dist" ]; then
            SERVER_DIST_SIZE=$(du -sh server/dist 2>/dev/null | cut -f1)
            echo "   🏗️  server/dist: $SERVER_DIST_SIZE"
        fi
        
        if [ -d "logs" ]; then
            LOGS_SIZE=$(du -sh logs 2>/dev/null | cut -f1)
            echo "   📋 logs: $LOGS_SIZE"
        fi
        
        if [ -d ".git" ]; then
            GIT_SIZE=$(du -sh .git 2>/dev/null | cut -f1)
            echo "   🔄 .git: $GIT_SIZE"
        fi
    fi
}

# Limpeza básica (rápida)
clean_basic() {
    log_info "Executando limpeza básica..."
    
    # Remover builds
    rm -rf client/dist server/dist
    log_success "Builds removidos"
    
    # Limpar logs
    rm -rf logs
    mkdir -p logs
    log_success "Logs limpos"
    
    # Limpar cache npm
    npm cache clean --force 2>/dev/null || true
    log_success "Cache npm limpo"
    
    # Limpar cache do sistema
    rm -rf ~/.npm 2>/dev/null || true
    rm -rf /tmp/npm-* 2>/dev/null || true
    
    log_success "Limpeza básica concluída"
}

# Limpeza profunda (remove dependências)
clean_deep() {
    log_warning "Executando limpeza profunda (remove todas as dependências)..."
    
    # Parar processos primeiro
    stop_all_processes
    
    # Remover node_modules
    rm -rf node_modules
    rm -rf client/node_modules  
    rm -rf server/node_modules
    log_success "node_modules removidos"
    
    # Remover builds
    rm -rf client/dist
    rm -rf server/dist
    log_success "Builds removidos"
    
    # Remover logs
    rm -rf logs
    mkdir -p logs
    log_success "Logs removidos"
    
    # Limpar todos os caches
    npm cache clean --force 2>/dev/null || true
    rm -rf ~/.npm 2>/dev/null || true
    rm -rf /tmp/npm-* 2>/dev/null || true
    
    # Limpar cache do Prisma
    rm -rf server/node_modules/.prisma 2>/dev/null || true
    
    # Limpar cache Python (se existir)
    find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
    find . -name "*.pyc" -delete 2>/dev/null || true
    
    log_success "Limpeza profunda concluída"
}

# Limpeza extrema (reset completo)
clean_extreme() {
    log_error "⚠️  LIMPEZA EXTREMA - Remove TUDO exceto código fonte!"
    read -p "Tem certeza? Esta ação é irreversível! (s/N): " -n 1 -r
    echo ""
    
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        log_info "Operação cancelada"
        return 0
    fi
    
    log_warning "Executando limpeza extrema..."
    
    # Parar todos os processos
    stop_all_processes
    
    # Remover TODAS as dependências e caches
    clean_deep
    
    # Remover banco de dados
    rm -f server/prisma/dev.db
    rm -f server/prisma/dev.db-journal
    rm -f server/prisma/backup-*.db
    log_warning "Banco de dados removido"
    
    # Remover arquivos de configuração gerados
    rm -f .env
    log_warning "Arquivo .env removido"
    
    # Remover dados de teste
    rm -rf data/*.csv 2>/dev/null || true
    log_warning "Dados de teste removidos"
    
    # Limpar cache Git (não remove histórico)
    git gc --aggressive --prune=now 2>/dev/null || true
    
    log_error "Limpeza extrema concluída - Projeto resetado ao estado inicial"
    log_info "Execute ./setup.sh para reconfigurar tudo"
}

# Calcular economia de espaço
calculate_savings() {
    echo ""
    log_info "Calculando economia de espaço..."
    
    if command -v du &> /dev/null; then
        TOTAL_SIZE_AFTER=$(du -sh . 2>/dev/null | cut -f1)
        echo "   📁 Tamanho após limpeza: $TOTAL_SIZE_AFTER"
        echo "   📁 Tamanho antes da limpeza: $TOTAL_SIZE_BEFORE"
        echo ""
        log_success "Limpeza concluída com sucesso!"
    fi
    
    echo ""
    echo "🔧 Para reconfigurar o projeto:"
    echo "   ./setup.sh"
    echo ""
    echo "🚀 Para iniciar desenvolvimento:"
    echo "   ./start.sh"
    echo ""
}

# Menu interativo
show_menu() {
    echo "🧹 Will Finance 5.0 - Sistema de Limpeza"
    echo ""
    echo "Escolha o tipo de limpeza:"
    echo ""
    echo "1) 🧽 Básica    - Remove builds, logs e cache (rápido)"
    echo "2) 🧹 Profunda  - Remove dependências + básica (economia máxima)"
    echo "3) 💥 Extrema   - Reset completo (remove TUDO exceto código)"
    echo "4) 📊 Análise   - Apenas mostrar uso de espaço"
    echo "5) ❌ Cancelar"
    echo ""
    read -p "Opção (1-5): " choice
    
    case $choice in
        1)
            calculate_size_before
            clean_basic
            calculate_savings
            ;;
        2)
            calculate_size_before
            clean_deep
            calculate_savings
            ;;
        3)
            calculate_size_before
            clean_extreme
            calculate_savings
            ;;
        4)
            calculate_size_before
            echo ""
            log_info "Análise concluída. Nenhuma limpeza executada."
            ;;
        5)
            log_info "Operação cancelada"
            ;;
        *)
            log_error "Opção inválida"
            exit 1
            ;;
    esac
}

# Limpeza automática por parâmetro
auto_clean() {
    local mode=$1
    
    case $mode in
        "basic")
            calculate_size_before
            clean_basic
            calculate_savings
            ;;
        "deep")
            calculate_size_before
            clean_deep
            calculate_savings
            ;;
        "extreme")
            calculate_size_before
            clean_extreme
            calculate_savings
            ;;
        *)
            log_error "Modo inválido. Use: basic, deep, ou extreme"
            exit 1
            ;;
    esac
}

# Função principal
main() {
    if [ $# -eq 0 ]; then
        show_menu
    else
        auto_clean "$1"
    fi
}

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
