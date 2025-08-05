# Instruções para GitHub Copilot - Will Finance 5.0

Este arquivo define padrões, convenções e guidelines para o desenvolvimento do Will Finance 5.0, garantindo qualidade, organização e segurança em todo o ciclo de vida do projeto.

---

## 🎯 Visão Geral

**Will Finance 5.0** é um sistema completo de gerenciamento financeiro com arquitetura modular, foco em segurança, escalabilidade e experiência do usuário cyberpunk. O projeto utiliza tecnologias modernas e integrações inteligentes para facilitar o controle financeiro pessoal ou empresarial.

### Características Principais
- ⚡ Performance otimizada com React 18 e Vite
- 🎨 Interface cyberpunk com animações Framer Motion
- 🔐 Autenticação Firebase e JWT
- 📊 Relatórios avançados e analytics
- 🤖 Recursos de IA para análise financeira
- 🌐 Arquitetura modular e escalável

---

## 🛠️ Stack Tecnológica

### Frontend (`client/`)
```typescript
// Tecnologias principais
- React 18 + TypeScript + Vite
- Tailwind CSS + PostCSS
- Framer Motion (animações)
- React Query (estado servidor)
- Zustand (estado global)
- React Hook Form + Zod (formulários/validação)
- Firebase Auth
- React Router v6
- Lucide React (ícones)
```

### Backend (`server/`)
```typescript
// Tecnologias principais  
- Node.js + Express + TypeScript
- Prisma ORM + SQLite/PostgreSQL
- JWT + bcrypt (autenticação)
- Multer (upload de arquivos)
- Cors + Helmet (segurança)
- Winston (logs)
```

### DevOps & Infraestrutura
```yaml
# Tecnologias de infraestrutura
- Docker + Docker Compose
- GitHub Actions (CI/CD)
- ESLint + Prettier
- Vitest (testes)
- Nginx (proxy reverso)
```

---

## 📁 Arquitetura do Projeto

### Frontend (`client/src/`)
```
client/src/
├── components/           # Componentes reutilizáveis
│   ├── auth/            # Login, Register, AuthCallback
│   ├── dashboard/       # Cards, Charts, Summary
│   ├── layout/          # Layout, Sidebar, Header
│   ├── Modal/           # TransactionModal, BudgetModal
│   └── ui/              # Button, Input, Loading (básicos)
├── pages/               # Páginas principais
│   ├── Dashboard/       # DashboardPage.tsx
│   ├── Transactions/    # TransactionsPage.tsx
│   ├── Budgets/         # BudgetsPage.tsx
│   ├── Reports/         # ReportsPage.tsx
│   ├── Settings/        # SettingsPage.tsx
│   ├── Login/           # LoginPage.tsx
│   └── ImportExport/    # ImportExportPage.tsx
├── hooks/               # Hooks customizados
│   ├── useAuth.ts       # Autenticação
│   ├── useTransactions.ts
│   └── useLocalStorage.ts
├── contexts/            # Contextos React
│   └── ThemeContext.tsx # Temas cyberpunk
├── stores/              # Estado global (Zustand)
│   ├── authStore.ts     # Estado de autenticação
│   └── themeStore.ts    # Estado de tema
├── types/               # Tipos TypeScript
│   ├── auth.ts          # User, LoginData, etc.
│   ├── transaction.ts   # Transaction, Category, etc.
│   └── index.ts         # Exports centralizados
├── utils/               # Utilitários
│   ├── formatters.ts    # formatCurrency, formatDate
│   ├── validators.ts    # Validações Zod
│   └── constants.ts     # Constantes da aplicação
├── lib/                 # Configurações externas
│   ├── firebase.ts      # Config Firebase
│   └── api.ts           # Axios config
└── styles/              # Estilos globais
    ├── index.css        # CSS principal
    └── cyberpunk-themes.css # Temas cyberpunk
```

