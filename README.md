# � Will Finance 5.0 - Sistema Profissional de Gerenciamento Financeiro

<div align="center">

![Will Finance 5.0](./imagem_gerada%20(2).png)

[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6+-purple.svg)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

Sistema completo e profissional de gerenciamento financeiro com frontend React moderno e backend robusto.

[🚀 Demo](#demo) • [📖 Documentação](#documentação) • [⚡ Início Rápido](#início-rápido) • [🤝 Contribuir](#contribuindo)

</div>

---

## 🎯 Características Principais

### 🛡️ **Segurança e Confiabilidade**
- ✅ **0 vulnerabilidades críticas** em produção
- 🔐 Autenticação JWT segura + Google OAuth
- 🛡️ Headers de segurança (Helmet, CORS, CSP)
- 🚦 Rate limiting e validação rigorosa
- 🔒 Senhas criptografadas com bcrypt

### ⚡ **Performance e Tecnologia**
- ⚡ **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- 🚀 **Backend**: Express + Prisma ORM + SQLite/PostgreSQL
- 📱 **PWA Ready**: Instalação como app nativo
- 🐳 **Dockerizado**: Ambiente completo de produção
- 🔄 **Real-time**: Atualizações instantâneas

### 🎨 **Interface Moderna**
- 🌙 Tema dark cyberpunk com cores neon
- 📱 Design responsivo para todos os dispositivos
- 🎭 Animações suaves e transições elegantes
- 📊 Gráficos interativos (barras, pizza, linha)
- 🎯 UX otimizada para produtividade

## ⚡ Início Rápido

### 🎯 **Opção 1: Setup Automático (Recomendado)**
```bash
# Clone o repositório
git clone https://github.com/William-kelvem94/Gerenciador_Financeiro-5.0.git
cd Gerenciador_Financeiro-5.0

# Setup completo automático (Windows)
.\setup-local.ps1

# Ou manualmente
npm run install:all
npm run db:setup
npm run dev
```

### 🐳 **Opção 2: Docker (Produção)**
```bash
# Desenvolvimento com Docker
docker-compose -f docker-compose.dev.yml up -d

# Produção completa
docker-compose -f docker-compose.prod.yml up -d
```

### 🔧 **Opção 3: Setup Manual**
```bash
# 1. Instalar dependências
npm ci
cd server && npm ci
cd ../client && npm ci

# 2. Configurar ambiente
cp .env.example .env
cp client/.env.example client/.env

# 3. Configurar banco de dados
cd server
npx prisma migrate dev --name init
npx tsx prisma/seed.ts

# 4. Iniciar servidores
npm run dev        # Frontend + Backend
```

## 🌐 **URLs de Acesso**

| Serviço | URL | Descrição |
|---------|-----|-----------|
| 🎨 **Frontend** | [http://localhost:5173](http://localhost:5173) | Interface principal |
| 🛡️ **Backend API** | [http://localhost:8080](http://localhost:8080) | API REST |
| 📊 **Health Check** | [http://localhost:8080/health](http://localhost:8080/health) | Status do sistema |
| 🗄️ **Prisma Studio** | [http://localhost:5555](http://localhost:5555) | Admin do banco |

## 👤 **Login Demo**
- **Email**: `demo@willfinance.com`
- **Senha**: `demo123`

## 📁 Arquitetura do Projeto

```
Will Finance 5.0/
├── 📱 client/                    # Frontend React + TypeScript
│   ├── src/
│   │   ├── components/          # Componentes reutilizáveis
│   │   ├── pages/              # Páginas da aplicação
│   │   ├── contexts/           # Contextos React (Auth, Theme)
│   │   ├── hooks/              # Hooks customizados
│   │   ├── stores/             # Zustand stores
│   │   ├── types/              # Definições TypeScript
│   │   ├── lib/                # Configurações (axios, utils)
│   │   └── utils/              # Utilitários
│   ├── public/                 # Arquivos estáticos
│   └── package.json            # Dependências do cliente
│
├── 🖥️ server/                    # Backend Node.js + Express
│   ├── src/
│   │   ├── controllers/        # Controladores da API
│   │   ├── routes/             # Rotas da API
│   │   ├── middleware/         # Middlewares (auth, cors, etc)
│   │   ├── services/           # Lógica de negócio
│   │   ├── utils/              # Utilitários do servidor
│   │   └── types/              # Tipos TypeScript
│   ├── prisma/                 # Schema e migrações
│   │   ├── schema.prisma       # Definição do banco
│   │   ├── migrations/         # Histórico de migrações
│   │   └── seed.ts            # Dados de demonstração
│   └── package.json            # Dependências do servidor
│
├── � docker/                    # Configurações Docker
│   ├── Dockerfile.server       # Dockerfile do backend
│   ├── Dockerfile.client       # Dockerfile do frontend
│   └── nginx.conf              # Configuração Nginx
│
├── 🔄 .github/                   # CI/CD GitHub Actions
│   └── workflows/
│       ├── ci.yml              # Pipeline de CI
│       └── deploy.yml          # Pipeline de Deploy
│
├── � docs/                      # Documentação completa
│   ├── README.md               # Guia principal
│   ├── DEVELOPMENT.md          # Guia de desenvolvimento
│   ├── CONTRIBUTING.md         # Guia de contribuição
│   └── API_README.md           # Documentação da API
│
├── �️ database/                  # Scripts e backups
│   ├── init.sql               # Inicialização
│   └── backup/                # Backups automáticos
│
├── 🤖 IA/                        # Módulo de IA (opcional)
│   ├── src/                    # Scripts Python
│   ├── models/                 # Modelos treinados
│   └── datasets/               # Datasets de treino
│
├── 🔧 scripts/                   # Scripts utilitários
│   ├── development/            # Scripts de desenvolvimento
│   └── testing/                # Scripts de teste
│
├── � data/                      # Dados de exemplo
├── 🐳 docker-compose.*.yml       # Configurações Docker
├── 📋 package.json               # Dependências raiz
└── 🔐 .env.example              # Variáveis de ambiente
```

## 📊 Funcionalidades Completas

### ✅ **Implementadas**
- **📈 Dashboard**: Gráficos em tempo real (barras, pizza, linha, dispersão)
- **💰 Transações**: CRUD completo com validação e categorização
- **📋 Orçamentos**: Criação e monitoramento de metas financeiras
- **📊 Relatórios**: Análises avançadas com filtros dinâmicos
- **🤖 IA Chat**: Assistente financeiro inteligente
- **📱 PWA**: Instalação como app nativo
- **🔐 Autenticação**: JWT + Google OAuth + Firebase
- **📤 Import/Export**: Suporte a 10+ bancos brasileiros (CSV, PDF)
- **🔄 Real-time**: Atualizações instantâneas via WebSocket
- **🌙 Tema Dark**: Interface cyberpunk completa

### 🔄 **Em Desenvolvimento**
- **📱 App Mobile**: React Native (Android/iOS)
- **💻 App Desktop**: Electron (Windows/Mac/Linux)
- **🤖 IA Avançada**: Machine Learning para previsões
- **🔗 Open Banking**: Integração com APIs bancárias
- **📊 Analytics**: Métricas avançadas de uso
- **🔔 Notificações**: Push notifications

## 🛠️ Scripts Disponíveis

### Desenvolvimento
```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Iniciar com IA
npm run dev:ai

# Iniciar em modo silencioso
npm run dev:silent
```

### Banco de Dados
```bash
# Executar migrações
npm run db:migrate

# Visualizar banco (Prisma Studio)
npm run db:studio

# Resetar banco
npm run db:reset
```

### Testes
```bash
# Executar todos os testes
npm run test

# Testar importação/exportação
npm run test:import

# Testar sistema completo
npm run test:system
```

## 🔧 Configuração

1. **Clone o repositório**
```bash
git clone [url-do-repositorio]
cd Gerenciador_Financeiro-5.0
```

2. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

3. **Instale as dependências**
```bash
npm run install:all
```

4. **Configure o banco de dados**
```bash
npm run db:setup
```

5. **Inicie o desenvolvimento**
```bash
npm run dev
```

## 🐳 Docker

Para executar com Docker:

```bash
# Iniciar todos os serviços
docker-compose up -d

# Iniciar com IA
docker-compose -f docker-compose.yml -f docker-compose.ia.yml up -d

# Parar serviços
docker-compose down
```

## 🤝 Contribuindo

Consulte o arquivo [CONTRIBUTING.md](./docs/CONTRIBUTING.md) para detalhes sobre como contribuir com o projeto.

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.

## 🆘 Suporte

- 📖 [Documentação Completa](./docs/)
- 🐛 [Reportar Bug](./issues)
- 💡 [Solicitar Feature](./issues)
- 💬 [Discussões](./discussions)
