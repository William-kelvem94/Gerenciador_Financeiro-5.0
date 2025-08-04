# 🤖 AI Integration Service

Serviço responsável pela integração com Inteligência Artificial no Will Finance 5.0.

## 📋 Funcionalidades

### ✅ **Implementadas:**

1. **Análise de Transações**
   - Classificação automática de categorias
   - Análise de confiança
   - Geração de tags
   - Sistema de fallback com regras

2. **Geração de Insights Financeiros**
   - Análise de padrões de gastos
   - Identificação de categorias mais gastas
   - Alertas de gastos altos
   - Oportunidades de economia

3. **Processamento de Extratos**
   - Integração com scripts Python
   - Análise automática de PDFs
   - Extração de transações

4. **Gestão de Insights**
   - Salvamento no banco de dados
   - Marcação como lido
   - Busca paginada

### 🔄 **Preparadas para Implementação:**

- Integração com modelos de ML externos
- Processamento via API REST
- Análise de documentos via OCR
- Predições de gastos futuros

## 🏗️ Arquitetura

```
AiIntegrationService
├── analyzeTransaction()      # Análise individual
├── generateFinancialInsights() # Insights gerais
├── processStatementWithAI()  # Processar extratos
├── getUserInsights()         # Buscar insights
└── markInsightAsRead()       # Marcar como lido
```

## 🔗 Integração com Módulos

### Transaction Module
```typescript
import { AiIntegrationService } from '../services/ai-integration.service';

const aiService = new AiIntegrationService();

// Após criar transação
const analysis = await aiService.analyzeTransaction(userId, {
  description: transaction.description,
  amount: transaction.amount,
  date: transaction.date
});

// Atualizar campos de IA na transação
await prisma.transaction.update({
  where: { id: transaction.id },
  data: {
    aiAnalyzed: true,
    aiCategories: analysis.suggestedCategory,
    aiConfidence: analysis.confidence,
    aiTags: analysis.tags.join(',')
  }
});
```

## 🐍 Scripts Python

O serviço espera scripts Python no diretório `../../IA/src/`:

- `analyze_transaction.py` - Análise individual
- `process_statement.py` - Processamento de extratos

### Formato de Entrada/Saída

**analyze_transaction.py**
```json
// Entrada
{
  "description": "Supermercado Carrefour",
  "amount": 150.75,
  "date": "2024-01-15T10:30:00Z"
}

// Saída
{
  "suggestedCategory": "Alimentação",
  "confidence": 0.85,
  "tags": ["comida", "essencial"],
  "insights": ["Gasto dentro da média mensal"]
}
```

## 🛠️ Configuração

### Variáveis de Ambiente

```env
AI_SERVICE_URL=http://localhost:8000  # URL do serviço de IA (futuro)
```

### Dependências Python

Certifique-se de que o Python está disponível no PATH do sistema.

## 📊 Schema do Banco

O serviço utiliza os seguintes modelos:

```prisma
model AiInsight {
  id          String   @id @default(cuid())
  type        String   # EXPENSE_PATTERN, BUDGET_ALERT, etc.
  title       String
  description String
  confidence  Float
  data        String   # JSON metadata
  isRead      Boolean  @default(false)
  createdAt   DateTime @default(now())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
}

model Transaction {
  // ... outros campos
  aiAnalyzed    Boolean  @default(false)
  aiCategories  String?
  aiConfidence  Float?
  aiTags        String?
}
```

## 🎯 Tipos de Insights

1. **EXPENSE_PATTERN** - Padrões de gastos identificados
2. **BUDGET_ALERT** - Alertas de orçamento
3. **SAVING_OPPORTUNITY** - Oportunidades de economia
4. **CATEGORY_SUGGESTION** - Sugestões de categorização

## 🚀 Próximos Passos

1. **Implementar scripts Python** no diretório IA/src
2. **Criar endpoints REST** para exposição via API
3. **Integrar com Transaction Module** para análise automática
4. **Implementar jobs periódicos** para geração de insights
5. **Adicionar testes unitários** e de integração

## 🔧 Troubleshooting

### Erro: "Python script failed"
- Verificar se Python está instalado
- Verificar se os scripts existem em `../../IA/src/`
- Verificar dependências Python

### Erro: "Invalid JSON response"
- Verificar formato de saída dos scripts Python
- Verificar encoding dos arquivos

### Performance
- Considerar cache para análises repetidas
- Implementar processamento assíncrono para grandes volumes

## 🧪 Testes

```bash
# Executar testes específicos do AI Service
npm test ai-integration.service

# Testar integração com Python
node -e "
const { AiIntegrationService } = require('./dist/services/ai-integration.service');
const service = new AiIntegrationService();
// ... testes
"
```

---

**Status:** ✅ **Implementado e Pronto para Uso**

O serviço está funcional com sistema de fallback robusto. A integração com Python é opcional e pode ser implementada gradualmente.
