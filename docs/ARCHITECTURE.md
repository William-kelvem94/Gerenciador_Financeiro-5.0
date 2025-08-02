# 🏗️ Will Finance 5.0 - Arquitetura de Serviços

## 📋 Visão Geral

O Will Finance 5.0 é um sistema de gerenciamento financeiro moderno construído com arquitetura de microserviços dockerizada.

## 🔧 Componentes Principais

### 🎯 Frontend (Client)
- **Framework**: React 18 + TypeScript + Vite
- **UI**: TailwindCSS + Framer Motion
- **Estado**: Zustand + React Query
- **Formulários**: React Hook Form + Zod
- **Porta**: 5173 (dev) / 80 (prod)

### ⚙️ Backend (Server)
- **Framework**: Express.js + TypeScript
- **Banco**: PostgreSQL + Prisma ORM
- **Cache**: Redis
- **Autenticação**: JWT + BCrypt
- **Validação**: Zod
- **Porta**: 8080

### 🤖 IA (Serviço)
- **Framework**: Python FastAPI
- **ML**: TensorFlow + Scikit-learn
- **Modelo**: finance_predictor_v6.h5
- **Porta**: 8001

### 🗄️ Banco de Dados
- **PostgreSQL 15**: Dados principais
- **Redis 7**: Cache e sessões

## 🐳 Containerização

```yaml
# Serviços Docker
- app (Backend)
- ia (Serviço de IA)
- postgres (Banco principal)
- redis (Cache)
```

## 📂 Estrutura de Diretórios

```
will-finance-5.0/
├── 📱 client/                    # Frontend React
│   ├── src/
│   │   ├── components/          # Componentes React
│   │   ├── pages/               # Páginas da aplicação
│   │   ├── stores/              # Estados Zustand
│   │   └── utils/               # Utilitários
│   └── public/assets/           # Assets públicos
├── 🔧 server/                    # Backend Express
│   ├── src/
│   │   ├── routes/              # Rotas da API
│   │   ├── services/            # Lógica de negócio
│   │   ├── modules/             # Módulos organizados
│   │   │   └── extrato/         # Exemplos de extrato
│   │   ├── utils/               # Utilitários
│   │   └── db/                  # Configuração do banco
│   └── prisma/                  # Schema e migrações
├── 🤖 IA/                        # Serviço de IA
│   ├── src/                     # Código Python
│   ├── models/                  # Modelos treinados
│   └── datasets/                # Dados de treinamento
├── 🗄️ database/                  # Scripts de banco
├── 📋 scripts/                   # Scripts de automação
└── 📚 docs/                      # Documentação
    ├── auth/                    # Documentação de autenticação
    └── *.md                     # Documentos diversos
```

## 🔒 Segurança

- **Autenticação**: JWT com refresh tokens
- **Autorização**: RBAC (Role-Based Access Control)
- **Criptografia**: BCrypt para senhas
- **Headers**: Helmet.js para segurança
- **Rate Limiting**: Express Rate Limit
- **CORS**: Configurado por ambiente

## 📊 Monitoramento

- **Logs**: Winston com rotação
- **Health Checks**: Endpoints de saúde
- **Métricas**: Performance e uptime
- **Alertas**: Sistema de notificação

## 🚀 Deploy

### Desenvolvimento
```bash
npm run dev:full
```

### Produção
```bash
docker-compose up -d
```

## 🔄 Fluxo de Dados

```
Client ←→ API Gateway ←→ Backend ←→ Database
                    ↓
                 IA Service
```

## 📈 Escalabilidade

- **Horizontal**: Load balancer + múltiplas instâncias
- **Vertical**: Otimização de recursos por container
- **Cache**: Redis para dados frequentes
- **CDN**: Assets estáticos otimizados

## 🔧 Configuração

Todas as configurações são feitas via variáveis de ambiente:
- `.env.template` - Template com todas as variáveis
- `.env.example` - Valores de exemplo
- `.env.production.example` - Configuração de produção
