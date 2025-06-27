/**
 * Sistema de Parser Moderno para Extratos Bancários
 * Corrige todos os problemas de tipos e adiciona suporte robusto a PDF/CSV/TXT
 */

import fs from 'fs';
import path from 'path';
import pdf from 'pdf-parse';
import * as XLSX from 'xlsx';

// Tipos seguros
export interface SafeTransaction {
  date: string;
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  category?: string;
  balance?: number;
  originalLine?: string;
}

export interface SafeParseResult {
  success: boolean;
  transactions: SafeTransaction[];
  errors: string[];
  bankDetected?: string;
  totalTransactions: number;
  summary: {
    income: number;
    expenses: number;
    balance: number;
  };
}

// Utilitários seguros
class SafeUtils {
  static safeString(value: unknown): string {
    if (typeof value === 'string') return value.trim();
    if (value == null) return '';
    return String(value).trim();
  }

  static safeNumber(value: unknown): number {
    if (typeof value === 'number' && !isNaN(value)) return value;
    if (typeof value === 'string') {
      const cleaned = value.replace(/[R$\s,]/g, '').replace(',', '.');
      const num = parseFloat(cleaned);
      return isNaN(num) ? 0 : num;
    }
    return 0;
  }

  static safeDate(dateStr: unknown): string {
    try {
      if (!dateStr || typeof dateStr !== 'string') {
        return new Date().toISOString().split('T')[0];
      }

      // Formatos suportados: DD/MM/YYYY, DD-MM-YYYY, YYYY-MM-DD
      const cleaned = dateStr.trim();
      
      if (cleaned.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
        const parts = cleaned.split('/');
        const day = parts[0];
        const month = parts[1];
        const year = parts[2];
        if (day && month && year) {
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
      }
      
      if (cleaned.match(/^\d{2}-\d{2}-\d{4}$/)) {
        const parts = cleaned.split('-');
        const day = parts[0];
        const month = parts[1];
        const year = parts[2];
        if (day && month && year) {
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
      }
      
      if (cleaned.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return cleaned; // Já no formato correto
      }

      // Fallback: tentar parse direto
      const date = new Date(cleaned);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }

      return new Date().toISOString().split('T')[0];
    } catch {
      return new Date().toISOString().split('T')[0];
    }
  }

  static detectBank(content: string, filename: string): string {
    const contentLower = content.toLowerCase();
    const filenameLower = filename.toLowerCase();

    if (contentLower.includes('bradesco') || filenameLower.includes('bradesco')) return 'BRADESCO';
    if (contentLower.includes('banco do brasil') || filenameLower.includes('bb')) return 'BANCO_DO_BRASIL';
    if (contentLower.includes('nubank') || filenameLower.includes('nubank')) return 'NUBANK';
    if (contentLower.includes('itaú') || contentLower.includes('itau')) return 'ITAU';
    if (contentLower.includes('santander')) return 'SANTANDER';
    if (contentLower.includes('caixa')) return 'CAIXA';
    if (contentLower.includes('inter')) return 'INTER';
    if (contentLower.includes('c6 bank') || contentLower.includes('c6')) return 'C6_BANK';

    return 'GENERICO';
  }
}

// Parser moderno e seguro
export class ModernBankParser {
  async parseFile(filePath: string, originalName?: string): Promise<SafeParseResult> {
    try {
      const filename = originalName || path.basename(filePath);
      let ext = path.extname(filePath).toLowerCase();
      
      // Se não tiver extensão no arquivo temporário, usar do nome original
      if (!ext && originalName) {
        ext = path.extname(originalName).toLowerCase();
      }
      
      // Se ainda não tiver extensão, assumir CSV como padrão
      if (!ext) {
        ext = '.csv';
      }
      
      let content: string;
      
      // Leitura segura por tipo de arquivo
      switch (ext) {
        case '.pdf':
          content = await this.parsePDF(filePath);
          break;
        case '.csv':
        case '.txt':
          content = fs.readFileSync(filePath, 'utf-8');
          break;
        case '.xlsx':
        case '.xls':
          content = this.parseExcel(filePath);
          break;
        default:
          // Tentar ler como arquivo texto genérico
          content = fs.readFileSync(filePath, 'utf-8');
          break;
      }

      return this.parseContent(content, filename);
    } catch (error) {
      return {
        success: false,
        transactions: [],
        errors: [error instanceof Error ? error.message : 'Erro desconhecido'],
        totalTransactions: 0,
        summary: { income: 0, expenses: 0, balance: 0 }
      };
    }
  }

