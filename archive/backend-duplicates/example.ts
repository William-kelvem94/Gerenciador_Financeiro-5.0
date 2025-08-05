/**
 * 📚 Transaction Module Usage Example - Will Finance 5.0
 * 
 * Exemplo de como usar o módulo de transações no Express app
 */

import express from 'express';
import { TransactionModule } from './index';
import { authenticateToken } from '../../shared/middleware/authenticateToken';

const app = express();

// Middleware global
app.use(express.json());

// Instanciar o módulo de transações
const transactionModule = new TransactionModule();

// Aplicar middleware de autenticação para todas as rotas de transações
app.use('/api/v1/transactions', authenticateToken);

// Registrar as rotas do módulo
app.use('/api/v1/transactions', transactionModule.getRouter());

// Exemplo de uso das rotas:
/*
GET    /api/v1/transactions                    - Listar transações
GET    /api/v1/transactions?page=1&limit=20    - Com paginação
GET    /api/v1/transactions?type=EXPENSE       - Filtrar por tipo
GET    /api/v1/transactions?categoryId=abc123  - Filtrar por categoria
GET    /api/v1/transactions?search=mercado     - Busca textual
GET    /api/v1/transactions/:id                - Buscar por ID
POST   /api/v1/transactions                    - Criar transação
PUT    /api/v1/transactions/:id                - Atualizar transação
DELETE /api/v1/transactions/:id                - Deletar transação
GET    /api/v1/transactions/stats/summary      - Estatísticas
*/

// Exemplo de payload para criar transação:
/*
POST /api/v1/transactions
{
  "amount": 150.75,
  "description": "Compras no supermercado",
  "type": "EXPENSE",
  "date": "2024-01-15T10:30:00Z",
  "accountId": "account_123",
  "categoryId": "category_food",
  "notes": "Compras mensais",
  "location": "Mercado Central"
}
*/

export default app;
