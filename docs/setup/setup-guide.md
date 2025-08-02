# Guia de Instalação e Configuração - Will Finance 5.0

## Pré-requisitos

### Software Necessário
- Node.js 20.x ou superior
- npm ou yarn
- Git
- Docker e Docker Compose (opcional)
- PostgreSQL 15+ (se não usar Docker)

### Verificar Instalações
```bash
node --version
npm --version
git --version
docker --version
```

## Configuração do Ambiente

### 1. Clone o Repositório
```bash
git clone https://github.com/William-kelvem94/Gerenciador_Financeiro-5.0.git
cd Gerenciador_Financeiro-5.0
```

### 2. Configuração das Variáveis de Ambiente

Copie os arquivos de exemplo de configuração:
```bash
# Configurações do servidor
cp configs/server.env.example configs/server.env

# Configurações do cliente
cp configs/client.env.example configs/client.env
```

### 3. Editar Variáveis de Ambiente

#### configs/server.env
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/willfinance"

# JWT
JWT_SECRET="your-secret-key"

# Google OAuth (opcional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Firebase (se usar)
FIREBASE_PROJECT_ID="your-project-id"
```

#### configs/client.env
```env
VITE_API_URL="http://localhost:3001"
VITE_GOOGLE_CLIENT_ID="your-google-client-id"
```

## Instalação

### Opção 1: Docker (Recomendado)
```bash
# Construir e executar com Docker
docker-compose up -d

# Executar migrações do banco
docker-compose exec server npm run migrate
```

### Opção 2: Manual

#### 1. Instalar Dependências
```bash
# Instalar dependências da raiz
npm install

# Instalar dependências do servidor
cd server && npm install

# Instalar dependências do cliente
cd ../client && npm install
```

#### 2. Configurar Banco de Dados
```bash
# No diretório server
cd server
npx prisma migrate dev
npx prisma generate
```

#### 3. Executar Aplicação
```bash
# Terminal 1 - Servidor
cd server
npm run dev

# Terminal 2 - Cliente
cd client
npm run dev
```

## Verificação da Instalação

### 1. Verificar Serviços
- Cliente: http://localhost:5173
- Servidor: http://localhost:3001
- Documentação API: http://localhost:3001/docs

### 2. Testar Conexões
```bash
# Testar API
curl http://localhost:3001/health

# Testar banco de dados (no diretório server)
npm run test:db
```

## Solução de Problemas

### Erro de Porta Ocupada
```bash
# Verificar processo usando a porta
netstat -ano | findstr :3001
netstat -ano | findstr :5173

# Matar processo se necessário
taskkill /PID <PID> /F
```

### Erro de Permissões do Docker
```bash
# Windows - Executar como administrador
# Linux/Mac - Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER
```

### Erro de Banco de Dados
```bash
# Resetar banco de dados
cd server
npx prisma migrate reset

# Executar migrações novamente
npx prisma migrate dev
```

## Scripts Úteis

```bash
# Desenvolvimento
npm run dev          # Executar em modo desenvolvimento
npm run build        # Build para produção
npm run test         # Executar testes
npm run lint         # Verificar código

# Banco de dados
npm run migrate      # Executar migrações
npm run seed         # Popular banco com dados de exemplo
npm run studio       # Abrir Prisma Studio
```

## Próximos Passos

1. Configurar variáveis de ambiente de produção
2. Configurar CI/CD
3. Configurar monitoramento
4. Revisar documentação da API
