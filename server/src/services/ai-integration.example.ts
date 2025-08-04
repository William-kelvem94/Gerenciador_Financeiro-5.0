/**
 * 🤖 AI Integration Service - Usage Example
 * 
 * Exemplo de como usar o serviço de integração com IA
 * NOTA: Este arquivo contém console.log para fins de demonstração
 */

/* eslint-disable no-console */

import { AiIntegrationService } from './ai-integration.service';

// Exemplo de uso do serviço
async function demonstrateAiIntegration() {
  const aiService = new AiIntegrationService();

  try {
    // 1. Analisar uma transação
    const transactionAnalysis = await aiService.analyzeTransaction('user123', {
      description: 'Supermercado Carrefour',
      amount: 150.75,
      date: new Date(),
      accountType: 'checking'
    });

    console.log('Análise da transação:', transactionAnalysis);

    // 2. Gerar insights financeiros
    await aiService.generateFinancialInsights('user123');

    // 3. Buscar insights do usuário
    const insights = await aiService.getUserInsights('user123', 5);
    console.log('Insights do usuário:', insights);

    // 4. Processar extrato bancário (exemplo)
    // const statementResult = await aiService.processStatementWithAI(
    //   '/path/to/statement.pdf',
    //   'user123'
    // );

  } catch (error) {
    console.error('Erro na demonstração:', error);
  } finally {
    await aiService.disconnect();
  }
}

// Como integrar com o módulo de transações
export async function integrateWithTransactionModule() {
  const aiService = new AiIntegrationService();

  // Esta função pode ser chamada após criar uma transação
  async function analyzeNewTransaction(userId: string, transactionData: {
    description: string;
    amount: number;
    date: Date;
  }) {
    try {
      // Analisar com IA
      const analysis = await aiService.analyzeTransaction(userId, transactionData);
      
      // Retornar sugestões para o frontend
      return {
        suggestedCategory: analysis.suggestedCategory,
        confidence: analysis.confidence,
        tags: analysis.tags,
        insights: analysis.insights
      };
    } catch (error) {
      console.error('Erro na análise:', error);
      return null;
    }
  }

  // Gerar insights periodicamente (pode ser um cron job)
  async function generateWeeklyInsights(userId: string) {
    try {
      await aiService.generateFinancialInsights(userId);
      console.log(`Insights gerados para usuário ${userId}`);
    } catch (error) {
      console.error('Erro ao gerar insights:', error);
    }
  }

  return {
    analyzeNewTransaction,
    generateWeeklyInsights,
    disconnect: () => aiService.disconnect()
  };
}

export default demonstrateAiIntegration;
