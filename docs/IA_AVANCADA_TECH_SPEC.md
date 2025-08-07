# 🤖 IA Financeira Avançada - Documentação Técnica

## 🎯 Visão Geral
Este documento detalha a implementação da IA financeira avançada para o Will Finance 5.0, incluindo previsões inteligentes, ChatGPT financeiro personalizado e alertas proativos.

---

## 🏗️ Arquitetura da IA

### Microserviços de IA
```
ai-services/
├── prediction-engine/          # Previsões financeiras
│   ├── models/
│   │   ├── time-series/       # LSTM, ARIMA para previsões
│   │   ├── classification/    # Categorização automática
│   │   └── anomaly-detection/ # Detecção de gastos anômalos
│   ├── training/
│   └── inference/
├── nlp-engine/                # Processamento de linguagem natural
│   ├── intent-recognition/    # Classificação de intenções
│   ├── entity-extraction/     # Extração de entidades financeiras
│   └── response-generation/   # Geração de respostas
├── recommendation-engine/      # Sistema de recomendações
│   ├── collaborative/         # Filtragem colaborativa
│   ├── content-based/         # Baseado em conteúdo
│   └── hybrid/               # Abordagem híbrida
└── alert-system/              # Sistema de alertas inteligentes
    ├── pattern-detection/
    ├── threshold-monitoring/
    └── notification-manager/
```

---

## 📊 Módulo de Previsões Financeiras

### 1. Modelo de Previsão de Saldo

#### Algoritmo Base: LSTM (Long Short-Term Memory)
```python
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
import numpy as np
import pandas as pd

class FinancialForecastModel:
    def __init__(self, sequence_length=30, features=5):
        self.sequence_length = sequence_length
        self.features = features
        self.model = self._build_model()
    
    def _build_model(self):
        model = Sequential([
            LSTM(50, return_sequences=True, input_shape=(self.sequence_length, self.features)),
            Dropout(0.2),
            LSTM(50, return_sequences=True),
            Dropout(0.2),
            LSTM(50),
            Dropout(0.2),
            Dense(25),
            Dense(1)
        ])
        
        model.compile(optimizer='adam', loss='mean_squared_error')
        return model
    
    def prepare_data(self, user_transactions):
        """
        Prepara dados do usuário para treinamento/predição
        Features: [saldo_atual, receitas, despesas, dia_semana, dia_mes]
        """
        # Agregação diária
        daily_data = user_transactions.groupby(user_transactions['date'].dt.date).agg({
            'amount': 'sum',
            'type': lambda x: (x == 'income').sum() - (x == 'expense').sum()
        }).reset_index()
        
        # Calcular saldo acumulado
        daily_data['balance'] = daily_data['amount'].cumsum()
        
        # Features adicionais
        daily_data['day_of_week'] = pd.to_datetime(daily_data['date']).dt.dayofweek
        daily_data['day_of_month'] = pd.to_datetime(daily_data['date']).dt.day
        daily_data['income'] = daily_data['type'].apply(lambda x: max(0, x))
        daily_data['expense'] = daily_data['type'].apply(lambda x: abs(min(0, x)))
        
        return daily_data[['balance', 'income', 'expense', 'day_of_week', 'day_of_month']]
    
    def predict_balance(self, user_data, days_ahead=30):
        """
        Prediz saldo futuro para N dias
        """
        # Preparar sequência de entrada
        sequence = self._create_sequences(user_data)[-1].reshape(1, self.sequence_length, self.features)
        
        predictions = []
        current_sequence = sequence
        
        for _ in range(days_ahead):
            pred = self.model.predict(current_sequence, verbose=0)[0][0]
            predictions.append(pred)
            
            # Atualizar sequência (sliding window)
            new_row = self._estimate_next_features(current_sequence, pred)
            current_sequence = np.roll(current_sequence, -1, axis=1)
            current_sequence[0, -1] = new_row
        
        return predictions
    
    def generate_scenarios(self, user_data, scenarios):
        """
        Gera múltiplos cenários de previsão
        """
        results = {}
        
        for scenario_name, modifications in scenarios.items():
            modified_data = user_data.copy()
            
            # Aplicar modificações do cenário
            for key, value in modifications.items():
                if key == 'income_increase':
                    modified_data['income'] *= (1 + value)
                elif key == 'expense_reduction':
                    modified_data['expense'] *= (1 - value)
                elif key == 'one_time_expense':
                    modified_data.iloc[-1, modified_data.columns.get_loc('expense')] += value
            
            results[scenario_name] = self.predict_balance(modified_data)
        
        return results
```