  private async parsePDF(filePath: string): Promise<string> {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdf(dataBuffer);
    return pdfData.text;
  }

  private parseExcel(filePath: string): string {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) throw new Error('Excel não contém planilhas');

    const worksheet = workbook.Sheets[sheetName];
    if (!worksheet) throw new Error('Planilha não encontrada');

    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    return jsonData.map((row: any) => Array.isArray(row) ? row.join(',') : '').join('\n');
  }

  private parseContent(content: string, filename: string): SafeParseResult {
    const bankType = SafeUtils.detectBank(content, filename);
    const transactions: SafeTransaction[] = [];
    const errors: string[] = [];

    try {
      // Parsers específicos por banco
      switch (bankType) {
        case 'BRADESCO':
          transactions.push(...this.parseBradesco(content));
          break;
        case 'BANCO_DO_BRASIL':
          transactions.push(...this.parseBancoDoBrasil(content));
          break;
        case 'NUBANK':
          transactions.push(...this.parseNubank(content));
          break;
        case 'ITAU':
          transactions.push(...this.parseItau(content));
          break;
        default:
          transactions.push(...this.parseGeneric(content));
      }

      // Calcular resumo
      const summary = transactions.reduce(
        (acc, t) => {
          if (t.type === 'INCOME') acc.income += t.amount;
          else acc.expenses += t.amount;
          acc.balance = acc.income - acc.expenses;
          return acc;
        },
        { income: 0, expenses: 0, balance: 0 }
      );

      return {
        success: true,
        transactions,
        errors,
        bankDetected: bankType,
        totalTransactions: transactions.length,
        summary
      };
    } catch (error) {
      errors.push(error instanceof Error ? error.message : 'Erro no parsing');
      return {
        success: false,
        transactions: [],
        errors,
        bankDetected: bankType,
        totalTransactions: 0,
        summary: { income: 0, expenses: 0, balance: 0 }
      };
    }
  }

  private parseBradesco(content: string): SafeTransaction[] {
    const transactions: SafeTransaction[] = [];
    const lines = content.split('\n');

    for (const line of lines) {
      if (!line.trim()) continue;

      // Padrão Bradesco CSV: Data;Histórico;Débito;Crédito;Saldo
      if (line.includes(';')) {
        try {
          const parts = line.split(';');
          if (parts.length >= 4) {
            const dateStr = SafeUtils.safeString(parts[0]);
            const description = SafeUtils.safeString(parts[1]);
            const debit = SafeUtils.safeNumber(parts[2]);
            const credit = SafeUtils.safeNumber(parts[3]);

            if (dateStr && description && (debit > 0 || credit > 0)) {
              const amount = debit > 0 ? debit : credit;
              const type = debit > 0 ? 'EXPENSE' : 'INCOME';

              transactions.push({
                date: SafeUtils.safeDate(dateStr),
                description,
                amount,
                type,
                originalLine: line
              });
            }
          }
        } catch (error) {
          console.log(`Erro ao processar linha Bradesco: ${line}`);
        }
      }

      // Padrão Bradesco PDF
      const pdfMatch = line.match(/(\d{2}\/\d{2}\/\d{4})\s+(.+?)\s+([-+]?\d+[,.]?\d*)/);
      if (pdfMatch) {
        try {
          const [, dateStr, description, amountStr] = pdfMatch;
          const amount = SafeUtils.safeNumber(amountStr);
          
          if (amount > 0) {
            transactions.push({
              date: SafeUtils.safeDate(dateStr),
              description: SafeUtils.safeString(description),
              amount,
              type: amountStr.includes('-') ? 'EXPENSE' : 'INCOME',
              originalLine: line
            });
          }
        } catch (error) {
          console.log(`Erro ao processar linha PDF Bradesco: ${line}`);
        }
      }
    }

    return transactions;
  }

