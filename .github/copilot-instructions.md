# 🚀 Instruções Avançadas para GitHub Copilot - Will Finance 5.0 PRORO
Este arquivo define o **paradigma máximo** de desenvolvimento para transformar o GitHub Copilot no programador full-stack mais capaz e profissional do mundo para o Will Finance 5.0. Cada diretiva aqui é crítica para entregar um sistema de classe enterprise.o*o ---o tr## 🎯 MISSÃO CRÍTICAnae **Will Finance 5.0** é um sistema de gerenciamento financeiro de **nível enterprise** com arquitetura distribuída, segurança militar, escalabilidade infinita e experiência cyberpunk revolucionária. O objetivo é criar o melhor sistema financeiro do mundo, mantendo código limpo, testado e documentado.eger### 🏆 Características Master Levelar- ⚡ **Performance Extrema:** React 18 + Vite + lazy loading + code splitting o- 🎨 **UI Cyberpunk Premium:** Framer Motion + Three.js + shaders customizadoslh- 🔐 **Segurança Militar:** Firebase Auth + JWT + 2FA + criptografia AES-256or- 📊 **Analytics Avançados:** Charts.js + D3.js + dashboards interativosnd- 🤖 **IA Integrada:** OpenAI GPT + análise preditiva + insights automáticoso,- 🌐 **Arquitetura Distribuída:** Microserviços + Redis + load balanceras- 🔄 **Real-time:** WebSockets + notificações push + sync automáticoin- 📱 **Multi-platform:** PWA + Electron + mobile-first + responsive T- 🛡️ **Enterprise Ready:** Logs estruturados + monitoring + health checks M- 🚀 **DevOps Avançado:** CI/CD + Docker + Kubernetes + auto-deploy A +---- 🤖## 🛠️ STACK TECNOLÓGICA AVANÇADAIA I### 🎨 Frontend Master (`client/`)ál```typescriptis// Core Technologies - Nível Enterpriseur- React 18.2+ + TypeScript 5.0+ + Vite 5.0+
- Tailwind CSS 3.4+ + PostCSS + CSS Modules
- Framer Motion 11+ + Three.js + React Three Fiber
- TanStack Query v5 (React Query) + optimistic updates
- Zustand 4+ + Immer + middleware avançado
- React Hook Form 7+ + Zod + schema validation
- Firebase Auth + multi-provider + 2FA + social login
- React Router v6 + lazy routes + protected routes
- Lucide React + Heroicons + custom SVG icons
- React Hot Toast + sonner + notification system
- React DnD + drag and drop avançado
- Chart.js 4+ + D3.js + custom visualizations
- React Virtualized + infinite scrolling
- React Helmet Async + SEO otimizado
- Workbox + service workers + offline support

// Development & Quality
- Vite plugins ecosystem + HMR otimizado
- ESLint 8+ + Prettier + import sorting
- Husky + lint-staged + commit hooks
- Vitest + Testing Library + Playwright E2E
- Storybook + visual testing + documentation
- TypeScript strict mode + exact types
- Bundle analyzer + performance monitoring
```

### 🖥️ Backend Master (`server/`)
```typescript
// Core Technologies - Enterprise Grade
- Node.js 20+ + Express 4.18+ + TypeScript 5.0+
- Prisma ORM 5+ + PostgreSQL 16+ + connection pooling
- JWT + Passport.js + OAuth2 + refresh tokens
- Multer + Sharp + image processing + S3 upload
- Redis 7+ + caching + session store + pub/sub
- Winston + structured logging + log aggregation
- Helmet + CORS + rate limiting + security headers
- Compression + gzip + response optimization
- Socket.io + real-time + room management
- Bull Queue + background jobs + cron scheduling
- Nodemailer + email templates + SMTP/SES
- Joi/Zod + input validation + sanitization
- Swagger/OpenAPI + auto-generated docs
- Morgan + request logging + analytics
- Dotenv + config management + secrets

// Database & Infrastructure
- Prisma migrations + seeding + schemas
- Database indexes + query optimization
- Connection pooling + read replicas
- Backup strategies + point-in-time recovery
- Database monitoring + slow query analysis
```

### 🔧 DevOps & Infrastructure Master
```yaml
# Enterprise Infrastructure
- Docker + multi-stage builds + optimization
- Docker Compose + development orchestration
- Kubernetes + production deployment + scaling
- GitHub Actions + advanced CI/CD pipelines
- Nginx + reverse proxy + load balancing
- SSL/TLS + HTTPS + security certificates
- CDN + static asset optimization + global distribution
- Monitoring + Prometheus + Grafana + alerts
- Logging + ELK Stack + centralized logs
- Error tracking + Sentry + performance monitoring
- Environment management + secrets + config
- Database migrations + zero-downtime deployments
- Health checks + liveness probes + readiness probes
- Backup automation + disaster recovery
- Security scanning + vulnerability assessment
```

### 🧪 Testing & Quality Master
```typescript
// Comprehensive Testing Strategy
- Unit Tests: Vitest + 90%+ coverage + mocking
- Integration Tests: Supertest + database testing
- E2E Tests: Playwright + visual regression
- Component Tests: Testing Library + accessibility
- API Tests: Postman/Newman + automated collection
- Performance Tests: Lighthouse + Core Web Vitals
- Security Tests: OWASP + penetration testing
- Load Tests: Artillery + stress testing
- Snapshot Tests: Jest + UI regression
- Contract Tests: Pact + API compatibility
```
---

## 📁 ARQUITETURA ENTERPRISE AVANÇADA

### 🎨 Frontend Architecture (`client/src/`)
```
client/src/
├── 🎯 components/           # Componentes reutilizáveis organizados
│   ├── auth/               # Autenticação completa
│   │   ├── LoginForm.tsx   # Form de login otimizado
│   │   ├── RegisterForm.tsx # Registro com validação
│   │   ├── AuthCallback.tsx # Callback social login
│   │   ├── ProtectedRoute.tsx # Route protection
│   │   └── AuthProvider.tsx # Context provider
│   ├── dashboard/          # Dashboard components
│   │   ├── DashboardCards.tsx # Cards métricas
│   │   ├── Charts/         # Gráficos avançados
│   │   │   ├── LineChart.tsx
│   │   │   ├── PieChart.tsx
│   │   │   ├── BarChart.tsx
│   │   │   └── CustomChart.tsx
│   │   ├── Summary.tsx     # Resumo financeiro
│   │   └── Widgets/        # Widgets customizáveis
│   ├── transactions/       # Gestão de transações
│   │   ├── TransactionList.tsx # Lista otimizada
│   │   ├── TransactionModal.tsx # Modal CRUD
│   │   ├── TransactionForm.tsx # Form validado
│   │   ├── TransactionFilters.tsx # Filtros avançados
│   │   ├── BulkActions.tsx # Ações em lote
│   │   └── ImportExport.tsx # Import/Export CSV
│   ├── budgets/            # Orçamentos
│   │   ├── BudgetManager.tsx
│   │   ├── BudgetChart.tsx
│   │   └── BudgetAlerts.tsx
│   ├── reports/            # Relatórios avançados
│   │   ├── FinancialReport.tsx
│   │   ├── CategoryReport.tsx
│   │   ├── TrendAnalysis.tsx
│   │   └── ExportOptions.tsx
│   ├── layout/             # Layout components
│   │   ├── Layout.tsx      # Layout principal
│   │   ├── Sidebar.tsx     # Sidebar responsiva
│   │   ├── Header.tsx      # Header com search
│   │   ├── Footer.tsx      # Footer informativo
│   │   ├── Breadcrumb.tsx  # Navegação
│   │   └── MobileNav.tsx   # Navegação mobile
│   ├── ui/                 # UI primitives
│   │   ├── Button.tsx      # Button component
│   │   ├── Input.tsx       # Input otimizado
│   │   ├── Select.tsx      # Select customizado
│   │   ├── Modal.tsx       # Modal reusável
│   │   ├── Loading.tsx     # Loading states
│   │   ├── ErrorBoundary.tsx # Error handling
│   │   ├── Toast.tsx       # Notification system
│   │   ├── Table.tsx       # Table component
│   │   ├── Pagination.tsx  # Paginação avançada
│   │   └── DataPicker.tsx  # Date picker
│   └── ai/                 # IA Integration
│       ├── ChatBot.tsx     # Chat assistant
│       ├── Insights.tsx    # AI insights
│       └── Predictions.tsx # Previsões IA
├── 📄 pages/               # Páginas principais
│   ├── Dashboard/          # Dashboard page
│   │   ├── DashboardPage.tsx
│   │   └── DashboardLayout.tsx
│   ├── Transactions/       # Transações
│   │   ├── TransactionsPage.tsx
│   │   ├── TransactionDetail.tsx
│   │   └── TransactionImport.tsx
│   ├── Budgets/           # Orçamentos
│   │   ├── BudgetsPage.tsx
│   │   └── BudgetDetail.tsx
│   ├── Reports/           # Relatórios
│   │   ├── ReportsPage.tsx
│   │   ├── FinancialReport.tsx
│   │   └── CustomReport.tsx
│   ├── Settings/          # Configurações
│   │   ├── SettingsPage.tsx
│   │   ├── ProfileSettings.tsx
│   │   ├── AccountSettings.tsx
│   │   └── NotificationSettings.tsx
│   ├── Auth/              # Páginas de auth
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   └── ForgotPassword.tsx
│   └── Admin/             # Admin pages
│       ├── AdminDashboard.tsx
│       ├── UserManagement.tsx
│       └── SystemSettings.tsx
├── 🪝 hooks/              # Custom hooks avançados
│   ├── useAuth.ts         # Autenticação hook
│   ├── useTransactions.ts # Transações hook
│   ├── useBudgets.ts      # Orçamentos hook
│   ├── useReports.ts      # Relatórios hook
│   ├── useLocalStorage.ts # LocalStorage hook
│   ├── useDebounce.ts     # Debounce hook
│   ├── useInfiniteScroll.ts # Infinite scroll
│   ├── useWebSocket.ts    # WebSocket hook
│   ├── usePermissions.ts  # Permissions hook
│   └── useAnalytics.ts    # Analytics hook
├── 🌐 contexts/           # React contexts
│   ├── AuthContext.tsx    # Auth context
│   ├── ThemeContext.tsx   # Theme context
│   ├── NotificationContext.tsx # Notifications
│   └── PermissionsContext.tsx # Permissions
├── 🗃️ stores/             # Estado global (Zustand)
│   ├── authStore.ts       # Auth state
│   ├── transactionStore.ts # Transactions state
│   ├── budgetStore.ts     # Budget state
│   ├── themeStore.ts      # Theme state
│   ├── notificationStore.ts # Notifications
│   └── settingsStore.ts   # Settings state
├── 📝 types/              # TypeScript types
│   ├── auth.ts            # Auth types
│   ├── transaction.ts     # Transaction types
│   ├── budget.ts          # Budget types
│   ├── report.ts          # Report types
│   ├── api.ts             # API types
│   ├── database.ts        # Database types
│   └── index.ts           # Exports centralizados
├── 🔧 utils/              # Utilitários
│   ├── formatters.ts      # formatCurrency, formatDate
│   ├── validators.ts      # Validações Zod
│   ├── constants.ts       # Constantes da aplicação
│   ├── helpers.ts         # Helper functions
│   ├── calculations.ts    # Cálculos financeiros
│   ├── exporters.ts       # Export utilities
│   ├── importers.ts       # Import utilities
│   └── analytics.ts       # Analytics utilities
├── 📚 lib/                # Configurações externas
│   ├── firebase.ts        # Config Firebase
│   ├── api.ts             # Axios config
│   ├── websocket.ts       # WebSocket config
│   ├── analytics.ts       # Analytics config
│   └── permissions.ts     # Permissions config
├── 🎨 styles/             # Estilos globais
│   ├── index.css          # CSS principal
│   ├── cyberpunk-themes.css # Temas cyberpunk
│   ├── components.css     # Component styles
│   └── utilities.css      # Utility classes
└── 🧪 __tests__/          # Tests
    ├── components/        # Component tests
    ├── hooks/            # Hook tests
    ├── utils/            # Utility tests
    └── integration/      # Integration tests
```

### 🖥️ Backend Architecture (`server/src/`)
```
server/src/
├── 🎯 modules/            # Módulos por domínio (DDD)
│   ├── auth/             # Autenticação completa
│   │   ├── controllers/
│   │   │   └── auth.controller.ts
│   │   ├── services/
│   │   │   └── auth.service.ts
│   │   ├── dto/
│   │   │   ├── login.dto.ts
│   │   │   └── register.dto.ts
│   │   ├── strategies/
│   │   │   ├── jwt.strategy.ts
│   │   │   ├── google.strategy.ts
│   │   │   └── local.strategy.ts
│   │   ├── middleware/
│   │   │   └── auth.middleware.ts
│   │   └── routes/
│   │       └── auth.routes.ts
│   ├── transactions/     # Gestão completa de transações
│   │   ├── controllers/
│   │   │   ├── transaction.controller.ts
│   │   │   └── bulk.controller.ts
│   │   ├── services/
│   │   │   ├── transaction.service.ts
│   │   │   ├── import.service.ts
│   │   │   └── export.service.ts
│   │   ├── dto/
│   │   │   ├── create-transaction.dto.ts
│   │   │   └── update-transaction.dto.ts
│   │   ├── validators/
│   │   │   └── transaction.validator.ts
│   │   └── routes/
│   │       └── transaction.routes.ts
│   ├── budgets/          # Gestão de orçamentos
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── dto/
│   │   └── routes/
│   ├── reports/          # Relatórios e analytics
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── generators/
│   │   └── routes/
│   ├── users/            # Gestão de usuários
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── dto/
│   │   └── routes/
│   ├── categories/       # Categorias
│   │   ├── controllers/
│   │   ├── services/
│   │   └── routes/
│   ├── accounts/         # Contas bancárias
│   │   ├── controllers/
│   │   ├── services/
│   │   └── routes/
│   ├── files/            # Upload e processamento
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── processors/
│   │   └── routes/
│   ├── notifications/    # Sistema de notificações
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── templates/
│   │   └── routes/
│   └── ai/               # Integração IA
│       ├── controllers/
│       ├── services/
│       ├── models/
│       └── routes/
├── 🔧 shared/            # Código compartilhado
│   ├── decorators/       # Decorators customizados
│   │   ├── roles.decorator.ts
│   │   └── validation.decorator.ts
│   ├── filters/          # Exception filters
│   │   ├── http-exception.filter.ts
│   │   └── validation.filter.ts
│   ├── pipes/            # Validation pipes
│   │   ├── validation.pipe.ts
│   │   └── transform.pipe.ts
│   ├── guards/           # Auth guards
│   │   ├── auth.guard.ts
│   │   ├── roles.guard.ts
│   │   └── permissions.guard.ts
│   ├── interceptors/     # Request interceptors
│   │   ├── logging.interceptor.ts
│   │   └── response.interceptor.ts
│   └── utils/            # Shared utilities
│       ├── crypto.util.ts
│       ├── date.util.ts
│       └── validation.util.ts
├── ⚙️ config/            # Configurações globais
│   ├── database.ts       # Prisma config
│   ├── jwt.config.ts     # JWT config
│   ├── cors.config.ts    # CORS config
│   ├── redis.config.ts   # Redis config
│   ├── email.config.ts   # Email config
│   └── app.config.ts     # App config
├── 🔄 middleware/        # Middlewares globais
│   ├── auth.middleware.ts # Auth middleware
│   ├── error.middleware.ts # Error handling
│   ├── logging.middleware.ts # Logging
│   ├── rate-limit.middleware.ts # Rate limiting
│   ├── validation.middleware.ts # Validation
│   └── cors.middleware.ts # CORS handling
├── 🗄️ prisma/            # Database schema
│   ├── schema.prisma     # Prisma schema
│   ├── migrations/       # Database migrations
│   ├── seeds/           # Database seeds
│   └── fixtures/        # Test fixtures
├── 📝 types/             # TypeScript types
│   ├── express.d.ts      # Express extensions
│   ├── user.types.ts     # User types
│   ├── transaction.types.ts # Transaction types
│   └── global.types.ts   # Global types
├── 🧪 __tests__/         # Backend tests
│   ├── unit/            # Unit tests
│   ├── integration/     # Integration tests
│   ├── e2e/            # End-to-end tests
│   └── fixtures/       # Test fixtures
└── 📊 scripts/          # Utility scripts
    ├── seed.ts          # Database seeding
    ├── migrate.ts       # Migration runner
    └── cleanup.ts       # Cleanup utilities
```

---

## 📋 CONVENÇÕES E PADRÕES ENTERPRISE

### 🔤 Nomenclatura Profissional
| Tipo | Convenção | Exemplo | Justificativa |
|------|-----------|---------|---------------|
| **Arquivos/Funções** | `camelCase` | `getUserData()`, `transactionService.ts` | Padrão JavaScript/TypeScript |
| **Componentes/Classes** | `PascalCase` | `TransactionModal`, `UserService` | Padrão React/OOP |
| **Tipos/Interfaces** | `PascalCase` | `Transaction`, `LoginData` | Convenção TypeScript |
| **Constantes** | `UPPER_SNAKE_CASE` | `MAX_RETRIES`, `API_ENDPOINTS` | Imutabilidade clara |
| **Diretórios** | `kebab-case` | `import-export/`, `user-profile/` | URL-friendly |
| **Variáveis CSS** | `kebab-case` | `--cyber-primary`, `--bg-secondary` | Padrão CSS |
| **Enum Values** | `UPPER_SNAKE_CASE` | `USER_ROLE.ADMIN` | Consistência enum |
| **Database Tables** | `snake_case` | `user_transactions`, `budget_categories` | SQL convention |

### 🏗️ Estrutura de Componentes React Master
```typescript
// Template padrão para componentes React enterprise
import { memo, useCallback, useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

// 1. Props Schema (Zod validation)
const ComponentPropsSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, 'Title is required'),
  data: z.array(z.unknown()).optional(),
  onAction: z.function().optional(),
  variant: z.enum(['primary', 'secondary', 'danger']).default('primary'),
});

type ComponentProps = z.infer<typeof ComponentPropsSchema>;

