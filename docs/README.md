
# Arquivo obsoleto: toda a documentação e informações técnicas foram migradas para `README-docs.md`.

Consulte `docs/README-docs.md` para informações completas e atualizadas sobre documentação técnica do projeto.
- **Backend API**: http://localhost:8080
- **Prisma Studio**: http://localhost:5555
- **Banco de Dados**: SQLite local

## 📊 Funcionalidades

- ✅ Dashboard em tempo real
- ✅ Gerenciamento de transações
- ✅ Orçamentos e metas
- ✅ Relatórios avançados
- ✅ IA integrada para insights
- ✅ Notificações push
- ✅ **Sistema de Importação/Exportação**
  - 🏦 Suporte a 10+ bancos brasileiros
  - 📄 Múltiplos formatos (CSV, TXT, PDF*, XLSX*, OFX*)
  - 🔍 Preview antes da importação
  - 🤖 Detecção automática de duplicatas
  - 📤 Exportação em JSON/CSV
- ✅ Export de dados

> *Em desenvolvimento

### 🏦 Sistema de Importação/Exportação

Importe extratos bancários automaticamente e exporte seus dados:

**Bancos Suportados:**
- Itaú, Bradesco, Banco do Brasil, Santander
- Caixa Econômica Federal, Nubank, BTG Pactual
- Inter, C6 Bank, Next

**Como usar:**
1. Acesse "Importar/Exportar" na sidebar
2. Faça upload do extrato (CSV/TXT)
3. Visualize o preview das transações
4. Confirme a importação
5. Exporte seus dados quando necessário

📚 **Documentação completa**: [IMPORT-EXPORT-DOCS.md](./IMPORT-EXPORT-DOCS.md)

Para mais detalhes, veja a [Documentação Completa](./DEVELOPMENT.md).
**✨ Inicia tudo em segundo plano e abre APENAS: http://localhost:5173**

### 🎯 **Alternativa: Batch File**
```bash
start.bat
```
**Compatível com qualquer Windows**

### 🛑 **Para Parar Tudo:**
```bash
.\stop.ps1
```

**🚀 O script principal (`start.ps1`) faz tudo automaticamente:**
- ⚡ Inicia Backend (Node.js + Express) **em segundo plano**
- 🌐 Inicia Frontend (React + Vite) **em segundo plano**  
- 🗄️ Inicia Prisma Studio (Database) **em segundo plano**
- 🎯 **Abre apenas o domínio principal no navegador:** `http://localhost:5173`
- 🧹 **Não polui sua tela** - todos os outros serviços ficam ocultos
- 🛠️ **Dev Tools** acessíveis via Configurações na interface

## ✨ Funcionalidades

- 🎨 **Interface Cyberpunk** - Design moderno e futurístico
- 🔐 **Autenticação Múltipla** - Login local + Google/Firebase
- 📊 **Dashboard Completo** - Analytics, transações, metas
- 🗄️ **Banco de Dados** - SQLite com Prisma ORM
- 🔥 **Firebase Integration** - Auth + Admin SDK
- ⚡ **API RESTful** - Backend Node.js + Express
- 🛠️ **Dev Tools** - Ferramentas integradas de desenvolvimento

## 🚀 Status do Projeto

✅ **TUDO FUNCIONANDO PERFEITAMENTE!**

- ✅ Frontend (React + Vite): `http://localhost:5173`
- ✅ Backend (Node + Express): `http://localhost:8080`
- ✅ Banco (SQLite + Prisma): `http://localhost:5555`
- ✅ Firebase Auth: Integrado e funcionando
- ✅ Login Demo: `demo@willfinance.com` / `cyberpunk2077`

## 🛠️ Como Executar (Manual)

Se preferir iniciar manualmente:

### 1. Backend (Terminal 1)
```bash
cd server
npm install
npm run dev
```

### 2. Frontend (Terminal 2)  
```bash
cd client
npm install
npm run dev
```

### 3. Prisma Studio (Terminal 3)
```bash
cd server
npx prisma studio
```

## 🎯 Acesso Rápido

### 📱 Aplicação
- **Projeto Principal**: http://localhost:5173
- **Dashboard**: http://localhost:5173/dashboard
- **Login**: http://localhost:5173/login
- **Configurações**: http://localhost:5173/settings

### 🛠️ Ferramentas (Dentro de Configurações > Dev Tools)
- **Banco de Dados**: http://localhost:5555
- **API Backend**: http://localhost:8080/api
- **Firebase Console**: Console integrado

## 📊 Tecnologias

### Frontend
- React 18 + TypeScript
- Vite 5.4.19
- Tailwind CSS
- Zustand (State Management)
- React Router
- Firebase SDK

### Backend
- Node.js + Express
- TypeScript
- Prisma ORM
- SQLite Database
- Firebase Admin SDK
- JWT Authentication

## 🔧 Configurações de Desenvolvimento

Todas as ferramentas de desenvolvimento agora estão organizadas em:

**Dashboard > Configurações > Dev Tools**

Inclui:
- ✅ Status do sistema em tempo real
- 🗄️ Acesso direto ao Prisma Studio
- ⚡ Links para API e endpoints
- 🔥 Console Firebase integrado
- 🛠️ Ações rápidas (seed, cache, etc.)

## 🔐 Autenticação

### Login Local
- Email: `demo@willfinance.com`
- Senha: `cyberpunk2077`

### Firebase/Google
- Integração completa
- Criação automática de usuários
- Fallback para desenvolvimento

## 🗄️ Banco de Dados

- SQLite para desenvolvimento
- Prisma ORM
- 3 usuários criados (demo + firebase)
- Seed automático disponível

## 🎨 Interface

O projeto mantém o design cyberpunk original com:
- Cores neon (cyan, green, purple)
- Efeitos de blur e transparência
- Animações suaves
- Layout responsivo
- Tema escuro

## 📋 Próximas Melhorias

1. 🎯 Melhorar dashboard analytics
2. 📊 Adicionar mais transações demo
3. 🔔 Implementar notificações em tempo real
4. 📈 Criar mais páginas (relatórios, metas)
5. ⚡ Otimizar performance

---

**Desenvolvido com ❤️ por Will Finance Team**

*Sistema 100% funcional e organizado! 🎉*

## 💡 Dicas

- **Para parar tudo**: Feche as janelas dos terminais
- **Primeiro uso**: Execute `npm install` nas pastas `server` e `client`
- **Problemas**: Use o script que mata processos automaticamente
- **Dev Tools**: Acesse via Dashboard > Configurações > Dev Tools
