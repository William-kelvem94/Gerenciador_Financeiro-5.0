# 🚀 **WILL FINANCE 5.0** 
*Sistema de Gestão Financeira Cyberpunk - Versão Nativa Otimizada*

<div align="center">

![Will Finance 5.0](https://img.shields.io/badge/Will%20Finance-5.0-00ffff?style=for-the-badge&logo=react)
![Native](https://img.shields.io/badge/Docker-FREE-green?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen?style=for-the-badge)
![Memory](https://img.shields.io/badge/Memory-Optimized-blue?style=for-the-badge)

**Sistema completo de gestão financeira com interface cyberpunk,**  
**IA integrada e performance otimizada para desenvolvimento nativo.**

[🚀 Quick Start](#-quick-start) • [📚 Documentação](#-documentação) • [🎨 Features](#-features) • [🔧 Configuração](#-configuração)

</div>

---

## 🎯 **VISÃO GERAL**

O **Will Finance 5.0** é um sistema completo de gestão financeira pessoal com:

- 🌐 **Frontend React + TypeScript + Vite** (SPA otimizada)
- 🛡️ **Backend NestJS** (API REST robusta)  
- 🤖 **Serviço de IA Python FastAPI** (ML integrado)
- 🗄️ **SQLite/PostgreSQL** (Flexível para dev/prod)
- 🎨 **Interface Cyberpunk** (8 temas incluindo dark mode)
- 📱 **PWA Ready** (Instalável como app)
- ⚡ **Zero Docker** (Performance nativa otimizada)

---

## 🚀 **QUICK START**

### **Setup em 30 segundos:**

```bash
# 1. Clone e configure
git clone https://github.com/seu-usuario/will-finance-5.0.git
cd will-finance-5.0

# 2. Setup automático
./setup.sh

# 3. Iniciar tudo
./start.sh
```

### **Acesse o sistema:**
- 🌐 **App Principal:** http://localhost:5173
- 📚 **API Docs:** http://localhost:8080/api/docs  
- 🗃️ **Database:** http://localhost:5555

### **Login de teste:**
- **Email:** `demo@willfinance.com`
- **Senha:** `demo123`

---

## 🎨 **FEATURES IMPLEMENTADAS**

### 💰 **Gestão Financeira Completa**
- ✅ **Transações** - Receitas, despesas, transferências
- ✅ **Categorização Automática** - IA classifica gastos
- ✅ **Múltiplas Contas** - Checking, savings, investimentos
- ✅ **Orçamentos Inteligentes** - Metas e acompanhamento
- ✅ **Fluxo de Caixa** - Projeções e análises

### 📊 **Dashboard e Relatórios**
- ✅ **Dashboard Interativo** - Gráficos em tempo real
- ✅ **Análises Avançadas** - Tendências e insights
- ✅ **Relatórios PDF** - Exportação profissional
- ✅ **Comparativos** - Mês a mês, categoria a categoria

### 🤖 **Inteligência Artificial**
- ✅ **Classificação Automática** - Categoriza transações
- ✅ **Sugestões de Economia** - Insights personalizados
- ✅ **Previsão de Gastos** - Machine Learning
- ✅ **OCR de Documentos** - Extração de dados de PDFs

### 📥 **Importação de Dados**
- ✅ **10+ Bancos Brasileiros** - Bradesco, Nubank, Itaú, etc.
- ✅ **Múltiplos Formatos** - CSV, TXT, PDF, XLSX
- ✅ **Detecção Automática** - Reconhece formato do banco
- ✅ **Anti-Duplicatas** - Validação inteligente

### 🎨 **Interface Cyberpunk**
- ✅ **8 Temas** - Light, Dark, Cyberpunk, Neon, Matrix
- ✅ **Efeitos Visuais** - Glassmorphism, animações
- ✅ **Totalmente Responsivo** - Mobile-first design
- ✅ **PWA** - Instalável como aplicativo

### 🔐 **Segurança Avançada**
- ✅ **JWT Authentication** - Tokens seguros
- ✅ **Google OAuth** - Login social
- ✅ **Criptografia bcrypt** - Senhas protegidas
- ✅ **Rate Limiting** - Proteção contra ataques
- ✅ **CORS e Helmet** - Headers de segurança

---

## 🏗️ **ARQUITETURA**

```
Will Finance 5.0/
├── 📱 client/               # React + Vite Frontend
│   ├── src/
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── stores/         # Zustand state management
│   │   ├── styles/         # CSS otimizado
│   │   └── types/          # TypeScript definitions
│   └── public/             # PWA assets
│
├── 🛡️ server/               # NestJS Backend API
│   ├── src/
│   │   ├── auth/           # Autenticação JWT/OAuth
│   │   ├── modules/        # Módulos funcionais
│   │   └── middleware/     # Middlewares customizados
│   └── prisma/             # Database schema
│
├── 🤖 IA/                  # FastAPI ML Service
│   ├── api/                # REST endpoints
│   ├── models/             # Modelos treinados
│   └── services/           # Lógica de ML
│
└── 📜 scripts/             # Automação
    ├── setup.sh            # Configuração inicial
    ├── start.sh            # Iniciar serviços
    ├── health.sh           # Health check
    └── clean.sh            # Limpeza otimizada
```

---

## 🔧 **COMANDOS DISPONÍVEIS**

| Comando | Descrição |
|---------|-----------|
| `./setup.sh` | Configuração inicial completa |
| `./start.sh` | Iniciar todos os serviços |
| `./health.sh` | Verificar saúde do sistema |
| `./clean.sh` | Limpeza de cache/dependências |
| `npm run dev:client` | Apenas frontend |
| `npm run dev:server` | Apenas backend |
| `npm run dev:ai` | Apenas serviço IA |
| `npm run test` | Executar todos os testes |

---

## 🌐 **URLS DO SISTEMA**

| Serviço | URL | Descrição |
|---------|-----|-----------|
| **Frontend** | http://localhost:5173 | Interface principal |
| **Backend** | http://localhost:8080 | API REST |
| **API Docs** | http://localhost:8080/api/docs | Swagger UI |
| **Database** | http://localhost:5555 | Prisma Studio |
| **IA Service** | http://localhost:8001 | Endpoints ML |

---

## 🧪 **TESTES**

### **Executar testes:**
```bash
# Todos os testes
npm run test

# Específicos
npm run test:client     # Frontend
npm run test:server     # Backend  
npm run test:e2e        # End-to-end
npm run test:coverage   # Cobertura
```

### **Health check:**
```bash
./health.sh  # Verificação completa do sistema
```

---

## 📱 **PWA (Progressive Web App)**

O sistema é uma PWA completa com:

- ✅ **Offline Support** - Funciona sem internet
- ✅ **Instalável** - Add to Home Screen
- ✅ **Service Workers** - Cache inteligente
- ✅ **Push Notifications** - Notificações nativas

---

## 🚀 **DEPLOY PARA PRODUÇÃO**

### **1. Build:**
```bash
npm run build  # Build otimizado
npm run preview  # Testar build local
```

### **2. Configurar PostgreSQL:**
```bash
# Alterar .env
DATABASE_URL="postgresql://user:pass@host:5432/db"

# Migrar dados
npm run db:migrate
```

### **3. Deploy (exemplo com PM2):**
```bash
npm install -g pm2
pm2 start server/dist/main.js --name will-finance
pm2 startup
pm2 save
```

---

## 🎨 **TEMAS DISPONÍVEIS**

- 🌅 **Light** - Modo claro profissional
- 🌙 **Dark** - Modo escuro elegante
- 🌈 **Cyberpunk** - Neon e cores vibrantes
- 💫 **Neon** - Efeitos luminosos
- 🔮 **Matrix** - Verde terminal
- 🎭 **Glassmorphism** - Transparências modernas
- 🌊 **Ocean** - Azuis profundos
- 🔥 **Fire** - Tons quentes

---

## 🛠️ **STACK TECNOLÓGICO**

### **Frontend:**
- ⚛️ **React 18** - Componentes modernos
- 🔷 **TypeScript** - Tipagem estática
- ⚡ **Vite** - Build tool ultrarrápido
- 🎨 **Tailwind CSS** - Styling utilitário
- 📊 **Recharts** - Gráficos interativos
- 🗃️ **Zustand** - State management

### **Backend:**
- 🛡️ **NestJS** - Framework enterprise
- 🗄️ **Prisma ORM** - Database abstraction
- 🔐 **JWT** - Autenticação segura
- 🌐 **Swagger** - Documentação automática
- 🛡️ **Helmet** - Security headers

### **IA/ML:**
- 🐍 **Python 3.11+**
- ⚡ **FastAPI** - API moderna
- 🤖 **scikit-learn** - Machine Learning
- 📄 **PyPDF2** - Processamento PDF
- 🔤 **TfidfVectorizer** - NLP

### **Database:**
- 🗃️ **SQLite** - Desenvolvimento
- 🐘 **PostgreSQL** - Produção
- 🔄 **Prisma** - ORM type-safe

---

## 🏆 **PERFORMANCE**

### **Sem Docker:**
- ⚡ **Startup:** < 10 segundos
- 💾 **Memória:** ~500MB total
- 🚀 **Build:** < 30 segundos
- 📱 **Lighthouse:** 95+ score

### **Vs Docker:**
- 📉 **-60% memória**
- ⚡ **+300% startup speed**
- 🎯 **Zero overhead**
- 🔧 **Easier debugging**

---

## 🐛 **TROUBLESHOOTING**

### **Porta em uso:**
```bash
lsof -ti:5173 | xargs kill -9  # Frontend
lsof -ti:8080 | xargs kill -9  # Backend
lsof -ti:8001 | xargs kill -9  # IA
```

### **Reset completo:**
```bash
./clean.sh extreme  # Remove tudo
./setup.sh          # Reconfigurar
```

### **Problemas com dependências:**
```bash
./clean.sh deep     # Limpar node_modules
npm run install:all # Reinstalar tudo
```

---

## 📚 **DOCUMENTAÇÃO**

- 📖 **[Guia Definitivo](./GUIA_DEFINITIVO.md)** - Setup completo
- 🏗️ **[Arquitetura](./docs/ARQUITETURA_SERVICOS.md)** - Estrutura técnica
- 🔧 **[Development](./docs/DEVELOPMENT.md)** - Guia de desenvolvimento
- 🚀 **[Quick Start](./docs/QUICK_START.md)** - Início rápido

---

## 📊 **STATUS DO PROJETO**

| Módulo | Status | Cobertura | Descrição |
|--------|---------|-----------|-----------|
| 🌐 Frontend | ✅ Completo | 85% | Interface responsiva |
| 🛡️ Backend | ✅ Completo | 90% | API REST robusta |
| 🤖 IA Service | ✅ Funcional | 70% | ML integrado |
| 📱 PWA | ✅ Completo | 80% | App instalável |
| 🧪 Testes | ⚠️ Parcial | 75% | Em melhoria |
| 📚 Docs | ✅ Completo | 95% | Bem documentado |

---

## 🤝 **CONTRIBUIÇÃO**

1. **Fork** o projeto
2. **Clone** sua fork
3. **Crie** uma branch: `git checkout -b feature/nova-funcionalidade`
4. **Commit** suas mudanças: `git commit -m 'feat: nova funcionalidade'`
5. **Push** para a branch: `git push origin feature/nova-funcionalidade`
6. **Abra** um Pull Request

---

## 📄 **LICENÇA**

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.

---

<div align="center">

**⭐ Se este projeto te ajudou, deixe uma estrela!**

**🚀 Will Finance 5.0 - Gestão Financeira do Futuro**

*Feito com ❤️ e muitas ⚡ horas de código*

</div>