// 2. Component Implementation
export const ComponentName = memo<ComponentProps>(({ 
  id, 
  title, 
  data = [], 
  onAction,
  variant = 'primary' 
}) => {
  // 3. Validate props
  const validatedProps = useMemo(() => {
    return ComponentPropsSchema.parse({ id, title, data, onAction, variant });
  }, [id, title, data, onAction, variant]);

  // 4. Local state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 5. Server state (React Query)
  const { 
    data: serverData, 
    isLoading: isServerLoading,
    error: serverError,
    refetch 
  } = useQuery({
    queryKey: ['component-data', id],
    queryFn: () => fetchComponentData(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });

  // 6. Mutations
  const { mutate: updateData, isPending: isUpdating } = useMutation({
    mutationFn: updateComponentData,
    onSuccess: () => {
      toast.success('Dados atualizados com sucesso!');
      refetch();
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
      setError(error.message);
    },
  });

  // 7. Memoized computations
  const processedData = useMemo(() => {
    if (!serverData) return [];
    return serverData.map(item => ({
      ...item,
      formatted: formatDisplayValue(item.value)
    }));
  }, [serverData]);

  // 8. Callbacks
  const handleAction = useCallback((actionData: unknown) => {
    try {
      setError(null);
      onAction?.(actionData);
      updateData(actionData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  }, [onAction, updateData]);

  // 9. Effects
  useEffect(() => {
    if (serverError) {
      setError(serverError.message);
      toast.error(`Erro ao carregar dados: ${serverError.message}`);
    }
  }, [serverError]);

  // 10. Loading state
  if (isServerLoading || isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center p-8"
      >
        <div className="animate-pulse text-cyber-primary">Carregando...</div>
      </motion.div>
    );
  }

  // 11. Error state
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
      >
        <p className="text-red-400">{error}</p>
        <button 
          onClick={() => refetch()}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
        >
          Tentar Novamente
        </button>
      </motion.div>
    );
  }

  // 12. Main render
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`
        component-container
        ${variant === 'primary' ? 'bg-cyber-primary/10' : ''}
        ${variant === 'secondary' ? 'bg-cyber-secondary/10' : ''}
        ${variant === 'danger' ? 'bg-red-500/10' : ''}
      `}
      data-testid={`component-${id}`}
    >
      <header className="component-header">
        <h2 className="text-xl font-bold text-cyber-primary">{title}</h2>
      </header>
      
      <main className="component-content">
        {processedData.length > 0 ? (
          <ul className="space-y-2">
            {processedData.map((item, index) => (
              <motion.li
                key={item.id || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-2 bg-background-secondary/50 rounded"
              >
                {item.formatted}
              </motion.li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">Nenhum dado disponível</p>
        )}
      </main>

      <footer className="component-footer">
        <button
          onClick={() => handleAction({ type: 'refresh' })}
          disabled={isUpdating}
          className="btn btn-primary"
        >
          {isUpdating ? 'Atualizando...' : 'Atualizar'}
        </button>
      </footer>
    </motion.div>
  );
});

// 13. Display name for debugging
ComponentName.displayName = 'ComponentName';

// 14. Default export
export default ComponentName;

// 15. Helper functions
async function fetchComponentData(id: string) {
  const response = await fetch(`/api/components/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch component data');
  }
  return response.json();
}

async function updateComponentData(data: unknown) {
  const response = await fetch('/api/components/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to update component data');
  }
  return response.json();
}

function formatDisplayValue(value: unknown): string {
  if (typeof value === 'number') {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }
  return String(value);
}
```

### 🎨 Padrões de Estilo Cyberpunk Avançados
```css
/* Tema Cyberpunk Master - Variáveis CSS Enterprise */
:root {
  /* Primary Colors - Neon Cyberpunk */
  --cyber-primary: #00FFFF;          /* Cyan neon principal */
  --cyber-primary-dark: #00CCCC;     /* Cyan escuro */
  --cyber-primary-light: #66FFFF;    /* Cyan claro */
  
  --cyber-secondary: #FF0080;        /* Pink neon secundário */
  --cyber-secondary-dark: #CC0066;   /* Pink escuro */
  --cyber-secondary-light: #FF66B3;  /* Pink claro */
  
  --cyber-accent: #39FF14;           /* Green neon accent */
  --cyber-accent-dark: #2ECC11;      /* Green escuro */
  --cyber-accent-light: #66FF4D;     /* Green claro */
  
  --cyber-warning: #FFD700;          /* Gold warning */
  --cyber-danger: #FF0040;           /* Red neon danger */
  --cyber-success: #00FF41;          /* Matrix green success */
  
  /* Background Colors - Dark Cyberpunk */
  --background-primary: #0A0A0F;     /* Ultra dark base */
  --background-secondary: #1A1A2E;   /* Card background */
  --background-tertiary: #16213E;    /* Elevated background */
  --background-accent: #0F3460;      /* Accent background */
  
  /* Text Colors */
  --foreground-primary: #FFFFFF;     /* Primary text */
  --foreground-secondary: #E2E8F0;   /* Secondary text */
  --foreground-muted: #94A3B8;       /* Muted text */
  --foreground-disabled: #64748B;    /* Disabled text */
  
  /* Border Colors */
  --border-primary: rgba(0, 255, 255, 0.3);    /* Cyan border */
  --border-secondary: rgba(255, 0, 128, 0.2);  /* Pink border */
  --border-muted: rgba(148, 163, 184, 0.2);    /* Muted border */
  
  /* Shadow Effects */
  --shadow-glow: 0 0 20px currentColor;
  --shadow-neon: 0 0 10px var(--cyber-primary), 0 0 20px var(--cyber-primary);
  --shadow-pink-neon: 0 0 10px var(--cyber-secondary), 0 0 20px var(--cyber-secondary);
  --shadow-elevation: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  
  /* Gradients */
  --gradient-primary: linear-gradient(135deg, var(--cyber-primary), var(--cyber-secondary));
  --gradient-background: linear-gradient(135deg, var(--background-primary), var(--background-secondary));
  --gradient-card: linear-gradient(135deg, var(--background-secondary), var(--background-tertiary));
  
  /* Animations */
  --animation-fast: 0.15s ease;
  --animation-normal: 0.3s ease;
  --animation-slow: 0.5s ease;
  --animation-pulse: pulse 2s infinite;
  
  /* Typography */
  --font-family-primary: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-family-mono: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
  
  /* Spacing */
  --spacing-xs: 0.25rem;   /* 4px */
  --spacing-sm: 0.5rem;    /* 8px */
  --spacing-md: 1rem;      /* 16px */
  --spacing-lg: 1.5rem;    /* 24px */
  --spacing-xl: 2rem;      /* 32px */
  --spacing-2xl: 3rem;     /* 48px */
  
  /* Border Radius */
  --radius-sm: 0.25rem;    /* 4px */
  --radius-md: 0.5rem;     /* 8px */
  --radius-lg: 1rem;       /* 16px */
  --radius-full: 9999px;   /* Full rounded */
}

/* Dark mode overrides */
[data-theme="dark"] {
  --background-primary: #000000;
  --background-secondary: #111111;
  --cyber-primary: #00FFFF;
  --cyber-secondary: #FF0080;
}

/* Light mode (for accessibility) */
[data-theme="light"] {
  --background-primary: #FFFFFF;
  --background-secondary: #F8FAFC;
  --foreground-primary: #1E293B;
  --cyber-primary: #0891B2;
  --cyber-secondary: #BE185D;
}

/* Component Classes - Enterprise Level */
.glass {
  background: rgba(26, 26, 46, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
}

.glass-strong {
  background: rgba(26, 26, 46, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-primary);
}

.text-glow {
  text-shadow: var(--shadow-glow);
}

.text-neon {
  color: var(--cyber-primary);
  text-shadow: var(--shadow-neon);
}

.text-pink-neon {
  color: var(--cyber-secondary);
  text-shadow: var(--shadow-pink-neon);
}

/* Button Styles - Premium */
.btn {
  @apply inline-flex items-center justify-center;
  @apply px-4 py-2 rounded-lg font-medium;
  @apply transition-all duration-300;
  @apply focus:outline-none focus:ring-2 focus:ring-offset-2;
  @apply disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-primary {
  background: var(--gradient-primary);
  color: var(--background-primary);
  box-shadow: var(--shadow-neon);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-neon), var(--shadow-elevation);
}

.btn-secondary {
  background: transparent;
  color: var(--cyber-primary);
  border: 1px solid var(--cyber-primary);
}

.btn-secondary:hover {
  background: var(--cyber-primary);
  color: var(--background-primary);
  box-shadow: var(--shadow-neon);
}

.btn-ghost {
  background: transparent;
  color: var(--foreground-secondary);
}

.btn-ghost:hover {
  background: var(--background-tertiary);
  color: var(--cyber-primary);
}

/* Input Styles - Professional */
.input {
  @apply w-full px-4 py-3 rounded-lg;
  background: var(--background-secondary);
  border: 1px solid var(--border-muted);
  color: var(--foreground-primary);
  transition: var(--animation-normal);
}

.input:focus {
  border-color: var(--cyber-primary);
  box-shadow: 0 0 0 3px rgba(0, 255, 255, 0.1);
  outline: none;
}

.input:invalid {
  border-color: var(--cyber-danger);
  box-shadow: 0 0 0 3px rgba(255, 0, 64, 0.1);
}

/* Card Styles - Enterprise */
.card {
  background: var(--gradient-card);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-elevation);
  transition: var(--animation-normal);
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-elevation), var(--shadow-neon);
  border-color: var(--cyber-primary);
}

.card-header {
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--border-muted);
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--cyber-primary);
  margin-bottom: var(--spacing-sm);
}

.card-description {
  color: var(--foreground-muted);
  font-size: 0.875rem;
}

/* Animation Classes */
.animate-pulse-neon {
  animation: pulseNeon 2s ease-in-out infinite alternate;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-glow {
  animation: glow 2s ease-in-out infinite alternate;
}

/* Keyframes */
@keyframes pulseNeon {
  from {
    text-shadow: 0 0 5px var(--cyber-primary), 0 0 10px var(--cyber-primary);
  }
  to {
    text-shadow: 0 0 10px var(--cyber-primary), 0 0 20px var(--cyber-primary), 0 0 30px var(--cyber-primary);
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes glow {
  from {
    box-shadow: 0 0 5px var(--cyber-primary);
  }
  to {
    box-shadow: 0 0 20px var(--cyber-primary), 0 0 30px var(--cyber-primary);
  }
}

/* Responsive Utilities */
.container {
  width: 100%;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

@media (min-width: 640px) {
  .container { max-width: 640px; }
}

@media (min-width: 768px) {
  .container { max-width: 768px; }
}

@media (min-width: 1024px) {
  .container { max-width: 1024px; }
}

@media (min-width: 1280px) {
  .container { max-width: 1280px; }
}

/* Accessibility */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  :root {
    --cyber-primary: #FFFFFF;
    --cyber-secondary: #FFFFFF;
    --background-primary: #000000;
    --background-secondary: #000000;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 🔧 GUIDELINES DE DESENVOLVIMENTO ENTERPRISE

### 1. 📝 TypeScript Obrigatório Avançado
```typescript
// ❌ NUNCA - Código sem tipos adequados
function processData(data: any): any {
  return data.map((item: any) => item.value);
}

// ✅ SEMPRE - Tipos específicos e validação
interface DataItem {
  id: string;
  value: number;
  label: string;
  category: 'income' | 'expense';
  metadata?: Record<string, unknown>;
}

interface ProcessDataOptions {
  sortBy?: keyof DataItem;
  filterBy?: (item: DataItem) => boolean;
  limit?: number;
}

function processData(
  data: DataItem[], 
  options: ProcessDataOptions = {}
): { processed: number[]; total: number } {
  const { sortBy = 'value', filterBy, limit } = options;
  
  let filteredData = filterBy ? data.filter(filterBy) : data;
  
  if (limit && limit > 0) {
    filteredData = filteredData.slice(0, limit);
  }
  
  const sortedData = filteredData.sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return bValue - aValue; // Descending order
    }
    
    return String(aValue).localeCompare(String(bValue));
  });
  
  return {
    processed: sortedData.map(item => item.value),
    total: filteredData.length
  };
}

// Uso com type safety completo
const result = processData(transactionData, {
  filterBy: (item) => item.category === 'income',
  sortBy: 'value',
  limit: 10
});
```

### 2. 🛡️ Validação Rigorosa com Zod
```typescript
import { z } from 'zod';

// Schema base para transação
const BaseTransactionSchema = z.object({
  id: z.string().uuid('ID deve ser um UUID válido'),
  description: z.string()
    .min(1, 'Descrição é obrigatória')
    .max(255, 'Descrição muito longa')
    .trim(),
  amount: z.number()
    .positive('Valor deve ser positivo')
    .max(999999999.99, 'Valor muito alto')
    .refine(val => Number(val.toFixed(2)) === val, 'Máximo 2 casas decimais'),
  type: z.enum(['INCOME', 'EXPENSE'], {
    errorMap: () => ({ message: 'Tipo deve ser INCOME ou EXPENSE' })
  }),
  category: z.string().min(1, 'Categoria é obrigatória'),
  date: z.string()
    .datetime('Data inválida')
    .or(z.date())
    .transform(val => typeof val === 'string' ? new Date(val) : val),
  tags: z.array(z.string()).optional().default([]),
  metadata: z.record(z.unknown()).optional(),
});

// Schemas específicos para diferentes operações
const CreateTransactionSchema = BaseTransactionSchema.omit({ id: true });
const UpdateTransactionSchema = BaseTransactionSchema.partial().required({ id: true });
const QueryTransactionSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  type: z.enum(['INCOME', 'EXPENSE']).optional(),
  search: z.string().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  categoryIds: z.array(z.string().uuid()).optional(),
});

// Types derivados dos schemas
type Transaction = z.infer<typeof BaseTransactionSchema>;
type CreateTransactionData = z.infer<typeof CreateTransactionSchema>;
type UpdateTransactionData = z.infer<typeof UpdateTransactionSchema>;
type TransactionQuery = z.infer<typeof QueryTransactionSchema>;

// Função de validação com error handling
function validateTransactionData<T extends z.ZodSchema>(
  schema: T,
  data: unknown
): { success: true; data: z.infer<T> } | { success: false; errors: string[] } {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      return { success: false, errors };
    }
    return { success: false, errors: ['Erro de validação desconhecido'] };
  }
}

// Uso em controller
export async function createTransaction(req: Request, res: Response) {
  const validation = validateTransactionData(CreateTransactionSchema, req.body);
  
  if (!validation.success) {
    return res.status(400).json({
      success: false,
      message: 'Dados inválidos',
      errors: validation.errors
    });
  }
  
  // Dados são type-safe aqui
  const transactionData = validation.data;
  
  try {
    const transaction = await transactionService.create(transactionData);
    res.json({
      success: true,
      data: transaction,
      message: 'Transação criada com sucesso'
    });
  } catch (error) {
    // Error handling...
  }
}
```

### 3. 🎯 Tratamento de Erros Enterprise
```typescript
// Base error classes
export abstract class BaseError extends Error {
  abstract readonly statusCode: number;
  abstract readonly code: string;
  abstract readonly isOperational: boolean;

  constructor(message: string, public readonly context?: Record<string, unknown>) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends BaseError {
  readonly statusCode = 400;
  readonly code = 'VALIDATION_ERROR';
  readonly isOperational = true;

  constructor(message: string, public readonly fields: string[] = []) {
    super(message);
  }
}

export class NotFoundError extends BaseError {
  readonly statusCode = 404;
  readonly code = 'NOT_FOUND';
  readonly isOperational = true;
}

export class UnauthorizedError extends BaseError {
  readonly statusCode = 401;
  readonly code = 'UNAUTHORIZED';
  readonly isOperational = true;
}

export class ForbiddenError extends BaseError {
  readonly statusCode = 403;
  readonly code = 'FORBIDDEN';
  readonly isOperational = true;
}

export class InternalServerError extends BaseError {
  readonly statusCode = 500;
  readonly code = 'INTERNAL_SERVER_ERROR';
  readonly isOperational = false;
}

// Error handler middleware
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log error with context
  const errorContext = {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    userId: req.user?.id,
    timestamp: new Date().toISOString(),
  };

  if (error instanceof BaseError) {
    logger.warn('Operational error', { ...errorContext, context: error.context });
    
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      code: error.code,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    });
  } else {
    // Unhandled error
    logger.error('Unhandled error', errorContext);
    
    res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === 'production' 
        ? 'Erro interno do servidor' 
        : error.message,
      code: 'INTERNAL_SERVER_ERROR',
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    });
  }
};

// Async error wrapper
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Usage in routes
app.get('/api/transactions/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!isValidUUID(id)) {
    throw new ValidationError('ID deve ser um UUID válido');
  }
  
  const transaction = await transactionService.findById(id);
  
  if (!transaction) {
    throw new NotFoundError('Transação não encontrada');
  }
  
  res.json({
    success: true,
    data: transaction
  });
}));
```

### 4. 🔐 Segurança Enterprise
```typescript
// Authentication middleware with JWT
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const JWTPayloadSchema = z.object({
  userId: z.string().uuid(),
  email: z.string().email(),
  role: z.enum(['USER', 'ADMIN', 'MASTER']),
  permissions: z.array(z.string()),
  iat: z.number(),
  exp: z.number(),
});

type JWTPayload = z.infer<typeof JWTPayloadSchema>;

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export const authMiddleware = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    throw new UnauthorizedError('Token de acesso não fornecido');
  }
  
  const token = authHeader.substring(7);
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const validation = JWTPayloadSchema.safeParse(decoded);
    
    if (!validation.success) {
      throw new UnauthorizedError('Token inválido');
    }
    
    // Check if user still exists and is active
    const user = await userService.findById(validation.data.userId);
    if (!user || !user.isActive) {
      throw new UnauthorizedError('Usuário não encontrado ou inativo');
    }
    
    req.user = validation.data;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError('Token inválido');
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Token expirado');
    }
    throw error;
  }
});

// Role-based access control
export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new UnauthorizedError('Usuário não autenticado');
    }
    
    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError('Acesso negado - role insuficiente');
    }
    
    next();
  };
};

// Permission-based access control
export const requirePermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new UnauthorizedError('Usuário não autenticado');
    }
    
    if (!req.user.permissions.includes(permission)) {
      throw new ForbiddenError(`Acesso negado - permissão '${permission}' necessária`);
    }
    
    next();
  };
};

// Input sanitization
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const purify = DOMPurify(window as any);

export const sanitizeInput = (input: any): any => {
  if (typeof input === 'string') {
    return purify.sanitize(input.trim());
  }
  
  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }
  
  if (input && typeof input === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }
  
  return input;
};

// Rate limiting with Redis
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

export const apiLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: string[]) => redisClient.sendCommand(args),
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // Limit each IP to 100 requests per windowMs in production
  message: {
    error: 'Muitas requisições, tente novamente em alguns minutos',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/health';
  },
});

// Strict rate limiting for auth endpoints
export const authLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: string[]) => redisClient.sendCommand(args),
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 auth requests per windowMs
  message: {
    error: 'Muitas tentativas de login, tente novamente em 15 minutos',
    code: 'AUTH_RATE_LIMIT_EXCEEDED'
  },
  skipSuccessfulRequests: true,
});
```

### 5. 📊 Estrutura de API Response Enterprise
```typescript
// Base response interfaces
interface BaseApiResponse {
  success: boolean;
  timestamp: string;
  requestId: string;
}

interface SuccessResponse<T = any> extends BaseApiResponse {
  success: true;
  data: T;
  message?: string;
  meta?: {
    pagination?: PaginationMeta;
    total?: number;
    [key: string]: any;
  };
}

