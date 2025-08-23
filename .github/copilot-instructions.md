🚀 Instruções Otimizadas para GitHub Copilot - Will Finance 5.0 PRORO
🎯 MISSÃO PRINCIPAL
Criar o melhor sistema financeiro do mundo com arquitetura enterprise, segurança militar e experiência cyberpunk premium.

🏆 Características Essenciais
⚡ Performance Extrema: React 18 + Vite + lazy loading

🎨 UI Cyberpunk: Framer Motion + Three.js + temas customizados

🔐 Segurança: Firebase Auth + JWT + 2FA + criptografia AES-256

📊 Analytics: Charts.js + D3.js + dashboards interativos

🤖 IA Integrada: OpenAI GPT + análise preditiva

🌐 Arquitetura: Microserviços + Redis + load balancer

🔄 Real-time: WebSockets + notificações push

📱 Multi-plataforma: PWA + Electron + mobile-first

🛠️ STACK TECNOLÓGICA RESUMIDA
🎨 Frontend (client/)
typescript
- React 18.2+ + TypeScript 5.0+ + Vite 5.0+
- Tailwind CSS 3.4+ + Framer Motion 11+
- TanStack Query v5 + Zustand 4+
- React Hook Form 7+ + Zod
- Firebase Auth + React Router v6
- Chart.js 4+ + D3.js
🖥️ Backend (server/)
typescript
- Node.js 20+ + Express 4.18+ + TypeScript 5.0+
- Prisma ORM 5+ + PostgreSQL 16+
- JWT + Redis 7+ + Socket.io
- Winston + Bull Queue + Nodemailer
- Zod + Swagger/OpenAPI
🔧 DevOps
yaml
- Docker + Kubernetes
- GitHub Actions + Nginx
- Prometheus + Grafana + Sentry
- ELK Stack + SSL/TLS
📁 ARQUITETURA ESSENCIAL
🎨 Frontend Structure (client/src/)
text
src/
├── components/           # Componentes reutilizáveis
│   ├── auth/            # Autenticação
│   ├── dashboard/       # Dashboard
│   ├── transactions/    # Transações
│   ├── ui/              # UI primitives
│   └── ai/              # IA Integration
├── pages/               # Páginas principais
├── hooks/               # Custom hooks
├── stores/              # Estado global (Zustand)
├── types/               # TypeScript types
└── utils/               # Utilitários
🖥️ Backend Structure (server/src/)
text
src/
├── modules/             # Módulos por domínio
│   ├── auth/           # Autenticação
│   ├── transactions/   # Transações
│   ├── budgets/        # Orçamentos
│   └── reports/        # Relatórios
├── shared/              # Código compartilhado
├── config/              # Configurações
├── middleware/          # Middlewares
└── prisma/              # Database schema
📋 CONVENÇÕES PRINCIPAIS
🔤 Nomenclatura
Arquivos/Funções: camelCase (getUserData, transactionService.ts)

Componentes/Classes: PascalCase (TransactionModal, UserService)

Tipos/Interfaces: PascalCase (Transaction, LoginData)

Constantes: UPPER_SNAKE_CASE (MAX_RETRIES, API_ENDPOINTS)

Diretórios: kebab-case (import-export/, user-profile/)

🎨 Estilos Cyberpunk (Resumo)
css
:root {
  --cyber-primary: #00FFFF;          /* Cyan neon */
  --cyber-secondary: #FF0080;        /* Pink neon */
  --background-primary: #0A0A0F;     /* Dark base */
  --foreground-primary: #FFFFFF;     /* Texto principal */
}

.glass {
  background: rgba(26, 26, 46, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid var(--border-primary);
}
🔧 GUIDELINES CRÍTICAS
1. 📝 TypeScript Obrigatório
typescript
// ✅ SEMPRE - Tipos específicos
interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
}

// ❌ NUNCA - any
function processData(data: any): any
2. 🛡️ Validação com Zod
typescript
const TransactionSchema = z.object({
  amount: z.number().positive(),
  type: z.enum(['income', 'expense'])
});
3. 🎯 Tratamento de Erros
typescript
try {
  // código
} catch (error) {
  if (error instanceof ValidationError) {
    // erro de validação
  }
  // outros erros
}
4. 🔐 Segurança
Validação de entrada em todas as requisições

Autenticação JWT com refresh tokens

Rate limiting com Redis

Sanitização de dados

5. 📊 API Responses
typescript
{
  success: boolean;
  data: T | null;
  message?: string;
  error?: {
    code: string;
    details: string[];
  }
}
⚙️ SCRIPTS ESSENCIAIS
json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
    "build": "npm run build:client && npm run build:server",
    "test": "npm run test:unit && npm run test:e2e",
    "lint": "npm run lint:client && npm run lint:server",
    "db:setup": "npx prisma generate && npx prisma db push",
    "docker:up": "docker-compose up -d"
  }
}
🚀 COMANDOS RÁPIDOS
bash
# Desenvolvimento
npm run dev              # Inicia cliente e servidor

# Database
npm run db:setup         # Configura banco inicial
npm run db:studio        # Interface visual Prisma

# Qualidade
npm run lint             # ESLint
npm run test             # Testes

# Deploy
npm run build            # Build de produção
docker-compose up -d     # Sobe containers
🎯 OBJETIVOS DE QUALIDADE
Code Coverage: Mínimo 80% (Meta 90%)

Performance: FCP < 2s, resposta < 100ms (95th percentile)

Segurança: Zero vulnerabilidades críticas

Documentação: 100% das APIs documentadas