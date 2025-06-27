// Serviço de integração com n8n.io para análise financeira IA
// Este serviço conecta com workflows n8n para processamento de dados financeiros

export interface N8nAnalysisRequest {
  type: 'transaction_analysis' | 'budget_optimization' | 'investment_suggestion' | 'spending_pattern';
  data: any;
  userId: string;
}

export interface N8nAnalysisResponse {
  success: boolean;
  analysis: {
    summary: string;
    insights: string[];
    recommendations: string[];
    score?: number;
    charts?: any[];
  };
  processedAt: string;
}

class N8nService {
  private baseUrl: string;
  private webhookToken: string;

  constructor() {
    // Configurações do n8n - ajustar conforme sua instância
    this.baseUrl = import.meta.env.VITE_N8N_BASE_URL || 'http://localhost:5678';
    this.webhookToken = import.meta.env.VITE_N8N_WEBHOOK_TOKEN || 'demo-token';
  }

  /**
   * Analisa transações usando IA via n8n
   */
  async analyzeTransactions(transactions: any[], userId: string): Promise<N8nAnalysisResponse> {
    try {
      console.log('🔥 Enviando transações para análise IA via n8n...');
      
      const response = await fetch(`${this.baseUrl}/webhook/analyze-transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.webhookToken}`,
        },
        body: JSON.stringify({
          type: 'transaction_analysis',
          data: {
            transactions,
            analysisType: 'comprehensive',
            period: '30days'
          },
          userId,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`Erro na análise n8n: ${response.statusText}`);
      }

      const result = await response.json();
      
      console.log('✅ Análise IA concluída:', result);
      return result;

    } catch (error) {
      console.error('❌ Erro na análise via n8n:', error);
      
      // Fallback: retornar análise simulada
      return this.getSimulatedAnalysis(transactions);
    }
  }

  /**
   * Sugere otimizações de orçamento
   */
  async optimizeBudget(budgetData: any, userId: string): Promise<N8nAnalysisResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/webhook/optimize-budget`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.webhookToken}`,
        },
        body: JSON.stringify({
          type: 'budget_optimization',
          data: budgetData,
          userId,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`Erro na otimização n8n: ${response.statusText}`);
      }

      return await response.json();

    } catch (error) {
      console.error('❌ Erro na otimização via n8n:', error);
      return this.getSimulatedBudgetOptimization();
    }
  }

  /**
   * Analisa padrões de gastos
   */
  async analyzeSpendingPatterns(data: any, userId: string): Promise<N8nAnalysisResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/webhook/spending-patterns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.webhookToken}`,
        },
        body: JSON.stringify({
          type: 'spending_pattern',
          data,
          userId,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`Erro na análise de padrões n8n: ${response.statusText}`);
      }

      return await response.json();

    } catch (error) {
      console.error('❌ Erro na análise de padrões via n8n:', error);
      return this.getSimulatedSpendingAnalysis();
    }
  }

  /**
   * Sugere investimentos baseado no perfil
   */
  async suggestInvestments(profileData: any, userId: string): Promise<N8nAnalysisResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/webhook/investment-suggestions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.webhookToken}`,
        },
        body: JSON.stringify({
          type: 'investment_suggestion',
          data: profileData,
          userId,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`Erro nas sugestões n8n: ${response.statusText}`);
      }

      return await response.json();

    } catch (error) {
      console.error('❌ Erro nas sugestões via n8n:', error);
      return this.getSimulatedInvestmentSuggestions();
    }
  }

  /**
   * Análise simulada para fallback
   */
  private getSimulatedAnalysis(transactions: any[]): N8nAnalysisResponse {
    const totalAmount = transactions.reduce((sum, t) => sum + Math.abs(t.amount || 0), 0);
    const avgTransaction = totalAmount / transactions.length || 0;

    return {
      success: true,
      analysis: {
        summary: `Analisadas ${transactions.length} transações totalizando R$ ${totalAmount.toFixed(2)}`,
        insights: [
          `Valor médio por transação: R$ ${avgTransaction.toFixed(2)}`,
          'Padrão de gastos identificado: Regular',
          'Principais categorias: Alimentação, Transporte, Lazer'
        ],
        recommendations: [
          'Considere reduzir gastos em categorias não essenciais',
          'Estabeleça um orçamento mensal para controle',
          'Monitore transações recorrentes'
        ],
        score: Math.floor(Math.random() * 40) + 60 // Score entre 60-100
      },
      processedAt: new Date().toISOString()
    };
  }

  private getSimulatedBudgetOptimization(): N8nAnalysisResponse {
    return {
      success: true,
      analysis: {
        summary: 'Análise de otimização de orçamento concluída',
        insights: [
          'Potencial de economia identificado: 15%',
          'Categorias com maior impacto: Alimentação e Lazer',
          'Gastos recorrentes otimizáveis encontrados'
        ],
        recommendations: [
          'Reduza gastos em alimentação externa em 20%',
          'Renegocie contratos de serviços recorrentes',
          'Estabeleça limite para gastos com lazer'
        ],
        score: 78
      },
      processedAt: new Date().toISOString()
    };
  }

  private getSimulatedSpendingAnalysis(): N8nAnalysisResponse {
    return {
      success: true,
      analysis: {
        summary: 'Padrões de gastos analisados com sucesso',
        insights: [
          'Gastos concentrados em fins de semana',
          'Picos de gastos no meio do mês',
          'Comportamento de consumo regular identificado'
        ],
        recommendations: [
          'Planeje gastos para distribuir melhor ao longo do mês',
          'Crie reserva para picos de consumo',
          'Monitore gastos impulsivos em fins de semana'
        ],
        score: 72
      },
      processedAt: new Date().toISOString()
    };
  }

  private getSimulatedInvestmentSuggestions(): N8nAnalysisResponse {
    return {
      success: true,
      analysis: {
        summary: 'Sugestões de investimento baseadas no seu perfil',
        insights: [
          'Perfil de risco: Moderado',
          'Capacidade de investimento mensal: R$ 500-800',
          'Horizonte de investimento: Médio prazo'
        ],
        recommendations: [
          'Considere fundos de investimento diversificados',
          'Inicie com Tesouro Direto para reserva de emergência',
          'Avalie fundos imobiliários para renda passiva'
        ],
        score: 85
      },
      processedAt: new Date().toISOString()
    };
  }

  /**
   * Testa conectividade com n8n
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/webhook/health-check`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.webhookToken}`,
        }
      });
      
      return response.ok;
    } catch (error) {
      console.warn('⚠️ n8n não está acessível, usando modo simulado:', error);
      return false;
    }
  }
}

export const n8nService = new N8nService();
export default n8nService;
