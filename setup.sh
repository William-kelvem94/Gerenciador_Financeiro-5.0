#!/bin/bash

# Script de setup completo para o Gerenciador Financeiro 5.0
# Autor: William
# Versão: 5.0.0

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funções utilitárias
print_header() {
    echo -e "${BLUE}"
    echo "████████████████████████████████████████████████████████████"
    echo "█                                                          █"
    echo "█         GERENCIADOR FINANCEIRO 5.0 - SETUP              █"
    echo "█                                                          █"
    echo "████████████████████████████████████████████████████████████"
    echo -e "${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Verificar se Node.js está instalado
check_nodejs() {
    print_info "Verificando Node.js..."
    if command -v node >/dev/null 2>&1; then
        NODE_VERSION=$(node -v)
        print_success "Node.js $NODE_VERSION encontrado"
        
        # Verificar versão mínima (18.0.0)
        if [[ "${NODE_VERSION:1:2}" -lt 18 ]]; then
            print_error "Node.js versão 18+ é necessário. Versão atual: $NODE_VERSION"
            exit 1
        fi
    else
        print_error "Node.js não encontrado. Por favor, instale Node.js 18+ antes de continuar."
        exit 1
    fi
}

# Verificar se npm está instalado
check_npm() {
    print_info "Verificando npm..."
    if command -v npm >/dev/null 2>&1; then
        NPM_VERSION=$(npm -v)
        print_success "npm $NPM_VERSION encontrado"
    else
        print_error "npm não encontrado. Por favor, instale npm antes de continuar."
        exit 1
    fi
}

# Verificar se Docker está instalado
check_docker() {
    print_info "Verificando Docker..."
    if command -v docker >/dev/null 2>&1; then
        DOCKER_VERSION=$(docker --version)
        print_success "$DOCKER_VERSION encontrado"
        
        # Verificar se Docker está rodando
        if docker info >/dev/null 2>&1; then
            print_success "Docker está rodando"
        else
            print_warning "Docker está instalado mas não está rodando"
            print_info "Por favor, inicie o Docker para usar os recursos de containerização"
        fi
    else
        print_warning "Docker não encontrado. Recursos de containerização não estarão disponíveis."
    fi
}

# Verificar se Docker Compose está instalado
check_docker_compose() {
    print_info "Verificando Docker Compose..."
    if command -v docker-compose >/dev/null 2>&1; then
        COMPOSE_VERSION=$(docker-compose --version)
        print_success "$COMPOSE_VERSION encontrado"
    else
        print_warning "Docker Compose não encontrado. Recursos de containerização não estarão disponíveis."
    fi
}

# Criar arquivos de ambiente se não existirem
setup_environment_files() {
    print_info "Configurando arquivos de ambiente..."
    
    # .env principal
    if [ ! -f ".env" ]; then
        print_info "Criando arquivo .env principal..."
        cp .env.example .env 2>/dev/null || {
            cat > .env << EOF
# Gerenciador Financeiro 5.0 - Environment Variables
NODE_ENV=development

# Database
DATABASE_URL=postgresql://will_finance:cyberpunk2077@localhost:5432/will_finance_db

# JWT Secrets
JWT_SECRET=your-super-secret-jwt-key-change-in-production-2024-cyberpunk
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production-2024

# URLs
CLIENT_URL=http://localhost:5173
API_URL=http://localhost:8080

# Firebase (configure com suas credenciais)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email

# Google OAuth (configure com suas credenciais)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
EOF
        }
        print_success "Arquivo .env criado"
    else
        print_success "Arquivo .env já existe"
    fi
    
    # .env para o client
    if [ ! -f "client/.env.local" ]; then
        print_info "Criando arquivo .env.local para o client..."
        cat > client/.env.local << EOF
# Client Environment Variables
VITE_API_URL=http://localhost:8080
VITE_WS_URL=ws://localhost:8080

# Firebase Client Config
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id

# Google OAuth
VITE_GOOGLE_CLIENT_ID=your-google-client-id
EOF
        print_success "Arquivo .env.local criado para o client"
    else
        print_success "Arquivo .env.local do client já existe"
    fi
}

# Instalar dependências
install_dependencies() {
    print_info "Instalando dependências..."
    
    # Instalar dependências do projeto principal
    print_info "Instalando dependências principais..."
    npm install || {
        print_error "Falha ao instalar dependências principais"
        exit 1
    }
    
    # Instalar dependências do backend
    print_info "Instalando dependências do backend..."
    cd server && npm install || {
        print_error "Falha ao instalar dependências do backend"
        exit 1
    }
    cd ..
    
    # Instalar dependências do frontend
    print_info "Instalando dependências do frontend..."
    cd client && npm install || {
        print_error "Falha ao instalar dependências do frontend"
        exit 1
    }
    cd ..
    
    print_success "Todas as dependências foram instaladas"
}

# Configurar banco de dados
setup_database() {
    print_info "Configurando banco de dados..."
    
    cd server
    
    # Gerar Prisma Client
    print_info "Gerando Prisma Client..."
    npx prisma generate || {
        print_error "Falha ao gerar Prisma Client"
        cd ..
        exit 1
    }
    
    # Executar migrações
    print_info "Executando migrações do banco de dados..."
    npx prisma migrate dev || {
        print_warning "Falha ao executar migrações. Banco de dados pode não estar disponível."
    }
    
    # Executar seed (opcional)
    print_info "Executando seed do banco de dados..."
    npm run db:seed || {
        print_warning "Falha ao executar seed. Continuando sem dados de exemplo."
    }
    
    cd ..
    print_success "Configuração do banco de dados concluída"
}

# Verificar saúde do sistema
health_check() {
    print_info "Executando verificação de saúde do sistema..."
    
    # Verificar se as portas estão disponíveis
    check_port() {
        local port=$1
        local service=$2
        
        if lsof -i:$port >/dev/null 2>&1; then
            print_warning "Porta $port ($service) já está em uso"
        else
            print_success "Porta $port ($service) está disponível"
        fi
    }
    
    check_port 5173 "Frontend (Vite)"
    check_port 8080 "Backend (API)"
    check_port 5432 "PostgreSQL"
    check_port 6379 "Redis"
}

# Criar diretórios necessários
create_directories() {
    print_info "Criando diretórios necessários..."
    
    directories=(
        "server/logs"
        "server/uploads"
        "client/logs"
        "database/backup"
        "scripts/backup"
        "docs"
    )
    
    for dir in "${directories[@]}"; do
        mkdir -p "$dir"
        print_success "Diretório $dir criado"
    done
}

# Configurar Git hooks (opcional)
setup_git_hooks() {
    if [ -d ".git" ]; then
        print_info "Configurando Git hooks..."
        
        # Pre-commit hook para linting
        cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
echo "Executando lint antes do commit..."
npm run lint
if [ $? -ne 0 ]; then
  echo "Lint falhou. Commit cancelado."
  exit 1
fi
EOF
        chmod +x .git/hooks/pre-commit
        print_success "Git hooks configurados"
    fi
}

# Menu de opções de setup
show_menu() {
    echo
    print_info "Escolha o tipo de setup:"
    echo "1) Setup Completo (Recomendado)"
    echo "2) Setup Básico (apenas dependências)"
    echo "3) Setup com Docker"
    echo "4) Setup de Desenvolvimento"
    echo "5) Verificação de Saúde apenas"
    echo "6) Sair"
    echo
}

# Setup completo
full_setup() {
    print_header
    
    print_info "Iniciando setup completo..."
    
    check_nodejs
    check_npm
    check_docker
    check_docker_compose
    
    create_directories
    setup_environment_files
    install_dependencies
    setup_database
    setup_git_hooks
    health_check
    
    print_success "Setup completo concluído!"
    print_info "Para iniciar o projeto, execute: npm run dev"
}

# Setup básico
basic_setup() {
    print_header
    
    print_info "Iniciando setup básico..."
    
    check_nodejs
    check_npm
    
    create_directories
    setup_environment_files
    install_dependencies
    
    print_success "Setup básico concluído!"
    print_warning "Lembre-se de configurar o banco de dados antes de iniciar"
}

# Setup com Docker
docker_setup() {
    print_header
    
    print_info "Iniciando setup com Docker..."
    
    check_docker
    check_docker_compose
    
    if ! command -v docker >/dev/null 2>&1 || ! command -v docker-compose >/dev/null 2>&1; then
        print_error "Docker e Docker Compose são necessários para este setup"
        exit 1
    fi
    
    setup_environment_files
    
    print_info "Construindo containers..."
    docker-compose build || {
        print_error "Falha ao construir containers"
        exit 1
    }
    
    print_info "Iniciando serviços..."
    docker-compose up -d || {
        print_error "Falha ao iniciar serviços"
        exit 1
    }
    
    print_success "Setup com Docker concluído!"
    print_info "Para verificar os serviços: docker-compose ps"
}

# Setup de desenvolvimento
dev_setup() {
    print_header
    
    print_info "Iniciando setup de desenvolvimento..."
    
    full_setup
    
    print_info "Configurações adicionais para desenvolvimento..."
    
    # Instalar ferramentas de desenvolvimento globais
    print_info "Instalando ferramentas globais..."
    npm install -g tsx nodemon prisma || {
        print_warning "Falha ao instalar algumas ferramentas globais (pode precisar de sudo)"
    }
    
    print_success "Setup de desenvolvimento concluído!"
    print_info "Ambiente pronto para desenvolvimento!"
}

# Script principal
main() {
    # Verificar se estamos no diretório correto
    if [ ! -f "package.json" ]; then
        print_error "Por favor, execute este script no diretório raiz do projeto"
        exit 1
    fi
    
    # Se argumentos foram passados, executar setup específico
    case "${1:-}" in
        "full"|"complete")
            full_setup
            exit 0
            ;;
        "basic")
            basic_setup
            exit 0
            ;;
        "docker")
            docker_setup
            exit 0
            ;;
        "dev"|"development")
            dev_setup
            exit 0
            ;;
        "health"|"check")
            health_check
            exit 0
            ;;
        "help"|"-h"|"--help")
            print_header
            echo "Uso: $0 [opção]"
            echo
            echo "Opções:"
            echo "  full, complete    Setup completo (padrão)"
            echo "  basic            Setup básico apenas"
            echo "  docker           Setup com Docker"
            echo "  dev, development Setup de desenvolvimento"
            echo "  health, check    Verificação de saúde"
            echo "  help, -h, --help Mostrar esta ajuda"
            exit 0
            ;;
        "")
            # Menu interativo se nenhum argumento for passado
            ;;
        *)
            print_error "Opção inválida: $1"
            echo "Use '$0 help' para ver as opções disponíveis"
            exit 1
            ;;
    esac
    
    # Menu interativo
    while true; do
        show_menu
        read -p "Digite sua escolha (1-6): " choice
        
        case $choice in
            1)
                full_setup
                break
                ;;
            2)
                basic_setup
                break
                ;;
            3)
                docker_setup
                break
                ;;
            4)
                dev_setup
                break
                ;;
            5)
                health_check
                break
                ;;
            6)
                print_info "Saindo..."
                exit 0
                ;;
            *)
                print_error "Opção inválida. Tente novamente."
                ;;
        esac
    done
}

# Executar script principal
main "$@"
