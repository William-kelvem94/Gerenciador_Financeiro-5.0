
# 🚀 Will Finance 5.0 - Enterprise Financial Management

Bem-vindo ao sistema financeiro mais avançado, seguro e escalável do mercado!

---

## 📋 Contextualização Completa

Will Finance 5.0 é uma plataforma enterprise para gerenciamento financeiro pessoal e corporativo, com arquitetura distribuída, segurança militar, analytics avançado, IA integrada e interface cyberpunk premium.

### Principais Diferenciais
- **Frontend moderno:** React 18, Vite, Tailwind, Framer Motion, Zustand, React Query
- **Backend robusto:** Node.js, Express/NestJS, Prisma ORM, PostgreSQL, Redis, Socket.IO
- **Segurança:** JWT, Firebase Auth, 2FA, criptografia, rate limiting, sanitização
- **Analytics & IA:** Charts.js, D3.js, OpenAI GPT, insights automáticos, predições
- **Arquitetura distribuída:** Microserviços, Docker, Kubernetes, CI/CD, monitoramento
- **Experiência cyberpunk:** UI neon, dark mode, animações premium, responsivo, PWA

### Módulos e Funcionalidades
- Gestão de transações, orçamentos, relatórios, categorias, contas bancárias
- Dashboard interativo, widgets customizáveis, filtros avançados
- Importação/exportação de dados, bulk actions, notificações push
- Sistema de permissões, multiusuário, logs estruturados, auditoria
- Integração com IA para insights, chat, previsões e automação

---

## 🗂️ Estrutura Detalhada do Projeto

```
Gerenciador_Financeiro-5.0/
├── client/         # Frontend React + Vite + TypeScript
│   ├── src/        # Componentes, páginas, hooks, stores, types, utils
│   ├── public/     # Assets públicos
│   └── ...         # Configs, testes, Dockerfile
├── server/         # Backend Node.js + Express/NestJS + Prisma
│   ├── src/        # Módulos, controllers, services, DTOs, middlewares
│   ├── prisma/     # Schema, migrations, seeds
│   └── ...         # Configs, testes, Dockerfile
├── docs/           # Documentação técnica centralizada
│   ├── README-docs.md
│   ├── api/, auth/, guides/, reports/, setup/
│   └── ...         # Arquivos técnicos
├── archive/        # Arquivos históricos, backups, versões antigas
│   ├── README-archive.md
│   ├── old-docs/, old-transactions/
│   └── ...
├── IA/             # Módulos, scripts, modelos e documentação de IA
│   ├── README-IA.md
│   ├── models/, scripts/, datasets/, notebooks/
│   └── ...
├── scripts/        # Scripts de automação, desenvolvimento e testes
│   ├── README-scripts.md
│   ├── development/, testing/, maintenance/
│   └── ...
├── data/           # Dados de exemplo, extratos, arquivos CSV
├── database/       # Scripts, backups, init.sql
├── docker/         # Dockerfiles, docker-compose para dev/prod
├── configs/        # Arquivos de configuração de ambiente
├── .github/        # Workflows CI/CD
├── README.md       # Este arquivo (sumário e contextualização)
├── LICENSE         # Licença do projeto
└── ...             # Arquivos auxiliares
```

---

## 📚 Documentação
- [Documentação Técnica Completa](docs/README-docs.md)
- [API Reference](docs/api/api-reference.md)
- [Arquitetura](docs/ARCHITECTURE.md)
- [Roadmap](docs/ROADMAP_FUNCIONALIDADES.md)
- [Relatórios de Testes](docs/reports/RELATORIO_FINAL_COMPLETO.md)
- [Guia de Instalação](docs/setup/QUICK_START.md)
- [Scripts de Automação](scripts/README-scripts.md)
- [Ambiente de IA](IA/README-IA.md)
- [Histórico do Projeto](archive/README-archive.md)

---

