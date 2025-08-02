# 🎮 PLANO DE TESTES LOCAIS - WILL FINANCE 5.0

## 🚀 INÍCIO RÁPIDO

### 1. Configuração Inicial
```powershell
# Dar permissões de execução (apenas primeira vez)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Verificar sistema
.\dev-master.ps1 -Help
```

### 2. Desenvolvimento Completo (3 Terminais)
```powershell
# Terminal 1 - Backend
.\start-backend.ps1

# Terminal 2 - Frontend  
.\start-frontend.ps1

# Terminal 3 - IA Service (Opcional)
.\start-ia.ps1

# Terminal 4 - Testes e Monitoramento
.\test-local.ps1
.\health-check-local.ps1
```

## 📋 SCRIPTS DISPONÍVEIS

### 🎯 Scripts de Inicialização
- **`dev-master.ps1`** - Script principal com múltiplos modos
- **`start-backend.ps1`** - Inicia apenas o backend (port 3000)
- **`start-frontend.ps1`** - Inicia apenas o frontend (port 5173)
- **`start-ia.ps1`** - Inicia serviço de IA (port 8001)

### 🧪 Scripts de Teste e Monitoramento
- **`test-local.ps1`** - Testes automatizados completos
- **`health-check-local.ps1`** - Verificação de saúde dos serviços

## 🎮 MODOS DE OPERAÇÃO

### Modo Completo (Padrão)
```powershell
.\dev-master.ps1
# Configura ambiente para todos os serviços
```

### Modo Frontend Apenas
```powershell
.\dev-master.ps1 -Mode frontend
# Apenas desenvolvimento do frontend
```

### Modo Backend Apenas
```powershell
.\dev-master.ps1 -Mode backend
# Apenas desenvolvimento do backend
```

### Modo Sem IA
```powershell
.\dev-master.ps1 -SkipIA
# Desenvolvimento sem serviço de IA
```

## 🌐 URLs DE ACESSO

| Serviço | URL | Descrição |
|---------|-----|-----------|
| 🎨 Frontend | http://localhost:5173 | Interface do usuário |
| 🖥️ Backend | http://localhost:3000 | API REST |
| 📋 API Docs | http://localhost:3000/api/docs | Documentação da API |
| 🤖 IA Service | http://localhost:8001 | Serviço de IA (opcional) |
| 📋 IA Docs | http://localhost:8001/docs | Documentação da IA |

## 🧪 FLUXO DE TESTES

### 1. Testes de Infraestrutura
- ✅ Node.js instalado
- ✅ Python instalado (para IA)
- ✅ Dependências do backend
- ✅ Dependências do frontend

### 2. Testes de Conectividade
- 🌐 Portas disponíveis (3000, 5173, 8001)
- ❤️ Health checks dos serviços
- 🔗 Conectividade entre serviços

### 3. Testes de Banco de Dados
- 📄 Schema Prisma válido
- 🗃️ Database SQLite criado
- 🔄 Migrações aplicadas

### 4. Testes de API
- 🔐 Endpoints de autenticação
- 💰 Endpoints de transações
- 📊 Endpoints de relatórios

## 🔧 SOLUÇÃO DE PROBLEMAS

### Problema: Execution Policy
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Problema: Portas em uso
```powershell
# Verificar processos usando portas
netstat -ano | findstr :3000
netstat -ano | findstr :5173
netstat -ano | findstr :8001

# Matar processo específico
taskkill /PID <PID> /F
```

### Problema: Dependências não instaladas
```powershell
# Backend
cd server
npm install

# Frontend
cd client
npm install

# IA Service
cd IA
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### Problema: Banco de dados
```powershell
cd server
npx prisma generate
npx prisma migrate dev --name init
```

## 📊 MÉTRICAS DE SUCESSO

### 🟢 Sistema Saudável (80-100%)
- Todos os serviços rodando
- API respondendo corretamente
- Frontend carregando
- Banco de dados operacional

### 🟡 Sistema Parcial (60-79%)
- Serviços principais funcionando
- Alguns componentes opcionais com problema
- IA service pode estar offline

### 🔴 Sistema com Problemas (<60%)
- Múltiplos serviços offline
- Dependências faltando
- Problemas de configuração

## 🎯 CHECKLIST DE DESENVOLVIMENTO

### Antes de começar:
- [ ] PowerShell com permissões adequadas
- [ ] Node.js instalado (v16+)
- [ ] Python instalado (3.8+) - opcional
- [ ] Git configurado

### Configuração inicial:
- [ ] `.\dev-master.ps1` executado com sucesso
- [ ] Todos os scripts têm permissão de execução
- [ ] Dependências instaladas

### Durante desenvolvimento:
- [ ] Backend rodando (Terminal 1)
- [ ] Frontend rodando (Terminal 2)  
- [ ] IA service rodando (Terminal 3) - opcional
- [ ] Health check verde
- [ ] Testes passando

### Antes de commit:
- [ ] `.\test-local.ps1` com 80%+ sucesso
- [ ] Sem erros no console
- [ ] Frontend carregando corretamente
- [ ] API respondendo

## 🚀 COMANDOS RÁPIDOS

```powershell
# Setup completo
.\dev-master.ps1

# Verificar sistema
.\test-local.ps1

# Monitorar saúde
.\health-check-local.ps1

# Apenas frontend
.\start-frontend.ps1

# Apenas backend  
.\start-backend.ps1

# Apenas IA
.\start-ia.ps1

# Ajuda
.\dev-master.ps1 -Help
```

## 📝 LOGS E DEBUGGING

### Logs automáticos:
- `test-results-YYYYMMDD-HHMMSS.json` - Resultados de testes
- Terminal outputs em tempo real
- Health check status contínuo

### Debug manual:
```powershell
# Verificar logs do backend
cd server
npm run start:dev

# Verificar logs do frontend
cd client  
npm run dev

# Verificar logs da IA
cd IA
python -m uvicorn src.main:app --reload --port 8001
```

---

## 🎉 PRONTO PARA DESENVOLVER!

Com todos os scripts configurados, você tem um ambiente de desenvolvimento local completo e testado. Happy coding! 🚀