### 2. Sistema de Categorização Automática

```python
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
import re

class TransactionCategorizer:
    def __init__(self):
        self.pipeline = Pipeline([
            ('tfidf', TfidfVectorizer(max_features=1000, stop_words='portuguese')),
            ('classifier', MultinomialNB())
        ])
        
        self.categories = [
            'alimentacao', 'transporte', 'saude', 'educacao', 'lazer',
            'casa', 'roupas', 'tecnologia', 'investimentos', 'outros'
        ]
    
    def preprocess_description(self, description):
        """
        Limpa e prepara descrição da transação
        """
        # Remover caracteres especiais e números
        text = re.sub(r'[^a-zA-ZÀ-ÿ\s]', '', description.lower())
        
        # Remover espaços extras
        text = ' '.join(text.split())
        
        return text
    
    def train(self, training_data):
        """
        Treina o modelo com dados históricos
        """
        descriptions = [self.preprocess_description(desc) for desc in training_data['description']]
        categories = training_data['category']
        
        self.pipeline.fit(descriptions, categories)
    
    def predict_category(self, description, confidence_threshold=0.6):
        """
        Prediz categoria com score de confiança
        """
        processed_desc = self.preprocess_description(description)
        prediction = self.pipeline.predict([processed_desc])[0]
        probabilities = self.pipeline.predict_proba([processed_desc])[0]
        
        max_prob = max(probabilities)
        
        if max_prob >= confidence_threshold:
            return {
                'category': prediction,
                'confidence': max_prob,
                'suggestions': self._get_top_suggestions(probabilities)
            }
        else:
            return {
                'category': 'outros',
                'confidence': max_prob,
                'suggestions': self._get_top_suggestions(probabilities),
                'requires_manual_review': True
            }
    
    def _get_top_suggestions(self, probabilities):
        """
        Retorna top 3 categorias sugeridas
        """
        top_indices = probabilities.argsort()[-3:][::-1]
        return [
            {
                'category': self.categories[i],
                'probability': probabilities[i]
            }
            for i in top_indices
        ]
```

---

## 🗣️ ChatGPT Financeiro Personalizado

### 1. Sistema de Processamento de Linguagem Natural

```typescript
interface FinancialIntent {
  type: 'query' | 'analysis' | 'recommendation' | 'planning';
  category: string;
  entities: FinancialEntity[];
  confidence: number;
}

interface FinancialEntity {
  type: 'amount' | 'date' | 'category' | 'account' | 'period';
  value: string;
  normalized: any;
}

interface ConversationContext {
  userId: string;
  sessionId: string;
  history: Message[];
  userData: UserFinancialProfile;
}

class FinancialNLPProcessor {
  private openai: OpenAI;
  private intentClassifier: IntentClassifier;
  private entityExtractor: EntityExtractor;

  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    this.intentClassifier = new IntentClassifier();
    this.entityExtractor = new EntityExtractor();
  }

  async processQuery(message: string, context: ConversationContext): Promise<FinancialResponse> {
    // 1. Classificar intenção
    const intent = await this.intentClassifier.classify(message);
    
    // 2. Extrair entidades financeiras
    const entities = await this.entityExtractor.extract(message);
    
    // 3. Buscar dados relevantes do usuário
    const relevantData = await this.fetchRelevantData(intent, entities, context.userData);
    
    // 4. Gerar contexto personalizado
    const contextPrompt = this.buildContextPrompt(intent, entities, relevantData, context);
    
    // 5. Gerar resposta via GPT
    const response = await this.generateResponse(contextPrompt, message);
    
    return {
      intent,
      entities,
      response: response.content,
      actions: this.extractActions(response),
      followUpQuestions: this.generateFollowUpQuestions(intent, context)
    };
  }

  private buildContextPrompt(
    intent: FinancialIntent,
    entities: FinancialEntity[],
    userData: any,
    context: ConversationContext
  ): string {
    return `
