# 🚀 GUIA DEFINITIVO - WILL FINANCE 5.0
*Sistema de Gestão Financeira Cyberpunk - Versão Nativa (Sem Docker)*

## 📋 **PRÉ-REQUISITOS**

### **Obrigatórios**
- ✅ **Node.js 18+** (https://nodejs.org/)
- ✅ **npm 8+** (incluído com Node.js)
- ✅ **Python 3.11+** (para módulo de IA)
- ✅ **Git** (https://git-scm.com/)

### **Opcionais (para produção)**
- 🐘 **PostgreSQL 15+** (substitui SQLite em produção)
- ⚡ **Redis** (cache avançado)

## ⚙️ **CONFIGURAÇÃO INICIAL**

### 1. **Clone e Setup**
```bash
# Clone o repositório
git clone https://github.com/seu-usuario/will-finance-5.0.git
cd will-finance-5.0

# Configuração de ambiente
cp .env.example .env
# Edite o .env com suas configurações
```

### 2. **Instalação de Dependências**
```bash
# Instalar todas as dependências (Node.js + Python)
npm run install:all

# OU instalar manualmente:
npm install                           # Root
npm install --workspace=client        # Frontend
npm install --workspace=server        # Backend
pip install -r IA/requirements.txt    # IA Service
```

### 3. **Configuração do Banco de Dados**
```bash
# Setup completo do banco (SQLite)
npm run db:setup

# OU passo a passo:
npm run db:generate  # Gerar cliente Prisma
npm run db:migrate   # Aplicar migrações
npm run db:seed      # Popular com dados demo
```

## 🚀 **EXECUÇÃO**

### **Comando Único (Tudo junto)**
```bash
npm run start:all
```

### **Execução Individual**
```bash
# Frontend (porta 5173)
npm run dev:client

# Backend (porta 8080)
npm run dev:server

# Serviço de IA (porta 8001)
npm run dev:ai
```

## 🌐 **URLs DO SISTEMA**

| Serviço | URL | Descrição |
|---------|-----|-----------|
| **Frontend** | http://localhost:5173 | Interface principal |
| **Backend API** | http://localhost:8080 | API REST |
| **Documentação** | http://localhost:8080/api/docs | Swagger UI |
| **Prisma Studio** | http://localhost:5555 | Visualizar dados |
| **IA Service** | http://localhost:8001 | Endpoints de IA |

## 👤 **CREDENCIAIS DE TESTE**

### **Usuário Demo**
- **Email:** `demo@willfinance.com`
- **Senha:** `demo123`

### **Admin**
- **Email:** `admin@willfinance.com`
- **Senha:** `admin123`

## 🏗️ **ARQUITETURA DO SISTEMA**

```
Will Finance 5.0/
├── 📱 client/                    # React + Vite Frontend
│   ├── src/
│   │   ├── components/           # Componentes React
│   │   ├── pages/               # Páginas da aplicação
│   │   ├── stores/              # Zustand stores
│   │   ├── styles/              # CSS otimizado
│   │   └── types/               # TypeScript types
│   └── public/                  # Assets PWA
│
├── 🛡️ server/                    # NestJS Backend
│   ├── src/                     # Código fonte
│   │   ├── auth/                # Autenticação JWT
│   │   ├── modules/             # Módulos funcionais
│   │   └── middleware/          # Middlewares
│   └── prisma/                  # Schema e migrations (SQLite)
│
├── 🤖 IA/                        # Serviço Python FastAPI
│   ├── api/                     # Endpoints REST
│   ├── models/                  # Modelos ML
│   ├── services/                # Lógica de negócio
│   └── datasets/                # Dados de treino
│
├── 📚 docs/                      # Documentação
├── 📜 scripts/                   # Scripts de automação
│   ├── development/             # Scripts de dev
│   ├── testing/                 # Scripts de teste
│   └── setup/                   # Scripts de configuração
└── 🗂️ data/                      # Dados de exemplo/teste
```

## ✨ **FUNCIONALIDADES IMPLEMENTADAS**

### 💰 **Gestão Financeira**
- ✅ **Transações** - Receitas, despesas, transferências
- ✅ **Categorização** - Sistema automático com IA
- ✅ **Orçamentos** - Criação e monitoramento
- ✅ **Metas** - Definição e acompanhamento
- ✅ **Contas Múltiplas** - Checking, savings, credit

### 📊 **Relatórios e Análises**
- ✅ **Dashboard Interativo** - Visão em tempo real
- ✅ **Gráficos Avançados** - Recharts
- ✅ **Fluxo de Caixa** - Projeções
- ✅ **Insights IA** - Sugestões personalizadas

### 🔐 **Segurança**
- ✅ **JWT Authentication** - Tokens seguros
- ✅ **Google OAuth** - Login social
- ✅ **Criptografia** - bcrypt + hash
- ✅ **Middleware** - Helmet, CORS, Rate limiting

### 🎨 **Interface Cyberpunk**
- ✅ **8 Temas** - Light, Dark, Cyberpunk, etc.
- ✅ **Efeitos Visuais** - Neon, glassmorphism
- ✅ **Responsivo** - Mobile-first
- ✅ **PWA** - Instalável como app

### 📥 **Importação de Dados**
- ✅ **Parser Bancário** - 10+ bancos brasileiros
- ✅ **Detecção Automática** - Bradesco, Nubank, etc.
- ✅ **Múltiplos Formatos** - CSV, TXT, PDF, XLSX
- ✅ **Validação** - Anti-duplicatas

## 🧠 **SERVIÇO DE IA**

### **Classificação Automática**
```python
# IA/services/classification_service.py
class TransactionClassifier:
    def __init__(self):
        self.vectorizer = TfidfVectorizer()
        self.model = RandomForestClassifier(n_estimators=100)
    
    def predict(self, description):
        X = self.vectorizer.transform([description])
        return self.model.predict(X)[0]
```

### **Endpoints de IA**
- `POST /classify/transaction` - Classificar transação
- `GET /suggestions/savings` - Sugestões de economia
- `POST /predict/expenses` - Previsão de gastos
- `POST /ocr/extract` - Extrair dados de PDFs

## 🧪 **TESTES**

### **Executar Testes**
```bash
# Todos os testes
npm run test

# Testes do frontend
npm run test:client

# Testes do backend
npm run test:server

# Testes E2E
npm run test:e2e

# Cobertura de testes
npm run test:coverage

# Teste completo do sistema
npm run test:system
```

### **Health Check**
```bash
# Verificar saúde dos serviços
npm run health
```

## 📱 **PWA (Progressive Web App)**

### **Configuração Avançada**
```javascript
// client/vite.config.ts
VitePWA({
  registerType: 'autoUpdate',
  workbox: {
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/api\.willfinance\.com\/.*/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'api-cache',
          expiration: { maxAgeSeconds: 60 * 60 * 24 }
        }
      }
    ]
  },
  manifest: {
    name: 'Will Finance 5.0',
    short_name: 'WillFinance',
    theme_color: '#00ffff',
    display: 'standalone'
  }
})
```

### **Recursos PWA**
- ✅ **Offline Support** - Cache inteligente
- ✅ **Instalável** - Add to Home Screen
- ✅ **Performance** - Service Workers
- ✅ **Notificações** - Push notifications

## 🚀 **DEPLOY PARA PRODUÇÃO**

### **1. Build**
```bash
# Build completo
npm run build

# Testar build localmente
npm run preview
```

### **2. Configuração PostgreSQL (Produção)**
```bash
# Alterar .env para PostgreSQL
DATABASE_URL="postgresql://username:password@localhost:5432/will_finance_db"

# Migrar para PostgreSQL
npm run db:migrate
npm run db:seed
```

### **3. Deploy na AWS/Vercel/Netlify**
```bash
# Exemplo com PM2 (servidor próprio)
npm install -g pm2

# Start server em produção
pm2 start server/dist/main.js --name will-finance-api
pm2 startup
pm2 save
```

## 🔧 **UTILITÁRIOS**

### **Backup do Banco**
```bash
# Criar backup
npm run db:backup

# Restaurar backup
cp server/prisma/backup-YYYYMMDD-HHMMSS.db server/prisma/dev.db
```

### **Limpeza**
```bash
# Limpar node_modules
npm run clean

# Limpar cache
npm run clean:cache

# Reset completo
npm run reset
```

### **Logs**
```bash
# Ver logs do sistema
tail -f logs/app.log

# Logs específicos
grep "ERROR" logs/app.log
```

## 🐛 **TROUBLESHOOTING**

### **Erro: Porta em uso**
```bash
# Matar processo na porta
lsof -ti:5173 | xargs kill -9
lsof -ti:8080 | xargs kill -9
lsof -ti:8001 | xargs kill -9
```

### **Erro: Dependências**
```bash
# Reset completo
npm run clean
npm run install:all
```

### **Erro: Banco de dados**
```bash
# Reset do banco
npm run db:reset
```

### **Erro: Python/IA**
```bash
# Verificar Python
python --version  # >= 3.11

# Reinstalar dependências Python
pip install -r IA/requirements.txt --force-reinstall
```

## 🔒 **CONFIGURAÇÃO DE SEGURANÇA**

### **Variáveis Críticas (.env)**
```bash
# SEMPRE alterar em produção
JWT_SECRET=your-super-secret-jwt-key-256-bits-minimum
JWT_REFRESH_SECRET=your-super-secret-refresh-key-256-bits

# Google OAuth
GOOGLE_CLIENT_ID=your-real-google-client-id
GOOGLE_CLIENT_SECRET=your-real-google-client-secret

# Session
SESSION_SECRET=your-session-secret-change-in-production
```

### **CORS Produção**
```javascript
// server/src/main.ts
app.enableCors({
  origin: [
    'https://yourdomain.com',
    'https://www.yourdomain.com'
  ],
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
});
```

## 📈 **MONITORAMENTO**

### **Métricas Disponíveis**
- ✅ **Performance** - Tempo de resposta da API
- ✅ **Erros** - Log estruturado com Winston
- ✅ **Usuários** - Estatísticas de uso
- ✅ **Transações** - Volume e tipos

### **Health Endpoints**
```bash
# API Health
curl http://localhost:8080/health

# Database Health
curl http://localhost:8080/api/health/db

# IA Service Health
curl http://localhost:8001/health
```

## 📚 **DOCUMENTAÇÃO ADICIONAL**

- **API Documentation** - http://localhost:8080/api/docs
- **Prisma Schema** - server/prisma/schema.prisma
- **Frontend Components** - client/src/components/
- **IA Models** - IA/models/

## 🎯 **PRÓXIMOS PASSOS**

### **Roadmap de Funcionalidades**
- 🔄 **Real-time** - WebSockets para updates live
- 📱 **Mobile App** - React Native
- 🏦 **Open Banking** - Integração oficial bancos
- 🎙️ **Voice Assistant** - Comandos por voz
- 🤖 **Advanced AI** - Previsão de receitas

### **Otimizações**
- ⚡ **Performance** - Lazy loading, memoização
- 🧪 **Testes** - Aumentar cobertura para 90%+
- 🔐 **Security** - Implementar 2FA, audit logs
- 📊 **Analytics** - Dashboard de uso avançado

---

## 🏆 **SISTEMA 100% FUNCIONAL**

O **Will Finance 5.0** está completamente operacional com:
- ✅ **Zero dependências Docker**
- ✅ **Setup nativo simplificado**
- ✅ **SQLite para desenvolvimento**
- ✅ **PostgreSQL para produção**
- ✅ **PWA instalável**
- ✅ **IA integrada**
- ✅ **Interface cyberpunk moderna**
- ✅ **Testes automatizados**
- ✅ **Deploy pronto**

**Execute `npm run start:all` e comece a usar!** 🚀
