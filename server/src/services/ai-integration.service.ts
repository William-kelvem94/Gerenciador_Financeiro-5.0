/**
 * 🤖 AI Integration Service - Will Finance 5.0
 * 
 * Serviço responsável pela integração com IA para análise de transações
 * e geração de insights financeiros inteligentes
 */

import { PrismaClient } from '@prisma/client';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs/promises';

// Tipos para integração com IA
interface TransactionAnalysisRequest {
  description: string;
  amount: number;
  date: Date;
  accountType?: string;
}

interface TransactionAnalysisResponse {
  suggestedCategory: string;
  confidence: number;
  tags: string[];
  insights: string[];
}

interface AiInsightData {
  type: 'EXPENSE_PATTERN' | 'BUDGET_ALERT' | 'SAVING_OPPORTUNITY' | 'CATEGORY_SUGGESTION';
  title: string;
  description: string;
  confidence: number;
  metadata: Record<string, unknown>;
}

export class AiIntegrationService {
  private prisma: PrismaClient;
  private readonly AI_SERVICE_URL: string;
  private readonly AI_SCRIPT_PATH: string;

  constructor() {
    this.prisma = new PrismaClient();
    this.AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';
    this.AI_SCRIPT_PATH = path.join(process.cwd(), '../../IA/src');
  }

  /**
   * Analisar transação usando IA
   */
  async analyzeTransaction(
    userId: string,
    transactionData: TransactionAnalysisRequest
  ): Promise<TransactionAnalysisResponse> {
    try {
      // Chamar script Python de análise
      const analysis = await this.callPythonAnalysis(transactionData);
      
      // Salvar análise no banco
      await this.saveTransactionAnalysis(userId, transactionData, analysis);
      
      return analysis;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Erro na análise de IA:', error);
      // Fallback para análise simples baseada em regras
      return this.fallbackAnalysis(transactionData);
    }
  }