Você é um assistente financeiro pessoal especializado, focado em ajudar o usuário com suas finanças pessoais.

PERFIL DO USUÁRIO:
- Saldo atual: R$ ${userData.currentBalance?.toFixed(2) || '0,00'}
- Receita mensal média: R$ ${userData.avgMonthlyIncome?.toFixed(2) || '0,00'}
- Gastos mensais médios: R$ ${userData.avgMonthlyExpenses?.toFixed(2) || '0,00'}
- Categorias de maior gasto: ${userData.topExpenseCategories?.join(', ') || 'Não disponível'}

DADOS RELEVANTES:
${JSON.stringify(userData, null, 2)}

HISTÓRICO DA CONVERSA:
${context.history.slice(-5).map(msg => `${msg.role}: ${msg.content}`).join('\n')}

INSTRUÇÕES:
1. Responda de forma personalizada baseada nos dados reais do usuário
2. Use linguagem clara e acessível
3. Forneça insights práticos e acionáveis
4. Inclua números específicos quando relevante
5. Se necessário, faça perguntas para clarificar
6. Mantenha um tom profissional mas amigável
7. Foque em soluções práticas

INTENÇÃO DETECTADA: ${intent.type} - ${intent.category}
ENTIDADES: ${entities.map(e => `${e.type}: ${e.value}`).join(', ')}
    `;
  }

  private async generateResponse(contextPrompt: string, userMessage: string): Promise<any> {
    const completion = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: contextPrompt },
        { role: "user", content: userMessage }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return completion.choices[0].message;
  }

  private extractActions(response: any): FinancialAction[] {
    // Extrair ações sugeridas da resposta
    const actions: FinancialAction[] = [];
    
    // Detectar padrões de ação na resposta
    const actionPatterns = {
      'create_budget': /criar.*orçamento|definir.*limite/i,
      'set_goal': /meta.*economia|objetivo.*financeiro/i,
      'analyze_expenses': /analisar.*gastos|revisar.*despesas/i,
      'investment_suggestion': /investir|aplicar.*dinheiro/i
    };

    for (const [actionType, pattern] of Object.entries(actionPatterns)) {
      if (pattern.test(response.content)) {
        actions.push({
          type: actionType,
          description: this.extractActionDescription(response.content, pattern),
          priority: 'medium'
        });
      }
    }

    return actions;
  }
}
```

### 2. Sistema de Recomendações Inteligentes

