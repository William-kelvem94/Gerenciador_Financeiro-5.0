# 🚀 Instruções GitHub Copilot - Will Finance 5.0

## Missão
Sistema financeiro enterprise: código limpo, seguro, testado, escalável.

## Stack Tecnológica
**Frontend:**  
- React 18+, TypeScript 5+, Vite, Tailwind CSS, Framer Motion, Zustand, React Query, Zod  
- Firebase Auth, React Router, Chart.js, D3.js

**Backend:**  
- Node.js 20+, Express, TypeScript 5+, Prisma ORM, PostgreSQL, Redis, JWT  
- Winston, Joi/Zod, Swagger, Socket.io

**DevOps:**  
- Docker, Docker Compose, Kubernetes, GitHub Actions  
- Nginx, SSL/TLS, Prometheus, Grafana

---

## Convenções Gerais
- TypeScript estrito obrigatório
- Validação Zod em todas entradas
- Tratamento de erros centralizado
- Nomenclatura:
  - camelCase: funções/arquivos
  - PascalCase: componentes/classes/tipos/interfaces
  - UPPER_SNAKE: constantes/enums
  - kebab-case: diretórios/variáveis CSS
  - snake_case: tabelas SQL

---

## Diretrizes Principais
1. Segurança: JWT, 2FA, sanitização
2. Testes automatizados (Vitest, Playwright, cobertura ≥80%)
3. Documentação JSDoc nos serviços principais
4. API: respostas padronizadas (success/error/meta)
5. Performance: lazy loading, code splitting, cache Redis
6. CI/CD obrigatório

---

## Exemplos Práticos
- Valide DTOs/schemas com Zod:
  ```ts
  import { z } from 'zod';
  export const userSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  });
  ```
- Padronize respostas com ResponseHelper:
  ```ts
  res.json(ResponseHelper.success(data));
  ```
- Capture exceções com errorHandler:
  ```ts
  app.use(errorHandler);
  ```

---

## Estrutura de Arquivos
- Modular por domínio (DDD)
- Separação clara frontend/backend
- Veja README para diagrama completo

---

## Nomenclatura Profissional

| Tipo                | Convenção      | Exemplo                       |
|---------------------|---------------|-------------------------------|
| Arquivos/Funções    | camelCase     | getUserData(), transactionService.ts |
| Componentes/Classes | PascalCase    | TransactionModal, UserService |
| Tipos/Interfaces    | PascalCase    | Transaction, LoginData        |
| Constantes/Enums    | UPPER_SNAKE   | MAX_RETRIES, USER_ROLE.ADMIN  |
| Diretórios          | kebab-case    | import-export/, user-profile/ |
| Variáveis CSS       | kebab-case    | --cyber-primary               |
| Tabelas SQL         | snake_case    | user_transactions             |

---

## Observações Finais
- Remova duplicações, mantenha instruções claras e concisas
- Divida instruções avançadas em arquivos separados se necessário
- Sempre siga as convenções acima para garantir consistência e qualidade