  /**
   * Chamar script Python para análise
   */
  private async callPythonAnalysis(
    data: TransactionAnalysisRequest
  ): Promise<TransactionAnalysisResponse> {
    return new Promise((resolve, reject) => {
      const scriptPath = path.join(this.AI_SCRIPT_PATH, 'analyze_transaction.py');
      const pythonProcess = spawn('python', [scriptPath, JSON.stringify(data)]);

      let result = '';
      let errorOutput = '';

      pythonProcess.stdout.on('data', (data) => {
        result += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Python script failed: ${errorOutput}`));
          return;
        }

        try {
          const analysis = JSON.parse(result);
          resolve(analysis);
        } catch {
          reject(new Error(`Invalid JSON response: ${result}`));
        }
      });
    });
  }

  /**
   * Análise de fallback baseada em regras simples
   */
  private fallbackAnalysis(data: TransactionAnalysisRequest): TransactionAnalysisResponse {
    const description = data.description.toLowerCase();
    
    // Regras simples de categorização
    let suggestedCategory = 'Outros';
    let confidence = 0.3;
    const tags: string[] = [];
    const insights: string[] = [];

    // Alimentação
    if (description.includes('mercado') || description.includes('supermercado') || 
        description.includes('restaurante') || description.includes('lanchonete')) {
      suggestedCategory = 'Alimentação';
      confidence = 0.8;
      tags.push('comida', 'essencial');
    }
    
    // Transporte
    else if (description.includes('uber') || description.includes('taxi') || 
             description.includes('gasolina') || description.includes('combustível')) {
      suggestedCategory = 'Transporte';
      confidence = 0.8;
      tags.push('mobilidade');
    }
    
    // Saúde
    else if (description.includes('farmácia') || description.includes('médico') || 
             description.includes('hospital') || description.includes('clínica')) {
      suggestedCategory = 'Saúde';
      confidence = 0.9;
      tags.push('saúde', 'essencial');
    }

    // Insights baseados no valor
    if (data.amount > 1000) {
      insights.push('Transação de alto valor - considere revisar seu orçamento');
    }

    return {
      suggestedCategory,
      confidence,
      tags,
      insights
    };
  }

  /**
   * Salvar análise da transação
   */
  private async saveTransactionAnalysis(
    userId: string,
    transactionData: TransactionAnalysisRequest,
    analysis: TransactionAnalysisResponse
  ): Promise<void> {
    // Atualizar campos de IA na transação quando ela for criada
    // (Isso seria chamado após a criação da transação)
    
    // Por enquanto, apenas log para debug
    // eslint-disable-next-line no-console
    console.log('AI Analysis saved:', {
      userId,
      description: transactionData.description,
      category: analysis.suggestedCategory,
      confidence: analysis.confidence
    });
  }

  /**
   * Gerar insights financeiros personalizados
   */
  async generateFinancialInsights(userId: string): Promise<void> {
    try {
      // Buscar transações recentes do usuário
      const recentTransactions = await this.prisma.transaction.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        take: 100,
        include: {
          category: true,
          account: true
        }
      });

      if (recentTransactions.length === 0) {
        return;
      }

      // Análise de padrões de gastos
      const insights = await this.analyzeSpendingPatterns(userId, recentTransactions);
      
      // Salvar insights no banco
      await this.saveInsights(userId, insights);

    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Erro ao gerar insights:', error);
    }
  }

  /**
   * Analisar padrões de gastos
   */
  private async analyzeSpendingPatterns(
    userId: string,
    transactions: Array<{
      id: string;
      amount: number;
      description: string;
      type: string;
      date: Date;
      category: { name: string; type: string };
      account: { name: string };
    }>
  ): Promise<AiInsightData[]> {
    const insights: AiInsightData[] = [];

    // Análise 1: Categorias mais gastas
    const categoryTotals = new Map<string, number>();
    transactions
      .filter(t => t.type === 'EXPENSE')
      .forEach(t => {
        const current = categoryTotals.get(t.category.name) || 0;
        categoryTotals.set(t.category.name, current + t.amount);
      });

    const topCategory = Array.from(categoryTotals.entries())
      .sort((a, b) => b[1] - a[1])[0];

    if (topCategory && topCategory[1] > 1000) {
      insights.push({
        type: 'EXPENSE_PATTERN',
        title: 'Maior Categoria de Gastos',
        description: `Você gastou R$ ${topCategory[1].toFixed(2)} em ${topCategory[0]} no último período`,
        confidence: 0.9,
        metadata: {
          category: topCategory[0],
          amount: topCategory[1],
          period: '30 days'
        }
      });
    }

    // Análise 2: Gastos recorrentes altos
    const recurringExpenses = transactions
      .filter(t => t.type === 'EXPENSE' && t.amount > 500)
      .slice(0, 5);

    if (recurringExpenses.length > 0) {
      const avgAmount = recurringExpenses.reduce((sum, t) => sum + t.amount, 0) / recurringExpenses.length;
      
      insights.push({
        type: 'BUDGET_ALERT',
        title: 'Gastos Altos Identificados',
        description: `Foram identificados ${recurringExpenses.length} gastos acima de R$ 500,00 (média: R$ ${avgAmount.toFixed(2)})`,
        confidence: 0.8,
        metadata: {
          count: recurringExpenses.length,
          averageAmount: avgAmount,
          transactions: recurringExpenses.map(t => ({
            description: t.description,
            amount: t.amount,
            date: t.date
          }))
        }
      });
    }

    // Análise 3: Oportunidades de economia
    const totalExpenses = transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalIncome = transactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);

    if (totalExpenses > totalIncome * 0.8) {
      insights.push({
        type: 'SAVING_OPPORTUNITY',
        title: 'Oportunidade de Economia',
        description: `Seus gastos representam ${((totalExpenses/totalIncome) * 100).toFixed(1)}% da sua renda. Considere revisar gastos não essenciais.`,
        confidence: 0.7,
        metadata: {
          expenseRatio: totalExpenses / totalIncome,
          totalExpenses,
          totalIncome,
          savingPotential: totalIncome * 0.2 - (totalIncome - totalExpenses)
        }
      });
    }

    return insights;
  }

  /**
   * Salvar insights no banco de dados
   */
  private async saveInsights(userId: string, insights: AiInsightData[]): Promise<void> {
    for (const insight of insights) {
      await this.prisma.aiInsight.create({
        data: {
          userId,
          type: insight.type,
          title: insight.title,
          description: insight.description,
          confidence: insight.confidence,
          data: JSON.stringify(insight.metadata),
          isRead: false
        }
      });
    }
  }

  /**
   * Buscar insights do usuário
   */
  async getUserInsights(userId: string, limit = 10) {
    return await this.prisma.aiInsight.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
  }

  /**
   * Marcar insight como lido
   */
  async markInsightAsRead(insightId: string, userId: string): Promise<boolean> {
    try {
      await this.prisma.aiInsight.update({
        where: { 
          id: insightId,
          userId // Garantir que o insight pertence ao usuário
        },
        data: { isRead: true }
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Processar extrato bancário usando IA
   */
  async processStatementWithAI(filePath: string, userId: string): Promise<{
    transactions: Array<{
      description: string;
      amount: number;
      date: Date;
      suggestedCategory: string;
      confidence: number;
    }>;
    summary: {
      totalTransactions: number;
      totalAmount: number;
      categorized: number;
      highConfidence: number;
    };
  }> {
    try {
      // Verificar se o arquivo existe
      await fs.access(filePath);

      // Chamar script Python para processar extrato
      const scriptPath = path.join(this.AI_SCRIPT_PATH, 'process_statement.py');
      const result = await this.callPythonScript(scriptPath, { filePath, userId });

      return result as {
        transactions: Array<{
          description: string;
          amount: number;
          date: Date;
          suggestedCategory: string;
          confidence: number;
        }>;
        summary: {
          totalTransactions: number;
          totalAmount: number;
          categorized: number;
          highConfidence: number;
        };
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Erro ao processar extrato:', error);
      throw new Error('Falha no processamento do extrato com IA');
    }
  }

  /**
   * Chamar script Python genérico
   */
  private async callPythonScript(scriptPath: string, data: unknown): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const pythonProcess = spawn('python', [scriptPath, JSON.stringify(data)]);

      let result = '';
      let errorOutput = '';

      pythonProcess.stdout.on('data', (data) => {
        result += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Python script failed: ${errorOutput}`));
          return;
        }

        try {
          const parsedResult = JSON.parse(result);
          resolve(parsedResult);
        } catch {
          reject(new Error(`Invalid JSON response: ${result}`));
        }
      });
    });
  }

  /**
   * Limpeza de recursos
   */
  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}