```typescript
class FinancialRecommendationEngine {
  async generateRecommendations(userProfile: UserFinancialProfile): Promise<Recommendation[]> {
    const recommendations: Recommendation[] = [];

    // 1. Análise de padrões de gastos
    const spendingAnalysis = await this.analyzeSpendingPatterns(userProfile);
    
    // 2. Recomendações de economia
    if (spendingAnalysis.potentialSavings > 0) {
      recommendations.push({
        type: 'cost_reduction',
        title: 'Oportunidade de Economia Identificada',
        description: `Você pode economizar até R$ ${spendingAnalysis.potentialSavings.toFixed(2)} por mês`,
        impact: 'high',
        actions: spendingAnalysis.savingActions,
        category: 'economia'
      });
    }

    // 3. Recomendações de investimento
    const investmentOpportunities = await this.analyzeInvestmentOpportunities(userProfile);
    recommendations.push(...investmentOpportunities);

    // 4. Alertas de meta
    const goalProgress = await this.analyzeGoalProgress(userProfile);
    if (goalProgress.needsAttention.length > 0) {
      recommendations.push(...goalProgress.needsAttention);
    }

    // 5. Previsões de fluxo de caixa
    const cashFlowAlerts = await this.analyzeCashFlow(userProfile);
    recommendations.push(...cashFlowAlerts);

    return recommendations.sort((a, b) => this.priorityScore(b) - this.priorityScore(a));
  }

  private async analyzeSpendingPatterns(profile: UserFinancialProfile): Promise<SpendingAnalysis> {
    const transactions = profile.recentTransactions;
    const categorySpending = this.groupByCategory(transactions);
    
    // Detectar gastos anômalos
    const anomalies = await this.detectAnomalies(transactions);
    
    // Identificar padrões de economia
    const savingOpportunities = this.identifySavingOpportunities(categorySpending);
    
    return {
      potentialSavings: savingOpportunities.reduce((sum, opp) => sum + opp.amount, 0),
      savingActions: savingOpportunities.map(opp => opp.action),
      anomalies,
      trends: this.analyzeTrends(categorySpending)
    };
  }

  private identifySavingOpportunities(categorySpending: CategorySpending[]): SavingOpportunity[] {
    const opportunities: SavingOpportunity[] = [];

    for (const category of categorySpending) {
      // Comparar com benchmarks
      const benchmark = this.getBenchmark(category.name);
      
      if (category.amount > benchmark.recommended * 1.2) {
        opportunities.push({
          category: category.name,
          currentAmount: category.amount,
          recommendedAmount: benchmark.recommended,
          amount: category.amount - benchmark.recommended,
          action: `Considere reduzir gastos em ${category.name} para aproximadamente R$ ${benchmark.recommended.toFixed(2)} por mês`,
          confidence: this.calculateConfidence(category, benchmark)
        });
      }
    }

    return opportunities;
  }
}
```

---

## 🚨 Sistema de Alertas Inteligentes

### 1. Detecção de Anomalias

```python
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import numpy as np

class AnomalyDetector:
    def __init__(self):
        self.isolation_forest = IsolationForest(contamination=0.1, random_state=42)
        self.scaler = StandardScaler()
        self.is_trained = False
    
    def train(self, transaction_data):
        """
        Treina o detector com histórico de transações do usuário
        """
        features = self._extract_features(transaction_data)
        features_scaled = self.scaler.fit_transform(features)
        self.isolation_forest.fit(features_scaled)
        self.is_trained = True
    
    def _extract_features(self, transactions):
        """
        Extrai features relevantes para detecção de anomalias
        """
        features = []
        
        for _, transaction in transactions.iterrows():
            feature_vector = [
                transaction['amount'],
                transaction['hour'],
                transaction['day_of_week'],
                transaction['category_encoded'],
                transaction['merchant_encoded'] if 'merchant_encoded' in transaction else 0,
                transaction['account_balance_before'],
                self._calculate_frequency_score(transaction, transactions)
            ]
            features.append(feature_vector)
        
        return np.array(features)
    
    def detect_anomaly(self, new_transaction, user_transactions):
        """
        Detecta se uma nova transação é anômala
        """
        if not self.is_trained:
            self.train(user_transactions)
        
        features = self._extract_features(pd.DataFrame([new_transaction]))
        features_scaled = self.scaler.transform(features)
        
        anomaly_score = self.isolation_forest.decision_function(features_scaled)[0]
        is_anomaly = self.isolation_forest.predict(features_scaled)[0] == -1
        
        return {
            'is_anomaly': is_anomaly,
            'anomaly_score': anomaly_score,
            'risk_level': self._calculate_risk_level(anomaly_score),
            'explanation': self._generate_explanation(new_transaction, anomaly_score)
        }
    
    def _calculate_risk_level(self, score):
        if score < -0.5:
            return 'high'
        elif score < -0.2:
            return 'medium'
        else:
            return 'low'
    
    def _generate_explanation(self, transaction, score):
        explanations = []
        
        # Verificar valor anômalo
        if transaction['amount'] > transaction.get('usual_max', 0) * 2:
            explanations.append(f"Valor muito acima do usual (R$ {transaction['amount']:.2f})")
        
        # Verificar horário anômalo
        if transaction['hour'] < 6 or transaction['hour'] > 23:
            explanations.append(f"Horário incomum ({transaction['hour']}h)")
        
        # Verificar categoria anômala
        if transaction.get('new_merchant', False):
            explanations.append("Novo estabelecimento")
        
        return '; '.join(explanations) if explanations else "Padrão atípico detectado"
```

