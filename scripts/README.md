
# Arquivo obsoleto: toda a documentação e informações de scripts foram migradas para `README-scripts.md`.

Consulte `scripts/README-scripts.md` para informações completas e atualizadas sobre scripts de automação e desenvolvimento.

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
