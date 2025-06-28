# 🚀 Guia Completo de Desenvolvimento - Will Finance 5.0

## 🎯 Configuração Rápida para Desenvolvimento

### Opção 1: Setup Automático (⚡ Recomendado)
```bash
# Windows - Batch Script
./setup.bat

# Windows - PowerShell (com mais opções)
./setup-local.ps1

# Setup completo com parâmetros
./setup-local.ps1 -Quick -DevOnly

# Setup com Docker
./setup-local.ps1 -Docker
```

### Opção 2: Setup Manual Completo

#### 1. **Pré-requisitos Obrigatórios**
- ✅ **Node.js 18+** (https://nodejs.org/)
- ✅ **npm 8+** (incluído com Node.js)
- ✅ **Git** (https://git-scm.com/)

#### 2. **Pré-requisitos Opcionais**
- 🐳 **Docker Desktop** (para containerização)
- 📊 **PostgreSQL 15+** (para desenvolvimento sem Docker)
- ⚡ **Redis** (para cache local)

#### 3. **Instalação Completa**
```bash
# 1. Clonar repositório
git clone [url-do-repositorio]
cd will-finance-5.0

# 2. Instalar dependências (todas as pastas)
npm run install:all

# 3. Configurar ambiente
cp .env.example .env
# Edite o arquivo .env conforme necessário

# 4. Configurar banco de dados
npm run db:setup

# 5. Iniciar desenvolvimento
npm run dev
```

## 🛠️ Comandos de Desenvolvimento

### 🚀 Desenvolvimento Diário
```bash
# Iniciar tudo (frontend + backend)
npm run dev

# Apenas frontend (porta 5173)
npm run dev:client

# Apenas backend (porta 8080)
npm run dev:server

# Com IA integrada
npm run dev:ai

# Desenvolvimento local com Docker
npm run dev:local
```

### 🗄️ Banco de Dados
```bash
# Setup completo do banco
npm run db:setup

# Executar migrações
npm run db:migrate

# Gerar cliente Prisma
npm run db:generate

# Popular com dados de exemplo
npm run db:seed

# Visualizar dados (Prisma Studio)
npm run db:studio

# Resetar banco (cuidado!)
npm run db:reset

# Backup do banco
npm run db:backup
```

### 🧪 Testes
```bash
# Todos os testes
npm run test

# Apenas frontend
npm run test:client

# Apenas backend
npm run test:server

# Testes E2E
npm run test:e2e

# Testes em modo watch
npm run test:watch

# Cobertura de testes
npm run test:coverage

# Testes de sistema
npm run test:system
```

### 🐳 Docker
```bash
# Desenvolvimento com Docker
npm run docker:dev

# Produção
npm run docker:up

# Parar containers
npm run docker:down

# Ver logs
npm run docker:logs

# Rebuild completo
npm run docker:rebuild
```

## 🎛️ Estrutura de Desenvolvimento

### 📁 Frontend (client/)
```
client/
├── src/
│   ├── components/        # Componentes reutilizáveis
│   │   ├── ui/           # Componentes de UI básicos
│   │   ├── forms/        # Formulários
│   │   ├── charts/       # Gráficos
│   │   └── layout/       # Layout e navegação
│   ├── pages/            # Páginas da aplicação
│   ├── hooks/            # Hooks customizados
│   ├── contexts/         # Contextos React
│   ├── services/         # Serviços e APIs
│   ├── utils/            # Utilitários
│   ├── types/            # Tipos TypeScript
│   └── styles/           # Estilos globais
├── public/               # Assets estáticos
└── tests/                # Testes do frontend
```

### 🛡️ Backend (server/)
```
server/
├── src/
│   ├── modules/          # Módulos do NestJS
│   │   ├── auth/        # Autenticação
│   │   ├── users/       # Usuários
│   │   ├── transactions/ # Transações
│   │   └── dashboard/   # Dashboard
│   ├── common/          # Código compartilhado
│   │   ├── guards/      # Guards de autenticação
│   │   ├── interceptors/ # Interceptadores
│   │   └── filters/     # Filtros de exceção
│   ├── database/        # Configuração do banco
│   └── config/          # Configurações
├── prisma/              # Schema e migrações
└── tests/               # Testes do backend
```

## 🌐 URLs de Desenvolvimento

| Serviço | URL | Descrição |
|---------|-----|-----------|
| **Frontend** | http://localhost:5173 | Interface principal |
| **Backend API** | http://localhost:8080 | API REST + WebSocket |
| **Prisma Studio** | http://localhost:5555 | Admin do banco de dados |
| **PostgreSQL** | localhost:5432 | Banco de dados |
| **Redis** | localhost:6379 | Cache em memória |
| **PgAdmin** | http://localhost:8081 | Interface web do PostgreSQL |
| **Adminer** | http://localhost:8082 | Interface leve do banco |
| **MailHog** | http://localhost:8025 | Interface de emails |

## ⚡ Dicas de Produtividade

### 🔥 Hot Reload
- **Frontend**: Mudanças são refletidas instantaneamente
- **Backend**: Reinicialização automática com NestJS
- **Database**: Sincronização automática do schema

### 🛠️ Ferramentas Recomendadas
- **VS Code** com extensões:
  - Prisma
  - TypeScript
  - ES7+ React Snippets
  - Tailwind CSS IntelliSense
  - Thunder Client (API testing)

### 📊 Debugging
```bash
# Backend debug mode
cd server && npm run start:debug

# Frontend com source maps
cd client && npm run dev -- --sourcemap

# Database queries debug
DEBUG=prisma:query npm run dev:server
```

### 🧹 Limpeza e Manutenção
```bash
# Limpar node_modules
npm run clean

# Limpar cache
npm run clean:cache

# Limpar Docker
npm run clean:docker

# Reset completo
npm run reset
```

## 🔧 Configuração Avançada

### 🔐 Variáveis de Ambiente
```env
# Desenvolvimento
NODE_ENV=development
DATABASE_URL=postgresql://will_finance:cyberpunk2077@localhost:5432/will_finance_dev
JWT_SECRET=your-development-secret
CLIENT_URL=http://localhost:5173

# Recursos opcionais
ENABLE_AI_FEATURES=true
ENABLE_WEBSOCKETS=true
ENABLE_ANALYTICS=false
```

### 🎨 Personalização do Tema
```css
/* client/src/styles/theme.css */
:root {
  --primary-neon: #00ff9f;
  --secondary-neon: #ff00ff;
  --bg-dark: #0a0a0a;
  --text-light: #ffffff;
}
```

## 🚨 Solução de Problemas

### Problemas Comuns

#### 🔧 Erro de Dependências
```bash
# Limpar e reinstalar
npm run clean
npm run install:all
```

#### 🗄️ Erro no Banco de Dados
```bash
# Resetar banco
npm run db:reset
npm run db:setup
```

#### 🐳 Erro no Docker
```bash
# Rebuild containers
npm run docker:rebuild
```

#### ⚡ Porta em Uso
```bash
# Verificar portas em uso
netstat -an | findstr :5173
netstat -an | findstr :8080

# Matar processo
taskkill /F /PID [PID]
```

## 📞 Suporte

- 📧 **Email**: william@willfinance.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/william/will-finance-5.0/issues)
- 📖 **Docs**: [Documentação Completa](./docs/)
- 💬 **Chat**: Discord/Slack (se disponível)

---

**🎉 Divirta-se desenvolvendo com Will Finance 5.0!**
