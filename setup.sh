#!/bin/bash

# 🚀 Will Finance 5.0 - Native Development Environment Setup
# Configuração completa sem Docker para máxima performance

set -e

echo "🚀 Iniciando setup do Will Finance 5.0..."

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Função para logs coloridos
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

# Verificar dependências
check_dependencies() {
    log_info "Verificando dependências..."
    
    if ! command -v node &> /dev/null; then
        log_error "Node.js não encontrado. Instale a versão 18+: https://nodejs.org/"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        log_error "npm não encontrado. Reinstale o Node.js com npm incluído."
        exit 1
    fi
    
    if ! command -v python3 &> /dev/null; then
        log_warning "Python3 não encontrado. O serviço de IA será desabilitado."
        SKIP_AI=true
    fi
    
    # Verificar versões
    NODE_VERSION=$(node --version | sed 's/v//')
    if [[ $(echo "$NODE_VERSION 18.0.0" | tr " " "\n" | sort -V | head -n1) != "18.0.0" ]]; then
        log_error "Node.js versão 18+ requerida. Versão atual: $NODE_VERSION"
        exit 1
    fi
    
    log_success "Dependências verificadas"
}

# Configurar ambiente
setup_environment() {
    log_info "Configurando arquivo de ambiente..."
    
    if [ ! -f ".env" ]; then
        cp .env.example .env
        log_success "Arquivo .env criado com configurações padrão"
    else
        log_warning "Arquivo .env já existe. Mantendo configurações atuais."
    fi
}

# Instalar dependências
install_dependencies() {
    log_info "Instalando dependências do projeto..."
    
    # Root dependencies
    npm install
    log_success "Dependências root instaladas"
    
    # Frontend dependencies
    cd client
    npm install
    cd ..
    log_success "Dependências do frontend instaladas"
    
    # Backend dependencies
    cd server
    npm install
    cd ..
    log_success "Dependências do backend instaladas"
    
    # Python dependencies (opcional)
    if [ "$SKIP_AI" != true ]; then
        log_info "Instalando dependências Python para IA..."
        cd IA
        if command -v pip3 &> /dev/null; then
            pip3 install -r requirements.txt
        elif command -v pip &> /dev/null; then
            pip install -r requirements.txt
        else
            log_warning "pip não encontrado. Pule a configuração de IA ou instale Python com pip."
        fi
        cd ..
        log_success "Dependências Python instaladas"
    fi
}

# Configurar banco de dados
setup_database() {
    log_info "Configurando banco de dados SQLite..."
    
    cd server
    
    # Gerar Prisma Client
    npx prisma generate
    log_success "Prisma Client gerado"
    
    # Executar migrações
    npx prisma db push
    log_success "Migrações aplicadas"
    
    # Popular com dados demo
    if [ -f "prisma/seed.ts" ]; then
        npm run seed
        log_success "Dados demo criados"
    fi
    
    cd ..
}

# Verificar se tudo está funcionando
health_check() {
    log_info "Executando verificação de saúde..."
    
    # Verificar se as dependências foram instaladas corretamente
    if [ ! -d "node_modules" ] || [ ! -d "client/node_modules" ] || [ ! -d "server/node_modules" ]; then
        log_error "Algumas dependências não foram instaladas corretamente"
        return 1
    fi
    
    # Verificar se o banco foi configurado
    if [ ! -f "server/prisma/dev.db" ]; then
        log_warning "Banco de dados não encontrado. Execute: npm run db:setup"
    fi
    
    log_success "Sistema configurado e pronto para uso!"
}

# Exibir instruções finais
show_instructions() {
    echo ""
    echo "🎉 Setup concluído com sucesso!"
    echo ""
    echo "📋 Próximos passos:"
    echo "   1. npm run start:all       # Iniciar todos os serviços"
    echo "   2. http://localhost:5173   # Acessar aplicação"
    echo "   3. http://localhost:8080/api/docs  # Documentação da API"
    echo ""
    echo "👤 Credenciais de teste:"
    echo "   Email: demo@willfinance.com"
    echo "   Senha: demo123"
    echo ""
    echo "🔧 Comandos úteis:"
    echo "   npm run dev:client         # Apenas frontend"
    echo "   npm run dev:server         # Apenas backend"
    echo "   npm run dev:ai             # Apenas serviço IA"
    echo "   npm run health             # Verificar saúde do sistema"
    echo "   npm run test               # Executar testes"
    echo ""
    echo "📚 Documentação completa: ./GUIA_DEFINITIVO.md"
    echo ""
}

# Executar setup
main() {
    check_dependencies
    setup_environment
    install_dependencies
    setup_database
    health_check
    show_instructions
}

# Executar apenas se o script for chamado diretamente
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