  private parseBancoDoBrasil(content: string): SafeTransaction[] {
    const transactions: SafeTransaction[] = [];
    const lines = content.split('\n');

    for (const line of lines) {
      if (!line.trim()) continue;

      // Padrão BB: Data,Descrição,Valor,Tipo
      if (line.includes(',')) {
        try {
          const parts = line.split(',');
          if (parts.length >= 3) {
            const dateStr = SafeUtils.safeString(parts[0]);
            const description = SafeUtils.safeString(parts[1]);
            const amountStr = SafeUtils.safeString(parts[2]);
            const amount = SafeUtils.safeNumber(amountStr);

            if (dateStr && description && amount > 0) {
              transactions.push({
                date: SafeUtils.safeDate(dateStr),
                description,
                amount,
                type: amountStr.includes('-') ? 'EXPENSE' : 'INCOME',
                originalLine: line
              });
            }
          }
        } catch (error) {
          console.log(`Erro ao processar linha BB: ${line}`);
        }
      }
    }

    return transactions;
  }

  private parseNubank(content: string): SafeTransaction[] {
    const transactions: SafeTransaction[] = [];
    const lines = content.split('\n');

    for (const line of lines) {
      if (!line.trim() || line.includes('date,category')) continue;

      // Padrão Nubank: date,category,title,amount
      if (line.includes(',')) {
        try {
          const parts = line.split(',');
          if (parts.length >= 4) {
            const dateStr = SafeUtils.safeString(parts[0]);
            const category = SafeUtils.safeString(parts[1]);
            const description = SafeUtils.safeString(parts[2]);
            const amount = SafeUtils.safeNumber(parts[3]);

            if (dateStr && description && amount > 0) {
              transactions.push({
                date: SafeUtils.safeDate(dateStr),
                description,
                amount,
                type: amount < 0 ? 'EXPENSE' : 'INCOME',
                category,
                originalLine: line
              });
            }
          }
        } catch (error) {
          console.log(`Erro ao processar linha Nubank: ${line}`);
        }
      }
    }

    return transactions;
  }

  private parseItau(content: string): SafeTransaction[] {
    const transactions: SafeTransaction[] = [];
    const lines = content.split('\n');

    for (const line of lines) {
      if (!line.trim()) continue;

      // Padrão Itaú genérico
      const match = line.match(/(\d{2}\/\d{2}\/\d{4})\s+(.+?)\s+([-+]?\d+[,.]?\d*)/);
      if (match) {
        try {
          const [, dateStr, description, amountStr] = match;
          const amount = SafeUtils.safeNumber(amountStr);

          if (amount > 0) {
            transactions.push({
              date: SafeUtils.safeDate(dateStr),
              description: SafeUtils.safeString(description),
              amount,
              type: amountStr.includes('-') ? 'EXPENSE' : 'INCOME',
              originalLine: line
            });
          }
        } catch (error) {
          console.log(`Erro ao processar linha Itaú: ${line}`);
        }
      }
    }

    return transactions;
  }

  private parseGeneric(content: string): SafeTransaction[] {
    const transactions: SafeTransaction[] = [];
    const lines = content.split('\n');

    for (const line of lines) {
      if (!line.trim()) continue;
      
      // Tentar vários padrões genéricos
      const patterns = [
        /(\d{2}\/\d{2}\/\d{4})[,;\s]+(.+?)[,;\s]+([-+]?\d+[,.]?\d*)/,
        /(\d{2}-\d{2}-\d{4})[,;\s]+(.+?)[,;\s]+([-+]?\d+[,.]?\d*)/,
        /(\d{4}-\d{2}-\d{2})[,;\s]+(.+?)[,;\s]+([-+]?\d+[,.]?\d*)/
      ];

      for (const pattern of patterns) {
        const match = line.match(pattern);
        if (match) {
          try {
            const [, dateStr, description, amountStr] = match;
            const amount = SafeUtils.safeNumber(amountStr);

            if (amount > 0) {
              transactions.push({
                date: SafeUtils.safeDate(dateStr),
                description: SafeUtils.safeString(description),
                amount,
                type: amountStr.includes('-') ? 'EXPENSE' : 'INCOME',
                originalLine: line
              });
              break; // Parar no primeiro match
            }
          } catch (error) {
            console.log(`Erro ao processar linha genérica: ${line}`);
          }
        }
      }
    }

    return transactions;
  }
}

// Export singleton
export const modernBankParser = new ModernBankParser();
export default modernBankParser;
