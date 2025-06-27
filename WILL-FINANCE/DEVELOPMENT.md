# 🚀 Guia de Desenvolvimento - Will Finance

## 📋 Quick Start

### 1. Primeiro Setup
```bash
# Clone ou navegue para o projeto
cd WILL-FINANCE

# Instale todas as dependências
npm run install:all

# Configure ambiente
cp .env.example .env
# Edite .env com suas configurações

# Execute em desenvolvimento
npm run dev
```

### 2. Estrutura de URLs
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8080
- **Banco de dados**: `server/data/dev.db` (SQLite)

### 3. Credenciais de Teste
- **Email**: demo@willfinance.com
- **Senha**: cyberpunk2077

## 🛠️ Comandos Úteis

### Desenvolvimento
```bash
# Executar frontend e backend juntos
npm run dev

# Executar apenas frontend
cd client && npm run dev

# Executar apenas backend
cd server && npm run dev

# Executar com hot reload
cd server && npm run dev:watch
```

### Build e Deploy
```bash
# Build completo
npm run build

# Build apenas frontend
cd client && npm run build

# Build apenas backend
cd server && npm run build

# Executar build de produção
npm run start
```

### Banco de Dados
```bash
cd server

# Gerar cliente Prisma
npx prisma generate

# Executar migrações
npx prisma migrate dev

# Popular banco com dados de exemplo
npm run db:seed

# Visualizar banco de dados
npx prisma studio
```

### Linting e Formatação
```bash
# Lint frontend
cd client && npm run lint

# Lint e corrigir frontend
cd client && npm run lint:fix

# Verificar tipos TypeScript
cd client && npm run type-check
cd server && npm run type-check
```

## 🏗️ Como Adicionar Novas Funcionalidades

### 1. Nova Rota de API (Backend)
```typescript
// server/src/routes/exemplo.ts
import { Router } from 'express'
import { authenticateToken } from '../middleware/auth'

const router = Router()

// GET /api/exemplo
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Sua lógica aqui
    res.json({ success: true, data: [] })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
```

### 2. Novo Hook de API (Frontend)
```typescript
// client/src/hooks/useExemplo.ts
import { useState, useEffect } from 'react'
import { apiService } from '../services/api'

export function useExemplo() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiService.getExemplo()
        setData(response.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return { data, loading, error }
}
```

### 3. Nova Página (Frontend)
```typescript
// client/src/pages/ExemploPage.tsx
import { motion } from 'framer-motion'
import { useExemplo } from '@/hooks/useExemplo'

export function ExemploPage() {
  const { data, loading, error } = useExemplo()

  if (loading) return <div>Carregando...</div>
  if (error) return <div>Erro: {error}</div>

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold text-white">Exemplo</h1>
      {/* Seu conteúdo aqui */}
    </motion.div>
  )
}
```

### 4. Adicionar Nova Rota
```typescript
// client/src/App.tsx - Adicionar dentro do Routes
<Route path="/exemplo" element={<ExemploPage />} />

// client/src/components/Sidebar.tsx - Adicionar no menu
{
  name: 'Exemplo',
  path: '/exemplo',
  icon: Icon,
  color: 'text-purple-400'
}
```

## 🎨 Padrões de Design

### Cores do Tema Cyberpunk
```css
/* Cores principais */
--neon-green: #00ff88
--neon-cyan: #00ffff
--neon-purple: #a855f7
--neon-blue: #3b82f6
--neon-red: #ef4444

/* Backgrounds */
--bg-primary: bg-black/20
--bg-secondary: bg-black/30
--bg-glass: backdrop-blur-md

/* Borders */
--border-neon: border-green-500/30
--border-focus: border-green-400
```

### Componentes Padrão
```typescript
// Card padrão
<div className="bg-black/20 backdrop-blur-md border border-green-500/30 rounded-xl p-6">
  {/* Conteúdo */}
</div>

// Botão primário
<button className="px-4 py-2 bg-gradient-to-r from-green-500 to-cyan-500 text-black font-semibold rounded-lg hover:from-green-400 hover:to-cyan-400 transition-all duration-200">
  Ação
</button>

// Input padrão
<input className="w-full px-4 py-3 bg-black/30 border border-green-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 transition-all duration-200" />
```

## 🐛 Debugging

### Logs Úteis
```bash
# Logs do servidor
cd server && npm run dev

# Logs do cliente
cd client && npm run dev

# Verificar banco de dados
cd server && npx prisma studio
```

### Problemas Comuns

#### Frontend não conecta com Backend
```bash
# Verificar se backend está rodando na porta 8080
curl http://localhost:8080/health

# Verificar variável de ambiente
echo $VITE_API_URL  # ou no .env: VITE_API_URL=http://localhost:8080
```

#### Erro de CORS
```typescript
// server/src/index.ts - Verificar configuração CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}))
```

#### Problemas com Prisma
```bash
cd server

# Regenerar cliente
npx prisma generate

# Reset do banco
npx prisma migrate reset

# Verificar conexão
npx prisma db pull
```

## 📚 Recursos Adicionais

### Documentação das Bibliotecas
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Prisma](https://www.prisma.io/)
- [Express](https://expressjs.com/)

### VS Code Extensions Recomendados
- TypeScript Hero
- Tailwind CSS IntelliSense
- Prisma
- ES7+ React/Redux/React-Native snippets
- Auto Rename Tag
- Bracket Pair Colorizer

---
**Desenvolvimento eficiente para Will Finance** 🚀
