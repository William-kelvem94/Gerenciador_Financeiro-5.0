# 🚀 PRISMA - GUIA COMPLETO DO WILL FINANCE

## 💜 O que é o Prisma?

O Prisma é muito mais que um "editor de banco de dados"! É um **toolkit completo** para desenvolvimento com banco de dados que oferece:

### 🧩 **4 Componentes Principais:**

## 1. 📝 **Prisma Schema** - O Coração do Sistema

O arquivo `server/prisma/schema.prisma` é onde você define toda a estrutura do seu banco de dados usando uma linguagem própria, limpa e intuitiva.

### **Exemplo do seu schema:**

```prisma
// Configuração do gerador e fonte de dados
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

// Modelo de usuário
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  username  String   @unique
  firstName String
  lastName  String
  password  String
  avatar    String?
  // ... outros campos
  
  // Relacionamentos
  accounts     Account[]     // Um usuário tem várias contas
  transactions Transaction[] // Um usuário tem várias transações
  categories   Category[]    // Um usuário tem várias categorias
  
  @@map("users") // Nome da tabela no banco
}
```

### **Principais Features do Schema:**

- **Tipos Primitivos**: `String`, `Int`, `Float`, `Boolean`, `DateTime`
- **Modificadores**: `@id`, `@unique`, `@default()`, `@updatedAt`
- **Relacionamentos**: `User[]`, `Account`, `@relation()`
- **Mapeamento**: `@@map("table_name")`

## 2. 🔧 **Prisma Client** - O Motor de Consultas

O Prisma Client é **auto-gerado** baseado no seu schema e oferece uma API tipada e intuitiva.

### **Exemplos Práticos do seu projeto:**

```typescript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// 🔍 BUSCAR (Read)
const user = await prisma.user.findUnique({
  where: { email: "demo@willfinance.com" }
});

// 🆕 CRIAR (Create)
const newUser = await prisma.user.create({
  data: {
    email: "novo@user.com",
    username: "novousuario",
    firstName: "João",
    lastName: "Silva",
    password: hashedPassword
  }
});

// 📝 ATUALIZAR (Update)
const updatedUser = await prisma.user.update({
  where: { id: userId },
  data: { lastLoginAt: new Date() }
});

// 🗑️ DELETAR (Delete)
await prisma.user.delete({
  where: { id: userId }
});

// 🔗 BUSCAR COM RELACIONAMENTOS
const userWithData = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    accounts: true,      // Incluir contas
    transactions: {      // Incluir transações com filtro
      where: { type: 'EXPENSE' },
      orderBy: { date: 'desc' }
    },
    categories: true     // Incluir categorias
  }
});

// 📊 CONSULTAS AVANÇADAS
const stats = await prisma.transaction.groupBy({
  by: ['type'],
  _sum: { amount: true },
  _count: true,
  where: { userId: userId }
});
```

### **Vantagens do Prisma Client:**

- **Type Safety**: Tudo é tipado automaticamente
- **Auto-completion**: IDE sugere campos e métodos
- **Validação**: Garante que dados estão corretos
- **Performance**: Otimiza consultas automaticamente

## 3. 🚚 **Prisma Migrate** - Versionamento do Banco

Gerencia mudanças no banco de dados de forma controlada e versionada.

### **Comandos principais:**

```bash
# Aplicar mudanças do schema ao banco
npm run db:migrate

# Resetar banco (CUIDADO!)
npx prisma migrate reset

# Ver status das migrações
npx prisma migrate status
```

### **Fluxo de trabalho:**

1. Alterar `schema.prisma`
2. Rodar `npx prisma migrate dev --name nome-da-mudanca`
3. Prisma cria arquivo SQL com as mudanças
4. Aplica mudanças no banco automaticamente

## 4. 🎨 **Prisma Studio** - Interface Visual

Interface web para visualizar e editar dados do banco.

```bash
# Abrir Prisma Studio
npm run db:studio
```