interface ErrorResponse extends BaseApiResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: string[];
    field?: string;
  };
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse;

// Response helper functions
export class ResponseHelper {
  static success<T>(
    data: T,
    message?: string,
    meta?: SuccessResponse<T>['meta']
  ): SuccessResponse<T> {
    return {
      success: true,
      data,
      message,
      meta,
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
    };
  }

  static error(
    code: string,
    message: string,
    details?: string[],
    field?: string
  ): ErrorResponse {
    return {
      success: false,
      error: {
        code,
        message,
        details,
        field,
      },
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
    };
  }

  static paginated<T>(
    data: T[],
    page: number,
    limit: number,
    total: number,
    message?: string
  ): SuccessResponse<T[]> {
    const pages = Math.ceil(total / limit);
    
    return this.success(data, message, {
      pagination: {
        page,
        limit,
        total,
        pages,
        hasNext: page < pages,
        hasPrev: page > 1,
      },
      total,
    });
  }
}

// Request ID middleware
export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  req.requestId = generateRequestId();
  res.setHeader('X-Request-ID', req.requestId);
  next();
};

function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Usage in controllers
export const getTransactions = asyncHandler(async (req, res) => {
  const query = QueryTransactionSchema.parse(req.query);
  const userId = req.user!.userId;
  
  const [transactions, total] = await Promise.all([
    transactionService.findMany({
      ...query,
      userId,
      skip: (query.page - 1) * query.limit,
    }),
    transactionService.count({ ...query, userId }),
  ]);
  
  res.json(ResponseHelper.paginated(
    transactions,
    query.page,
    query.limit,
    total,
    'Transações recuperadas com sucesso'
  ));
});

export const createTransaction = asyncHandler(async (req, res) => {
  const validation = validateTransactionData(CreateTransactionSchema, req.body);
  
  if (!validation.success) {
    return res.status(400).json(ResponseHelper.error(
      'VALIDATION_ERROR',
      'Dados inválidos',
      validation.errors
    ));
  }
  
  const transaction = await transactionService.create({
    ...validation.data,
    userId: req.user!.userId,
  });
  
  res.status(201).json(ResponseHelper.success(
    transaction,
    'Transação criada com sucesso'
  ));
});
```

### 6. 🧪 Testes Enterprise Completos
```typescript
// Test setup and utilities
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { TransactionService } from './transaction.service';

// Mock factories
export const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: 'user-123',
  email: 'user@example.com',
  name: 'Test User',
  role: 'USER',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createMockTransaction = (overrides: Partial<Transaction> = {}): Transaction => ({
  id: 'tx-123',
  description: 'Test Transaction',
  amount: 100.50,
  type: 'EXPENSE',
  category: 'Food',
  date: new Date(),
  userId: 'user-123',
  tags: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

// Test wrappers
interface TestWrapperProps {
  children: React.ReactNode;
  initialEntries?: string[];
}

export const TestWrapper = ({ children, initialEntries = ['/'] }: TestWrapperProps) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>
        {children}
      </MemoryRouter>
    </QueryClientProvider>
  );
};

// Unit Tests - Service Layer
describe('TransactionService', () => {
  let transactionService: TransactionService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      transaction: {
        create: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        count: vi.fn(),
        aggregate: vi.fn(),
      },
    };
    
    transactionService = new TransactionService(mockPrisma);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new transaction successfully', async () => {
      // Arrange
      const transactionData = {
        description: 'Test transaction',
        amount: 100,
        type: 'EXPENSE' as const,
        category: 'Food',
        date: new Date(),
        userId: 'user-123',
      };
      
      const mockCreatedTransaction = createMockTransaction(transactionData);
      mockPrisma.transaction.create.mockResolvedValue(mockCreatedTransaction);

      // Act
      const result = await transactionService.create(transactionData);

      // Assert
      expect(mockPrisma.transaction.create).toHaveBeenCalledWith({
        data: transactionData,
      });
      expect(result).toEqual(mockCreatedTransaction);
    });

    it('should throw ValidationError for invalid amount', async () => {
      // Arrange
      const invalidData = {
        description: 'Test',
        amount: -100, // Invalid negative amount
        type: 'EXPENSE' as const,
        category: 'Food',
        date: new Date(),
        userId: 'user-123',
      };

      // Act & Assert
      await expect(transactionService.create(invalidData))
        .rejects
        .toThrow(ValidationError);
    });
  });

  describe('findMany', () => {
    it('should return paginated transactions with correct filters', async () => {
      // Arrange
      const mockTransactions = [
        createMockTransaction({ id: '1', type: 'INCOME' }),
        createMockTransaction({ id: '2', type: 'EXPENSE' }),
      ];
      
      mockPrisma.transaction.findMany.mockResolvedValue(mockTransactions);

      const query = {
        userId: 'user-123',
        type: 'INCOME' as const,
        page: 1,
        limit: 10,
      };

      // Act
      const result = await transactionService.findMany(query);

      // Assert
      expect(mockPrisma.transaction.findMany).toHaveBeenCalledWith({
        where: {
          userId: 'user-123',
          type: 'INCOME',
        },
        skip: 0,
        take: 10,
        orderBy: { date: 'desc' },
        include: {
          category: true,
          account: true,
        },
      });
      expect(result).toEqual(mockTransactions);
    });
  });
});

// Integration Tests - API Endpoints
describe('Transaction API', () => {
  let app: Express;
  let server: any;
  let testDb: any;

  beforeAll(async () => {
    // Setup test database
    testDb = await setupTestDatabase();
    app = createTestApp();
    server = app.listen(0);
  });

  afterAll(async () => {
    await cleanupTestDatabase(testDb);
    server.close();
  });

  beforeEach(async () => {
    await seedTestData(testDb);
  });

  afterEach(async () => {
    await clearTestData(testDb);
  });

  describe('POST /api/transactions', () => {
    it('should create transaction with valid data', async () => {
      // Arrange
      const transactionData = {
        description: 'Test transaction',
        amount: 150.75,
        type: 'EXPENSE',
        category: 'Food',
        date: '2025-01-01T00:00:00.000Z',
      };

      const authToken = await getTestAuthToken('user-123');

      // Act
      const response = await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send(transactionData)
        .expect(201);

      // Assert
      expect(response.body).toMatchObject({
        success: true,
        data: {
          id: expect.any(String),
          description: 'Test transaction',
          amount: 150.75,
          type: 'EXPENSE',
        },
        message: 'Transação criada com sucesso',
      });

      // Verify in database
      const createdTransaction = await testDb.transaction.findUnique({
        where: { id: response.body.data.id },
      });
      expect(createdTransaction).toBeTruthy();
    });

    it('should return 400 for invalid data', async () => {
      // Arrange
      const invalidData = {
        description: '', // Empty description
        amount: -100, // Negative amount
        type: 'INVALID_TYPE', // Invalid type
      };

      const authToken = await getTestAuthToken('user-123');

      // Act
      const response = await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);

      // Assert
      expect(response.body).toMatchObject({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Dados inválidos',
          details: expect.arrayContaining([
            expect.stringContaining('description'),
            expect.stringContaining('amount'),
            expect.stringContaining('type'),
          ]),
        },
      });
    });

    it('should return 401 for unauthenticated request', async () => {
      // Act
      const response = await request(app)
        .post('/api/transactions')
        .send({})
        .expect(401);

      // Assert
      expect(response.body).toMatchObject({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Token de acesso não fornecido',
        },
      });
    });
  });
});

// Component Tests - React Testing Library
describe('TransactionForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockOnCancel.mockClear();
  });

  it('should render form fields correctly', () => {
    // Act
    render(
      <TestWrapper>
        <TransactionForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
      </TestWrapper>
    );

    // Assert
    expect(screen.getByLabelText(/descrição/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/valor/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tipo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/categoria/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/data/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /salvar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
  });

  it('should submit form with valid data', async () => {
    // Arrange
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <TransactionForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
      </TestWrapper>
    );

    // Act
    await user.type(screen.getByLabelText(/descrição/i), 'Test transaction');
    await user.type(screen.getByLabelText(/valor/i), '100.50');
    await user.selectOptions(screen.getByLabelText(/tipo/i), 'EXPENSE');
    await user.selectOptions(screen.getByLabelText(/categoria/i), 'Food');
    await user.type(screen.getByLabelText(/data/i), '2025-01-01');
    
    await user.click(screen.getByRole('button', { name: /salvar/i }));

    // Assert
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        description: 'Test transaction',
        amount: 100.50,
        type: 'EXPENSE',
        category: 'Food',
        date: expect.any(Date),
      });
    });
  });

  it('should show validation errors for empty fields', async () => {
    // Arrange
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <TransactionForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
      </TestWrapper>
    );

    // Act
    await user.click(screen.getByRole('button', { name: /salvar/i }));

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/descrição é obrigatória/i)).toBeInTheDocument();
      expect(screen.getByText(/valor deve ser positivo/i)).toBeInTheDocument();
    });
    
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should call onCancel when cancel button is clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <TransactionForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
      </TestWrapper>
    );

    // Act
    await user.click(screen.getByRole('button', { name: /cancelar/i }));

    // Assert
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });
});

// E2E Tests - Playwright
import { test, expect as playwrightExpect } from '@playwright/test';

test.describe('Transaction Management', () => {
  test.beforeEach(async ({ page }) => {
    // Setup authenticated state
    await page.goto('/login');
    await page.fill('[data-testid=email-input]', 'test@example.com');
    await page.fill('[data-testid=password-input]', 'password123');
    await page.click('[data-testid=login-button]');
    await page.waitForURL('/dashboard');
  });

  test('should create new transaction', async ({ page }) => {
    // Navigate to transactions page
    await page.click('[data-testid=nav-transactions]');
    await page.waitForURL('/transactions');

    // Open create form
    await page.click('[data-testid=create-transaction-button]');
    await page.waitForSelector('[data-testid=transaction-form]');

    // Fill form
    await page.fill('[data-testid=description-input]', 'E2E Test Transaction');
    await page.fill('[data-testid=amount-input]', '299.99');
    await page.selectOption('[data-testid=type-select]', 'EXPENSE');
    await page.selectOption('[data-testid=category-select]', 'Shopping');
    await page.fill('[data-testid=date-input]', '2025-01-15');

    // Submit form
    await page.click('[data-testid=submit-button]');

    // Verify success
    await playwrightExpected(page.locator('[data-testid=success-toast]'))
      .toContainText('Transação criada com sucesso');
    
    // Verify transaction appears in list
    await playwrightExpected(page.locator('[data-testid=transaction-list]'))
      .toContainText('E2E Test Transaction');
    await playwrightExpected(page.locator('[data-testid=transaction-list]'))
      .toContainText('R$ 299,99');
  });

  test('should filter transactions by type', async ({ page }) => {
    await page.goto('/transactions');
    
    // Apply income filter
    await page.selectOption('[data-testid=type-filter]', 'INCOME');
    await page.click('[data-testid=apply-filters]');

    // Verify only income transactions are shown
    const transactions = page.locator('[data-testid=transaction-item]');
    const count = await transactions.count();
    
    for (let i = 0; i < count; i++) {
      await playwrightExpected(transactions.nth(i).locator('[data-testid=transaction-type]'))
        .toContainText('Receita');
    }
  });
});

// Performance Tests
describe('Performance Tests', () => {
  it('should handle large transaction datasets efficiently', async () => {
    // Arrange
    const largeDataset = Array.from({ length: 10000 }, (_, i) => 
      createMockTransaction({ id: `tx-${i}`, amount: Math.random() * 1000 })
    );

    mockPrisma.transaction.findMany.mockResolvedValue(largeDataset);

    // Act
    const startTime = performance.now();
    const result = await transactionService.findMany({
      userId: 'user-123',
      limit: 10000,
    });
    const endTime = performance.now();

    // Assert
    expect(result).toHaveLength(10000);
    expect(endTime - startTime).toBeLessThan(1000); // Should complete in less than 1 second
  });
});

// Load Tests with Artillery
// artillery.yml
/*
config:
  target: 'http://localhost:8080'
  phases:
    - duration: 60
      arrivalRate: 10
      name: Warm up
    - duration: 120
      arrivalRate: 50
      name: Load test
    - duration: 60
      arrivalRate: 100
      name: Stress test

scenarios:
  - name: 'Transaction CRUD operations'
    weight: 70
    flow:
      - post:
          url: '/api/auth/login'
          json:
            email: 'test@example.com'
            password: 'password123'
          capture:
            - json: '$.data.token'
              as: 'authToken'
      - get:
          url: '/api/transactions'
          headers:
            Authorization: 'Bearer {{ authToken }}'
      - post:
          url: '/api/transactions'
          headers:
            Authorization: 'Bearer {{ authToken }}'
          json:
            description: 'Load test transaction'
            amount: 100
            type: 'EXPENSE'
            category: 'Test'
            date: '2025-01-01T00:00:00.000Z'
*/
```

### 7. 📚 Documentação JSDoc Enterprise
```typescript
/**
 * Service responsável pela gestão completa de transações financeiras.
 * Implementa padrões enterprise com validação, logging e error handling.
 * 
 * @example
 * ```typescript
 * const transactionService = new TransactionService(prisma);
 * 
 * // Criar nova transação
 * const transaction = await transactionService.create({
 *   description: 'Compra no supermercado',
 *   amount: 150.75,
 *   type: 'EXPENSE',
 *   category: 'Alimentação',
 *   date: new Date(),
 *   userId: 'user-123'
 * });
 * 
 * // Buscar transações com filtros
 * const transactions = await transactionService.findMany({
 *   userId: 'user-123',
 *   type: 'EXPENSE',
 *   dateFrom: '2025-01-01',
 *   dateTo: '2025-01-31',
 *   page: 1,
 *   limit: 20
 * });
 * ```
 * 
 * @since 5.0.0
 * @author Will Finance Team
 */
export class TransactionService {
  private readonly logger = createLogger('TransactionService');

  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Cria uma nova transação com validação completa e auditoria.
   * 
   * @param data - Dados da transação a ser criada
   * @param data.description - Descrição da transação (1-255 caracteres)
   * @param data.amount - Valor da transação (positivo, até 2 casas decimais)
   * @param data.type - Tipo da transação ('INCOME' ou 'EXPENSE')
   * @param data.category - Categoria da transação
   * @param data.date - Data da transação
   * @param data.userId - ID do usuário proprietário
   * @param data.tags - Tags opcionais para classificação
   * @param data.metadata - Metadados adicionais (JSON)
   * 
   * @returns Promise<Transaction> Transação criada com ID gerado
   * 
   * @throws {ValidationError} Quando os dados não atendem aos critérios de validação
   * @throws {NotFoundError} Quando categoria ou usuário não existem
   * @throws {InternalServerError} Quando ocorre erro interno no banco de dados
   * 
   * @example
   * ```typescript
   * const transaction = await transactionService.create({
   *   description: 'Salário mensal',
   *   amount: 5000.00,
   *   type: 'INCOME',
   *   category: 'Salário',
   *   date: new Date(),
   *   userId: 'user-123',
   *   tags: ['trabalho', 'mensal'],
   *   metadata: { company: 'ACME Corp', department: 'Engineering' }
   * });
   * 
   * console.log(`Transação criada: ${transaction.id}`);
   * ```
   * 
   * @since 5.0.0
   */
  async create(data: CreateTransactionData): Promise<Transaction> {
    this.logger.info('Creating new transaction', { 
      userId: data.userId, 
      type: data.type, 
      amount: data.amount 
    });

    // Validação de dados
    const validation = validateTransactionData(CreateTransactionSchema, data);
    if (!validation.success) {
      this.logger.warn('Transaction validation failed', { 
        errors: validation.errors, 
        data 
      });
      throw new ValidationError('Dados da transação inválidos', validation.errors);
    }

    const validatedData = validation.data;

    try {
      // Verificar se usuário existe
      const user = await this.prisma.user.findUnique({
        where: { id: validatedData.userId }
      });

      if (!user || !user.isActive) {
        throw new NotFoundError('Usuário não encontrado ou inativo');
      }

      // Verificar se categoria existe
      const category = await this.prisma.category.findFirst({
        where: { 
          name: validatedData.category,
          userId: validatedData.userId,
          isActive: true
        }
      });

      if (!category) {
        throw new NotFoundError(`Categoria '${validatedData.category}' não encontrada`);
      }

      // Criar transação
      const transaction = await this.prisma.transaction.create({
        data: {
          ...validatedData,
          categoryId: category.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        include: {
          category: true,
          user: {
            select: { id: true, name: true, email: true }
          }
        }
      });

      this.logger.info('Transaction created successfully', { 
        transactionId: transaction.id,
        userId: validatedData.userId,
        amount: validatedData.amount
      });

      // Dispatch evento para atualização de saldos, relatórios, etc.
      await this.dispatchTransactionCreatedEvent(transaction);

      return transaction;

    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }

      this.logger.error('Failed to create transaction', { 
        error: error.message, 
        stack: error.stack, 
        data: validatedData 
      });

      throw new InternalServerError('Falha ao criar transação');
    }
  }

