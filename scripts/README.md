# Scripts de Desenvolvimento - Will Finance 5.0

Este diretório contém todos os scripts necessários para o desenvolvimento e operação do Will Finance.

## 📁 Estrutura

### `/development/` - Scripts de Desenvolvimento
- `start.ps1` - Script principal para iniciar o ambiente
- `start-with-ai.ps1` - Iniciar com módulo de IA
- `start-silent.ps1` - Iniciar em modo silencioso
- `start-background.ps1` - Iniciar serviços em background
- `stop.ps1` - Parar todos os serviços
- `status.ps1` - Verificar status dos serviços
- `dev-tools.ps1` - Ferramentas de desenvolvimento
- `quick-links.ps1` - Links rápidos para URLs do projeto

### `/testing/` - Scripts de Teste
- `test-complete-system.js` - Teste completo do sistema
- `test-import-export.js` - Teste de importação/exportação
- `test-validation.js` - Validação de dados
- `test-api-direct.js` - Teste direto da API
- `test-*.js` - Scripts de teste específicos
- `clean-demo-data.js` - Limpeza de dados de demonstração

## 🚀 Uso Rápido

### PowerShell (Windows)
```powershell
# Iniciar desenvolvimento
.\scripts\development\start.ps1

# Iniciar com IA
.\scripts\development\start-with-ai.ps1

# Verificar status
.\scripts\development\status.ps1

# Parar serviços
.\scripts\development\stop.ps1
```

### NPM Scripts (Multiplataforma)
```bash
# Iniciar desenvolvimento
npm run dev

# Iniciar com IA
npm run dev:ai

# Verificar status
npm run status

# Testes
npm run test:system
npm run test:import
```

## 🔧 Configuração

Os scripts utilizam as seguintes configurações padrão:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:8080
- **Prisma Studio**: http://localhost:5555
- **IA Service**: http://localhost:8001

## 📋 Pré-requisitos

- Node.js >= 18
- npm >= 8
- PowerShell (para scripts .ps1)
- Docker (opcional)

## 🛠️ Personalização

Para personalizar os scripts:
1. Copie o script desejado
2. Modifique as variáveis no início do arquivo
3. Execute o script personalizado

## 🆘 Solução de Problemas

### Scripts PowerShell não executam
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Portas em uso
- Verifique processos: `netstat -ano | findstr :8080`
- Pare o processo: `taskkill /PID <PID> /F`

### Permissões de arquivo
```bash
chmod +x scripts/development/*.sh
```