- **Navegação**: Explore tabelas e relacionamentos
- **Edição**: Adicione, edite e delete registros
- **Filtros**: Busque e filtre dados
- **Relacionamentos**: Veja conexões entre dados

## 🔄 **Fluxo Completo do Prisma:**

1. **Schema First**: Define estrutura em `schema.prisma`
2. **Generate**: `npx prisma generate` → Gera cliente TypeScript
3. **Migrate**: `npx prisma migrate dev` → Aplica mudanças no banco
4. **Code**: Usa o cliente gerado no código
5. **Deploy**: `npx prisma migrate deploy` → Produção

## 🎯 **Scripts do Will Finance:**

```json
{
  "db:migrate": "prisma migrate dev",    // Aplicar mudanças
  "db:generate": "prisma generate",      // Gerar cliente
  "db:seed": "tsx src/scripts/seed.ts",  // Popular dados
  "db:studio": "prisma studio"           // Interface visual
}
```

## 🌟 **Por que o Prisma é Amazing:**

### **1. Type Safety Completo**
```typescript
// ✅ TypeScript sabe exatamente o que esperar
const user: User = await prisma.user.findUnique({
  where: { id: "123" }
});

// ❌ Erro de compilação se campo não existe
user.nonExistentField; // TypeScript error!
```

### **2. Relacionamentos Intuitivos**
```typescript
// Uma linha traz usuário com todas as transações
const userWithTransactions = await prisma.user.findUnique({
  where: { email: "user@example.com" },
  include: { transactions: true }
});
```

### **3. Queries Complexas Simples**
```typescript
// Estatísticas financeiras em uma query
const monthlyStats = await prisma.transaction.groupBy({
  by: ['type'],
  where: {
    userId: userId,
    date: {
      gte: new Date('2025-01-01'),
      lt: new Date('2025-02-01')
    }
  },
  _sum: { amount: true },
  _count: true
});
```

## 🔥 **Exemplos do Will Finance:**

### **Seed de Dados (Dados Iniciais):**
```typescript
// Criar usuário demo
const user = await prisma.user.create({
  data: {
    email: 'demo@willfinance.com',
    username: 'demo_user',
    firstName: 'Demo',
    lastName: 'User',
    password: hashedPassword,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
  }
});

// Criar categorias do sistema
const categories = await prisma.category.createMany({
  data: [
    { name: 'Salário', color: '#39FF14', icon: 'briefcase', type: 'INCOME' },
    { name: 'Alimentação', color: '#FF6B35', icon: 'utensils', type: 'EXPENSE' },
    // ... mais categorias
  ]
});
```

### **Autenticação com Prisma:**
```typescript
// Login - buscar usuário por email
const user = await prisma.user.findUnique({
  where: { email: loginData.email }
});

// Registro - verificar se já existe
const existingUser = await prisma.user.findFirst({
  where: {
    OR: [
      { email: registerData.email },
      { username: registerData.username }
    ]
  }
});
```

## 📊 **Estrutura do Banco Will Finance:**

### **Tabelas Principais:**
- **users**: Usuários do sistema
- **accounts**: Contas bancárias/cartões
- **transactions**: Movimentações financeiras
- **categories**: Categorias de transações
- **budgets**: Orçamentos mensais
- **goals**: Metas financeiras
- **notifications**: Notificações do sistema
- **ai_insights**: Insights da IA

### **Relacionamentos:**
- User → Account (1:N)
- User → Transaction (1:N)
- Account → Transaction (1:N)
- Category → Transaction (1:N)
- User → Budget (1:N)
- User → Goal (1:N)

## 🚀 **Próximos Passos:**

1. **Usar Prisma Studio**: `npm run db:studio` para ver dados
2. **Explorar Queries**: Teste diferentes consultas
3. **Adicionar Campos**: Modify schema e migrate
4. **Performance**: Use `select` para campos específicos
5. **Transações**: Use `$transaction` para operações atômicas

---

💜 **O Prisma transforma desenvolvimento com banco de dados em uma experiência cyberpunk: rápida, elegante e poderosa!**