  /**
   * Busca transações com filtros avançados, paginação e ordenação.
   * Implementa cache inteligente e otimizações de performance.
   * 
   * @param query - Parâmetros de busca e paginação
   * @param query.userId - ID do usuário (obrigatório)
   * @param query.type - Filtro por tipo de transação (opcional)
   * @param query.search - Busca textual na descrição (opcional)
   * @param query.categoryIds - Array de IDs de categorias (opcional)
   * @param query.dateFrom - Data inicial (ISO string, opcional)
   * @param query.dateTo - Data final (ISO string, opcional)
   * @param query.page - Página atual (padrão: 1)
   * @param query.limit - Itens por página (padrão: 20, máximo: 100)
   * @param query.sortBy - Campo para ordenação (padrão: 'date')
   * @param query.sortOrder - Ordem da classificação (padrão: 'desc')
   * 
   * @returns Promise<Transaction[]> Array de transações que atendem aos critérios
   * 
   * @throws {ValidationError} Quando parâmetros de query são inválidos
   * @throws {ForbiddenError} Quando usuário não tem acesso às transações
   * 
   * @example
   * ```typescript
   * // Buscar todas as despesas do mês atual
   * const expensesThisMonth = await transactionService.findMany({
   *   userId: 'user-123',
   *   type: 'EXPENSE',
   *   dateFrom: '2025-01-01T00:00:00.000Z',
   *   dateTo: '2025-01-31T23:59:59.999Z',
   *   page: 1,
   *   limit: 50,
   *   sortBy: 'amount',
   *   sortOrder: 'desc'
   * });
   * 
   * // Buscar transações por texto
   * const searchResults = await transactionService.findMany({
   *   userId: 'user-123',
   *   search: 'supermercado',
   *   page: 1,
   *   limit: 20
   * });
   * ```
   * 
   * @since 5.0.0
   */
  async findMany(query: FindManyTransactionsQuery): Promise<Transaction[]> {
    this.logger.debug('Finding transactions', { query });

    // Validação de query
    const validation = validateTransactionData(QueryTransactionSchema, query);
    if (!validation.success) {
      throw new ValidationError('Parâmetros de busca inválidos', validation.errors);
    }

    const validatedQuery = validation.data;
    const { userId, type, search, categoryIds, dateFrom, dateTo, page, limit, sortBy, sortOrder } = validatedQuery;

    // Construir filtros WHERE do Prisma
    const where: Prisma.TransactionWhereInput = {
      userId,
      ...(type && { type }),
      ...(search && {
        description: {
          contains: search,
          mode: 'insensitive'
        }
      }),
      ...(categoryIds?.length && {
        categoryId: {
          in: categoryIds
        }
      }),
      ...((dateFrom || dateTo) && {
        date: {
          ...(dateFrom && { gte: new Date(dateFrom) }),
          ...(dateTo && { lte: new Date(dateTo) })
        }
      })
    };

    // Construir ordenação
    const orderBy: Prisma.TransactionOrderByWithRelationInput = {
      [sortBy]: sortOrder
    };

    try {
      const transactions = await this.prisma.transaction.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          category: {
            select: { id: true, name: true, icon: true, color: true }
          },
          account: {
            select: { id: true, name: true, type: true }
          }
        }
      });

      this.logger.debug('Transactions found', { 
        count: transactions.length, 
        userId, 
        filters: { type, search, categoryIds, dateFrom, dateTo }
      });

      return transactions;

    } catch (error) {
      this.logger.error('Failed to find transactions', { 
        error: error.message, 
        query: validatedQuery 
      });
      
      throw new InternalServerError('Falha ao buscar transações');
    }
  }

  /**
   * Calcula estatísticas financeiras para um usuário em um período específico.
   * Retorna receitas, despesas, saldo e outras métricas importantes.
   * 
   * @param userId - ID do usuário
   * @param dateRange - Período para cálculo (opcional, padrão: mês atual)
   * @param dateRange.from - Data inicial (ISO string)
   * @param dateRange.to - Data final (ISO string)
   * 
   * @returns Promise<FinancialStats> Estatísticas financeiras calculadas
   * 
   * @throws {ValidationError} Quando userId é inválido ou datas são inconsistentes
   * @throws {NotFoundError} Quando usuário não existe
   * 
   * @example
   * ```typescript
   * // Estatísticas do mês atual
   * const stats = await transactionService.calculateStats('user-123');
   * console.log(`Saldo atual: R$ ${stats.balance.toFixed(2)}`);
   * 
   * // Estatísticas de um período específico
   * const yearStats = await transactionService.calculateStats('user-123', {
   *   from: '2024-01-01T00:00:00.000Z',
   *   to: '2024-12-31T23:59:59.999Z'
   * });
   * ```
   * 
   * @since 5.0.0
   */
  async calculateStats(
    userId: string, 
    dateRange?: { from: string; to: string }
  ): Promise<FinancialStats> {
    // Implementation...
  }

  /**
   * Dispara evento interno para processamento assíncrono após criação de transação.
   * Atualiza caches, recalcula saldos, envia notificações, etc.
   * 
   * @private
   * @param transaction - Transação criada
   * @returns Promise<void>
   * 
   * @since 5.0.0
   */
  private async dispatchTransactionCreatedEvent(transaction: Transaction): Promise<void> {
    // Event dispatch implementation...
  }
}
```

---

## ⚙️ Scripts e Automação

### Package.json Scripts
```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
    "dev:client": "cd client && npm run dev",
    "dev:server": "cd server && npm run dev",
    "build": "npm run build:client && npm run build:server",
    "test": "npm run test:client && npm run test:server",
    "lint": "npm run lint:client && npm run lint:server",
    "db:setup": "cd server && npx prisma generate && npx prisma db push",
    "db:migrate": "cd server && npx prisma migrate dev",
    "db:studio": "cd server && npx prisma studio",
    "install:all": "npm install && cd client && npm install && cd ../server && npm install"
  }
}
```

### 🔄 GitHub Actions (CI/CD)
```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

---

## ⚙️ Scripts e Automação Enterprise

### Package.json Scripts Master
```json
{
  "name": "will-finance-5.0-pro",
  "version": "5.0.0",
  "description": "Sistema de gerenciamento financeiro enterprise com arquitetura distribuída",
  "scripts": {
    "// === DESENVOLVIMENTO === //": "",
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\" \"npm run dev:watch\"",
    "dev:client": "cd client && npm run dev",
    "dev:server": "cd server && npm run dev",
    "dev:watch": "nodemon --watch server/src --exec \"npm run typecheck:server\"",
    "dev:debug": "concurrently \"npm run dev:server -- --inspect\" \"npm run dev:client\"",
    "dev:https": "concurrently \"npm run dev:server -- --https\" \"npm run dev:client -- --https\"",
    
    "// === BUILD & DEPLOY === //": "",
    "build": "npm run build:client && npm run build:server && npm run build:docs",
    "build:client": "cd client && npm run build",
    "build:server": "cd server && npm run build",
    "build:docs": "typedoc --out docs server/src client/src",
    "build:docker": "docker-compose -f docker/docker-compose.prod.yml build",
    "build:analyze": "cd client && npm run build:analyze",
    
    "// === TESTES COMPLETOS === //": "",
    "test": "npm run test:unit && npm run test:integration && npm run test:e2e",
    "test:unit": "concurrently \"npm run test:client:unit\" \"npm run test:server:unit\"",
    "test:integration": "cd server && npm run test:integration",
    "test:e2e": "playwright test",
    "test:client:unit": "cd client && npm run test",
    "test:server:unit": "cd server && npm run test",
    "test:watch": "concurrently \"npm run test:client:watch\" \"npm run test:server:watch\"",
    "test:client:watch": "cd client && npm run test:watch",
    "test:server:watch": "cd server && npm run test:watch",
    "test:coverage": "npm run test:client:coverage && npm run test:server:coverage",
    "test:client:coverage": "cd client && npm run test:coverage",
    "test:server:coverage": "cd server && npm run test:coverage",
    "test:performance": "artillery run tests/performance/load-test.yml",
    "test:security": "npm audit && npm run test:security:client && npm run test:security:server",
    "test:security:client": "cd client && npm audit",
    "test:security:server": "cd server && npm audit",
    
    "// === QUALIDADE DE CÓDIGO === //": "",
    "lint": "npm run lint:client && npm run lint:server",
    "lint:client": "cd client && npm run lint",
    "lint:server": "cd server && npm run lint",
    "lint:fix": "npm run lint:client:fix && npm run lint:server:fix",
    "lint:client:fix": "cd client && npm run lint:fix",
    "lint:server:fix": "cd server && npm run lint:fix",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md,yml}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,js,jsx,json,md,yml}\"",
    "typecheck": "npm run typecheck:client && npm run typecheck:server",
    "typecheck:client": "cd client && npm run typecheck",
    "typecheck:server": "cd server && npm run typecheck",
    
    "// === DATABASE === //": "",
    "db:setup": "cd server && npm run db:setup",
    "db:migrate": "cd server && npm run db:migrate",
    "db:migrate:dev": "cd server && npm run db:migrate:dev",
    "db:migrate:deploy": "cd server && npm run db:migrate:deploy",
    "db:migrate:reset": "cd server && npm run db:migrate:reset",
    "db:seed": "cd server && npm run db:seed",
    "db:studio": "cd server && npm run db:studio",
    "db:backup": "cd server && npm run db:backup",
    "db:restore": "cd server && npm run db:restore",
    "db:inspect": "cd server && npm run db:inspect",
    
    "// === DOCKER & CONTAINERS === //": "",
    "docker:dev": "docker-compose -f docker/docker-compose.yml up -d",
    "docker:prod": "docker-compose -f docker/docker-compose.prod.yml up -d",
    "docker:build": "docker-compose -f docker/docker-compose.yml build",
    "docker:logs": "docker-compose -f docker/docker-compose.yml logs -f",
    "docker:down": "docker-compose -f docker/docker-compose.yml down",
    "docker:clean": "docker system prune -a --volumes -f",
    
    "// === ANÁLISE E MONITORAMENTO === //": "",
    "analyze": "npm run analyze:bundle && npm run analyze:deps && npm run analyze:security",
    "analyze:bundle": "cd client && npm run analyze:bundle",
    "analyze:deps": "depcheck && madge --circular --extensions ts,tsx,js,jsx .",
    "analyze:security": "npm audit && snyk test",
    "analyze:performance": "cd client && npm run analyze:performance",
    "monitor:start": "pm2 start ecosystem.config.js",
    "monitor:stop": "pm2 stop ecosystem.config.js",
    "monitor:logs": "pm2 logs",
    
    "// === INSTALAÇÃO E CONFIGURAÇÃO === //": "",
    "install:all": "npm install && cd client && npm install && cd ../server && npm install",
    "install:clean": "npm run clean && npm run install:all",
    "clean": "rm -rf node_modules client/node_modules server/node_modules && rm -rf client/dist server/dist",
    "clean:cache": "npm cache clean --force && cd client && npm cache clean --force && cd ../server && npm cache clean --force",
    "setup": "npm run install:all && npm run db:setup && npm run build",
    "setup:dev": "npm run install:all && npm run db:setup && npm run db:seed",
    
    "// === DEPLOYMENT === //": "",
    "deploy": "npm run build && npm run deploy:staging",
    "deploy:staging": "gh-actions-deploy staging",
    "deploy:production": "gh-actions-deploy production",
    "deploy:docker": "npm run build:docker && docker-compose -f docker/docker-compose.prod.yml up -d",
    "deploy:vercel": "cd client && vercel --prod",
    "deploy:railway": "railway up",
    
    "// === UTILITÁRIOS === //": "",
    "generate": "npm run generate:types && npm run generate:docs && npm run generate:migration",
    "generate:types": "cd server && npm run generate:types",
    "generate:docs": "typedoc --out docs --theme minimal server/src client/src",
    "generate:migration": "cd server && npm run generate:migration",
    "validate": "npm run typecheck && npm run lint && npm run test:unit && npm run format:check",
    "pre-commit": "lint-staged",
    "pre-push": "npm run validate",
    "postinstall": "husky install && npm run setup:dev"
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm run validate",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,yml}": ["prettier --write"],
    "*.{css,scss}": ["stylelint --fix", "prettier --write"]
  }
}
```

### 🔄 GitHub Actions Avançado (CI/CD)
```yaml
# .github/workflows/ci-cd-master.yml
name: 🚀 Will Finance 5.0 - CI/CD Master Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 2 * * *' # Daily security scan at 2 AM

env:
  NODE_VERSION: '20'
  REGISTRY: ghcr.io
  IMAGE_NAME: will-finance-5.0

jobs:
  # === ANÁLISE ESTÁTICA === #
  static-analysis:
    name: 📊 Static Analysis
    runs-on: ubuntu-latest
    outputs:
      should-deploy: ${{ steps.changes.outputs.should-deploy }}
    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: 🔍 Detect changes
        id: changes
        uses: dorny/paths-filter@v2
        with:
          filters: |
            client:
              - 'client/**'
            server:
              - 'server/**'
            docs:
              - 'docs/**'
            should-deploy:
              - 'client/**'
              - 'server/**'
              - 'docker/**'

      - name: 🟢 Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: 📦 Install dependencies
        run: npm run install:all

      - name: 🔍 TypeScript check
        run: npm run typecheck

      - name: 🧹 Lint check
        run: npm run lint

      - name: 💅 Format check
        run: npm run format:check

      - name: 📈 Dependency analysis
        run: npm run analyze:deps

  # === TESTES UNITÁRIOS === #
  unit-tests:
    name: 🧪 Unit Tests
    runs-on: ubuntu-latest
    needs: static-analysis
    strategy:
      matrix:
        node-version: [18, 20]
    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4

      - name: 🟢 Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: 📦 Install dependencies
        run: npm run install:all

      - name: 🧪 Run unit tests
        run: npm run test:unit

      - name: 📊 Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./client/coverage/lcov.info,./server/coverage/lcov.info
          flags: unittests
          name: codecov-umbrella

  # === TESTES DE INTEGRAÇÃO === #
  integration-tests:
    name: 🔗 Integration Tests
    runs-on: ubuntu-latest
    needs: static-analysis
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: testpassword
          POSTGRES_DB: will_finance_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379
    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4

      - name: 🟢 Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: 📦 Install dependencies
        run: npm run install:all

      - name: 🗄️ Setup test database
        run: |
          cd server
          npm run db:migrate:deploy
          npm run db:seed:test
        env:
          DATABASE_URL: postgresql://postgres:testpassword@localhost:5432/will_finance_test

      - name: 🔗 Run integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://postgres:testpassword@localhost:5432/will_finance_test
          REDIS_URL: redis://localhost:6379

  # === TESTES E2E === #
  e2e-tests:
    name: 🎭 E2E Tests
    runs-on: ubuntu-latest
    needs: [static-analysis, unit-tests]
    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4

      - name: 🟢 Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: 📦 Install dependencies
        run: npm run install:all

      - name: 🎭 Install Playwright
        run: npx playwright install --with-deps

      - name: 🏗️ Build application
        run: npm run build

      - name: 🚀 Start application
        run: |
          npm run dev &
          npx wait-on http://localhost:5173
        timeout-minutes: 5

      - name: 🎭 Run Playwright tests
        run: npm run test:e2e

      - name: 📊 Upload E2E results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/

  # === SEGURANÇA === #
  security-scan:
    name: 🛡️ Security Scan
    runs-on: ubuntu-latest
    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4

      - name: 🔒 Run Snyk security scan
        uses: snyk/actions/node@master
        continue-on-error: true
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high

      - name: 🛡️ Run CodeQL analysis
        uses: github/codeql-action/init@v2
        with:
          languages: javascript, typescript

      - name: 🔍 Perform CodeQL analysis
        uses: github/codeql-action/analyze@v2

  # === BUILD === #
  build:
    name: 🏗️ Build Application
    runs-on: ubuntu-latest
    needs: [unit-tests, integration-tests]
    if: needs.static-analysis.outputs.should-deploy == 'true'
    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4

      - name: 🟢 Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: 📦 Install dependencies
        run: npm run install:all

      - name: 🏗️ Build application
        run: npm run build

      - name: 📦 Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-artifacts
          path: |
            client/dist/
            server/dist/

  # === DOCKER BUILD === #
  docker-build:
    name: 🐳 Docker Build
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    permissions:
      contents: read
      packages: write
    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4

      - name: 🐳 Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: 🔑 Log in to Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: 📋 Extract metadata
        id: meta
        uses: docker/metadata-action@v4
        with:
          images: ${{ env.REGISTRY }}/${{ github.repository }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=sha,prefix={{branch}}-
            type=raw,value=latest,enable={{is_default_branch}}

      - name: 🏗️ Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          file: ./docker/Dockerfile.prod
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  # === DEPLOY STAGING === #
  deploy-staging:
    name: 🚀 Deploy to Staging
    runs-on: ubuntu-latest
    needs: [build, docker-build, e2e-tests, security-scan]
    if: github.ref == 'refs/heads/develop'
    environment:
      name: staging
      url: https://staging.willfinance.com
    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4

      - name: 🚀 Deploy to staging
        run: |
          echo "Deploying to staging environment"
          # Add your staging deployment commands here

      - name: 🔍 Run smoke tests
        run: |
          curl -f https://staging.willfinance.com/health || exit 1
          npm run test:smoke -- --baseURL https://staging.willfinance.com

  # === DEPLOY PRODUCTION === #
  deploy-production:
    name: 🌟 Deploy to Production
    runs-on: ubuntu-latest
    needs: [build, docker-build, e2e-tests, security-scan]
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
      url: https://willfinance.com
    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4

      - name: 🌟 Deploy to production
        run: |
          echo "Deploying to production environment"
          # Add your production deployment commands here

      - name: 🔍 Run smoke tests
        run: |
          curl -f https://willfinance.com/health || exit 1
          npm run test:smoke -- --baseURL https://willfinance.com

      - name: 📢 Notify deployment
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          channel: '#deployments'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}

  # === PERFORMANCE MONITORING === #
  performance-monitoring:
    name: 📈 Performance Monitoring
    runs-on: ubuntu-latest
    needs: deploy-production
    if: github.ref == 'refs/heads/main'
    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4

      - name: 🟢 Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - name: 📊 Run Lighthouse CI
        run: |
          npm install -g @lhci/cli@0.12.x
          lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}

      - name: 🚀 Run load tests
        run: npm run test:performance
```

### 🐳 Docker Configuration Master
```dockerfile
# docker/Dockerfile.prod
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache dumb-init

# === CLIENT BUILD STAGE === #
FROM base AS client-builder
COPY client/package*.json ./client/
RUN cd client && npm ci --only=production

COPY client/ ./client/
RUN cd client && npm run build

# === SERVER BUILD STAGE === #
FROM base AS server-builder
COPY server/package*.json ./server/
RUN cd server && npm ci --only=production

COPY server/ ./server/
RUN cd server && npm run build

# === PRODUCTION STAGE === #
FROM base AS production
ENV NODE_ENV=production
ENV PORT=8080

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Copy built applications
COPY --from=client-builder --chown=nextjs:nodejs /app/client/dist ./client/dist
COPY --from=server-builder --chown=nextjs:nodejs /app/server/dist ./server/dist
COPY --from=server-builder --chown=nextjs:nodejs /app/server/node_modules ./server/node_modules
COPY --from=server-builder --chown=nextjs:nodejs /app/server/package.json ./server/package.json

# Copy Prisma schema and migrations
COPY --chown=nextjs:nodejs server/prisma ./server/prisma

USER nextjs

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server/dist/index.js"]
```

```yaml
# docker/docker-compose.prod.yml
version: '3.8'

services:
  app:
    build:
      context: ..
      dockerfile: docker/Dockerfile.prod
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - postgres
      - redis
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: will_finance
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER} -d will_finance"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 3

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

---

## 🚀 Comandos Essenciais

```bash
# Desenvolvimento
npm run dev              # Inicia cliente e servidor
npm run dev:client       # Apenas cliente (porta 5173)
npm run dev:server       # Apenas servidor (porta 8080)

# Database
npm run db:setup         # Configura banco inicial
npm run db:migrate       # Aplica migrações
npm run db:studio        # Interface visual Prisma

# Qualidade de código
npm run lint             # ESLint em todo projeto
npm run test             # Testes unitários e e2e
npm run build            # Build de produção

