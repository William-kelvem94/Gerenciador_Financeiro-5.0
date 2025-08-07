# 🔄 Transaction Module

Módulo responsável pelo gerenciamento de transações financeiras no Will Finance 5.0.

## 📁 Estrutura

```
transactions/
├── controllers/
│   └── transaction.controller.ts    # Controller REST para transações
├── services/
│   └── transaction.service.ts       # Lógica de negócio
├── dtos/
│   └── transaction.dtos.ts          # Schemas de validação e tipos
├── transaction.module.ts            # Configuração de rotas
└── index.ts                         # Exports centralizados
```

## 🛣️ Endpoints

### Transações
- `GET /api/v1/transactions` - Listar transações (com filtros e paginação)
- `GET /api/v1/transactions/:id` - Buscar transação por ID
- `POST /api/v1/transactions` - Criar nova transação
- `PUT /api/v1/transactions/:id` - Atualizar transação
- `DELETE /api/v1/transactions/:id` - Deletar transação
- `GET /api/v1/transactions/stats/summary` - Estatísticas resumidas

### Filtros Suportados (GET)
- `page` - Página (padrão: 1)
- `limit` - Itens por página (padrão: 10, máximo: 100)
- `type` - Tipo da transação (`INCOME` | `EXPENSE`)
- `categoryId` - ID da categoria
- `accountId` - ID da conta
- `startDate` - Data inicial (ISO string)
- `endDate` - Data final (ISO string)
- `search` - Busca textual (description, notes, reference)

## 📝 DTOs e Validação

### CreateTransactionDto
```typescript
{
  amount: number;          // > 0
  description: string;     // 1-255 chars
  type: 'INCOME' | 'EXPENSE';
  date?: Date;             // opcional, padrão: now()
  accountId: string;       // obrigatório
  categoryId: string;      // obrigatório
  notes?: string;          // até 500 chars
  location?: string;       // até 255 chars
  reference?: string;      // até 100 chars
  isRecurring?: boolean;   // padrão: false
  recurringRule?: string;  // até 100 chars
}
```

### UpdateTransactionDto
Todos os campos do `CreateTransactionDto` são opcionais, mas pelo menos um deve ser fornecido.

## 🔒 Segurança

- Todas as rotas requerem autenticação
- Usuários só podem acessar suas próprias transações
- Validação rigorosa de entrada usando Zod
- Verificação de propriedade de contas e categorias

## 📊 Funcionalidades

### Estatísticas
- Total de receitas e despesas
- Valor líquido (receitas - despesas)
- Média de transações
- Quebra por categorias e contas
- Tendência mensal

### Recursos Avançados
- Paginação eficiente
- Filtros múltiplos combinados
- Busca textual fuzzy
- Atualização automática de saldos
- Suporte a transações recorrentes
- Análise por IA (preparado)

## 🎯 Uso

```typescript
import { TransactionModule } from './modules/transactions';

// Usar o módulo no Express
const transactionModule = new TransactionModule();
app.use('/api/v1/transactions', transactionModule.getRouter());
```

## 🧪 Validação

Todos os dados são validados usando schemas Zod antes do processamento. Erros de validação retornam detalhes específicos sobre os campos inválidos.

## 🔄 Integração

O módulo integra-se com:
- **Auth Module** - Autenticação de usuários
- **Account Module** - Gestão de contas
- **Category Module** - Gestão de categorias
- **Budget Module** - Controle de orçamentos
- **AI Module** - Análise inteligente (futuro)