### Backend (`server/src/`)
```
server/src/
├── modules/             # Módulos por domínio
│   ├── auth/           # Autenticação
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.dto.ts
│   │   └── strategies/
│   │       └── jwt.strategy.ts
│   ├── transactions/   # Gestão de transações
│   │   ├── transactions.controller.ts
│   │   ├── transactions.service.ts
│   │   └── transactions.dto.ts
│   ├── budgets/        # Gestão de orçamentos
│   ├── reports/        # Relatórios e analytics
│   ├── users/          # Gestão de usuários
│   └── files/          # Upload/processamento arquivos
├── shared/             # Código compartilhado
│   ├── decorators/     # Decorators customizados
│   ├── filters/        # Exception filters
│   ├── pipes/          # Validation pipes
│   └── guards/         # Auth guards
├── config/             # Configurações globais
│   ├── database.ts     # Prisma config
│   ├── jwt.config.ts   # JWT config
│   └── cors.config.ts  # CORS config
├── middleware/         # Middlewares
│   ├── auth.middleware.ts
│   ├── error.middleware.ts
│   └── logging.middleware.ts
├── prisma/             # Prisma schema e migrations
│   ├── schema.prisma
│   └── migrations/
└── types/              # Tipos TypeScript
    └── express.d.ts    # Extensões do Express
```

### Configurações (`configs/`)
```
configs/
├── client.env          # Variáveis do frontend
├── client.env.example  # Template do cliente
├── server.env          # Variáveis do backend
└── server.env.example  # Template do servidor
```

---

## 📋 Convenções e Padrões

### 🔤 Nomenclatura
| Tipo | Convenção | Exemplo |
|------|-----------|---------|
| **Arquivos/Funções** | `camelCase` | `getUserData()`, `transactionService.ts` |
| **Componentes/Classes** | `PascalCase` | `TransactionModal`, `UserService` |
| **Tipos/Interfaces** | `PascalCase` | `Transaction`, `LoginData` |
| **Constantes** | `UPPER_SNAKE_CASE` | `MAX_RETRIES`, `API_ENDPOINTS` |
| **Diretórios** | `kebab-case` | `import-export/`, `user-profile/` |
| **Variáveis CSS** | `kebab-case` | `--cyber-primary`, `--bg-secondary` |

### 🏗️ Estrutura de Componentes React
```typescript
// Estrutura padrão de componente
interface ComponentProps {
  // Props tipadas
}

export function ComponentName({ prop1, prop2 }: ComponentProps) {
  // 1. Hooks de estado
  const [state, setState] = useState();
  
  // 2. Hooks customizados
  const { user } = useAuth();
  
  // 3. Effects
  useEffect(() => {
    // side effects
  }, []);
  
  // 4. Handlers
  const handleAction = () => {
    // lógica do handler
  };
  
  // 5. Render
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="component-styles"
    >
      {/* JSX */}
    </motion.div>
  );
}
```

### 🎨 Padrões de Estilo (Cyberpunk Theme)
```css
/* Cores principais do tema cyberpunk */
:root {
  --cyber-primary: #00FFFF;    /* Cyan neon */
  --cyber-secondary: #FF0080;  /* Pink neon */
  --cyber-accent: #39FF14;     /* Green neon */
  --cyber-danger: #FF0040;     /* Red neon */
  
  --background: #0A0A0F;       /* Dark base */
  --background-secondary: #1A1A2E; /* Card background */
  --foreground: #FFFFFF;       /* Primary text */
  --foreground-muted: #B3B3B3; /* Secondary text */
}

/* Classes utilitárias cyberpunk */
.text-glow { 
  text-shadow: 0 0 10px currentColor; 
}

.btn-primary {
  @apply bg-gradient-to-r from-cyber-primary to-cyber-secondary;
  @apply hover:shadow-glow transition-all duration-300;
}

.glass {
  @apply bg-background-secondary/20 backdrop-blur-sm;
  @apply border border-cyber-primary/20;
}
```