# Docker
docker-compose up -d     # Ambiente containerizado
docker-compose logs -f   # Visualizar logs
```

---

## 🎯 Objetivos de Qualidade

### Code Coverage
- **Mínimo:** 80% de cobertura nos testes
- **Meta:** 90% de cobertura crítica

### Performance
- **Frontend:** First Contentful Paint < 2s
- **Backend:** Response time < 100ms (95th percentile)

### Segurança
- **Autenticação:** JWT + Firebase Auth
- **Validação:** Sanitização de todas as entradas
- **CORS:** Configurado adequadamente para produção
a Distribuída:** Microserviços + Redis + load balancer
- 🔄 **Real-time:** WebSockets + notificações push + sync automático
- 📱 **Multi-platform:** PWA + Electron + mobile-first + responsive
- 🛡️ **Enterprise Ready:** Logs estruturados + monitoring + health checks
- 🚀 **DevOps Avançado:** CI/CD + Docker + Kubernetes + auto-deploy

---

## 🛠️ STACK TECNOLÓGICA AVANÇADA

### 🎨 Frontend Master (`client/`)
```typescript
// Core Technologies - Nível Enterprise
- React 18.2+ + TypeScript 5.0+ + Vite 5.0+
- Tailwind CSS 3.4+ + PostCSS + CSS Modules
- Framer Motion 11+ + Three.js + React Three Fiber
- TanStack Query v5 (React Query) + optimistic updates
- Zustand 4+ + Immer + middleware avançado
- React Hook Form 7+ + Zod + schema validation
- Firebase Auth + multi-provider + 2FA + social login
- React Router v6 + lazy routes + protected routes
- Lucide React + Heroicons + custom SVG icons
- React Hot Toast + sonner + notification system
- React DnD + drag and drop avançado
- Chart.js 4+ + D3.js + custom visualizations
- React Virtualized + infinite scrolling
- React Helmet Async + SEO otimizado
- Workbox + service workers + offline support
- React 18.2+ + TypeScript 5.0+ + Vite 5.0+
- Tailwind CSS 3.4+ + PostCSS + CSS Modules
- Framer Motion 11+ + Three.js + React Three Fiber
- TanStack Query v5 (React Query) + optimistic updates
- Zustand 4+ + Immer + middleware avançado
- React Hook Form 7+ + Zod + schema validation
- Firebase Auth + multi-provider + 2FA + social login
- React Router v6 + lazy routes + protected routes
- Lucide React + Heroicons + custom SVG icons
- React Hot Toast + sonner + notification system
- React DnD + drag and drop avançado
- Chart.js 4+ + D3.js + custom visualizations
- React Virtualized + infinite scrolling
- React Helmet Async + SEO otimizado
- Workbox + service workers + offline support

// Development & Quality
- Vite plugins ecosystem + HMR otimizado
- ESLint 8+ + Prettier + import sorting
- Husky + lint-staged + commit hooks
- Vitest + Testing Library + Playwright E2E
- Storybook + visual testing + documentation
- TypeScript strict mode + exact types
- Bundle analyzer + performance monitoring
```

### 🖥️ Backend Master (`server/`)
```typescript
// Core Technologies - Enterprise Grade
- Node.js 20+ + Express 4.18+ + TypeScript 5.0+
- Prisma ORM 5+ + PostgreSQL 16+ + connection pooling
- JWT + Passport.js + OAuth2 + refresh tokens
- Multer + Sharp + image processing + S3 upload
- Redis 7+ + caching + session store + pub/sub
- Winston + structured logging + log aggregation
- Helmet + CORS + rate limiting + security headers
- Compression + gzip + response optimization
- Socket.io + real-time + room management
- Bull Queue + background jobs + cron scheduling
- Nodemailer + email templates + SMTP/SES
- Joi/Zod + input validation + sanitization
- Swagger/OpenAPI + auto-generated docs
- Morgan + request logging + analytics
- Dotenv + config management + secrets

// Database & Infrastructure
- Prisma migrations + seeding + schemas
- Database indexes + query optimization
- Connection pooling + read replicas
- Backup strategies + point-in-time recovery
- Database monitoring + slow query analysis
```

### 🔧 DevOps & Infrastructure Master
```yaml
# Enterprise Infrastructure
- Docker + multi-stage builds + optimization
- Docker Compose + development orchestration
- Kubernetes + production deployment + scaling
- GitHub Actions + advanced CI/CD pipelines
- Nginx + reverse proxy + load balancing
- SSL/TLS + HTTPS + security certificates
- CDN + static asset optimization + global distribution
- Monitoring + Prometheus + Grafana + alerts
- Logging + ELK Stack + centralized logs
- Error tracking + Sentry + performance monitoring
- Environment management + secrets + config
- Database migrations + zero-downtime deployments
- Health checks + liveness probes + readiness probes
- Backup automation + disaster recovery
- Security scanning + vulnerability assessment
```

### 🧪 Testing & Quality Master
```typescript
// Comprehensive Testing Strategy
- Unit Tests: Vitest + 90%+ coverage + mocking
- Integration Tests: Supertest + database testing
- E2E Tests: Playwright + visual regression
- Component Tests: Testing Library + accessibility
- API Tests: Postman/Newman + automated collection
- Performance Tests: Lighthouse + Core Web Vitals
- Security Tests: OWASP + penetration testing
- Load Tests: Artillery + stress testing
- Snapshot Tests: Jest + UI regression
- Contract Tests: Pact + API compatibility
```
---

## 📁 ARQUITETURA ENTERPRISE AVANÇADA

### 🎨 Frontend Architecture (`client/src/`)
```
client/src/
├── 🎯 components/           # Componentes reutilizáveis organizados
│   ├── auth/               # Autenticação completa
│   │   ├── LoginForm.tsx   # Form de login otimizado
│   │   ├── RegisterForm.tsx # Registro com validação
│   │   ├── AuthCallback.tsx # Callback social login
│   │   ├── ProtectedRoute.tsx # Route protection
│   │   └── AuthProvider.tsx # Context provider
│   ├── dashboard/          # Dashboard components
│   │   ├── DashboardCards.tsx # Cards métricas
│   │   ├── Charts/         # Gráficos avançados
│   │   │   ├── LineChart.tsx
│   │   │   ├── PieChart.tsx
│   │   │   ├── BarChart.tsx
│   │   │   └── CustomChart.tsx
│   │   ├── Summary.tsx     # Resumo financeiro
│   │   └── Widgets/        # Widgets customizáveis
│   ├── transactions/       # Gestão de transações
│   │   ├── TransactionList.tsx # Lista otimizada
│   │   ├── TransactionModal.tsx # Modal CRUD
│   │   ├── TransactionForm.tsx # Form validado
│   │   ├── TransactionFilters.tsx # Filtros avançados
│   │   ├── BulkActions.tsx # Ações em lote
│   │   └── ImportExport.tsx # Import/Export CSV
│   ├── budgets/            # Orçamentos
│   │   ├── BudgetManager.tsx
│   │   ├── BudgetChart.tsx
│   │   └── BudgetAlerts.tsx
│   ├── reports/            # Relatórios avançados
│   │   ├── FinancialReport.tsx
│   │   ├── CategoryReport.tsx
│   │   ├── TrendAnalysis.tsx
│   │   └── ExportOptions.tsx
│   ├── layout/             # Layout components
│   │   ├── Layout.tsx      # Layout principal
│   │   ├── Sidebar.tsx     # Sidebar responsiva
│   │   ├── Header.tsx      # Header com search
│   │   ├── Footer.tsx      # Footer informativo
│   │   ├── Breadcrumb.tsx  # Navegação
│   │   └── MobileNav.tsx   # Navegação mobile
│   ├── ui/                 # UI primitives
│   │   ├── Button.tsx      # Button component
│   │   ├── Input.tsx       # Input otimizado
│   │   ├── Select.tsx      # Select customizado
│   │   ├── Modal.tsx       # Modal reusável
│   │   ├── Loading.tsx     # Loading states
│   │   ├── ErrorBoundary.tsx # Error handling
│   │   ├── Toast.tsx       # Notification system
│   │   ├── Table.tsx       # Table component
│   │   ├── Pagination.tsx  # Paginação avançada
│   │   └── DataPicker.tsx  # Date picker
│   └── ai/                 # IA Integration
│       ├── ChatBot.tsx     # Chat assistant
│       ├── Insights.tsx    # AI insights
│       └── Predictions.tsx # Previsões IA
├── 📄 pages/               # Páginas principais
│   ├── Dashboard/          # Dashboard page
│   │   ├── DashboardPage.tsx
│   │   └── DashboardLayout.tsx
│   ├── Transactions/       # Transações
│   │   ├── TransactionsPage.tsx
│   │   ├── TransactionDetail.tsx
│   │   └── TransactionImport.tsx
│   ├── Budgets/           # Orçamentos
│   │   ├── BudgetsPage.tsx
│   │   └── BudgetDetail.tsx
│   ├── Reports/           # Relatórios
│   │   ├── ReportsPage.tsx
│   │   ├── FinancialReport.tsx
│   │   └── CustomReport.tsx
│   ├── Settings/          # Configurações
│   │   ├── SettingsPage.tsx
│   │   ├── ProfileSettings.tsx
│   │   ├── AccountSettings.tsx
│   │   └── NotificationSettings.tsx
│   ├── Auth/              # Páginas de auth
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   └── ForgotPassword.tsx
│   └── Admin/             # Admin pages
│       ├── AdminDashboard.tsx
│       ├── UserManagement.tsx
│       └── SystemSettings.tsx
├── 🪝 hooks/              # Custom hooks avançados
│   ├── useAuth.ts         # Autenticação hook
│   ├── useTransactions.ts # Transações hook
│   ├── useBudgets.ts      # Orçamentos hook
│   ├── useReports.ts      # Relatórios hook
│   ├── useLocalStorage.ts # LocalStorage hook
│   ├── useDebounce.ts     # Debounce hook
│   ├── useInfiniteScroll.ts # Infinite scroll
│   ├── useWebSocket.ts    # WebSocket hook
│   ├── usePermissions.ts  # Permissions hook
│   └── useAnalytics.ts    # Analytics hook
├── 🌐 contexts/           # React contexts
│   ├── AuthContext.tsx    # Auth context
│   ├── ThemeContext.tsx   # Theme context
│   ├── NotificationContext.tsx # Notifications
│   └── PermissionsContext.tsx # Permissions
├── 🗃️ stores/             # Estado global (Zustand)
│   ├── authStore.ts       # Auth state
│   ├── transactionStore.ts # Transactions state
│   ├── budgetStore.ts     # Budget state
│   ├── themeStore.ts      # Theme state
│   ├── notificationStore.ts # Notifications
│   └── settingsStore.ts   # Settings state
├── 📝 types/              # TypeScript types
│   ├── auth.ts            # Auth types
│   ├── transaction.ts     # Transaction types
│   ├── budget.ts          # Budget types
│   ├── report.ts          # Report types
│   ├── api.ts             # API types
│   ├── database.ts        # Database types
│   └── index.ts           # Exports centralizados
├── 🔧 utils/              # Utilitários
│   ├── formatters.ts      # formatCurrency, formatDate
│   ├── validators.ts      # Validações Zod
│   ├── constants.ts       # Constantes da aplicação
│   ├── helpers.ts         # Helper functions
│   ├── calculations.ts    # Cálculos financeiros
│   ├── exporters.ts       # Export utilities
│   ├── importers.ts       # Import utilities
│   └── analytics.ts       # Analytics utilities
├── 📚 lib/                # Configurações externas
│   ├── firebase.ts        # Config Firebase
│   ├── api.ts             # Axios config
│   ├── websocket.ts       # WebSocket config
│   ├── analytics.ts       # Analytics config
│   └── permissions.ts     # Permissions config
├── 🎨 styles/             # Estilos globais
│   ├── index.css          # CSS principal
│   ├── cyberpunk-themes.css # Temas cyberpunk
│   ├── components.css     # Component styles
│   └── utilities.css      # Utility classes
└── 🧪 __tests__/          # Tests
    ├── components/        # Component tests
    ├── hooks/            # Hook tests
    ├── utils/            # Utility tests
    └── integration/      # Integration tests
```

### 🖥️ Backend Architecture (`server/src/`)
```
server/src/
├── 🎯 modules/            # Módulos por domínio (DDD)
│   ├── auth/             # Autenticação completa
│   │   ├── controllers/
│   │   │   └── auth.controller.ts
│   │   ├── services/
│   │   │   └── auth.service.ts
│   │   ├── dto/
│   │   │   ├── login.dto.ts
│   │   │   └── register.dto.ts
│   │   ├── strategies/
│   │   │   ├── jwt.strategy.ts
│   │   │   ├── google.strategy.ts
│   │   │   └── local.strategy.ts
│   │   ├── middleware/
│   │   │   └── auth.middleware.ts
│   │   └── routes/
│   │       └── auth.routes.ts
│   ├── transactions/     # Gestão completa de transações
│   │   ├── controllers/
│   │   │   ├── transaction.controller.ts
│   │   │   └── bulk.controller.ts
│   │   ├── services/
│   │   │   ├── transaction.service.ts
│   │   │   ├── import.service.ts
│   │   │   └── export.service.ts
│   │   ├── dto/
│   │   │   ├── create-transaction.dto.ts
│   │   │   └── update-transaction.dto.ts
│   │   ├── validators/
│   │   │   └── transaction.validator.ts
│   │   └── routes/
│   │       └── transaction.routes.ts
│   ├── budgets/          # Gestão de orçamentos
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── dto/
│   │   └── routes/
│   ├── reports/          # Relatórios e analytics
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── generators/
│   │   └── routes/
│   ├── users/            # Gestão de usuários
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── dto/
│   │   └── routes/
│   ├── categories/       # Categorias
│   │   ├── controllers/
│   │   ├── services/
│   │   └── routes/
│   ├── accounts/         # Contas bancárias
│   │   ├── controllers/
│   │   ├── services/
│   │   └── routes/
│   ├── files/            # Upload e processamento
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── processors/
│   │   └── routes/
│   ├── notifications/    # Sistema de notificações
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── templates/
│   │   └── routes/
│   └── ai/               # Integração IA
│       ├── controllers/
│       ├── services/
│       ├── models/
│       └── routes/
├── 🔧 shared/            # Código compartilhado
│   ├── decorators/       # Decorators customizados
│   │   ├── roles.decorator.ts
│   │   └── validation.decorator.ts
│   ├── filters/          # Exception filters
│   │   ├── http-exception.filter.ts
│   │   └── validation.filter.ts
│   ├── pipes/            # Validation pipes
│   │   ├── validation.pipe.ts
│   │   └── transform.pipe.ts
│   ├── guards/           # Auth guards
│   │   ├── auth.guard.ts
│   │   ├── roles.guard.ts
│   │   └── permissions.guard.ts
│   ├── interceptors/     # Request interceptors
│   │   ├── logging.interceptor.ts
│   │   └── response.interceptor.ts
│   └── utils/            # Shared utilities
│       ├── crypto.util.ts
│       ├── date.util.ts
│       └── validation.util.ts
├── ⚙️ config/            # Configurações globais
│   ├── database.ts       # Prisma config
│   ├── jwt.config.ts     # JWT config
│   ├── cors.config.ts    # CORS config
│   ├── redis.config.ts   # Redis config
│   ├── email.config.ts   # Email config
│   └── app.config.ts     # App config
├── 🔄 middleware/        # Middlewares globais
│   ├── auth.middleware.ts # Auth middleware
│   ├── error.middleware.ts # Error handling
│   ├── logging.middleware.ts # Logging
│   ├── rate-limit.middleware.ts # Rate limiting
│   ├── validation.middleware.ts # Validation
│   └── cors.middleware.ts # CORS handling
├── 🗄️ prisma/            # Database schema
│   ├── schema.prisma     # Prisma schema
│   ├── migrations/       # Database migrations
│   ├── seeds/           # Database seeds
│   └── fixtures/        # Test fixtures
├── 📝 types/             # TypeScript types
│   ├── express.d.ts      # Express extensions
│   ├── user.types.ts     # User types
│   ├── transaction.types.ts # Transaction types
│   └── global.types.ts   # Global types
├── 🧪 __tests__/         # Backend tests
│   ├── unit/            # Unit tests
│   ├── integration/     # Integration tests
│   ├── e2e/            # End-to-end tests
│   └── fixtures/       # Test fixtures
└── 📊 scripts/          # Utility scripts
    ├── seed.ts          # Database seeding
    ├── migrate.ts       # Migration runner
    └── cleanup.ts       # Cleanup utilities
```

---

## 📋 CONVENÇÕES E PADRÕES ENTERPRISE

### 🔤 Nomenclatura Profissional
| Tipo | Convenção | Exemplo | Justificativa |
|------|-----------|---------|---------------|
| **Arquivos/Funções** | `camelCase` | `getUserData()`, `transactionService.ts` | Padrão JavaScript/TypeScript |
| **Componentes/Classes** | `PascalCase` | `TransactionModal`, `UserService` | Padrão React/OOP |
| **Tipos/Interfaces** | `PascalCase` | `Transaction`, `LoginData` | Convenção TypeScript |
| **Constantes** | `UPPER_SNAKE_CASE` | `MAX_RETRIES`, `API_ENDPOINTS` | Imutabilidade clara |
| **Diretórios** | `kebab-case` | `import-export/`, `user-profile/` | URL-friendly |
| **Variáveis CSS** | `kebab-case` | `--cyber-primary`, `--bg-secondary` | Padrão CSS |
| **Enum Values** | `UPPER_SNAKE_CASE` | `USER_ROLE.ADMIN` | Consistência enum |
| **Database Tables** | `snake_case` | `user_transactions`, `budget_categories` | SQL convention |

### 🏗️ Estrutura de Componentes React Master
```typescript
// Template padrão para componentes React enterprise
import { memo, useCallback, useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

// 1. Props Schema (Zod validation)
const ComponentPropsSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, 'Title is required'),
  data: z.array(z.unknown()).optional(),
  onAction: z.function().optional(),
  variant: z.enum(['primary', 'secondary', 'danger']).default('primary'),
});

type ComponentProps = z.infer<typeof ComponentPropsSchema>;

