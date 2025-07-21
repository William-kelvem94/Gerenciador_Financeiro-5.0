# 🚀 Will Finance 5.0 - Sistema de Gestão Financeira Completo

![Will Finance 5.0](https://img.shields.io/badge/Will%20Finance-5.0-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-✅%20Funcional-green?style=for-the-badge)
![Tecnologia](https://img.shields.io/badge/Tech-React%20%2B%20NestJS-blueviolet?style=for-the-badge)

## 📋 Visão Geral

O **Will Finance 5.0** é um sistema completo de gestão financeira pessoal desenvolvido com tecnologias modernas. Oferece controle total sobre suas finanças com interface intuitiva, relatórios detalhados e funcionalidades avançadas.

## ✨ Funcionalidades Principais

### 💰 Gestão Financeira
- **Transações**: Cadastro, edição e exclusão de receitas e despesas
- **Categorização**: Organização por categorias personalizáveis
- **Orçamentos**: Criação e acompanhamento de orçamentos mensais
- **Metas**: Definição e tracking de objetivos financeiros

### 📊 Relatórios e Análises
- **Dashboard**: Visão geral das finanças com gráficos interativos
- **Relatório de Fluxo de Caixa**: Análise detalhada de entradas e saídas
- **Tendências**: Acompanhamento de padrões de gastos
- **Categorias Top**: Identificação dos maiores gastos por categoria

### 🔄 Import/Export
- **Importação CSV**: Suporte para extratos bancários
- **Exportação**: Backup completo dos dados
- **Sincronização**: Dados em tempo real

### 🔐 Segurança e Autenticação
- **JWT Authentication**: Sistema seguro de autenticação
- **Google OAuth**: Login social integrado
- **Criptografia**: Dados protegidos
- **Sessões Seguras**: Controle de acesso

### 📱 Experiência do Usuário
- **PWA**: Progressive Web App instalável
- **Responsivo**: Funciona em desktop, tablet e mobile
- **Tema Dark/Light**: Interface adaptável
- **Animações**: Transições suaves com Framer Motion

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18**: Framework JavaScript moderno
- **TypeScript**: Tipagem estática
- **Vite**: Build tool rápido
- **TailwindCSS**: Framework CSS utilitário
- **Zustand**: Gerenciamento de estado
- **Framer Motion**: Animações fluidas
- **React Hook Form**: Formulários otimizados
- **Recharts**: Gráficos interativos

### Backend
- **NestJS**: Framework Node.js robusto
- **Prisma ORM**: ORM moderno para TypeScript
- **SQLite**: Banco de dados leve e eficiente
- **Passport JWT**: Autenticação JWT
- **Swagger**: Documentação automática da API
- **Class Validator**: Validação de dados

### DevOps e Ferramentas
- **Docker**: Containerização
- **ESLint**: Linting JavaScript/TypeScript
- **Prettier**: Formatação de código
- **Concurrently**: Execução paralela de comandos

## 🚀 Instalação e Execução

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Git

### Setup Rápido

```bash
# 1. Clone o repositório
git clone <repository-url>
cd Gerenciador_Financeiro-5.0

# 2. Execute o setup completo (recomendado)
chmod +x setup-complete.sh
./setup-complete.sh

# 3. Inicie o sistema
npm run dev
```

### Setup Manual

```bash
# 1. Instalar dependências
npm install

# 2. Configurar banco de dados
cd server
npm run db:generate
npm run db:migrate
npm run db:seed
cd ..

# 3. Build do projeto
npm run build

# 4. Iniciar desenvolvimento
npm run dev
```

## 📱 Acesso ao Sistema

Após a inicialização, acesse:

- **Frontend**: http://localhost:5174
- **API Backend**: http://localhost:3001/api
- **Documentação Swagger**: http://localhost:3001/api/docs

## 👥 Usuários de Teste

O sistema vem com usuários pré-configurados:

| Email | Senha | Perfil |
|-------|--------|---------|
| admin@willfinance.com | admin123 | Administrador |
| user@willfinance.com | user123 | Usuário padrão |

## 📂 Estrutura do Projeto

```
Gerenciador_Financeiro-5.0/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── stores/         # Gerenciamento de estado
│   │   ├── types/          # Tipos TypeScript
│   │   └── utils/          # Utilitários
│   └── dist/               # Build de produção
├── server/                 # Backend NestJS
│   ├── src/
│   │   ├── auth/           # Módulo de autenticação
│   │   ├── transactions/   # Módulo de transações
│   │   ├── budgets/        # Módulo de orçamentos
│   │   ├── reports/        # Módulo de relatórios
│   │   └── prisma/         # Configuração do banco
│   ├── prisma/             # Schema e migrações
│   └── dist/               # Build de produção
├── docs/                   # Documentação
├── scripts/                # Scripts utilitários
└── IA/                     # Módulo de IA (em desenvolvimento)
```

## 🔧 Scripts Disponíveis

### Scripts Principais
- `npm run dev` - Inicia frontend e backend em desenvolvimento
- `npm run build` - Compila todo o projeto
- `npm run start` - Inicia em modo produção
- `npm run test` - Executa testes

### Scripts do Servidor
- `npm run dev:server` - Servidor em desenvolvimento
- `npm run db:setup` - Configura banco completo
- `npm run db:studio` - Interface visual do banco

### Scripts do Cliente
- `npm run dev:client` - Frontend em desenvolvimento
- `npm run build:client` - Build do frontend

## 🐳 Docker

O projeto inclui configuração Docker para diferentes ambientes:

```bash
# Desenvolvimento local
docker-compose -f docker-compose.local.yml up

# Produção
docker-compose up

# Com IA habilitada
docker-compose -f docker-compose.ia.yml up
```

## 📚 Documentação

- [Guia de Desenvolvimento](./docs/DEVELOPMENT.md)
- [Arquitetura dos Serviços](./docs/ARQUITETURA_SERVICOS.md)
- [Guia Prisma Completo](./docs/PRISMA_GUIA_COMPLETO.md)
- [Setup Google Cloud](./docs/GOOGLE_CLOUD_SETUP.md)
- [Importação/Exportação](./docs/IMPORT-EXPORT-DOCS.md)

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes end-to-end
npm run test:e2e

# Testes com watch
npm run test:watch
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📝 Changelog

### Versão 5.0 (Atual)
- ✅ Sistema completo funcional
- ✅ Autenticação JWT + Google OAuth
- ✅ CRUD completo de transações
- ✅ Sistema de orçamentos e metas
- ✅ Relatórios interativos
- ✅ PWA configurado
- ✅ Banco SQLite configurado
- ✅ Docker multi-ambiente
- ✅ Documentação Swagger
- ✅ Scripts de automação

### Próximas Versões
- 🔮 Integração com APIs bancárias
- 🔮 IA para análise de gastos
- 🔮 Notificações push
- 🔮 Modo offline avançado

## 🆘 Suporte

- **Issues**: Reporte bugs e sugestões nas Issues do GitHub
- **Documentação**: Consulte a pasta `/docs` para guias detalhados
- **API**: Acesse `/api/docs` para documentação da API

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

---

<div align="center">

**🎯 Will Finance 5.0 - Transformando a gestão financeira pessoal** 

[![Made with ❤️](https://img.shields.io/badge/Made%20with-❤️-red?style=for-the-badge)](https://github.com/willfinance)

</div>