## 🚀 Instalação Rápida
```bash
npm run setup # Instala dependências, configura banco e build
npm run dev   # Inicia cliente e servidor
```
Mais comandos em [scripts/README-scripts.md](scripts/README-scripts.md).

---

## 🛡️ Qualidade e Segurança
- Cobertura de testes: 80%+ (meta 90%)
- Performance: FCP < 2s, backend < 100ms (95th percentile)
- Segurança: JWT, 2FA, sanitização, CORS, rate limiting
- CI/CD, Docker, monitoramento, backup automatizado

---

**Desenvolvido por Will Finance Team — Para dúvidas, consulte a documentação ou abra uma issue!**
<<<<<<< HEAD
# 🚀 Will Finance 5.0 - Sistema de Gerenciamento Financeiro

> **Sistema completo de gerenciamento financeiro com interface cyberpunk, arquitetura modular e recursos avançados de IA.**

![Version](https://img.shields.io/badge/version-5.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)

---

## 📋 Índice
- [Visão Geral](#-visão-geral)
- [Características](#-características)  
- [Tecnologias](#-tecnologias)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Instalação e Configuração](#-instalação-e-configuração)
- [Uso](#-uso)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Desenvolvimento](#-desenvolvimento)
- [API Endpoints](#-api-endpoints)
- [Deploy](#-deploy)
- [Contribuição](#-contribuição)

---

## 🎯 Visão Geral

Will Finance 5.0 é um sistema completo de gerenciamento financeiro desenvolvido com tecnologias modernas, oferecendo:

- 💰 **Gestão Completa**: Controle total de receitas, despesas e orçamentos
- 🎨 **Interface Cyberpunk**: Design futurístico com animações e efeitos neon
- 📊 **Relatórios Avançados**: Analytics em tempo real com gráficos interativos
- 🤖 **IA Integrada**: Análise inteligente de padrões financeiros
- 🔐 **Segurança Avançada**: Autenticação multi-fator e criptografia
- 📱 **Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- 🌐 **PWA Ready**: Instalável como aplicativo nativo

---

## ✨ Características

### 🎛️ **Dashboard Interativo**
- Resumo financeiro em tempo real
- Gráficos e métricas personalizáveis
- Alertas e notificações inteligentes

### 💳 **Gestão de Transações**
- Adicionar, editar e categorizar transações
- Upload de extratos bancários (CSV/PDF)
- Detecção automática de padrões

### 📈 **Orçamentos e Metas**
- Criação de orçamentos por categoria
- Acompanhamento de metas financeiras
- Alertas de limite de gastos

### 📊 **Relatórios e Analytics**
- Relatórios detalhados por período
- Análise de tendências
- Exportação em múltiplos formatos

### 🔒 **Segurança**
- Autenticação Firebase
- JWT tokens seguros
- Criptografia de dados sensíveis

---

## 🛠️ Tecnologias

### **Frontend**
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- PostCSS
- Zustand
- React Query
- React Hook Form
- Zod
- Firebase Auth
- React Router v6
- Lucide React

### **Backend**
- Node.js
- Express
- TypeScript
- Prisma ORM
- SQLite/PostgreSQL
- JWT
- bcrypt
- Zod
- Multer
- Helmet
- CORS
- Winston

### **DevOps**
- Docker
- Docker Compose
- GitHub Actions
- Vitest
- Jest
- ESLint
- Prettier
- Health checks
- Logs
```json
{
  "core": ["React 18", "TypeScript", "Vite"],
  "styling": ["Tailwind CSS", "Framer Motion", "PostCSS"],
  "state": ["Zustand", "React Query"],
  "forms": ["React Hook Form", "Zod"],
  "auth": ["Firebase Auth"],
  "routing": ["React Router v6"],
  "icons": ["Lucide React"]
}
```

### **Backend**
```json
{
  "runtime": ["Node.js", "Express", "TypeScript"],
  "database": ["Prisma ORM", "SQLite/PostgreSQL"],
  "auth": ["JWT", "bcrypt"],
  "validation": ["Zod"],
  "files": ["Multer"],
  "security": ["Helmet", "CORS"],
  "logging": ["Winston"]
}
```

### **DevOps**
```json
{
  "containerization": ["Docker", "Docker Compose"],
  "ci_cd": ["GitHub Actions"],
  "testing": ["Vitest", "Jest"],
  "quality": ["ESLint", "Prettier"],
  "monitoring": ["Health checks", "Logs"]
}
```

---

## 📁 Estrutura do Projeto

```
Will-Finance-5.0/
├── 📱 client/                    # Frontend React
│   ├── src/
│   │   ├── components/          # Componentes reutilizáveis
│   │   ├── pages/              # Páginas principais
│   │   ├── hooks/              # Hooks customizados  
│   │   ├── stores/             # Estado global (Zustand)
│   │   ├── types/              # Tipos TypeScript
│   │   ├── utils/              # Utilitários
│   │   └── styles/             # Estilos globais
│   └── public/                 # Assets estáticos
├── 🖥️ server/                   # Backend Node.js
│   ├── src/
│   │   ├── modules/            # Módulos por domínio
│   │   ├── middleware/         # Middlewares customizados
│   │   ├── config/             # Configurações
│   │   ├── utils/              # Utilitários do servidor
│   │   └── types/              # Tipos do backend
│   └── prisma/                 # Schema e migrações
├── 🤖 IA/                       # Módulo de Inteligência Artificial
│   ├── src/                    # Código fonte IA
│   ├── models/                 # Modelos treinados
│   ├── datasets/               # Datasets de treino
│   └── notebooks/              # Jupyter notebooks
├── 🐳 docker/                   # Configurações Docker
├── 📚 docs/                     # Documentação
├── ⚙️ configs/                  # Arquivos de configuração
├── 🔧 scripts/                  # Scripts de automação
└── 📦 archive/                  # Arquivos antigos/backup
```

---

## 🚀 Instalação e Configuração

### **Pré-requisitos**
- Node.js 18+ 
- npm ou yarn
- Git
- Docker (opcional)

### **1. Clone o Repositório**
```bash
git clone https://github.com/William-kelvem94/Gerenciador_Financeiro-5.0.git
=======
# 🚀 Will Finance 6.0 - Complete Cyberpunk Financial Management System

> **Enterprise-grade financial management system** with cutting-edge cyberpunk design, AI-powered insights, and full-stack modern architecture.

![Will Finance 6.0](./imagem_gerada%20(2).png)

## 🎯 What's New in Version 6.0

### ✨ **Complete Technology Stack Upgrade**
- **🛡️ Backend**: Migrated from Express to **NestJS** with modular architecture
- **⚡ Frontend**: Enhanced **React 18 + Vite + TypeScript + Zustand**
- **🤖 AI Module**: Dedicated **FastAPI** service with ML capabilities
- **🐳 Infrastructure**: Production-ready **Docker** configuration
- **📱 PWA**: Progressive Web App with offline capabilities

### 🎨 **Enhanced Cyberpunk Interface**
- **Matrix Rain Effects**: Animated background visuals
- **Neon Glow Components**: Interactive UI elements with cyberpunk aesthetics
- **Advanced Animations**: Framer Motion powered micro-interactions
- **Responsive Design**: Mobile-first approach with PWA support
- **Dark Theme Optimization**: Enhanced contrast and visual hierarchy

### 🤖 **Integrated AI Capabilities**
- **Smart Transaction Classification**: Automatic expense categorization
- **Savings Suggestions**: Personalized financial optimization tips
- **Budget Predictions**: ML-powered expense forecasting
- **OCR Processing**: Extract data from bank statements (PDF/images)
- **Pattern Recognition**: Detect spending anomalies and trends

## 🏗️ Architecture Overview

```
Will Finance 6.0/
├── 📱 client/              # React 18 + Vite + TypeScript Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Application pages/routes
│   │   ├── stores/        # Zustand state management
│   │   ├── lib/           # API client and utilities
│   │   └── types/         # TypeScript definitions
│   ├── public/            # Static assets and PWA config
│   └── package.json       # Frontend dependencies
│
├── 🛡️ server/              # NestJS Backend API
│   ├── src/
│   │   ├── auth/          # Authentication module
│   │   ├── transactions/  # Transaction management
│   │   ├── budgets/       # Budget management
│   │   ├── reports/       # Financial reports
│   │   └── prisma/        # Database service
│   ├── prisma/            # Database schema and migrations
│   └── package.json       # Backend dependencies
│
├── 🤖 IA/                  # AI/ML FastAPI Service
│   ├── api/               # FastAPI REST endpoints
│   ├── models/            # ML models and training
│   ├── services/          # AI business logic
│   └── requirements.txt   # Python dependencies
│
├── 🗄️ data/                # Sample data and migrations
├── 📄 docs/                # Comprehensive documentation
├── 🔧 scripts/             # Development and deployment utilities
├── 🐳 docker-compose.yml   # Multi-service orchestration
└── 📋 package.json         # Monorepo configuration
```

## 🚀 Quick Start

### Option 1: One-Command Setup (Recommended)
```bash
git clone https://github.com/William-kelvem94/Gerenciador_Financeiro-5.0.git
cd Gerenciador_Financeiro-5.0
npm run setup
```

### Option 2: Manual Development Setup
```bash
# Install all dependencies
npm run install:all

# Setup database with sample data
npm run db:setup

# Start all services in development mode
npm run dev

# Or with AI service included
npm run dev:ai
```

### Option 3: Docker Production Environment
```bash
# Start all services with Docker
npm run docker:up

# With AI service
npm run docker:ai

# View logs
npm run docker:logs
```

## 🌐 Service URLs

- **🎨 Frontend (Client)**: http://localhost:5173
- **🛡️ Backend API**: http://localhost:8080
- **🤖 AI Service**: http://localhost:8001
- **📊 API Documentation**: http://localhost:8080/api/docs
- **🤖 AI Documentation**: http://localhost:8001/docs
- **📈 Prisma Studio**: http://localhost:5555
- **🗄️ PostgreSQL**: localhost:5432
- **⚡ Redis Cache**: localhost:6379

## 📊 Complete Feature Set

### ✅ **Core Financial Management**
- **💰 Transaction Management**: CRUD operations with real-time updates
- **📋 Budget Planning**: Create, monitor, and track financial goals
- **📊 Advanced Reports**: Dynamic charts and financial analytics
- **🏦 Multi-Account Support**: Manage multiple bank accounts
- **🏷️ Smart Categories**: Auto-categorization with custom rules
- **📱 Multi-Currency**: Support for multiple currencies

### ✅ **Smart Automation**
- **🤖 AI Transaction Classification**: Automatic expense categorization
- **💡 Savings Suggestions**: Personalized financial optimization
- **🔮 Predictive Analytics**: Budget forecasting and trend analysis
- **📄 OCR Processing**: Extract data from bank statements
- **🔔 Smart Notifications**: Proactive financial alerts
- **📈 Goal Tracking**: Automated progress monitoring

### ✅ **Modern User Experience**
- **🎨 Cyberpunk Design**: Immersive dark theme with neon accents
- **📱 PWA Support**: Install as native mobile/desktop app
- **⚡ Real-time Updates**: Live data synchronization
- **🌙 Dark Mode**: Optimized for low-light usage
- **🎭 Animations**: Smooth transitions and micro-interactions
- **♿ Accessibility**: WCAG compliance and screen reader support

### ✅ **Enterprise Security**
- **🔐 JWT Authentication**: Secure token-based auth
- **🌐 Google OAuth**: Social login integration
- **🛡️ Data Encryption**: End-to-end security
- **⚠️ Input Validation**: Comprehensive data sanitization
- **🚫 Rate Limiting**: DDoS protection
- **📝 Audit Logging**: Complete activity tracking

### ✅ **Developer Experience**
- **📚 Comprehensive Documentation**: API docs and guides
- **🧪 Testing Suite**: Unit, integration, and E2E tests
- **🔧 Development Tools**: Hot reload, debugging, profiling
- **🐳 Docker Support**: Containerized development and production
- **📊 Monitoring**: Health checks and performance metrics
- **🔄 CI/CD Ready**: Automated deployment pipelines

## 📋 Available Scripts

### Development
```bash
npm run dev              # Start frontend + backend
npm run dev:ai           # Start all services including AI
npm run dev:client       # Frontend only
npm run dev:server       # Backend only
npm run dev:silent       # Silent mode (no logs)
```

### Database Management
```bash
npm run db:setup         # Complete database setup
npm run db:migrate       # Run migrations
npm run db:seed          # Seed sample data
npm run db:studio        # Open Prisma Studio
npm run db:reset         # Reset database
```

### Building & Testing
```bash
npm run build            # Build all services
npm run test             # Run all tests
npm run lint             # Lint all code
npm run clean            # Clean build artifacts
```

### Docker Operations
```bash
npm run docker:up        # Start all containers
npm run docker:down      # Stop all containers
npm run docker:build     # Rebuild containers
npm run docker:logs      # View container logs
npm run docker:ai        # Start with AI service
```

## 🔧 Configuration

### Environment Variables
Copy `.env.example` to `.env` and configure:

```bash
# Database
DATABASE_URL="postgresql://will_finance:cyberpunk2077@localhost:5432/will_finance_db"

# Authentication
JWT_SECRET="your-secure-jwt-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# AI Service
AI_API_URL="http://localhost:8001"
AI_API_KEY="your-ai-api-key"

# Optional: Email, Analytics, etc.
```

### Database Setup
The system uses PostgreSQL with Prisma ORM:

1. **Automatic Setup**: `npm run db:setup`
2. **Manual Setup**:
   ```bash
   npm run db:generate  # Generate Prisma client
   npm run db:migrate   # Apply database migrations
   npm run db:seed      # Insert sample data
   ```

## 🚀 Deployment

### Production Docker Deployment
```bash
# Clone and setup
git clone <repository-url>
>>>>>>> 19ae9cf82eb63c5cfccf5974311e9c254540a7d3
cd Gerenciador_Financeiro-5.0

<<<<<<< HEAD
### **2. Instale as Dependências**
```bash
# Instalar todas as dependências (root, client, server)
npm run install:all

# Ou instalar individualmente
npm install           # Dependências root
cd client && npm install
cd ../server && npm install
```

### **3. Configuração do Ambiente**
```bash
# Copiar arquivos de exemplo
cp configs/client.env client/.env
cp configs/server.env server/.env

# Editar as variáveis conforme necessário
```

### **4. Configuração do Banco de Dados**
```bash
# Configurar Prisma e banco
npm run db:setup

# Executar migrações
npm run db:migrate
```

### **5. Iniciar o Desenvolvimento**
```bash
# Iniciar cliente e servidor simultaneamente
npm run dev

# Ou separadamente
npm run dev:client    # http://localhost:5173
npm run dev:server    # http://localhost:8080
```

---

## 🎮 Uso

### **Acesso à Aplicação**
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080/api
- **Documentação API**: http://localhost:8080/api-docs
- **Health Check**: http://localhost:8080/health
- **Prisma Studio**: http://localhost:5555

### **Funcionalidades Principais**

#### 💰 **Transações**
1. Acesse "Transações" no menu lateral
2. Clique em "Nova Transação" 
3. Preencha descrição, valor, categoria e data
4. Salve para adicionar ao histórico

#### 📊 **Dashboard**
- Visualize resumo financeiro em tempo real
- Acompanhe gráficos de receitas vs despesas
- Configure widgets personalizados

#### 💡 **Orçamentos**
- Defina limites de gastos por categoria
- Acompanhe progresso das metas
- Receba alertas de limites

#### 📈 **Relatórios**
- Gere relatórios detalhados por período
- Exporte dados em CSV/PDF
- Analise tendências e padrões

---

## 📜 Scripts Disponíveis

```bash
# 🚀 Desenvolvimento
npm run dev              # Inicia cliente + servidor
npm run dev:client       # Só cliente (React)
npm run dev:server       # Só servidor (Node.js)

# 🏗️ Build
npm run build            # Build completo
npm run build:client     # Build do frontend
npm run build:server     # Build do backend

# 🧪 Testes
npm run test             # Todos os testes
npm run test:client      # Testes do frontend
npm run test:server      # Testes do backend

# 🔍 Qualidade
npm run lint             # ESLint em todo projeto
npm run format           # Prettier formatting
npm run type-check       # Verificação TypeScript

# 🗄️ Banco de Dados
npm run db:setup         # Configuração inicial
npm run db:migrate       # Executar migrações
npm run db:studio        # Interface visual Prisma
npm run db:reset         # Reset completo

# 📦 Instalação
npm run install:all      # Instalar todas dependências
npm run clean            # Limpar node_modules
npm run fresh-install    # Reinstalação limpa

# 🐳 Docker
npm run docker:build     # Build das imagens
npm run docker:up        # Subir containers
npm run docker:down      # Parar containers
```

---

## 🔧 Desenvolvimento

### **Padrões de Código**
- **TypeScript** obrigatório em todo código
- **ESLint + Prettier** para formatação
- **Conventional Commits** para mensagens
- **Testes** para novas funcionalidades

### **Estrutura de Componentes**
```typescript
// Estrutura padrão React
interface ComponentProps {
  // Props tipadas
}

export function ComponentName({ prop }: ComponentProps) {
  // 1. Hooks de estado
  // 2. Hooks customizados  
  // 3. Effects
  // 4. Handlers
  // 5. Render com motion
}
```

### **API Endpoints**
```typescript
// Padrão de resposta
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  code?: string;
  timestamp: string;
}
```

### **Temas e Estilos**
```css
/* Cores cyberpunk */
--cyber-primary: #00FFFF;     /* Cyan */
--cyber-secondary: #FF00FF;   /* Magenta */
--cyber-accent: #39FF14;      /* Green */
--cyber-danger: #FF0040;      /* Red */
```

---

## 🌐 API Endpoints

### **Autenticação**
```
POST   /api/auth/login       # Login usuário
POST   /api/auth/register    # Registrar usuário  
POST   /api/auth/logout      # Logout
GET    /api/auth/me          # Dados do usuário
```

### **Transações**
```
GET    /api/transactions     # Listar transações
POST   /api/transactions     # Criar transação
PUT    /api/transactions/:id # Atualizar transação
DELETE /api/transactions/:id # Deletar transação
```

### **Orçamentos**
```
GET    /api/budgets          # Listar orçamentos
POST   /api/budgets          # Criar orçamento
PUT    /api/budgets/:id      # Atualizar orçamento
DELETE /api/budgets/:id      # Deletar orçamento
```

### **Relatórios**
```
GET    /api/reports/summary  # Resumo financeiro
GET    /api/reports/trends   # Análise de tendências
POST   /api/reports/export   # Exportar relatório
```

---

## 🚢 Deploy

### **Desenvolvimento Local**
```bash
npm run dev
```

### **Build de Produção**
```bash
npm run build
npm start
```

### **Docker**
```bash
# Desenvolvimento
docker-compose up -d

# Produção
docker-compose -f docker-compose.prod.yml up -d
```

### **Variáveis de Ambiente**
```env
# Client (.env)
VITE_API_URL=http://localhost:8080
VITE_FIREBASE_API_KEY=your_key

# Server (.env)
DATABASE_URL=sqlite:./dev.db
JWT_SECRET=your_secret
PORT=8080
```

---

## 🤝 Contribuição

### **Como Contribuir**
1. Fork do repositório
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Commit suas mudanças: `git commit -m 'feat: adiciona nova funcionalidade'`
4. Push para a branch: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

### **Padrões de Commit**
```
feat: nova funcionalidade
fix: correção de bug
docs: atualização de documentação
style: formatação/estilo
refactor: refatoração de código
test: adição/correção de testes
chore: tarefas de manutenção
```

### **Reportar Issues**
- Use templates de issue apropriados
- Inclua steps para reproduzir bugs
- Adicione screenshots quando relevante

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 🙏 Agradecimentos

- **Comunidade React** pelos componentes e bibliotecas
- **Tailwind CSS** pelo sistema de design
- **Framer Motion** pelas animações fluidas
- **Lucide** pelos ícones consistentes

---

## 📞 Suporte

- 📧 **Email**: william.kelvem94@gmail.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/William-kelvem94/Gerenciador_Financeiro-5.0/issues)
- 💬 **Discussões**: [GitHub Discussions](https://github.com/William-kelvem94/Gerenciador_Financeiro-5.0/discussions)
=======
# Configure environment
cp .env.example .env
# Edit .env with production values

# Deploy with Docker
docker-compose up -d

# Check status
docker-compose ps
docker-compose logs -f
```

### Manual Production Deployment
```bash
# Build all services
npm run build

# Setup production database
npm run db:migrate

# Start production server
npm run start
```

## 🎨 Demo Credentials

For testing the complete system:

```
Email: demo@willfinance.com
Password: demo123
```

**Demo includes:**
- Pre-configured accounts and categories
- Sample transactions across multiple months
- Budget examples and goals
- AI classification examples

## 🔮 Roadmap

### 🔄 **Currently in Development**
- **📱 Mobile App**: React Native application
- **💻 Desktop App**: Electron wrapper
- **🔗 Open Banking**: Brazilian bank API integration
- **📊 Advanced Analytics**: Machine learning insights
- **🌍 Multi-language**: i18n support

### 📈 **Future Enhancements**
- **👥 Multi-user**: Family/business account management
- **🔔 Push Notifications**: Real-time alerts
- **📱 Widget Support**: Home screen widgets
- **🎯 Investment Tracking**: Portfolio management
- **💳 Credit Score**: Integration with credit bureaus

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./docs/CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

## 📞 Support

- 📖 **Documentation**: [Complete Docs](./docs/)
- 🐛 **Bug Reports**: [GitHub Issues](./issues)
- 💡 **Feature Requests**: [GitHub Discussions](./discussions)
- 💬 **Community**: [Discord Server](#)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🌟 Acknowledgments

- **Design Inspiration**: Cyberpunk 2077, Matrix, Blade Runner
- **Open Source Libraries**: React, NestJS, Prisma, FastAPI
- **Community**: Amazing developers who contribute to open source
>>>>>>> 19ae9cf82eb63c5cfccf5974311e9c254540a7d3

---

<div align="center">

<<<<<<< HEAD
**⚡ Will Finance 5.0 - O futuro do gerenciamento financeiro ⚡**

[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/William-kelvem94/Gerenciador_Financeiro-5.0)
=======
**Built with ❤️ by the Will Finance Team**

🚀 **Experience the Future of Financial Management** 🚀

[⭐ Star this repo](../../stargazers) | [🍴 Fork it](../../fork) | [📊 View Demo](#) | [📖 Read Docs](./docs/)
>>>>>>> 19ae9cf82eb63c5cfccf5974311e9c254540a7d3

</div>