// 2. Component Implementation
export const ComponentName = memo<ComponentProps>(({ 
  id, 
  title, 
  data = [], 
  onAction,
  variant = 'primary' 
}) => {
  // 3. Validate props
  const validatedProps = useMemo(() => {
    return ComponentPropsSchema.parse({ id, title, data, onAction, variant });
  }, [id, title, data, onAction, variant]);

  // 4. Local state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 5. Server state (React Query)
  const { 
    data: serverData, 
    isLoading: isServerLoading,
    error: serverError,
    refetch 
  } = useQuery({
    queryKey: ['component-data', id],
    queryFn: () => fetchComponentData(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });

  // 6. Mutations
  const { mutate: updateData, isPending: isUpdating } = useMutation({
    mutationFn: updateComponentData,
    onSuccess: () => {
      toast.success('Dados atualizados com sucesso!');
      refetch();
    },
    onError: (error) => {
      toast.error(`Erro: ${error.message}`);
      setError(error.message);
    },
  });

  // 7. Memoized computations
  const processedData = useMemo(() => {
    if (!serverData) return [];
    return serverData.map(item => ({
      ...item,
      formatted: formatDisplayValue(item.value)
    }));
  }, [serverData]);

  // 8. Callbacks
  const handleAction = useCallback((actionData: unknown) => {
    try {
      setError(null);
      onAction?.(actionData);
      updateData(actionData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  }, [onAction, updateData]);

  // 9. Effects
  useEffect(() => {
    if (serverError) {
      setError(serverError.message);
      toast.error(`Erro ao carregar dados: ${serverError.message}`);
    }
  }, [serverError]);

  // 10. Loading state
  if (isServerLoading || isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center p-8"
      >
        <div className="animate-pulse text-cyber-primary">Carregando...</div>
      </motion.div>
    );
  }

  // 11. Error state
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
      >
        <p className="text-red-400">{error}</p>
        <button 
          onClick={() => refetch()}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
        >
          Tentar Novamente
        </button>
      </motion.div>
    );
  }

  // 12. Main render
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`
        component-container
        ${variant === 'primary' ? 'bg-cyber-primary/10' : ''}
        ${variant === 'secondary' ? 'bg-cyber-secondary/10' : ''}
        ${variant === 'danger' ? 'bg-red-500/10' : ''}
      `}
      data-testid={`component-${id}`}
    >
      <header className="component-header">
        <h2 className="text-xl font-bold text-cyber-primary">{title}</h2>
      </header>
      
      <main className="component-content">
        {processedData.length > 0 ? (
          <ul className="space-y-2">
            {processedData.map((item, index) => (
              <motion.li
                key={item.id || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-2 bg-background-secondary/50 rounded"
              >
                {item.formatted}
              </motion.li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">Nenhum dado disponível</p>
        )}
      </main>

      <footer className="component-footer">
        <button
          onClick={() => handleAction({ type: 'refresh' })}
          disabled={isUpdating}
          className="btn btn-primary"
        >
          {isUpdating ? 'Atualizando...' : 'Atualizar'}
        </button>
      </footer>
    </motion.div>
  );
});

// 13. Display name for debugging
ComponentName.displayName = 'ComponentName';

// 14. Default export
export default ComponentName;

// 15. Helper functions
async function fetchComponentData(id: string) {
  const response = await fetch(`/api/components/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch component data');
  }
  return response.json();
}

async function updateComponentData(data: unknown) {
  const response = await fetch('/api/components/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to update component data');
  }
  return response.json();
}

function formatDisplayValue(value: unknown): string {
  if (typeof value === 'number') {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }
  return String(value);
}
```

### 🎨 Padrões de Estilo Cyberpunk Avançados
```css
/* Tema Cyberpunk Master - Variáveis CSS Enterprise */
:root {
  /* Primary Colors - Neon Cyberpunk */
  --cyber-primary: #00FFFF;          /* Cyan neon principal */
  --cyber-primary-dark: #00CCCC;     /* Cyan escuro */
  --cyber-primary-light: #66FFFF;    /* Cyan claro */
  
  --cyber-secondary: #FF0080;        /* Pink neon secundário */
  --cyber-secondary-dark: #CC0066;   /* Pink escuro */
  --cyber-secondary-light: #FF66B3;  /* Pink claro */
  
  --cyber-accent: #39FF14;           /* Green neon accent */
  --cyber-accent-dark: #2ECC11;      /* Green escuro */
  --cyber-accent-light: #66FF4D;     /* Green claro */
  
  --cyber-warning: #FFD700;          /* Gold warning */
  --cyber-danger: #FF0040;           /* Red neon danger */
  --cyber-success: #00FF41;          /* Matrix green success */
  
  /* Background Colors - Dark Cyberpunk */
  --background-primary: #0A0A0F;     /* Ultra dark base */
  --background-secondary: #1A1A2E;   /* Card background */
  --background-tertiary: #16213E;    /* Elevated background */
  --background-accent: #0F3460;      /* Accent background */
  
  /* Text Colors */
  --foreground-primary: #FFFFFF;     /* Primary text */
  --foreground-secondary: #E2E8F0;   /* Secondary text */
  --foreground-muted: #94A3B8;       /* Muted text */
  --foreground-disabled: #64748B;    /* Disabled text */
  
  /* Border Colors */
  --border-primary: rgba(0, 255, 255, 0.3);    /* Cyan border */
  --border-secondary: rgba(255, 0, 128, 0.2);  /* Pink border */
  --border-muted: rgba(148, 163, 184, 0.2);    /* Muted border */
  
  /* Shadow Effects */
  --shadow-glow: 0 0 20px currentColor;
  --shadow-neon: 0 0 10px var(--cyber-primary), 0 0 20px var(--cyber-primary);
  --shadow-pink-neon: 0 0 10px var(--cyber-secondary), 0 0 20px var(--cyber-secondary);
  --shadow-elevation: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  
  /* Gradients */
  --gradient-primary: linear-gradient(135deg, var(--cyber-primary), var(--cyber-secondary));
  --gradient-background: linear-gradient(135deg, var(--background-primary), var(--background-secondary));
  --gradient-card: linear-gradient(135deg, var(--background-secondary), var(--background-tertiary));
  
  /* Animations */
  --animation-fast: 0.15s ease;
  --animation-normal: 0.3s ease;
  --animation-slow: 0.5s ease;
  --animation-pulse: pulse 2s infinite;
  
  /* Typography */
  --font-family-primary: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-family-mono: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
  
  /* Spacing */
  --spacing-xs: 0.25rem;   /* 4px */
  --spacing-sm: 0.5rem;    /* 8px */
  --spacing-md: 1rem;      /* 16px */
  --spacing-lg: 1.5rem;    /* 24px */
  --spacing-xl: 2rem;      /* 32px */
  --spacing-2xl: 3rem;     /* 48px */
  
  /* Border Radius */
  --radius-sm: 0.25rem;    /* 4px */
  --radius-md: 0.5rem;     /* 8px */
  --radius-lg: 1rem;       /* 16px */
  --radius-full: 9999px;   /* Full rounded */
}

/* Dark mode overrides */
[data-theme="dark"] {
  --background-primary: #000000;
  --background-secondary: #111111;
  --cyber-primary: #00FFFF;
  --cyber-secondary: #FF0080;
}

/* Light mode (for accessibility) */
[data-theme="light"] {
  --background-primary: #FFFFFF;
  --background-secondary: #F8FAFC;
  --foreground-primary: #1E293B;
  --cyber-primary: #0891B2;
  --cyber-secondary: #BE185D;
}

/* Component Classes - Enterprise Level */
.glass {
  background: rgba(26, 26, 46, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
}

.glass-strong {
  background: rgba(26, 26, 46, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-primary);
}

.text-glow {
  text-shadow: var(--shadow-glow);
}

.text-neon {
  color: var(--cyber-primary);
  text-shadow: var(--shadow-neon);
}

.text-pink-neon {
  color: var(--cyber-secondary);
  text-shadow: var(--shadow-pink-neon);
}

/* Button Styles - Premium */
.btn {
  @apply inline-flex items-center justify-center;
  @apply px-4 py-2 rounded-lg font-medium;
  @apply transition-all duration-300;
  @apply focus:outline-none focus:ring-2 focus:ring-offset-2;
  @apply disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-primary {
  background: var(--gradient-primary);
  color: var(--background-primary);
  box-shadow: var(--shadow-neon);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-neon), var(--shadow-elevation);
}

.btn-secondary {
  background: transparent;
  color: var(--cyber-primary);
  border: 1px solid var(--cyber-primary);
}

.btn-secondary:hover {
  background: var(--cyber-primary);
  color: var(--background-primary);
  box-shadow: var(--shadow-neon);
}

.btn-ghost {
  background: transparent;
  color: var(--foreground-secondary);
}

.btn-ghost:hover {
  background: var(--background-tertiary);
  color: var(--cyber-primary);
}

/* Input Styles - Professional */
.input {
  @apply w-full px-4 py-3 rounded-lg;
  background: var(--background-secondary);
  border: 1px solid var(--border-muted);
  color: var(--foreground-primary);
  transition: var(--animation-normal);
}

.input:focus {
  border-color: var(--cyber-primary);
  box-shadow: 0 0 0 3px rgba(0, 255, 255, 0.1);
  outline: none;
}

.input:invalid {
  border-color: var(--cyber-danger);
  box-shadow: 0 0 0 3px rgba(255, 0, 64, 0.1);
}

/* Card Styles - Enterprise */
.card {
  background: var(--gradient-card);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-elevation);
  transition: var(--animation-normal);
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-elevation), var(--shadow-neon);
  border-color: var(--cyber-primary);
}

.card-header {
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--border-muted);
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--cyber-primary);
  margin-bottom: var(--spacing-sm);
}

.card-description {
  color: var(--foreground-muted);
  font-size: 0.875rem;
}

/* Animation Classes */
.animate-pulse-neon {
  animation: pulseNeon 2s ease-in-out infinite alternate;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-glow {
  animation: glow 2s ease-in-out infinite alternate;
}

/* Keyframes */
@keyframes pulseNeon {
  from {
    text-shadow: 0 0 5px var(--cyber-primary), 0 0 10px var(--cyber-primary);
  }
  to {
    text-shadow: 0 0 10px var(--cyber-primary), 0 0 20px var(--cyber-primary), 0 0 30px var(--cyber-primary);
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

@keyframes glow {
  from {
    box-shadow: 0 0 5px var(--cyber-primary);
  }
  to {
    box-shadow: 0 0 20px var(--cyber-primary), 0 0 30px var(--cyber-primary);
  }
}

/* Responsive Utilities */
.container {
  width: 100%;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

@media (min-width: 640px) {
  .container { max-width: 640px; }
}

@media (min-width: 768px) {
  .container { max-width: 768px; }
}

@media (min-width: 1024px) {
  .container { max-width: 1024px; }
}

@media (min-width: 1280px) {
  .container { max-width: 1280px; }
}

/* Accessibility */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  :root {
    --cyber-primary: #FFFFFF;
    --cyber-secondary: #FFFFFF;
    --background-primary: #000000;
    --background-secondary: #000000;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 🔧 GUIDELINES DE DESENVOLVIMENTO ENTERPRISE

### 1. 📝 TypeScript Obrigatório Avançado
```typescript
// ❌ NUNCA - Código sem tipos adequados
function processData(data: any): any {
  return data.map((item: any) => item.value);
}

// ✅ SEMPRE - Tipos específicos e validação
interface DataItem {
  id: string;
  value: number;
  label: string;
  category: 'income' | 'expense';
  metadata?: Record<string, unknown>;
}

interface ProcessDataOptions {
  sortBy?: keyof DataItem;
  filterBy?: (item: DataItem) => boolean;
  limit?: number;
}

function processData(
  data: DataItem[], 
  options: ProcessDataOptions = {}
): { processed: number[]; total: number } {
  const { sortBy = 'value', filterBy, limit } = options;
  
  let filteredData = filterBy ? data.filter(filterBy) : data;
  
  if (limit && limit > 0) {
    filteredData = filteredData.slice(0, limit);
  }
  
  const sortedData = filteredData.sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return bValue - aValue; // Descending order
    }
    
    return String(aValue).localeCompare(String(bValue));
  });
  
  return {
    processed: sortedData.map(item => item.value),
    total: filteredData.length
  };
}

// Uso com type safety completo
const result = processData(transactionData, {
  filterBy: (item) => item.category === 'income',
  sortBy: 'value',
  limit: 10
});
```

### 2. 🛡️ Validação Rigorosa com Zod
```typescript
import { z } from 'zod';

// Schema base para transação
const BaseTransactionSchema = z.object({
  id: z.string().uuid('ID deve ser um UUID válido'),
  description: z.string()
    .min(1, 'Descrição é obrigatória')
    .max(255, 'Descrição muito longa')
    .trim(),
  amount: z.number()
    .positive('Valor deve ser positivo')
    .max(999999999.99, 'Valor muito alto')
    .refine(val => Number(val.toFixed(2)) === val, 'Máximo 2 casas decimais'),
  type: z.enum(['INCOME', 'EXPENSE'], {
    errorMap: () => ({ message: 'Tipo deve ser INCOME ou EXPENSE' })
  }),
  category: z.string().min(1, 'Categoria é obrigatória'),
  date: z.string()
    .datetime('Data inválida')
    .or(z.date())
    .transform(val => typeof val === 'string' ? new Date(val) : val),
  tags: z.array(z.string()).optional().default([]),
  metadata: z.record(z.unknown()).optional(),
});

// Schemas específicos para diferentes operações
const CreateTransactionSchema = BaseTransactionSchema.omit({ id: true });
const UpdateTransactionSchema = BaseTransactionSchema.partial().required({ id: true });
const QueryTransactionSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  type: z.enum(['INCOME', 'EXPENSE']).optional(),
  search: z.string().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  categoryIds: z.array(z.string().uuid()).optional(),
});

// Types derivados dos schemas
type Transaction = z.infer<typeof BaseTransactionSchema>;
type CreateTransactionData = z.infer<typeof CreateTransactionSchema>;
type UpdateTransactionData = z.infer<typeof UpdateTransactionSchema>;
type TransactionQuery = z.infer<typeof QueryTransactionSchema>;

// Função de validação com error handling
function validateTransactionData<T extends z.ZodSchema>(
  schema: T,
  data: unknown
): { success: true; data: z.infer<T> } | { success: false; errors: string[] } {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      return { success: false, errors };
    }
    return { success: false, errors: ['Erro de validação desconhecido'] };
  }
}

// Uso em controller
export async function createTransaction(req: Request, res: Response) {
  const validation = validateTransactionData(CreateTransactionSchema, req.body);
  
  if (!validation.success) {
    return res.status(400).json({
      success: false,
      message: 'Dados inválidos',
      errors: validation.errors
    });
  }
  
  // Dados são type-safe aqui
  const transactionData = validation.data;
  
  try {
    const transaction = await transactionService.create(transactionData);
    res.json({
      success: true,
      data: transaction,
      message: 'Transação criada com sucesso'
    });
  } catch (error) {
    // Error handling...
  }
}
```

### 3. 🎯 Tratamento de Erros Enterprise
```typescript
// Base error classes
export abstract class BaseError extends Error {
  abstract readonly statusCode: number;
  abstract readonly code: string;
  abstract readonly isOperational: boolean;

  constructor(message: string, public readonly context?: Record<string, unknown>) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends BaseError {
  readonly statusCode = 400;
  readonly code = 'VALIDATION_ERROR';
  readonly isOperational = true;

  constructor(message: string, public readonly fields: string[] = []) {
    super(message);
  }
}

export class NotFoundError extends BaseError {
  readonly statusCode = 404;
  readonly code = 'NOT_FOUND';
  readonly isOperational = true;
}

export class UnauthorizedError extends BaseError {
  readonly statusCode = 401;
  readonly code = 'UNAUTHORIZED';
  readonly isOperational = true;
}

export class ForbiddenError extends BaseError {
  readonly statusCode = 403;
  readonly code = 'FORBIDDEN';
  readonly isOperational = true;
}

export class InternalServerError extends BaseError {
  readonly statusCode = 500;
  readonly code = 'INTERNAL_SERVER_ERROR';
  readonly isOperational = false;
}

// Error handler middleware
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log error with context
  const errorContext = {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    userId: req.user?.id,
    timestamp: new Date().toISOString(),
  };

  if (error instanceof BaseError) {
    logger.warn('Operational error', { ...errorContext, context: error.context });
    
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      code: error.code,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    });
  } else {
    // Unhandled error
    logger.error('Unhandled error', errorContext);
    
    res.status(500).json({
      success: false,
      message: process.env.NODE_ENV === 'production' 
        ? 'Erro interno do servidor' 
        : error.message,
      code: 'INTERNAL_SERVER_ERROR',
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    });
  }
};

// Async error wrapper
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Usage in routes
app.get('/api/transactions/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!isValidUUID(id)) {
    throw new ValidationError('ID deve ser um UUID válido');
  }
  
  const transaction = await transactionService.findById(id);
  
  if (!transaction) {
    throw new NotFoundError('Transação não encontrada');
  }
  
  res.json({
    success: true,
    data: transaction
  });
}));
```

### 4. 🔐 Segurança Enterprise
```typescript
// Authentication middleware with JWT
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const JWTPayloadSchema = z.object({
  userId: z.string().uuid(),
  email: z.string().email(),
  role: z.enum(['USER', 'ADMIN', 'MASTER']),
  permissions: z.array(z.string()),
  iat: z.number(),
  exp: z.number(),
});

type JWTPayload = z.infer<typeof JWTPayloadSchema>;

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export const authMiddleware = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    throw new UnauthorizedError('Token de acesso não fornecido');
  }
  
  const token = authHeader.substring(7);
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const validation = JWTPayloadSchema.safeParse(decoded);
    
    if (!validation.success) {
      throw new UnauthorizedError('Token inválido');
    }
    
    // Check if user still exists and is active
    const user = await userService.findById(validation.data.userId);
    if (!user || !user.isActive) {
      throw new UnauthorizedError('Usuário não encontrado ou inativo');
    }
    
    req.user = validation.data;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError('Token inválido');
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Token expirado');
    }
    throw error;
  }
});

// Role-based access control
export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new UnauthorizedError('Usuário não autenticado');
    }
    
    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError('Acesso negado - role insuficiente');
    }
    
    next();
  };
};

// Permission-based access control
export const requirePermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new UnauthorizedError('Usuário não autenticado');
    }
    
    if (!req.user.permissions.includes(permission)) {
      throw new ForbiddenError(`Acesso negado - permissão '${permission}' necessária`);
    }
    
    next();
  };
};

// Input sanitization
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const purify = DOMPurify(window as any);

export const sanitizeInput = (input: any): any => {
  if (typeof input === 'string') {
    return purify.sanitize(input.trim());
  }
  
  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }
  
  if (input && typeof input === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }
  
  return input;
};

// Rate limiting with Redis
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

export const apiLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: string[]) => redisClient.sendCommand(args),
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // Limit each IP to 100 requests per windowMs in production
  message: {
    error: 'Muitas requisições, tente novamente em alguns minutos',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/health';
  },
});

// Strict rate limiting for auth endpoints
export const authLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: string[]) => redisClient.sendCommand(args),
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 auth requests per windowMs
  message: {
    error: 'Muitas tentativas de login, tente novamente em 15 minutos',
    code: 'AUTH_RATE_LIMIT_EXCEEDED'
  },
  skipSuccessfulRequests: true,
});
```

### 5. 📊 Estrutura de API Response Enterprise
```typescript
// Base response interfaces
interface BaseApiResponse {
  success: boolean;
  timestamp: string;
  requestId: string;
}

interface SuccessResponse<T = any> extends BaseApiResponse {
  success: true;
  data: T;
  message?: string;
  meta?: {
    pagination?: PaginationMeta;
    total?: number;
    [key: string]: any;
  };
}

interface ErrorResponse extends BaseApiResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: string[];
    field?: string;
  };
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse;

// Response helper functions
export class ResponseHelper {
  static success<T>(
    data: T,
    message?: string,
    meta?: SuccessResponse<T>['meta']
  ): SuccessResponse<T> {
    return {
      success: true,
      data,
      message,
      meta,
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
    };
  }