### 2. Sistema de Monitoramento de Orçamento

```typescript
interface BudgetAlert {
  type: 'warning' | 'danger' | 'info';
  category: string;
  currentSpent: number;
  budgetLimit: number;
  percentage: number;
  projectedEnd: Date;
  recommendations: string[];
}

class BudgetMonitor {
  async checkBudgetStatus(userId: string): Promise<BudgetAlert[]> {
    const user = await this.getUserWithBudgets(userId);
    const alerts: BudgetAlert[] = [];

    for (const budget of user.budgets) {
      const currentPeriodSpending = await this.getCurrentPeriodSpending(
        userId, 
        budget.category, 
        budget.period
      );

      const percentage = (currentPeriodSpending / budget.limit) * 100;
      
      if (percentage >= 90) {
        alerts.push({
          type: 'danger',
          category: budget.category,
          currentSpent: currentPeriodSpending,
          budgetLimit: budget.limit,
          percentage,
          projectedEnd: this.calculateProjectedEnd(currentPeriodSpending, budget),
          recommendations: this.generateRecommendations(budget, percentage)
        });
      } else if (percentage >= 75) {
        alerts.push({
          type: 'warning',
          category: budget.category,
          currentSpent: currentPeriodSpending,
          budgetLimit: budget.limit,
          percentage,
          projectedEnd: this.calculateProjectedEnd(currentPeriodSpending, budget),
          recommendations: this.generateRecommendations(budget, percentage)
        });
      }
    }

    return alerts;
  }

  private generateRecommendations(budget: Budget, percentage: number): string[] {
    const recommendations = [];

    if (percentage >= 90) {
      recommendations.push(`Evite gastos em ${budget.category} pelo resto do período`);
      recommendations.push('Considere revisar o orçamento para o próximo período');
    } else if (percentage >= 75) {
      recommendations.push(`Monitore gastos em ${budget.category} mais de perto`);
      recommendations.push('Procure alternativas mais econômicas');
    }

    // Recomendações específicas por categoria
    const categoryRecommendations = {
      'alimentacao': [
        'Cozinhe mais em casa',
        'Procure promoções no supermercado',
        'Evite delivery e restaurantes'
      ],
      'transporte': [
        'Use transporte público',
        'Considere carona solidária',
        'Caminhe ou use bicicleta quando possível'
      ],
      'lazer': [
        'Procure atividades gratuitas',
        'Aproveite promoções e descontos',
        'Organize programas em casa'
      ]
    };

    if (categoryRecommendations[budget.category]) {
      recommendations.push(...categoryRecommendations[budget.category].slice(0, 2));
    }

    return recommendations;
  }
}
```

---

## 📱 Integração Frontend-Backend

### 1. API Endpoints para IA

```typescript
// src/api/ai.ts
export const aiAPI = {
  // Chat financeiro
  async sendMessage(message: string, sessionId: string): Promise<ChatResponse> {
    return await api.post('/ai/chat', { message, sessionId });
  },

  // Previsões
  async getBalancePrediction(days: number = 30): Promise<PredictionResponse> {
    return await api.get(`/ai/predictions/balance?days=${days}`);
  },

  async getScenarios(scenarios: Scenario[]): Promise<ScenarioResponse> {
    return await api.post('/ai/predictions/scenarios', { scenarios });
  },

  // Alertas
  async getAlerts(): Promise<Alert[]> {
    return await api.get('/ai/alerts');
  },

  async dismissAlert(alertId: string): Promise<void> {
    return await api.patch(`/ai/alerts/${alertId}/dismiss`);
  },

  // Recomendações
  async getRecommendations(): Promise<Recommendation[]> {
    return await api.get('/ai/recommendations');
  },

  // Categorização automática
  async categorizeTransaction(description: string): Promise<CategorySuggestion> {
    return await api.post('/ai/categorize', { description });
  }
};
```

