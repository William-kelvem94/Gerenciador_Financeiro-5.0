# 🎯 Will Finance 5.0 - Guia de Contribuição

Obrigado por considerar contribuir para o Will Finance 5.0! Este documento fornece diretrizes para contribuições.

## 🚀 Como Contribuir

### 1. **Setup do Ambiente de Desenvolvimento**

```bash
# Fork e clone o repositório
git clone https://github.com/seu-usuario/Gerenciador_Financeiro-5.0.git
cd Gerenciador_Financeiro-5.0

# Setup automático
npm run setup

# Ou manual
npm run install:all
npm run db:setup
npm run dev
```

### 2. **Fluxo de Desenvolvimento**

1. **Crie uma branch** para sua feature
   ```bash
   git checkout -b feature/nova-funcionalidade
   ```

2. **Faça suas alterações** seguindo os padrões do projeto

3. **Execute os testes**
   ```bash
   npm run lint
   npm run test
   npm run health:check
   ```

4. **Commit suas alterações**
   ```bash
   git add .
   git commit -m "feat: adiciona nova funcionalidade"
   ```

5. **Push e abra um Pull Request**
   ```bash
   git push origin feature/nova-funcionalidade
   ```

## 📋 Padrões de Código

### **TypeScript/JavaScript**
- Use TypeScript sempre que possível
- Seguir ESLint configurado
- Nomenclatura em camelCase para variáveis e funções
- Nomenclatura em PascalCase para componentes React

### **Commits**
Seguimos o padrão [Conventional Commits](https://conventionalcommits.org/):

```bash
feat: nova funcionalidade
fix: correção de bug
docs: documentação
style: formatação (sem mudança de código)
refactor: refatoração
test: testes
chore: tarefas de manutenção
```

### **Pull Requests**
- Título descritivo
- Descrição detalhada das mudanças
- Screenshots se aplicável
- Testes passando
- Documentação atualizada

## 🏗️ Estrutura do Projeto

```
Will Finance 5.0/
├── client/          # Frontend React + TypeScript
├── server/          # Backend Express + TypeScript
├── docker/          # Configurações Docker
├── docs/            # Documentação
├── scripts/         # Scripts utilitários
└── .github/         # CI/CD workflows
```

## 🧪 Testes

### **Executar Testes**
```bash
# Todos os testes
npm run test

# Lint
npm run lint

# Health check
npm run health:check
```

### **Escrever Testes**
- Testes unitários para funções críticas
- Testes de integração para APIs
- Mocks para dependências externas

## 🐛 Reportando Bugs

Use o template de issue para bugs:

1. **Descrição** do problema
2. **Passos** para reproduzir
3. **Comportamento esperado**
4. **Screenshots** se aplicável
5. **Ambiente** (OS, Node version, etc.)

## 💡 Sugerindo Features

Use o template de issue para features:

1. **Problema** que a feature resolve
2. **Solução proposta**
3. **Alternativas consideradas**
4. **Contexto adicional**

## 🔍 Code Review

### **Como Revisor**
- Seja construtivo e respeitoso
- Foque na funcionalidade e qualidade
- Teste localmente se necessário
- Aprove apenas se estiver satisfeito

### **Como Autor**
- Responda a todos os comentários
- Faça alterações solicitadas
- Teste antes de solicitar nova revisão

## 📚 Recursos Úteis

- [React Documentation](https://reactjs.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Express.js Guide](https://expressjs.com/)
- [Docker Documentation](https://docs.docker.com/)

## 🆘 Precisa de Ajuda?

- Abra uma [issue](../../issues) para dúvidas
- Participe das [discussions](../../discussions)
- Entre em contato com os mantenedores

## 📄 Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a licença MIT do projeto.

---

Obrigado por contribuir! 🎉