  static error(
    code: string,
    message: string,
    details?: string[],
    field?: string
  ): ErrorResponse {
    return {
      success: false,
      error: {
        code,
        message,
        details,
        field,
      },
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
    };
  }

  static paginated<T>(
    data: T[],
    page: number,
    limit: number,
    total: number,
    message?: string
  ): SuccessResponse<T[]> {
    const pages = Math.ceil(total / limit);
    
    return this.success(data, message, {
      pagination: {
        page,
        limit,
        total,
        pages,
        hasNext: page < pages,
        hasPrev: page > 1,
      },
      total,
    });
  }
}

// Request ID middleware
export const requestIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  req.requestId = generateRequestId();
  res.setHeader('X-Request-ID', req.requestId);
  next();
};

function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Usage in controllers
export const getTransactions = asyncHandler(async (req, res) => {
  const query = QueryTransactionSchema.parse(req.query);
  const userId = req.user!.userId;
  
  const [transactions, total] = await Promise.all([
    transactionService.findMany({
      ...query,
      userId,
      skip: (query.page - 1) * query.limit,
    }),
    transactionService.count({ ...query, userId }),
  ]);
  
  res.json(ResponseHelper.paginated(
    transactions,
    query.page,
    query.limit,
    total,
    'Transações recuperadas com sucesso'
  ));
});

export const createTransaction = asyncHandler(async (req, res) => {
  const validation = validateTransactionData(CreateTransactionSchema, req.body);
  
  if (!validation.success) {
    return res.status(400).json(ResponseHelper.error(
      'VALIDATION_ERROR',
      'Dados inválidos',
      validation.errors
    ));
  }
  
  const transaction = await transactionService.create({
    ...validation.data,
    userId: req.user!.userId,
  });
  
  res.status(201).json(ResponseHelper.success(
    transaction,
    'Transação criada com sucesso'
  ));
});
```

### 6. 🧪 Testes Enterprise Completos
```typescript
// Test setup and utilities
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { TransactionService } from './transaction.service';

// Mock factories
export const createMockUser = (overrides: Partial<User> = {}): User => ({
  id: 'user-123',
  email: 'user@example.com',
  name: 'Test User',
  role: 'USER',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createMockTransaction = (overrides: Partial<Transaction> = {}): Transaction => ({
  id: 'tx-123',
  description: 'Test Transaction',
  amount: 100.50,
  type: 'EXPENSE',
  category: 'Food',
  date: new Date(),
  userId: 'user-123',
  tags: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

// Test wrappers
interface TestWrapperProps {
  children: React.ReactNode;
  initialEntries?: string[];
}

export const TestWrapper = ({ children, initialEntries = ['/'] }: TestWrapperProps) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={initialEntries}>
        {children}
      </MemoryRouter>
    </QueryClientProvider>
  );
};

// Unit Tests - Service Layer
describe('TransactionService', () => {
  let transactionService: TransactionService;
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      transaction: {
        create: vi.fn(),
        findMany: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        count: vi.fn(),
        aggregate: vi.fn(),
      },
    };
    
    transactionService = new TransactionService(mockPrisma);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new transaction successfully', async () => {
      // Arrange
      const transactionData = {
        description: 'Test transaction',
        amount: 100,
        type: 'EXPENSE' as const,
        category: 'Food',
        date: new Date(),
        userId: 'user-123',
      };
      
      const mockCreatedTransaction = createMockTransaction(transactionData);
      mockPrisma.transaction.create.mockResolvedValue(mockCreatedTransaction);

      // Act
      const result = await transactionService.create(transactionData);

      // Assert
      expect(mockPrisma.transaction.create).toHaveBeenCalledWith({
        data: transactionData,
      });
      expect(result).toEqual(mockCreatedTransaction);
    });

    it('should throw ValidationError for invalid amount', async () => {
      // Arrange
      const invalidData = {
        description: 'Test',
        amount: -100, // Invalid negative amount
        type: 'EXPENSE' as const,
        category: 'Food',
        date: new Date(),
        userId: 'user-123',
      };

      // Act & Assert
      await expect(transactionService.create(invalidData))
        .rejects
        .toThrow(ValidationError);
    });
  });

  describe('findMany', () => {
    it('should return paginated transactions with correct filters', async () => {
      // Arrange
      const mockTransactions = [
        createMockTransaction({ id: '1', type: 'INCOME' }),
        createMockTransaction({ id: '2', type: 'EXPENSE' }),
      ];
      
      mockPrisma.transaction.findMany.mockResolvedValue(mockTransactions);

      const query = {
        userId: 'user-123',
        type: 'INCOME' as const,
        page: 1,
        limit: 10,
      };

      // Act
      const result = await transactionService.findMany(query);

      // Assert
      expect(mockPrisma.transaction.findMany).toHaveBeenCalledWith({
        where: {
          userId: 'user-123',
          type: 'INCOME',
        },
        skip: 0,
        take: 10,
        orderBy: { date: 'desc' },
        include: {
          category: true,
          account: true,
        },
      });
      expect(result).toEqual(mockTransactions);
    });
  });
});

// Integration Tests - API Endpoints
describe('Transaction API', () => {
  let app: Express;
  let server: any;
  let testDb: any;

  beforeAll(async () => {
    // Setup test database
    testDb = await setupTestDatabase();
    app = createTestApp();
    server = app.listen(0);
  });

  afterAll(async () => {
    await cleanupTestDatabase(testDb);
    server.close();
  });

  beforeEach(async () => {
    await seedTestData(testDb);
  });

  afterEach(async () => {
    await clearTestData(testDb);
  });

  describe('POST /api/transactions', () => {
    it('should create transaction with valid data', async () => {
      // Arrange
      const transactionData = {
        description: 'Test transaction',
        amount: 150.75,
        type: 'EXPENSE',
        category: 'Food',
        date: '2025-01-01T00:00:00.000Z',
      };

      const authToken = await getTestAuthToken('user-123');

      // Act
      const response = await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send(transactionData)
        .expect(201);

      // Assert
      expect(response.body).toMatchObject({
        success: true,
        data: {
          id: expect.any(String),
          description: 'Test transaction',
          amount: 150.75,
          type: 'EXPENSE',
        },
        message: 'Transação criada com sucesso',
      });

      // Verify in database
      const createdTransaction = await testDb.transaction.findUnique({
        where: { id: response.body.data.id },
      });
      expect(createdTransaction).toBeTruthy();
    });

    it('should return 400 for invalid data', async () => {
      // Arrange
      const invalidData = {
        description: '', // Empty description
        amount: -100, // Negative amount
        type: 'INVALID_TYPE', // Invalid type
      };

      const authToken = await getTestAuthToken('user-123');

      // Act
      const response = await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);

      // Assert
      expect(response.body).toMatchObject({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Dados inválidos',
          details: expect.arrayContaining([
            expect.stringContaining('description'),
            expect.stringContaining('amount'),
            expect.stringContaining('type'),
          ]),
        },
      });
    });

    it('should return 401 for unauthenticated request', async () => {
      // Act
      const response = await request(app)
        .post('/api/transactions')
        .send({})
        .expect(401);

      // Assert
      expect(response.body).toMatchObject({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Token de acesso não fornecido',
        },
      });
    });
  });
});

// Component Tests - React Testing Library
describe('TransactionForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockOnCancel.mockClear();
  });

  it('should render form fields correctly', () => {
    // Act
    render(
      <TestWrapper>
        <TransactionForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
      </TestWrapper>
    );

    // Assert
    expect(screen.getByLabelText(/descrição/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/valor/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tipo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/categoria/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/data/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /salvar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
  });

  it('should submit form with valid data', async () => {
    // Arrange
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <TransactionForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
      </TestWrapper>
    );

    // Act
    await user.type(screen.getByLabelText(/descrição/i), 'Test transaction');
    await user.type(screen.getByLabelText(/valor/i), '100.50');
    await user.selectOptions(screen.getByLabelText(/tipo/i), 'EXPENSE');
    await user.selectOptions(screen.getByLabelText(/categoria/i), 'Food');
    await user.type(screen.getByLabelText(/data/i), '2025-01-01');
    
    await user.click(screen.getByRole('button', { name: /salvar/i }));

    // Assert
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        description: 'Test transaction',
        amount: 100.50,
        type: 'EXPENSE',
        category: 'Food',
        date: expect.any(Date),
      });
    });
  });

  it('should show validation errors for empty fields', async () => {
    // Arrange
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <TransactionForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
      </TestWrapper>
    );

    // Act
    await user.click(screen.getByRole('button', { name: /salvar/i }));

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/descrição é obrigatória/i)).toBeInTheDocument();
      expect(screen.getByText(/valor deve ser positivo/i)).toBeInTheDocument();
    });
    
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should call onCancel when cancel button is clicked', async () => {
    // Arrange
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <TransactionForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
      </TestWrapper>
    );

    // Act
    await user.click(screen.getByRole('button', { name: /cancelar/i }));

    // Assert
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });
});

// E2E Tests - Playwright
import { test, expect as playwrightExpect } from '@playwright/test';

test.describe('Transaction Management', () => {
  test.beforeEach(async ({ page }) => {
    // Setup authenticated state
    await page.goto('/login');
    await page.fill('[data-testid=email-input]', 'test@example.com');
    await page.fill('[data-testid=password-input]', 'password123');
    await page.click('[data-testid=login-button]');
    await page.waitForURL('/dashboard');
  });

  test('should create new transaction', async ({ page }) => {
    // Navigate to transactions page
    await page.click('[data-testid=nav-transactions]');
    await page.waitForURL('/transactions');

    // Open create form
    await page.click('[data-testid=create-transaction-button]');
    await page.waitForSelector('[data-testid=transaction-form]');

    // Fill form
    await page.fill('[data-testid=description-input]', 'E2E Test Transaction');
    await page.fill('[data-testid=amount-input]', '299.99');
    await page.selectOption('[data-testid=type-select]', 'EXPENSE');
    await page.selectOption('[data-testid=category-select]', 'Shopping');
    await page.fill('[data-testid=date-input]', '2025-01-15');

    // Submit form
    await page.click('[data-testid=submit-button]');

    // Verify success
    await playwrightExpected(page.locator('[data-testid=success-toast]'))
      .toContainText('Transação criada com sucesso');
    
    // Verify transaction appears in list
    await playwrightExpected(page.locator('[data-testid=transaction-list]'))
      .toContainText('E2E Test Transaction');
    await playwrightExpected(page.locator('[data-testid=transaction-list]'))
      .toContainText('R$ 299,99');
  });

  test('should filter transactions by type', async ({ page }) => {
    await page.goto('/transactions');
    
    // Apply income filter
    await page.selectOption('[data-testid=type-filter]', 'INCOME');
    await page.click('[data-testid=apply-filters]');

    // Verify only income transactions are shown
    const transactions = page.locator('[data-testid=transaction-item]');
    const count = await transactions.count();
    
    for (let i = 0; i < count; i++) {
      await playwrightExpected(transactions.nth(i).locator('[data-testid=transaction-type]'))
        .toContainText('Receita');
    }
  });
});

// Performance Tests
describe('Performance Tests', () => {
  it('should handle large transaction datasets efficiently', async () => {
    // Arrange
    const largeDataset = Array.from({ length: 10000 }, (_, i) => 
      createMockTransaction({ id: `tx-${i}`, amount: Math.random() * 1000 })
    );

    mockPrisma.transaction.findMany.mockResolvedValue(largeDataset);

    // Act
    const startTime = performance.now();
    const result = await transactionService.findMany({
      userId: 'user-123',
      limit: 10000,
    });
    const endTime = performance.now();

    // Assert
    expect(result).toHaveLength(10000);
    expect(endTime - startTime).toBeLessThan(1000); // Should complete in less than 1 second
  });
});

// Load Tests with Artillery
// artillery.yml
/*
config:
  target: 'http://localhost:8080'
  phases:
    - duration: 60
      arrivalRate: 10
      name: Warm up
    - duration: 120
      arrivalRate: 50
      name: Load test
    - duration: 60
      arrivalRate: 100
      name: Stress test

scenarios:
  - name: 'Transaction CRUD operations'
    weight: 70
    flow:
      - post:
          url: '/api/auth/login'
          json:
            email: 'test@example.com'
            password: 'password123'
          capture:
            - json: '$.data.token'
              as: 'authToken'
      - get:
          url: '/api/transactions'
          headers:
            Authorization: 'Bearer {{ authToken }}'
      - post:
          url: '/api/transactions'
          headers:
            Authorization: 'Bearer {{ authToken }}'
          json:
            description: 'Load test transaction'
            amount: 100
            type: 'EXPENSE'
            category: 'Test'
            date: '2025-01-01T00:00:00.000Z'
*/
```

### 7. 📚 Documentação JSDoc Enterprise
```typescript
/**
 * Service responsável pela gestão completa de transações financeiras.
 * Implementa padrões enterprise com validação, logging e error handling.
 * 
 * @example
 * ```typescript
 * const transactionService = new TransactionService(prisma);
 * 
 * // Criar nova transação
 * const transaction = await transactionService.create({
 *   description: 'Compra no supermercado',
 *   amount: 150.75,
 *   type: 'EXPENSE',
 *   category: 'Alimentação',
 *   date: new Date(),
 *   userId: 'user-123'
 * });
 * 
 * // Buscar transações com filtros
 * const transactions = await transactionService.findMany({
 *   userId: 'user-123',
 *   type: 'EXPENSE',
 *   dateFrom: '2025-01-01',
 *   dateTo: '2025-01-31',
 *   page: 1,
 *   limit: 20
 * });
 * ```
 * 
 * @since 5.0.0
 * @author Will Finance Team
 */
export class TransactionService {
  private readonly logger = createLogger('TransactionService');

  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Cria uma nova transação com validação completa e auditoria.
   * 
   * @param data - Dados da transação a ser criada
   * @param data.description - Descrição da transação (1-255 caracteres)
   * @param data.amount - Valor da transação (positivo, até 2 casas decimais)
   * @param data.type - Tipo da transação ('INCOME' ou 'EXPENSE')
   * @param data.category - Categoria da transação
   * @param data.date - Data da transação
   * @param data.userId - ID do usuário proprietário
   * @param data.tags - Tags opcionais para classificação
   * @param data.metadata - Metadados adicionais (JSON)
   * 
   * @returns Promise<Transaction> Transação criada com ID gerado
   * 
   * @throws {ValidationError} Quando os dados não atendem aos critérios de validação
   * @throws {NotFoundError} Quando categoria ou usuário não existem
   * @throws {InternalServerError} Quando ocorre erro interno no banco de dados
   * 
   * @example
   * ```typescript
   * const transaction = await transactionService.create({
   *   description: 'Salário mensal',
   *   amount: 5000.00,
   *   type: 'INCOME',
   *   category: 'Salário',
   *   date: new Date(),
   *   userId: 'user-123',
   *   tags: ['trabalho', 'mensal'],
   *   metadata: { company: 'ACME Corp', department: 'Engineering' }
   * });
   * 
   * console.log(`Transação criada: ${transaction.id}`);
   * ```
   * 
   * @since 5.0.0
   */
  async create(data: CreateTransactionData): Promise<Transaction> {
    this.logger.info('Creating new transaction', { 
      userId: data.userId, 
      type: data.type, 
      amount: data.amount 
    });

    // Validação de dados
    const validation = validateTransactionData(CreateTransactionSchema, data);
    if (!validation.success) {
      this.logger.warn('Transaction validation failed', { 
        errors: validation.errors, 
        data 
      });
      throw new ValidationError('Dados da transação inválidos', validation.errors);
    }

    const validatedData = validation.data;

    try {
      // Verificar se usuário existe
      const user = await this.prisma.user.findUnique({
        where: { id: validatedData.userId }
      });

      if (!user || !user.isActive) {
        throw new NotFoundError('Usuário não encontrado ou inativo');
      }

      // Verificar se categoria existe
      const category = await this.prisma.category.findFirst({
        where: { 
          name: validatedData.category,
          userId: validatedData.userId,
          isActive: true
        }
      });

      if (!category) {
        throw new NotFoundError(`Categoria '${validatedData.category}' não encontrada`);
      }

      // Criar transação
      const transaction = await this.prisma.transaction.create({
        data: {
          ...validatedData,
          categoryId: category.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        include: {
          category: true,
          user: {
            select: { id: true, name: true, email: true }
          }
        }
      });

      this.logger.info('Transaction created successfully', { 
        transactionId: transaction.id,
        userId: validatedData.userId,
        amount: validatedData.amount
      });

      // Dispatch evento para atualização de saldos, relatórios, etc.
      await this.dispatchTransactionCreatedEvent(transaction);

      return transaction;

    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }

      this.logger.error('Failed to create transaction', { 
        error: error.message, 
        stack: error.stack, 
        data: validatedData 
      });

      throw new InternalServerError('Falha ao criar transação');
    }
  }