---

## 🔧 Guidelines de Desenvolvimento

### 1. 📝 TypeScript Obrigatório
```typescript
// ❌ Evitar
function processData(data: any): any {
  return data.map((item: any) => item.value);
}

// ✅ Correto
interface DataItem {
  value: number;
  label: string;
}

function processData(data: DataItem[]): number[] {
  return data.map(item => item.value);
}
```

### 2. 🛡️ Validação Rigorosa
```typescript
// Usando Zod para validação
import { z } from 'zod';

const TransactionSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória'),
  amount: z.number().positive('Valor deve ser positivo'),
  type: z.enum(['income', 'expense']),
  category: z.string().min(1, 'Categoria é obrigatória'),
  date: z.string().datetime('Data inválida')
});

type TransactionData = z.infer<typeof TransactionSchema>;
```

### 3. 🎯 Tratamento de Erros
```typescript
// Classes de erro customizadas
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 400,
    public code: string = 'APP_ERROR'
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

// Handler de erro global
export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      code: error.code
    });
  }
  
  // Log do erro não tratado
  console.error('Unhandled error:', error);
  
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor'
  });
};
```

### 4. 🔐 Segurança
```typescript
// Middleware de autenticação
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      throw new AppError('Token não fornecido', 401, 'UNAUTHORIZED');
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    
    next();
  } catch (error) {
    next(new AppError('Token inválido', 401, 'INVALID_TOKEN'));
  }
};

// Sanitização de dados
import DOMPurify from 'dompurify';

export const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input.trim());
};
```

### 5. 📊 Estrutura de API Response
```typescript
// Padronização de respostas da API
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message: string;
  code?: string;
  timestamp: string;
}

// Helper para respostas
export const createResponse = <T>(
  success: boolean,
  data?: T,
  message: string = '',
  code?: string
): ApiResponse<T> => ({
  success,
  data,
  message,
  code,
  timestamp: new Date().toISOString()
});

// Uso nos controllers
app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await transactionService.findAll(req.user.id);
    res.json(createResponse(true, transactions, 'Transações recuperadas com sucesso'));
  } catch (error) {
    next(error);
  }
});
```

### 6. 🧪 Testes Obrigatórios
```typescript
// Exemplo de teste unitário
import { describe, it, expect, vi } from 'vitest';
import { TransactionService } from './transaction.service';

describe('TransactionService', () => {
  it('should create a new transaction', async () => {
    const mockPrisma = {
      transaction: {
        create: vi.fn().mockResolvedValue({
          id: '1',
          description: 'Test transaction',
          amount: 100
        })
      }
    };
    
    const service = new TransactionService(mockPrisma);
    const result = await service.create({
      description: 'Test transaction',
      amount: 100,
      type: 'income',
      category: 'salary',
      date: '2025-01-01'
    });
    
    expect(result.id).toBe('1');
    expect(mockPrisma.transaction.create).toHaveBeenCalledTimes(1);
  });
});
```

### 7. 📚 Documentação JSDoc
```typescript
/**
 * Calcula o saldo disponível do usuário considerando transações pendentes
 * @param userId - ID único do usuário
 * @param dateRange - Período para cálculo (opcional)
 * @returns Promise<number> Saldo calculado em reais
 * @throws {ValidationError} Quando userId é inválido
 * @throws {NotFoundError} Quando usuário não existe
 * @example
 * ```typescript
 * const balance = await calculateBalance('user123', {
 *   start: '2025-01-01',
 *   end: '2025-01-31'
 * });
 * console.log(`Saldo: R$ ${balance.toFixed(2)}`);
 * ```
 */
export async function calculateBalance(
  userId: string,
  dateRange?: { start: string; end: string }
): Promise<number> {
  // implementação...
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

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm run install:all
      
      - name: Run linting
        run: npm run lint
      
      - name: Run tests
        run: npm run test
      
      - name: Build project
        run: npm run build
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
