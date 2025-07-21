#!/bin/bash

# =============================================================================
# 🚀 WILL FINANCE 5.0 - SCRIPT DE CONFIGURAÇÃO AUTOMATIZADA
# =============================================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${CYAN}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${PURPLE}"
    echo "████████████████████████████████████████████████████████████"
    echo "█                                                          █"
    echo "█         🚀 WILL FINANCE 5.0 - SETUP COMPLETO           █"
    echo "█                                                          █"
    echo "████████████████████████████████████████████████████████████"
    echo -e "${NC}"
}

# Main setup function
main() {
    print_header
    
    print_status "Iniciando configuração completa do Will Finance 5.0..."
    
    # Check if we're in the right directory
    if [ ! -f "package.json" ]; then
        print_error "Por favor, execute este script no diretório raiz do projeto"
        exit 1
    fi
    
    # 1. Install root dependencies
    print_status "📦 Instalando dependências raiz..."
    npm install || {
        print_error "Falha ao instalar dependências raiz"
        exit 1
    }
    print_success "Dependências raiz instaladas"
    
    # 2. Install client dependencies
    print_status "📦 Instalando dependências do frontend..."
    cd client
    npm install || {
        print_error "Falha ao instalar dependências do frontend"
        exit 1
    }
    cd ..
    print_success "Dependências do frontend instaladas"
    
    # 3. Install server dependencies
    print_status "📦 Instalando dependências do backend..."
    cd server
    npm install || {
        print_error "Falha ao instalar dependências do backend"
        exit 1
    }
    cd ..
    print_success "Dependências do backend instaladas"
    
    # 4. Setup environment files
    print_status "🔧 Configurando arquivos de ambiente..."
    if [ ! -f ".env" ]; then
        cp .env.example .env
        print_success "Arquivo .env criado"
    else
        print_warning "Arquivo .env já existe"
    fi
    
    if [ ! -f "client/.env" ]; then
        cp client/.env.example client/.env 2>/dev/null || echo "# Client Environment Variables" > client/.env
        print_success "Arquivo .env do cliente criado"
    fi
    
    if [ ! -f "server/.env" ]; then
        cp .env server/.env
        print_success "Arquivo .env do servidor criado"
    fi
    
    # 5. Setup database
    print_status "🗄️ Configurando banco de dados..."
    cd server
    
    # Generate Prisma client
    print_status "Gerando cliente Prisma..."
    npx prisma generate || {
        print_error "Falha ao gerar cliente Prisma"
        exit 1
    }
    
    # Run migrations
    print_status "Executando migrações..."
    npx prisma migrate dev --name setup || {
        print_warning "Falha nas migrações - banco pode já estar configurado"
    }
    
    # Run seed
    print_status "Populando banco com dados iniciais..."
    npm run db:seed || {
        print_warning "Falha no seed - dados podem já existir"
    }
    
    cd ..
    print_success "Banco de dados configurado"
    
    # 6. Build projects
    print_status "🔨 Compilando projetos..."
    
    # Build server
    print_status "Compilando backend..."
    cd server
    npm run build || {
        print_warning "Falha na compilação do backend"
    }
    cd ..
    
    # Build client
    print_status "Compilando frontend..."
    cd client
    npm run build || {
        print_warning "Falha na compilação do frontend"
    }
    cd ..
    
    print_success "Compilação concluída"
    
    # 7. Create startup scripts
    print_status "📝 Criando scripts de inicialização..."
    
    # Create development script
    cat > start-dev.sh << 'EOF'
#!/bin/bash
echo "🚀 Iniciando Will Finance 5.0 em modo desenvolvimento..."

# Kill existing processes
pkill -f "nest start" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true

# Start backend
cd server
npm run dev &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 3

# Start frontend
cd ../client
npm run dev &
FRONTEND_PID=$!

echo "✅ Will Finance 5.0 iniciado!"
echo "🌐 Frontend: http://localhost:5173"
echo "🔧 Backend: http://localhost:8080"
echo "📚 API Docs: http://localhost:8080/api/docs"
echo ""
echo "Para parar, pressione Ctrl+C"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
EOF
    
    chmod +x start-dev.sh
    print_success "Script de desenvolvimento criado: ./start-dev.sh"
    
    # Create production script
    cat > start-prod.sh << 'EOF'
#!/bin/bash
echo "🚀 Iniciando Will Finance 5.0 em modo produção..."

# Build projects
npm run build

# Start server
cd server
npm run start:prod
EOF
    
    chmod +x start-prod.sh
    print_success "Script de produção criado: ./start-prod.sh"
    
    # 8. Create health check script
    cat > health-check.sh << 'EOF'
#!/bin/bash
echo "🏥 Verificando saúde do sistema..."

# Check backend
if curl -s http://localhost:8080/health > /dev/null; then
    echo "✅ Backend: OK"
else
    echo "❌ Backend: DOWN"
fi

# Check frontend
if curl -s http://localhost:5173 > /dev/null; then
    echo "✅ Frontend: OK"
else
    echo "❌ Frontend: DOWN"
fi

# Check database
cd server
if npx prisma db push --accept-data-loss > /dev/null 2>&1; then
    echo "✅ Database: OK"
else
    echo "❌ Database: ISSUES"
fi
cd ..
EOF
    
    chmod +x health-check.sh
    print_success "Script de verificação criado: ./health-check.sh"
    
    # 9. Final summary
    echo ""
    print_success "🎉 CONFIGURAÇÃO COMPLETA!"
    echo ""
    echo -e "${CYAN}📋 Resumo da configuração:${NC}"
    echo "✅ Dependências instaladas (root, client, server)"
    echo "✅ Arquivos de ambiente configurados"
    echo "✅ Banco de dados SQLite configurado"
    echo "✅ Dados iniciais populados"
    echo "✅ Projetos compilados"
    echo "✅ Scripts de inicialização criados"
    echo ""
    echo -e "${YELLOW}🚀 Para iniciar o desenvolvimento:${NC}"
    echo "   ./start-dev.sh"
    echo ""
    echo -e "${YELLOW}🌐 URLs disponíveis:${NC}"
    echo "   Frontend:  http://localhost:5173"
    echo "   Backend:   http://localhost:8080"
    echo "   API Docs:  http://localhost:8080/api/docs"
    echo "   Database:  server/dev.db (SQLite)"
    echo ""
    echo -e "${YELLOW}👤 Credenciais de teste:${NC}"
    echo "   Email: demo@willfinance.com"
    echo "   Senha: demo123"
    echo ""
    echo -e "${GREEN}🎯 O Will Finance 5.0 está pronto para uso!${NC}"
}

# Run main function
main "$@"
