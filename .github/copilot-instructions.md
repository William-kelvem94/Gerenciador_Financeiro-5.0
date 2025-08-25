# Instruções Otimizadas — Will Finance 5.0 (versão refatorada)

Objetivo: entregar instruções objetivas, padronizadas e acionáveis para o Copilot gerar código como um desenvolvedor sênior — seguro, testável e consistente.

## Princípios gerais
- TypeScript estrito (noImplicitAny, strict).
- Tipos explícitos; evitar `any`.
- Validação com Zod em todas as entradas.
- Separação clara: controller (HTTP) → service (negócio) → repository/ORM.
- Tratamento de erros centralizado e respostas padronizadas.
- Segurança por padrão: validação, sanitização, rate-limit, JWT + refresh tokens.
- Testes: unitários para serviços, integração para rotas críticas.

## Stack resumido
- Frontend: React 18 + Vite + TypeScript + Tailwind + Framer Motion
- Backend: Node 20 + Express + TypeScript + Prisma + Zod + Redis + JWT
- DevOps: Docker, GitHub Actions, Prometheus/Grafana, Sentry

## Estrutura recomendada
- client/
  - src/components, pages, hooks, stores, types, utils
- server/
  - src/modules/* (auth, transactions, budgets, reports)
  - src/shared (errors, logger, utils)
  - src/config, src/middleware, src/prisma

## Convenções de nomes
- Arquivos/funções: camelCase (createTransaction, authMiddleware)
- Componentes/Classes/Tipos: PascalCase (TransactionModal, Transaction)
- Constantes: UPPER_SNAKE_CASE
- Diretórios: kebab-case

## TypeScript & ESLint/TSConfig (principais)
- tsconfig.json: strict: true, noImplicitAny: true, forceConsistentCasingInFileNames: true
- ESLint: regras para evitar any, prefer const, etc.

## Model de resposta HTTP (padrão)
- Forma:
    {
        success: boolean;
        data: T | null;
        message?: string;
        error?: { code: string; details?: string[] }
    }

## Exemplo de tipos e resposta genérica (padrão)
    interface ApiResponse<T> {
        success: boolean;
        data: T | null;
        message?: string;
        error?: { code: string; details?: string[] };
    }

## Validação com Zod (exemplo)
    import { z } from 'zod';

    const createTransactionSchema = z.object({
        body: z.object({
            amount: z.number().positive(),
            type: z.enum(['income', 'expense']),
            description: z.string().max(500).optional(),
            date: z.string().optional()
        })
    });

## Padrão de controller → service (exemplo)
- Controller: recebe req, valida com Zod, chama service, retorna ApiResponse.
- Service: lógica de negócio, lança erros específicos.
- Error handling middleware: formata erros e responde com ApiResponse.

    // controller.ts (pseudo)
    async function createTransaction(req: Request, res: Response, next: NextFunction) {
        try {
            const parsed = createTransactionSchema.parse({ body: req.body });
            const result = await transactionService.create(parsed.body, { userId: req.user.id });
            res.json({ success: true, data: result });
        } catch (err) {
            next(err);
        }
    }

    // service.ts (pseudo)
    async function create(data: CreateTransactionDto, ctx: ServiceContext) {
        // validações de negócio
        return prisma.transaction.create({ data: { ...data, userId: ctx.userId } });
    }

## Erros & Logging
- Use classes de erro customizadas (ValidationError, NotFoundError, AuthError) com código interno.
- Middleware de erro traduz exceções para ApiResponse e codes HTTP.
- Logger (Winston) central; sensível: nunca logar tokens ou senhas.

## Segurança (checklist)
- Validar + sanitizar todas as entradas (Zod + sanitizer).
- Autenticação: JWT curta validade + refresh tokens guardados com httpOnly cookie.
- Rate limiting usando Redis.
- CORS whitelist.
- Helmet + sane headers.
- Criptografia: AES-256 para dados sensíveis; armazenar chaves em KMS/secret manager.
- Proteções contra SQL/NoSQL injection (usar ORM com parametrização).

## Autenticação JWT (recomendação)
- Access token: 15m, assinado com chave rotacionável.
- Refresh token: 30d, armazenado hashed no DB + httpOnly cookie.
- Endpoint /auth/refresh que valida refresh token e emite novo access token.

## Prisma (dicas)
- Modelar relações com índices e constraints.
- Migrations revisadas; scripts para gerar e aplicar.
- Exemplo comando:
    npm run db:setup  # npx prisma generate && npx prisma migrate dev --name init

## Testes
- Unit: Jest + ts-jest, mock Prisma com ferramentas como prisma-mock ou testcontainers.
- Integration: testes de rotas com SuperTest.
- Mínimo 80% coverage, ideal 90%.

## Scripts essenciais (package.json)
    {
      "scripts": {
        "dev:server": "ts-node-dev --respawn --transpile-only src/server.ts",
        "dev:client": "vite",
        "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
        "build": "npm run build:client && npm run build:server",
        "db:setup": "npx prisma generate && npx prisma migrate deploy",
        "lint": "eslint . --ext .ts,.tsx",
        "test": "jest --coverage"
      }
    }

## CI / CD
- GitHub Actions: lint + test + build em PRs.
- PR obrigatório: revisão, changelog, testes passing.
- Runner deploy automático em branch main com checks de segurança e scan de dependências.

## PR Template mínimo
- Descrição curta
- Tipo de mudança (feat/fix/chore)
- Como testar
- Checklist: testes, lint, changelog, migrations

## Boas práticas de commits
- Use Conventional Commits (feat:, fix:, chore:, docs:, refactor:).

## Checklist final antes de PR
- ✅ Tipos sem any
- ✅ Validação Zod em endpoints
- ✅ Erros tratados e logados
- ✅ Testes cobrindo feature crítica
- ✅ Scripts e migrations atualizados
- ✅ Secrets não expostos

---

Use esse documento como referência principal. Ao gerar código, o Copilot deve:
1. Priorizar tipos explícitos.
2. Gerar validações Zod para entradas HTTP.
3. Seguir padrão controller → service → repository.
4. Incluir testes básicos e exemplos de uso.
5. Não incluir segredos ou chaves no código.

FIM.
