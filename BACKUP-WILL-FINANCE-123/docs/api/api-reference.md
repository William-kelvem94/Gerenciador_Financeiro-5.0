# API Reference - Will Finance 5.0

## Visão Geral

Este documento contém a referência completa da API do sistema Will Finance 5.0.

## Base URL
```
https://api.willfinance.com.br/v1
```

## Autenticação

Todas as requisições devem incluir um token JWT válido no header:
```
Authorization: Bearer <token>
```

## Endpoints Principais

### Auth Module
- `POST /auth/login` - Autenticar usuário
- `POST /auth/register` - Registrar novo usuário
- `POST /auth/logout` - Logout do usuário
- `GET /auth/profile` - Obter perfil do usuário

### Transactions Module
- `GET /transactions` - Listar transações
- `POST /transactions` - Criar nova transação
- `PUT /transactions/:id` - Atualizar transação
- `DELETE /transactions/:id` - Deletar transação

### Budgets Module
- `GET /budgets` - Listar orçamentos
- `POST /budgets` - Criar novo orçamento
- `PUT /budgets/:id` - Atualizar orçamento
- `DELETE /budgets/:id` - Deletar orçamento

### Reports Module
- `GET /reports/summary` - Relatório resumo
- `GET /reports/detailed` - Relatório detalhado
- `GET /reports/export` - Exportar relatórios

## Códigos de Status

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Requisição inválida
- `401` - Não autorizado
- `403` - Proibido
- `404` - Não encontrado
- `500` - Erro interno do servidor

## Exemplos de Uso

### Criar Transação
```http
POST /transactions
Content-Type: application/json
Authorization: Bearer <token>

{
  "description": "Pagamento conta de luz",
  "amount": -150.00,
  "category": "utilities",
  "date": "2025-08-02"
}
```

### Resposta
```json
{
  "id": "uuid",
  "description": "Pagamento conta de luz",
  "amount": -150.00,
  "category": "utilities",
  "date": "2025-08-02T00:00:00Z",
  "createdAt": "2025-08-02T19:30:00Z"
}
```
