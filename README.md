# 🚀 Will Finance - Gerenciador Financeiro 5.0

Sistema de gerenciamento financeiro completo com interface cyberpunk, usando React + TypeScript + Vite no frontend e Node.js + Express + Prisma no backend.

## 🎯 Características

- **Interface Cyberpunk**: Design futurista com cores neon e tema dark
- **Frontend Moderno**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend Robusto**: Node.js + Express + Prisma + SQLite/PostgreSQL
- **Real-time**: WebSocket para atualizações em tempo real
- **PWA Ready**: Progressive Web App com suporte offline
- **Multiplataforma**: Pronto para Electron e React Native

## 🚀 Inicialização Rápida

```bash
# Instalar dependências
npm run install:all

# Configurar banco de dados
npm run db:migrate
npm run db:seed

# Iniciar desenvolvimento
npm run dev
```

## 📁 Estrutura Organizada do Projeto

```
Will Finance/
├── 📱 client/              # Frontend React + TypeScript
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── contexts/      # Contextos React
│   │   ├── hooks/         # Hooks customizados
│   │   ├── types/         # Definições TypeScript
│   │   └── utils/         # Utilitários
│   ├── public/            # Arquivos estáticos
│   └── package.json
│
├── 🖥️ server/              # Backend Node.js + Express
│   ├── src/
│   │   ├── controllers/   # Controladores da API
│   │   ├── routes/        # Rotas da API
│   │   ├── middleware/    # Middlewares
│   │   ├── services/      # Lógica de negócio
│   │   └── utils/         # Utilitários do servidor
│   ├── prisma/            # Schema e migrações do banco
│   └── package.json
│
├── 🗄️ database/            # Configurações do banco
├── 🤖 IA/                  # Módulo de Inteligência Artificial
├── 📄 docs/                # Documentação
│   ├── README.md          # Documentação principal
│   ├── DEVELOPMENT.md     # Guia de desenvolvimento
│   ├── CONTRIBUTING.md    # Guia de contribuição
│   └── *.md              # Outras documentações
│
├── 🔧 scripts/             # Scripts utilitários
│   ├── development/       # Scripts de desenvolvimento
│   │   ├── *.ps1         # Scripts PowerShell
│   │   ├── *.bat         # Scripts Windows
│   │   └── *.sh          # Scripts Unix/Linux
│   └── testing/           # Scripts de teste
│       ├── test-*.js     # Testes automatizados
│       └── clean*.js     # Scripts de limpeza
│
├── 📊 data/                # Dados de exemplo e assets
│   ├── *.csv             # Extratos de exemplo
│   ├── *.png             # Imagens
│   └── samples/          # Dados de exemplo
│
├── 📦 EXTRATO/             # Extratos importados
├── 🗃️ backup_old_files/    # Backup de arquivos antigos
├── 🐳 docker-compose.yml   # Configuração Docker
└── 📋 package.json         # Dependências raiz
```

## 🌐 URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **Prisma Studio**: http://localhost:5555
- **Banco de Dados**: SQLite local

## 📊 Funcionalidades

- ✅ Dashboard em tempo real
- ✅ Gerenciamento de transações
- ✅ Orçamentos e metas
- ✅ Relatórios avançados
- ✅ IA integrada para insights
- ✅ Notificações push
- ✅ **Sistema de Importação/Exportação**
  - 🏦 Suporte a 10+ bancos brasileiros
  - 📄 Múltiplos formatos (CSV, TXT, PDF*, XLSX*, OFX*)
  - 📤 Exportação em JSON/CSV
- ✅ Export de dados

> *Em desenvolvimento

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