  /**
   * Busca transações com filtros avançados, paginação e ordenação.
   * Implementa cache inteligente e otimizações de performance.
   * 
   * @param query - Parâmetros de busca e paginação
   * @param query.userId - ID do usuário (obrigatório)
   * @param query.type - Filtro por tipo de transação (opcional)
   * @param query.search - Busca textual na descrição (opcional)
   * @param query.categoryIds - Array de IDs de categorias (opcional)
   * @param query.dateFrom - Data inicial (ISO string, opcional)
   * @param query.dateTo - Data final (ISO string, opcional)
   * @param query.page - Página atual (padrão: 1)
   * @param query.limit - Itens por página (padrão: 20, máximo: 100)
   * @param query.sortBy - Campo para ordenação (padrão: 'date')
   * @param query.sortOrder - Ordem da classificação (padrão: 'desc')
   * 
   * @returns Promise<Transaction[]> Array de transações que atendem aos critérios
   * 
   * @throws {ValidationError} Quando parâmetros de query são inválidos
   * @throws {ForbiddenError} Quando usuário não tem acesso às transações
   * 
   * @example
   * ```typescript
   * // Buscar todas as despesas do mês atual
   * const expensesThisMonth = await transactionService.findMany({
   *   userId: 'user-123',
   *   type: 'EXPENSE',
   *   dateFrom: '2025-01-01T00:00:00.000Z',
   *   dateTo: '2025-01-31T23:59:59.999Z',
   *   page: 1,
   *   limit: 50,
   *   sortBy: 'amount',
   *   sortOrder: 'desc'
   * });
   * 
   * // Buscar transações por texto
   * const searchResults = await transactionService.findMany({
   *   userId: 'user-123',
   *   search: 'supermercado',
   *   page: 1,
   *   limit: 20
   * });
   * ```
   * 
   * @since 5.0.0
   */
  async findMany(query: FindManyTransactionsQuery): Promise<Transaction[]> {
    this.logger.debug('Finding transactions', { query });

    // Validação de query
    const validation = validateTransactionData(QueryTransactionSchema, query);
    if (!validation.success) {
      throw new ValidationError('Parâmetros de busca inválidos', validation.errors);
    }

    const validatedQuery = validation.data;
    const { userId, type, search, categoryIds, dateFrom, dateTo, page, limit, sortBy, sortOrder } = validatedQuery;

    // Construir filtros WHERE do Prisma
    const where: Prisma.TransactionWhereInput = {
      userId,
      ...(type && { type }),
      ...(search && {
        description: {
          contains: search,
          mode: 'insensitive'
        }
      }),
      ...(categoryIds?.length && {
        categoryId: {
          in: categoryIds
        }
      }),
      ...((dateFrom || dateTo) && {
        date: {
          ...(dateFrom && { gte: new Date(dateFrom) }),
          ...(dateTo && { lte: new Date(dateTo) })
        }
      })
    };

    // Construir ordenação
    const orderBy: Prisma.TransactionOrderByWithRelationInput = {
      [sortBy]: sortOrder
    };

    try {
      const transactions = await this.prisma.transaction.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          category: {
            select: { id: true, name: true, icon: true, color: true }
          },
          account: {
            select: { id: true, name: true, type: true }
          }
        }
      });

      this.logger.debug('Transactions found', { 
        count: transactions.length, 
        userId, 
        filters: { type, search, categoryIds, dateFrom, dateTo }
      });

      return transactions;

    } catch (error) {
      this.logger.error('Failed to find transactions', { 
        error: error.message, 
        query: validatedQuery 
      });
      
      throw new InternalServerError('Falha ao buscar transações');
    }
  }

  /**
   * Calcula estatísticas financeiras para um usuário em um período específico.
   * Retorna receitas, despesas, saldo e outras métricas importantes.
   * 
   * @param userId - ID do usuário
   * @param dateRange - Período para cálculo (opcional, padrão: mês atual)
   * @param dateRange.from - Data inicial (ISO string)
   * @param dateRange.to - Data final (ISO string)
   * 
   * @returns Promise<FinancialStats> Estatísticas financeiras calculadas
   * 
   * @throws {ValidationError} Quando userId é inválido ou datas são inconsistentes
   * @throws {NotFoundError} Quando usuário não existe
   * 
   * @example
   * ```typescript
   * // Estatísticas do mês atual
   * const stats = await transactionService.calculateStats('user-123');
   * console.log(`Saldo atual: R$ ${stats.balance.toFixed(2)}`);
   * 
   * // Estatísticas de um período específico
   * const yearStats = await transactionService.calculateStats('user-123', {
   *   from: '2024-01-01T00:00:00.000Z',
   *   to: '2024-12-31T23:59:59.999Z'
   * });
   * ```
   * 
   * @since 5.0.0
   */
  async calculateStats(
    userId: string, 
    dateRange?: { from: string; to: string }
  ): Promise<FinancialStats> {
    // Implementation...
  }

  /**
   * Dispara evento interno para processamento assíncrono após criação de transação.
   * Atualiza caches, recalcula saldos, envia notificações, etc.
   * 
   * @private
   * @param transaction - Transação criada
   * @returns Promise<void>
   * 
   * @since 5.0.0
   */
  private async dispatchTransactionCreatedEvent(transaction: Transaction): Promise<void> {
    // Event dispatch implementation...
  }
}
```

---

## ⚙️ Scripts e Automação

### Package.json Scripts
```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
    "dev:client": "cd client && npm run dev",
    "dev:server": "cd server && npm run dev",
    "build": "npm run build:client && npm run build:server",
    "test": "npm run test:client && npm run test:server",
    "lint": "npm run lint:client && npm run lint:server",
    "db:setup": "cd server && npx prisma generate && npx prisma db push",
    "db:migrate": "cd server && npx prisma migrate dev",
    "db:studio": "cd server && npx prisma studio",
    "install:all": "npm install && cd client && npm install && cd ../server && npm install"
  }
}
```

### 🔄 GitHub Actions (CI/CD)
```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

---

## ⚙️ Scripts e Automação Enterprise

### Package.json Scripts Master
```json
{
  "name": "will-finance-5.0-pro",
  "version": "5.0.0",
  "description": "Sistema de gerenciamento financeiro enterprise com arquitetura distribuída",
  "scripts": {
    "// === DESENVOLVIMENTO === //": "",
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\" \"npm run dev:watch\"",
    "dev:client": "cd client && npm run dev",
    "dev:server": "cd server && npm run dev",
    "dev:watch": "nodemon --watch server/src --exec \"npm run typecheck:server\"",
    "dev:debug": "concurrently \"npm run dev:server -- --inspect\" \"npm run dev:client\"",
    "dev:https": "concurrently \"npm run dev:server -- --https\" \"npm run dev:client -- --https\"",
    
    "// === BUILD & DEPLOY === //": "",
    "build": "npm run build:client && npm run build:server && npm run build:docs",
    "build:client": "cd client && npm run build",
    "build:server": "cd server && npm run build",
    "build:docs": "typedoc --out docs server/src client/src",
    "build:docker": "docker-compose -f docker/docker-compose.prod.yml build",
    "build:analyze": "cd client && npm run build:analyze",
    
    "// === TESTES COMPLETOS === //": "",
    "test": "npm run test:unit && npm run test:integration && npm run test:e2e",
    "test:unit": "concurrently \"npm run test:client:unit\" \"npm run test:server:unit\"",
    "test:integration": "cd server && npm run test:integration",
    "test:e2e": "playwright test",
    "test:client:unit": "cd client && npm run test",
    "test:server:unit": "cd server && npm run test",
    "test:watch": "concurrently \"npm run test:client:watch\" \"npm run test:server:watch\"",
    "test:client:watch": "cd client && npm run test:watch",
    "test:server:watch": "cd server && npm run test:watch",
    "test:coverage": "npm run test:client:coverage && npm run test:server:coverage",
    "test:client:coverage": "cd client && npm run test:coverage",
    "test:server:coverage": "cd server && npm run test:coverage",
    "test:performance": "artillery run tests/performance/load-test.yml",
    "test:security": "npm audit && npm run test:security:client && npm run test:security:server",
    "test:security:client": "cd client && npm audit",
    "test:security:server": "cd server && npm audit",
    
    "// === QUALIDADE DE CÓDIGO === //": "",
    "lint": "npm run lint:client && npm run lint:server",
    "lint:client": "cd client && npm run lint",
    "lint:server": "cd server && npm run lint",
    "lint:fix": "npm run lint:client:fix && npm run lint:server:fix",
    "lint:client:fix": "cd client && npm run lint:fix",
    "lint:server:fix": "cd server && npm run lint:fix",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md,yml}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,js,jsx,json,md,yml}\"",
    "typecheck": "npm run typecheck:client && npm run typecheck:server",
    "typecheck:client": "cd client && npm run typecheck",
    "typecheck:server": "cd server && npm run typecheck",
    
    "// === DATABASE === //": "",
    "db:setup": "cd server && npm run db:setup",
    "db:migrate": "cd server && npm run db:migrate",
    "db:migrate:dev": "cd server && npm run db:migrate:dev",
    "db:migrate:deploy": "cd server && npm run db:migrate:deploy",
    "db:migrate:reset": "cd server && npm run db:migrate:reset",
    "db:seed": "cd server && npm run db:seed",
    "db:studio": "cd server && npm run db:studio",
    "db:backup": "cd server && npm run db:backup",
    "db:restore": "cd server && npm run db:restore",
    "db:inspect": "cd server && npm run db:inspect",
    
    "// === DOCKER & CONTAINERS === //": "",
    "docker:dev": "docker-compose -f docker/docker-compose.yml up -d",
    "docker:prod": "docker-compose -f docker/docker-compose.prod.yml up -d",
    "docker:build": "docker-compose -f docker/docker-compose.yml build",
    "docker:logs": "docker-compose -f docker/docker-compose.yml logs -f",
    "docker:down": "docker-compose -f docker/docker-compose.yml down",
    "docker:clean": "docker system prune -a --volumes -f",
    
    "// === ANÁLISE E MONITORAMENTO === //": "",
    "analyze": "npm run analyze:bundle && npm run analyze:deps && npm run analyze:security",
    "analyze:bundle": "cd client && npm run analyze:bundle",
    "analyze:deps": "depcheck && madge --circular --extensions ts,tsx,js,jsx .",
    "analyze:security": "npm audit && snyk test",
    "analyze:performance": "cd client && npm run analyze:performance",
    "monitor:start": "pm2 start ecosystem.config.js",
    "monitor:stop": "pm2 stop ecosystem.config.js",
    "monitor:logs": "pm2 logs",
    
    "// === INSTALAÇÃO E CONFIGURAÇÃO === //": "",
    "install:all": "npm install && cd client && npm install && cd ../server && npm install",
    "install:clean": "npm run clean && npm run install:all",
    "clean": "rm -rf node_modules client/node_modules server/node_modules && rm -rf client/dist server/dist",
    "clean:cache": "npm cache clean --force && cd client && npm cache clean --force && cd ../server && npm cache clean --force",
    "setup": "npm run install:all && npm run db:setup && npm run build",
    "setup:dev": "npm run install:all && npm run db:setup && npm run db:seed",
    
    "// === DEPLOYMENT === //": "",
    "deploy": "npm run build && npm run deploy:staging",
    "deploy:staging": "gh-actions-deploy staging",
    "deploy:production": "gh-actions-deploy production",
    "deploy:docker": "npm run build:docker && docker-compose -f docker/docker-compose.prod.yml up -d",
    "deploy:vercel": "cd client && vercel --prod",
    "deploy:railway": "railway up",
    
    "// === UTILITÁRIOS === //": "",
    "generate": "npm run generate:types && npm run generate:docs && npm run generate:migration",
    "generate:types": "cd server && npm run generate:types",
    "generate:docs": "typedoc --out docs --theme minimal server/src client/src",
    "generate:migration": "cd server && npm run generate:migration",
    "validate": "npm run typecheck && npm run lint && npm run test:unit && npm run format:check",
    "pre-commit": "lint-staged",
    "pre-push": "npm run validate",
    "postinstall": "husky install && npm run setup:dev"
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm run validate",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,yml}": ["prettier --write"],
    "*.{css,scss}": ["stylelint --fix", "prettier --write"]
  }
}
```

### 🔄 GitHub Actions Avançado (CI/CD)
```yaml
# .github/workflows/ci-cd-master.yml
name: 🚀 Will Finance 5.0 - CI/CD Master Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 2 * * *' # Daily security scan at 2 AM

env:
  NODE_VERSION: '20'
  REGISTRY: ghcr.io
  IMAGE_NAME: will-finance-5.0

jobs:
  # === ANÁLISE ESTÁTICA === #
  static-analysis:
    name: 📊 Static Analysis
    runs-on: ubuntu-latest
    outputs:
      should-deploy: ${{ steps.changes.outputs.should-deploy }}
    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: 🔍 Detect changes
        id: changes
        uses: dorny/paths-filter@v2
        with:
          filters: |
            client:
              - 'client/**'
            server:
              - 'server/**'
            docs:
              - 'docs/**'
            should-deploy:
              - 'client/**'
              - 'server/**'
              - 'docker/**'

      - name: 🟢 Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: 📦 Install dependencies
        run: npm run install:all

      - name: 🔍 TypeScript check
        run: npm run typecheck

      - name: 🧹 Lint check
        run: npm run lint

      - name: 💅 Format check
        run: npm run format:check

      - name: 📈 Dependency analysis
        run: npm run analyze:deps

  # === TESTES UNITÁRIOS === #
  unit-tests:
    name: 🧪 Unit Tests
    runs-on: ubuntu-latest
    needs: static-analysis
    strategy:
      matrix:
        node-version: [18, 20]
    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4

      - name: 🟢 Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: 📦 Install dependencies
        run: npm run install:all

      - name: 🧪 Run unit tests
        run: npm run test:unit

      - name: 📊 Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./client/coverage/lcov.info,./server/coverage/lcov.info
          flags: unittests
          name: codecov-umbrella

  # === TESTES DE INTEGRAÇÃO === #
  integration-tests:
    name: 🔗 Integration Tests
    runs-on: ubuntu-latest
    needs: static-analysis
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: testpassword
          POSTGRES_DB: will_finance_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379
    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4

      - name: 🟢 Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: 📦 Install dependencies
        run: npm run install:all

      - name: 🗄️ Setup test database
        run: |
          cd server
          npm run db:migrate:deploy
          npm run db:seed:test
        env:
          DATABASE_URL: postgresql://postgres:testpassword@localhost:5432/will_finance_test

      - name: 🔗 Run integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://postgres:testpassword@localhost:5432/will_finance_test
          REDIS_URL: redis://localhost:6379

  # === TESTES E2E === #
  e2e-tests:
    name: 🎭 E2E Tests
    runs-on: ubuntu-latest
    needs: [static-analysis, unit-tests]
    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4

      - name: 🟢 Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: 📦 Install dependencies
        run: npm run install:all

      - name: 🎭 Install Playwright
        run: npx playwright install --with-deps

      - name: 🏗️ Build application
        run: npm run build

      - name: 🚀 Start application
        run: |
          npm run dev &
          npx wait-on http://localhost:5173
        timeout-minutes: 5

      - name: 🎭 Run Playwright tests
        run: npm run test:e2e

      - name: 📊 Upload E2E results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/

  # === SEGURANÇA === #
  security-scan:
    name: 🛡️ Security Scan
    runs-on: ubuntu-latest
    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4

      - name: 🔒 Run Snyk security scan
        uses: snyk/actions/node@master
        continue-on-error: true
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high

      - name: 🛡️ Run CodeQL analysis
        uses: github/codeql-action/init@v2
        with:
          languages: javascript, typescript

      - name: 🔍 Perform CodeQL analysis
        uses: github/codeql-action/analyze@v2

  # === BUILD === #
  build:
    name: 🏗️ Build Application
    runs-on: ubuntu-latest
    needs: [unit-tests, integration-tests]
    if: needs.static-analysis.outputs.should-deploy == 'true'
    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4

      - name: 🟢 Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: 📦 Install dependencies
        run: npm run install:all

      - name: 🏗️ Build application
        run: npm run build

      - name: 📦 Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-artifacts
          path: |
            client/dist/
            server/dist/

  # === DOCKER BUILD === #
  docker-build:
    name: 🐳 Docker Build
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    permissions:
      contents: read
      packages: write
    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4

      - name: 🐳 Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: 🔑 Log in to Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: 📋 Extract metadata
        id: meta
        uses: docker/metadata-action@v4
        with:
          images: ${{ env.REGISTRY }}/${{ github.repository }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=sha,prefix={{branch}}-
            type=raw,value=latest,enable={{is_default_branch}}

      - name: 🏗️ Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          file: ./docker/Dockerfile.prod
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  # === DEPLOY STAGING === #
  deploy-staging:
    name: 🚀 Deploy to Staging
    runs-on: ubuntu-latest
    needs: [build, docker-build, e2e-tests, security-scan]
    if: github.ref == 'refs/heads/develop'
    environment:
      name: staging
      url: https://staging.willfinance.com
    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4

      - name: 🚀 Deploy to staging
        run: |
          echo "Deploying to staging environment"
          # Add your staging deployment commands here

      - name: 🔍 Run smoke tests
        run: |
          curl -f https://staging.willfinance.com/health || exit 1
          npm run test:smoke -- --baseURL https://staging.willfinance.com

  # === DEPLOY PRODUCTION === #
  deploy-production:
    name: 🌟 Deploy to Production
    runs-on: ubuntu-latest
    needs: [build, docker-build, e2e-tests, security-scan]
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
      url: https://willfinance.com
    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4

      - name: 🌟 Deploy to production
        run: |
          echo "Deploying to production environment"
          # Add your production deployment commands here

      - name: 🔍 Run smoke tests
        run: |
          curl -f https://willfinance.com/health || exit 1
          npm run test:smoke -- --baseURL https://willfinance.com

      - name: 📢 Notify deployment
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          channel: '#deployments'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}

  # === PERFORMANCE MONITORING === #
  performance-monitoring:
    name: 📈 Performance Monitoring
    runs-on: ubuntu-latest
    needs: deploy-production
    if: github.ref == 'refs/heads/main'
    steps:
      - name: 📥 Checkout code
        uses: actions/checkout@v4

      - name: 🟢 Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - name: 📊 Run Lighthouse CI
        run: |
          npm install -g @lhci/cli@0.12.x
          lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}

      - name: 🚀 Run load tests
        run: npm run test:performance
```

### 🐳 Docker Configuration Master
```dockerfile
# docker/Dockerfile.prod
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache dumb-init

# === CLIENT BUILD STAGE === #
FROM base AS client-builder
COPY client/package*.json ./client/
RUN cd client && npm ci --only=production

COPY client/ ./client/
RUN cd client && npm run build

# === SERVER BUILD STAGE === #
FROM base AS server-builder
COPY server/package*.json ./server/
RUN cd server && npm ci --only=production

COPY server/ ./server/
RUN cd server && npm run build

# === PRODUCTION STAGE === #
FROM base AS production
ENV NODE_ENV=production
ENV PORT=8080

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Copy built applications
COPY --from=client-builder --chown=nextjs:nodejs /app/client/dist ./client/dist
COPY --from=server-builder --chown=nextjs:nodejs /app/server/dist ./server/dist
COPY --from=server-builder --chown=nextjs:nodejs /app/server/node_modules ./server/node_modules
COPY --from=server-builder --chown=nextjs:nodejs /app/server/package.json ./server/package.json

# Copy Prisma schema and migrations
COPY --chown=nextjs:nodejs server/prisma ./server/prisma

USER nextjs

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server/dist/index.js"]
```

```yaml
# docker/docker-compose.prod.yml
version: '3.8'

services:
  app:
    build:
      context: ..
      dockerfile: docker/Dockerfile.prod
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - postgres
      - redis
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: will_finance
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER} -d will_finance"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 3

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

---

## 🚀 Comandos Essenciais

```bash
# Desenvolvimento
npm run dev              # Inicia cliente e servidor
npm run dev:client       # Apenas cliente (porta 5173)
npm run dev:server       # Apenas servidor (porta 8080)

# Database
npm run db:setup         # Configura banco inicial
npm run db:migrate       # Aplica migrações
npm run db:studio        # Interface visual Prisma

# Qualidade de código
npm run lint             # ESLint em todo projeto
npm run test             # Testes unitários e e2e
npm run build            # Build de produção

# Docker
docker-compose up -d     # Ambiente containerizado
docker-compose logs -f   # Visualizar logs
```

---

## 🎯 Objetivos de Qualidade

### Code Coverage
- **Mínimo:** 80% de cobertura nos testes
- **Meta:** 90% de cobertura crítica

### Performance
- **Frontend:** First Contentful Paint < 2s
- **Backend:** Response time < 100ms (95th percentile)

### Segurança
- **Autenticação:** JWT + Firebase Auth
- **Validação:** Sanitização de todas as entradas
- **CORS:** Configurado adequadamente para produção
