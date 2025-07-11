# Will Finance 5.0 - API Documentation

## Overview
Complete RESTful API for the Will Finance cyberpunk financial management system.

**Base URL**: `http://localhost:8080/api`

## Authentication
All protected endpoints require JWT authentication via Bearer token:
```
Authorization: Bearer <jwt_token>
```

## Endpoints Summary

### Authentication (`/auth`)
- `POST /auth/login` - User login
- `POST /auth/register` - User registration  
- `POST /auth/refresh` - Refresh JWT token
- `POST /auth/logout` - User logout
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password with token

### Google OAuth (`/auth/google`)
- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/google/callback` - Handle OAuth callback

### Users (`/users`)
- `GET /users/profile` - Get current user profile
- `PUT /users/profile` - Update user profile
- `PUT /users/preferences` - Update user preferences
- `POST /users/change-password` - Change password
- `DELETE /users/account` - Delete user account
- `GET /users/dashboard` - Get dashboard data

### Accounts (`/accounts`)
- `GET /accounts` - List user accounts
- `POST /accounts` - Create new account
- `GET /accounts/:id` - Get account details
- `PUT /accounts/:id` - Update account
- `DELETE /accounts/:id` - Delete account
- `GET /accounts/summary` - Get accounts summary

### Transactions (`/transactions`)
- `GET /transactions` - List transactions (with filters)
- `POST /transactions` - Create new transaction
- `GET /transactions/:id` - Get transaction details
- `PUT /transactions/:id` - Update transaction
- `DELETE /transactions/:id` - Delete transaction
- `POST /transactions/bulk` - Create multiple transactions
- `GET /transactions/summary` - Get transactions summary

### Categories (`/categories`)
- `GET /categories` - List categories
- `POST /categories` - Create custom category
- `GET /categories/:id` - Get category details
- `PUT /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category

### Budgets (`/budgets`)
- `GET /budgets` - List budgets
- `POST /budgets` - Create new budget
- `GET /budgets/:id` - Get budget details
- `PUT /budgets/:id` - Update budget
- `DELETE /budgets/:id` - Delete budget
- `GET /budgets/status` - Get budgets status

### Goals (`/goals`)
- `GET /goals` - List financial goals
- `POST /goals` - Create new goal
- `GET /goals/:id` - Get goal details
- `PUT /goals/:id` - Update goal
- `DELETE /goals/:id` - Delete goal
- `POST /goals/:id/progress` - Update goal progress

### Analytics (`/analytics`)
- `GET /analytics/overview` - Financial overview
- `GET /analytics/income-expenses` - Income vs expenses
- `GET /analytics/categories` - Spending by category
- `GET /analytics/trends` - Financial trends
- `GET /analytics/cash-flow` - Cash flow analysis

### Import/Export (`/import-export`)
- `POST /import-export/preview` - Preview import file
- `POST /import-export/import` - Import transactions
- `GET /import-export/export` - Export data (CSV, XLSX, PDF)
- `GET /import-export/templates` - Download import templates

### Notifications (`/notifications`)
- `GET /notifications` - List notifications
- `PUT /notifications/:id/read` - Mark as read
- `DELETE /notifications/:id` - Delete notification
- `POST /notifications/mark-all-read` - Mark all as read

### AI Features (`/ai`)
- `POST /ai/chat` - Chat with AI assistant
- `GET /ai/insights` - Get AI financial insights
- `POST /ai/analyze-transaction` - Analyze transaction patterns
- `POST /ai/budget-suggestions` - Get budget suggestions

### Admin (`/admin`)
- `GET /admin/stats` - System statistics
- `GET /admin/users` - List all users (admin only)
- `DELETE /admin/users/:id` - Delete user (admin only)

## Request/Response Examples

### Authentication

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    },
    "token": "jwt_token_here",
    "refreshToken": "refresh_token_here"
  }
}
```

### Transactions

#### Create Transaction
```http
POST /api/transactions
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": -50.00,
  "description": "Almoço no restaurante",
  "type": "EXPENSE",
  "categoryId": "category_id",
  "accountId": "account_id",
  "date": "2024-01-15T12:00:00Z",
  "notes": "Reunião de trabalho"
}
```

#### List Transactions (with filters)
```http
GET /api/transactions?page=1&limit=20&startDate=2024-01-01&endDate=2024-01-31&type=EXPENSE&categoryId=cat_123
Authorization: Bearer <token>
```

### Analytics

#### Financial Overview
```http
GET /api/analytics/overview?period=current_month
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalIncome": 5000.00,
    "totalExpenses": 3200.00,
    "netIncome": 1800.00,
    "totalBalance": 25000.00,
    "transactionCount": 45,
    "topCategories": [
      {
        "categoryId": "cat_1",
        "name": "Alimentação",
        "amount": 800.00,
        "percentage": 25
      }
    ]
  }
}
```

## Error Responses

All endpoints return errors in the following format:
```json
{
  "success": false,
  "error": "Error Type",
  "message": "Detailed error message",
  "statusCode": 400
}
```

### Common Error Codes
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (duplicate data)
- `422` - Unprocessable Entity (validation failed)
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

## Rate Limiting
- 100 requests per 15 minutes per IP
- Authenticated endpoints: 200 requests per 15 minutes per user

## Pagination
Most list endpoints support pagination:
```
?page=1&limit=20&sort=createdAt&order=desc
```

## Filtering
Common filter parameters:
- `startDate` / `endDate` - Date range
- `type` - Transaction type (INCOME/EXPENSE)
- `categoryId` - Filter by category
- `accountId` - Filter by account
- `status` - Status filter
- `search` - Text search

## WebSocket Events
Real-time updates via WebSocket at `/socket.io`:

### Events:
- `transaction:created` - New transaction added
- `transaction:updated` - Transaction modified
- `transaction:deleted` - Transaction removed
- `budget:alert` - Budget threshold exceeded
- `goal:progress` - Goal progress updated
- `notification:new` - New notification

## Data Validation

### Transaction Schema
```typescript
{
  amount: number (required),
  description: string (required, max 255),
  type: "INCOME" | "EXPENSE" (required),
  categoryId: string (required),
  accountId: string (required),
  date: string (ISO date, optional, defaults to now),
  notes: string (optional, max 500),
  reference: string (optional),
  location: string (optional),
  isRecurring: boolean (optional)
}
```

### Account Schema
```typescript
{
  name: string (required, max 100),
  type: "CHECKING" | "SAVINGS" | "CREDIT_CARD" | "INVESTMENT",
  balance: number (optional, defaults to 0),
  color: string (hex color, optional),
  icon: string (optional),
  bankName: string (optional),
  creditLimit: number (optional, for credit cards)
}
```

## Security Features
- JWT token authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Input validation with Zod
- SQL injection prevention (Prisma ORM)
- XSS protection
- CSRF protection for state-changing operations

## File Upload
Support for transaction import files:
- Maximum file size: 10MB
- Supported formats: CSV, XLSX, OFX, TXT
- Automatic bank statement parsing for 10+ Brazilian banks

## Development Notes
- All timestamps are in UTC
- Currency amounts are stored as decimal with 2 decimal places
- Soft delete for most entities (isActive field)
- Audit logging for all financial operations
- Automatic categorization using AI for transactions
- Real-time balance calculation and caching