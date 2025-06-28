# 🚀 Guia de Desenvolvimento - Will Finance 5.0

## 📋 Pré-requisitos

- **Node.js 18+** (https://nodejs.org/)
- **npm 8+** ou **pnpm** (recomendado)
- **Git** (opcional)

## 🎯 Configuração Rápida

### 1. **Comando Principal (Recomendado)**
```bash
# Instala tudo e inicia desenvolvimento
npm run install:all
npm run db:migrate
npm run db:seed
npm run dev
```

### 2. **Configuração Manual**
```bash
# 1. Instalar dependências
npm install

# 2. Frontend
cd client
npm install
cd ..

# 3. Backend
cd server
npm install

# 4. Configurar banco
npx prisma generate
npx prisma migrate dev
npx prisma db seed
cd ..

# 5. Iniciar desenvolvimento
npm run dev
```

## 🌐 URLs de Desenvolvimento

| Serviço | URL | Descrição |
|---------|-----|-----------|
| **Frontend** | http://localhost:5173 | Interface React + Vite |
| **Backend API** | http://localhost:3001 | API REST + WebSocket |
| **Prisma Studio** | http://localhost:5555 | Interface do banco |

## 📁 Estrutura Organizada

```
Will Finance 5.0/
├── client/                     # 🎨 Frontend (React + TypeScript)
│   ├── src/
│   │   ├── components/         # Componentes reutilizáveis
│   │   │   ├── Header.tsx      # Header cyberpunk
│   │   │   ├── Sidebar.tsx     # Navegação lateral
│   │   │   └── ui/             # Componentes de UI base
│   │   ├── pages/              # Páginas da aplicação
│   │   │   ├── DashboardPage.tsx    # Dashboard principal
│   │   │   ├── TransactionsPage.tsx # Gestão de transações
│   │   │   ├── BudgetsPage.tsx      # Orçamentos
│   │   │   ├── GoalsPage.tsx        # Metas financeiras
│   │   │   └── ReportsPage.tsx      # Relatórios
│   │   ├── hooks/              # Custom hooks
│   │   │   ├── useApi.ts       # Hook para API
│   │   │   └── useAuth.ts      # Hook de autenticação
│   │   ├── services/           # Serviços
│   │   │   ├── api.ts          # Cliente HTTP
│   │   │   └── websocket.ts    # WebSocket client
│   │   ├── stores/             # Zustand stores
│   │   ├── utils/              # Utilitários
│   │   └── types/              # Tipos TypeScript
│   ├── public/                 # Assets públicos
│   ├── tailwind.config.js      # Config Tailwind
│   ├── vite.config.ts          # Config Vite
│   └── package.json            # Dependências client
│
├── server/                     # 🔧 Backend (Node.js + Express)
│   ├── src/
│   │   ├── routes/             # Rotas da API
│   │   │   ├── auth.ts         # Autenticação
│   │   │   ├── transactions.ts # CRUD transações
│   │   │   ├── accounts.ts     # Contas
│   │   │   ├── budgets.ts      # Orçamentos
│   │   │   ├── goals.ts        # Metas
│   │   │   ├── analytics.ts    # Relatórios
│   │   │   └── ai.ts           # IA endpoints
│   │   ├── middleware/         # Middlewares
│   │   │   ├── auth.ts         # Middleware auth
│   │   │   ├── validate.ts     # Validação Zod
│   │   │   └── cors.ts         # CORS config
│   │   ├── config/             # Configurações
│   │   │   ├── database.ts     # Config Prisma
│   │   │   └── env.ts          # Variáveis ambiente
│   │   ├── services/           # Serviços de negócio
│   │   ├── utils/              # Utilitários
│   │   └── index.ts            # Entry point
│   ├── prisma/                 # Prisma ORM
│   │   ├── schema.prisma       # Schema do banco
│   │   ├── migrations/         # Migrações
│   │   └── seed.ts             # Dados iniciais
│   ├── uploads/                # Arquivos upload
│   └── package.json            # Dependências server
│
├── database/                   # 🗄️ Banco de dados
│   └── dev.db                  # SQLite desenvolvimento
│
├── backup_old_files/           # 📦 Backup arquivos antigos
│   ├── frontend/               # Frontend antigo
│   ├── backend/                # Backend antigo
│   └── WILL-FINANCE/           # Estrutura original
│
├── docker-compose.yml          # 🐳 Docker config
├── .env.example                # 📝 Variáveis exemplo
├── package.json                # 📦 Scripts principais
└── README.md                   # 📚 Documentação
```

## 🛠️ Scripts Disponíveis

### **Desenvolvimento**
```bash
npm run dev              # Inicia client + server
npm run dev:client       # Apenas frontend (porta 5173)
npm run dev:server       # Apenas backend (porta 3001)
```

### **Banco de Dados**
```bash
npm run db:migrate       # Aplicar migrações
npm run db:seed          # Popular com dados teste
npm run db:generate      # Gerar cliente Prisma
npm run db:studio        # Interface visual (porta 5555)
```

### **Build & Deploy**
```bash
npm run build            # Build completo
npm run build:client     # Build apenas frontend
npm run build:server     # Build apenas backend
npm run start            # Iniciar produção
```

### **Utilitários**
```bash
npm run install:all      # Instalar todas dependências
npm run lint             # Verificar código
npm run test             # Executar testes
npm run clean            # Limpar node_modules
npm run reset            # Reset completo
```

## 🎨 Tema Cyberpunk

### **Cores Principais**
```css
/* Primárias */
--cyan: #00FFFF
--magenta: #FF00FF
--neon-green: #39FF14
--gold: #FFD700

/* Backgrounds */
--deep-black: #0A0A0A
--dark-surface: #1A1A1A
--border: #333333

/* Text */
--text-primary: #FFFFFF
--text-secondary: #CCCCCC
--text-muted: #888888
```

### **Componentes UI**
- **Glass Morphism**: Transparência + blur
- **Neon Effects**: Box-shadow com cores vibrantes
- **Gradients**: Degradês cyberpunk
- **Animations**: Framer Motion suaves

## 🔧 Configurações Específicas

### **Frontend (Vite + React)**
```json
// vite.config.ts
{
  "server": {
    "port": 5173,
    "proxy": {
      "/api": "http://localhost:3001"
    }
  }
}
```

### **Backend (Express + Prisma)**
```typescript
// .env
DATABASE_URL="file:../database/dev.db"
JWT_SECRET="seu-jwt-secret"
PORT=3001
NODE_ENV="development"
```

### **Banco (SQLite → PostgreSQL)**
```prisma
// Para produção, altere em schema.prisma:
datasource db {
  provider = "postgresql"  // ao invés de "sqlite"
  url      = env("DATABASE_URL")
}
```

## 📊 Funcionalidades Principais

### ✅ **Implementadas**
- **Dashboard**: Cards com métricas + gráficos
- **Transações**: CRUD completo com filtros
- **Contas**: Múltiplas contas bancárias
- **Categorias**: Sistema dinâmico
- **Orçamentos**: Tracking em tempo real
- **Metas**: Objetivos financeiros
- **Relatórios**: Análises detalhadas
- **IA Chat**: Assistente financeiro
- **Notificações**: Alertas personalizados
- **PWA**: Funciona offline

### 🔄 **Em Desenvolvimento**
- Integração Open Banking
- OCR para comprovantes
- Machine Learning
- Apps mobile/desktop

## 🚨 Resolução de Problemas

### **Porta em uso**
```bash
# Matar processo na porta
npx kill-port 3001
npx kill-port 5173
```

### **Erro de dependências**
```bash
# Reset completo
npm run clean
npm run install:all
```

### **Erro no banco**
```bash
# Reset do banco
cd server
npx prisma migrate reset
npx prisma db seed
```

### **Build falha**
```bash
# Verificar versões
node --version  # >= 18
npm --version   # >= 8

# Limpar cache
npm cache clean --force
```

## 🐳 Docker (Opcional)

```bash
# Subir ambiente completo
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar tudo
docker-compose down
```

## 📱 PWA (Progressive Web App)

O app funciona como aplicativo nativo:
- **Instalável** via navegador
- **Offline** com Service Worker
- **Push Notifications**
- **App Shell** cached

## 🎯 Próximos Passos

1. **Configurar ambiente** seguindo este guia
2. **Testar funcionalidades** existentes
3. **Personalizar** tema e componentes
4. **Adicionar** novas features
5. **Deploy** para produção

---

**Agora está tudo organizado e funcionando! 🚀**

A interface cyberpunk que você viu está preservada e todas as duplicatas foram removidas.
