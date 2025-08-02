# Instruções para GitHub Copilot - Will Finance 5.0

<!-- Use this file to provide workspace-specific custom instructions to Copilot. Para mais detalhes, visite https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Visão Geral do Projeto

Este é o **Will Finance 5.0**, um sistema completo e profissional de gerenciamento financeiro com:
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript + Prisma ORM
- **IA**: Processamento inteligente de extratos bancários
- **DevOps**: Docker + GitHub Actions + Segurança robusta

## Estrutura Modular Organizada

### Frontend (`client/`)
```
client/src/
├── components/        # Organizados por funcionalidade (auth, dashboard, ui)
├── pages/            # DashboardPage, TransactionsPage, BudgetsPage, etc.
├── hooks/            # Hooks customizados
├── contexts/         # Contextos React
├── stores/           # Estado global
├── types/            # Tipos TypeScript
└── utils/            # Utilitários
```

### Backend (`server/`)
```
server/src/
├── modules/          # Módulos por domínio
│   ├── auth/         # controllers, services, dtos, strategies
│   ├── transactions/ # Gestão de transações
│   ├── budgets/      # Gestão de orçamentos
│   └── reports/      # Relatórios e analytics
├── shared/           # Código compartilhado (decorators, filters, pipes)
├── config/           # Configurações globais
└── middleware/       # Middlewares customizados
```

### Configurações Centralizadas (`configs/`)
- `server.env` - Configurações do backend
- `client.env` - Configurações do frontend
- `.env` - Variáveis principais

## Convenções e Padrões

### Naming
- **Arquivos/Funções**: camelCase
- **Componentes/Types**: PascalCase
- **Constantes**: UPPER_SNAKE_CASE
- **Diretórios**: kebab-case ou camelCase

### Estrutura de Módulos Backend
Cada módulo deve ter: `controllers/`, `services/`, `dtos/`, e opcionalmente `strategies/`

### Componentes React
Organizar por funcionalidade, não por tipo de arquivo

## Tecnologias Principais

- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** + **React Query** + **React Hook Form**
- **Express** + **Prisma** + **JWT**
- **Docker** + **GitHub Actions**

## Guidelines de Desenvolvimento

1. **Sempre seguir a estrutura modular**
2. **TypeScript obrigatório em todo código**
3. **Validação rigorosa de entrada**
4. **Tratamento de erros consistente**
5. **Testes para novas funcionalidades**
6. **Documentação para funções complexas**
7. **Segurança em primeiro lugar**