### 2. Hooks React para IA

```typescript
// src/hooks/useFinancialAI.ts
export const useFinancialAI = () => {
  const [predictions, setPredictions] = useState<PredictionData | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadPredictions = useCallback(async (days: number = 30) => {
    setIsLoading(true);
    try {
      const data = await aiAPI.getBalancePrediction(days);
      setPredictions(data);
    } catch (error) {
      console.error('Error loading predictions:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadAlerts = useCallback(async () => {
    try {
      const data = await aiAPI.getAlerts();
      setAlerts(data);
    } catch (error) {
      console.error('Error loading alerts:', error);
    }
  }, []);

  const loadRecommendations = useCallback(async () => {
    try {
      const data = await aiAPI.getRecommendations();
      setRecommendations(data);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    }
  }, []);

  useEffect(() => {
    loadPredictions();
    loadAlerts();
    loadRecommendations();
  }, [loadPredictions, loadAlerts, loadRecommendations]);

  return {
    predictions,
    alerts,
    recommendations,
    isLoading,
    loadPredictions,
    loadAlerts,
    loadRecommendations,
    dismissAlert: (alertId: string) => aiAPI.dismissAlert(alertId).then(() => loadAlerts())
  };
};
```

---

## 🔧 Deploy e Monitoramento

### 1. Docker para Serviços de IA

```dockerfile
# Dockerfile.ai-services
FROM python:3.9-slim

WORKDIR /app

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código
COPY . .

# Configurar variáveis de ambiente
ENV PYTHONPATH=/app
ENV MODEL_PATH=/app/models

# Expor porta
EXPOSE 8001

# Comando de inicialização
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]
```

### 2. Monitoramento de Performance

```typescript
// src/monitoring/aiMetrics.ts
export class AIMetricsCollector {
  private metrics: Map<string, number[]> = new Map();

  recordPredictionAccuracy(predicted: number, actual: number) {
    const accuracy = 1 - Math.abs((predicted - actual) / actual);
    this.addMetric('prediction_accuracy', accuracy);
  }

  recordResponseTime(operation: string, time: number) {
    this.addMetric(`response_time_${operation}`, time);
  }

  recordUserSatisfaction(rating: number) {
    this.addMetric('user_satisfaction', rating);
  }

  private addMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(value);
    
    // Manter apenas os últimos 100 valores
    if (this.metrics.get(name)!.length > 100) {
      this.metrics.get(name)!.shift();
    }
  }

  getMetricsSummary() {
    const summary: Record<string, any> = {};
    
    for (const [name, values] of this.metrics.entries()) {
      summary[name] = {
        avg: values.reduce((a, b) => a + b, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        count: values.length
      };
    }
    
    return summary;
  }
}
```

---

## 📋 Checklist de Implementação

### Fase 1: Fundação (2-3 semanas)
- [ ] Configurar microserviços de IA
- [ ] Implementar modelo básico de previsão LSTM
- [ ] Criar sistema de categorização automática
- [ ] Configurar pipeline de dados

### Fase 2: NLP e Chat (3-4 semanas)
- [ ] Integrar OpenAI API
- [ ] Implementar processamento de intenções
- [ ] Criar sistema de contexto conversacional
- [ ] Desenvolver gerador de respostas personalizadas

### Fase 3: Alertas e Recomendações (2-3 semanas)
- [ ] Implementar detector de anomalias
- [ ] Criar sistema de monitoramento de orçamento
- [ ] Desenvolver engine de recomendações
- [ ] Configurar notificações em tempo real

### Fase 4: Interface e UX (2-3 semanas)
- [ ] Criar componentes React para chat
- [ ] Implementar dashboard de previsões
- [ ] Desenvolver interface de alertas
- [ ] Adicionar visualizações interativas

### Fase 5: Testes e Otimização (2-3 semanas)
- [ ] Testes automatizados para modelos
- [ ] Validação de accuracy das previsões
- [ ] Otimização de performance
- [ ] Testes de usabilidade

---

*Esta documentação será atualizada conforme o desenvolvimento progride.*
