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
│   │   ├── components/           # Componentes reutilizáveis
│   │   ├── pages/                # Páginas principais
│   │   ├── hooks/                # Hooks customizados  
│   │   ├── stores/               # Estado global (Zustand)
│   │   ├── types/                # Tipos TypeScript
│   │   ├── utils/                # Utilitários
│   │   └── styles/               # Estilos globais
│   └── public/                   # Assets estáticos
├── 🖥️ server/                    # Backend Node.js
│   ├── src/
│   │   ├── modules/              # Módulos por domínio
│   │   ├── middleware/           # Middlewares customizados
│   │   ├── config/               # Configurações
│   │   ├── utils/                # Utilitários do servidor
│   │   └── types/                # Tipos do backend
│   └── prisma/                   # Schema e migrações
├── 🤖 ia/                        # Módulo de inteligência artificial
│   ├── src/                      # Código fonte IA
│   ├── models/                   # Modelos treinados
│   ├── datasets/                 # Datasets de treino
│   └── notebooks/                # Jupyter notebooks
├── 🐳 docker/                     # Configurações Docker
├── 📚 docs/                       # Documentação
├── ⚙️ configs/                    # Arquivos de configuração
├── 🔧 scripts/                    # Scripts de automação
└── 📦 archive/                    # Arquivos antigos/backup
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
cd Gerenciador_Financeiro-5.0
```

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

---

<div align="center">

**⚡ Will Finance 5.0 - O futuro do gerenciamento financeiro ⚡**

[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/William-kelvem94/Gerenciador_Financeiro-5.0)

</div>
