Front-end Specification — Will Finance 5.0 (Client)

Resumo
------
Documento detalhado das telas e componentes atuais do frontend (client/) com propostas de melhoria, contratos, estados, e prioridades para implementação.

Estrutura do projeto (relevante)
- src/
  - components/
    - layout/
      - Header.tsx
      - Sidebar.tsx
      - Layout.tsx
  - pages/
    - Dashboard/
      - DashboardPage.tsx
      - DashboardCards.tsx
    - Transactions/TransactionsPage.tsx
    - Budgets/BudgetsPage.tsx
    - Reports/ReportsPage.tsx
    - Settings/SettingsPage.tsx
    - Auth/
      - LoginPage.tsx
      - RegisterPage.tsx
  - styles/index.css

Objetivo
--------
Tornar cada tela descrita, com contrato (inputs/outputs), estrutura de componentes, responsabilidades, estados locais e globais, e sugestões de UX / acessibilidade / performance para uma versão "enterprise / cyberpunk" pronta para design e desenvolvimento.

Padrões visuais e utilitários
- Cores: variáveis em `:root` em `index.css` (cyber-primary, cyber-secondary, background-*).
- Componentes de base: `.card`, `.glass`, `.btn`, `.input`.
- Tipografia: `--font-family-primary` (Inter) e `--font-family-mono`.
- Layout: Header fixo (64px), Sidebar fixo desktop (16rem) e drawer mobile.

Regras gerais de acessibilidade
- Todos os botões de controle do menu devem ter `aria-label`.
- Links de navegação devem indicar o estado `aria-current="page"` quando ativos.
- Form inputs devem usar `label` ou `aria-label` e ter estados de foco visíveis.

Telas (detalhado)
-----------------
1) Dashboard (src/pages/Dashboard)
- Arquivos: `DashboardPage.tsx`, `DashboardCards.tsx`
- Objetivo: visão geral financeira rápida (saldo, receitas, despesas, orçamentos ativos), entrada para gráficos, próximos lançamentos e notificações.
- Componentes e contrato:
  - DashboardCards
    - Inputs: lista de métricas (id, icon, title, value, description, color)
    - Output: grid responsivo de cards
    - Estados: nenhum necessário (apenas render)
  - DashboardPage
    - Inputs: (opcional) user context
    - Output: combinação de cabeçalho, cards, widgets
- Acessibilidade: cards devem ser navegáveis por teclado se clicáveis; ícones decorativos usar `aria-hidden="true"`.
- Melhorias sugeridas:
  - Separar dados estáticos dos componentes e consumir via hook `useDashboardData()` (mock -> API)
  - Adicionar testes (unitários) para garantir renderização do grid e fallback quando vazio
  - Incluir placeholders skeleton enquanto dados carregam
  - Implementar gráficos (Chart.js) em widget à direita em desktop

2) Transações (src/pages/Transactions)
- Arquivo: `TransactionsPage.tsx`
- Objetivo: listar, filtrar, criar e editar transações.
- Componentes sugeridos:
  - TransactionsList (virtualized list)
  - TransactionRow (item da lista)
  - TransactionForm (modal ou drawer)
- Contrato mínimo por componente:
  - TransactionsList
    - Props: transactions[], onEdit(id), onDelete(id), onPageChange
    - States: page, pageSize, loading
- Melhoria UX:
  - Buscar transações com paginação cursor-based
  - Filtrar por conta, categoria, período
  - Ações rápidas (repetir, dividir, exportar CSV)
  - Atalhos de teclado

3) Orçamentos (src/pages/Budgets)
- Arquivo: `BudgetsPage.tsx`
- Objetivo: criar/acompanhar orçamentos por categoria
- Componentes: BudgetsList, BudgetForm, BudgetProgress
- Melhoria: visual progress bars, alertas quando consumo > X%

4) Relatórios (src/pages/Reports)
- Arquivo: `ReportsPage.tsx`
- Objetivo: gerar relatórios exportáveis e gráficos históricos
- Componentes: ReportsFilters, ReportsGrid, ChartWidgets
- Melhoria: export PDF/CSV, filtros de comparação ano-a-ano

5) Configurações (src/pages/Settings)
- Arquivo: `SettingsPage.tsx`
- Objetivo: preferências do usuário, integrações, segurança
- Componentes: ProfileForm, SecuritySection (2FA), Integrations
- Melhoria: sessão ativa, revogar tokens, logs de auditoria

6) Autenticação (src/pages/Auth)
- Arquivos: `LoginPage.tsx`, `RegisterPage.tsx`
- Objetivo: fluxo de login/registro com validação (Zod) e feedback claro
- Contrato/Form validation:
  - Usar `react-hook-form` + `zod` para formularios
  - Exibir erros inline
  - Botão de progredir com estado `loading`
- Segurança:
  - Não logar senhas e usar HTTPS no servidor
  - Reforçar políticas de senha e 2FA como opção

Componentes de layout (detalhes)
- `Header.tsx`
  - Props: onMenuClick?: () => void
  - Responsabilidade: título, ações globais (Pesquisa, Perfil, Notificações), botão de menu para mobile
  - Melhorias: adicionar menu de usuário com avatar, acesso rápido às notificações
- `Sidebar.tsx`
  - Props: mobileOpen?: boolean, setMobileOpen?: (open:boolean) => void
  - Responsabilidade: navegação primária, acesso a features
  - Melhorias: agrupar por seção, adicionar badges e estado ativo com `aria-current`.
- `Layout.tsx`
  - Responsabilidade: compor Header + Sidebar + main
  - Melhoria: controlar overflow do main, scroll independent do sidebar, foco trap no drawer mobile

Estilo e tokens design
- Documentar tokens adicionais (espessuras, espaçamentos, breakpoints)
- Criar um pequeno arquivo `design-tokens.md` (próxima etapa)

Testes e qualidade
- Escrever testes unitários para componentes cruciais: Sidebar, Header, DashboardCards
- E2E básico com Playwright cobrindo fluxo de login e visualização do dashboard

Plano de refatoração prioritária (curto prazo)
1. Normalizar classes CSS e remover vestígios de Tailwind (feito parcialmente)
2. Separar dados fake em `src/mocks/dashboard.ts` e criar `useDashboardData` hook
3. Melhorar Header e Sidebar com acessibilidade e agrupamento
4. Implementar TransactionList skeleton e pagination
5. Rodar linter e corrigir erros TS/ESLint

Checkpoint actual
- Varias páginas padronizadas com classes novas e CSS utilitário adicionado (`.page-title`, `.form-card`, `.input` etc.)
- Sidebar e Header refatorados para evitar sobreposição com o content

Próximos passos que posso executar agora
- 1) Criar `src/mocks/dashboard.ts` com dados estruturados e trocar `DashboardCards` para consumir via hook
- 2) Implementar `useDashboardData` (simples fetch mock)
- 3) Adicionar skeleton loading para cards
- 4) Rodar dev server e validar (preciso de confirmação para executar comandos no terminal)

Se você autorizar, inicio pelo item 1 e 2 (mocks + hook) e já atualizo `DashboardCards` para consumir o hook e exibir skeleton enquanto carrega.
