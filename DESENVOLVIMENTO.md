# 🚀 Guia de Desenvolvimento Local - Gerenciador Financeiro 4.0

## 🎯 Configuração Rápida

### Opção 1: Script Automático (Recomendado)
```bash
# Windows
.\start-dev.bat

# PowerShell
.\setup-local.ps1
```

### Opção 2: Manual

#### 1. **Pré-requisitos**
- ✅ **Node.js 18+** (https://nodejs.org/)
- ✅ **PostgreSQL 12+** (https://www.postgresql.org/)
- ✅ **Git** (opcional)

#### 2. **Configuração do Banco de Dados**
```sql
-- Conectar como postgres
CREATE DATABASE financeiro;
CREATE USER financeiro WITH PASSWORD 'financeiro';
GRANT ALL PRIVILEGES ON DATABASE financeiro TO financeiro;
```

#### 3. **Instalar Dependências**
```bash
# Raiz do projeto
npm install

# Backend
cd backend
npm install

# Frontend  
cd ../frontend
npm install
```

#### 4. **Iniciar Desenvolvimento**
```bash
# Tudo junto (recomendado)
npm run dev:all

# Ou separadamente:
npm run dev:backend   # Backend na porta 3000
npm run dev:frontend  # Frontend na porta 4000
```

## 🌐 URLs de Desenvolvimento

| Serviço | URL | Descrição |
|---------|-----|-----------|
| **Frontend** | http://localhost:4000 | Interface do usuário |
| **Backend** | http://localhost:3000 | API REST |
| **Dashboard** | http://localhost:3000/dashboard | Dados do dashboard |
| **Transações** | http://localhost:3000/transactions | CRUD de transações |
| **IA Chat** | http://localhost:3000/ia-chat | Endpoint da IA |
| **Banco** | localhost:5432 | PostgreSQL |

## 📁 Estrutura de Desenvolvimento

```
Gerenciador_Financeiro-4.0/
├── 🚀 start-dev.bat           # Inicialização rápida
├── ⚙️ setup-local.ps1         # Configuração automática
├── 📋 .env.example            # Variáveis de ambiente
├── backend/                   # 🔧 API NestJS
│   ├── src/
│   │   ├── main.ts           # Entry point (porta 3000)
│   │   ├── app.module.ts     # Configuração principal
│   │   ├── transaction/      # CRUD transações
│   │   └── dashboard.controller.ts
│   └── package.json
├── frontend/                  # 🎨 React + Vite
│   ├── src/
│   │   ├── config/api.ts     # Configuração da API
│   │   ├── App.tsx           # Componente principal  
│   │   └── pages/            # Páginas da aplicação
│   └── package.json
└── IA/                        # 🤖 Módulo de IA
    ├── src/
    └── models/
```

## 🛠️ Scripts Disponíveis

### Raiz do Projeto
```bash
npm run dev:all       # Inicia tudo junto
npm run dev:backend   # Apenas backend
npm run dev:frontend  # Apenas frontend
npm run build         # Build de produção
npm run test          # Executa todos os testes
```

### Backend (NestJS)
```bash
npm run start:dev     # Desenvolvimento com hot-reload
npm run build         # Build para produção
npm run test          # Testes unitários
npm run test:cov      # Cobertura de testes
```

### Frontend (React + Vite)
```bash
npm run dev           # Desenvolvimento (porta 4000)
npm run build         # Build para produção
npm run test          # Testes com Vitest
npm run lint          # Verificação de código
```

## 🗄️ Banco de Dados

### Configuração Local
- **Host:** localhost
- **Porta:** 5432
- **Banco:** financeiro
- **Usuário:** financeiro
- **Senha:** financeiro

### Entidades
- ✅ **Transaction** - Transações financeiras
- 🔄 **User** - Usuários (em desenvolvimento)

## 🔧 Troubleshooting

### Problemas Comuns

#### ❌ "Porta já em uso"
```bash
# Windows - Matar processos nas portas
netstat -ano | findstr :3000
taskkill /PID <PID_AQUI> /F

netstat -ano | findstr :4000  
taskkill /PID <PID_AQUI> /F
```

#### ❌ "Cannot connect to database"
1. Verificar se PostgreSQL está rodando
2. Criar banco e usuário conforme documentação
3. Verificar credenciais no `.env`

#### ❌ "Module not found"
```bash
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install

# Ou no Windows
rmdir /s node_modules
del package-lock.json
npm install
```

## 🚢 Migração para Docker

Quando estiver 100% funcionando localmente:

```bash
# Parar desenvolvimento local
Ctrl+C

# Subir com Docker
npm run docker:up

# URLs Docker:
# Frontend: http://localhost:4000
# Backend: http://localhost:3001  
```

## 🧪 Testes

```bash
# Todos os testes
npm test

# Apenas backend
cd backend && npm test

# Apenas frontend
cd frontend && npm test

# Com cobertura
npm run test:cov
```

## 📊 Funcionalidades Implementadas

### ✅ Dashboard
- Gráficos de barras por categoria
- Gráfico de pizza por tipo
- Gráfico de linha temporal
- Gráfico de dispersão

### ✅ Transações
- CRUD completo
- Categorização
- Filtros e busca

### 🔄 Em Desenvolvimento
- Sistema de usuários
- Relatórios avançados
- Integração com IA
- Exportação de dados

---

💡 **Dica:** Use `npm run dev:all` para desenvolvimento completo ou execute os serviços separadamente conforme necessário.
