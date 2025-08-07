import * as fs from 'fs';
import { logger } from '../utils/logger';

export interface ParsedTransaction {
  date: string;
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  category?: string;
  account?: string;
}

export interface ParsingResult {
  success: boolean;
  bankDetected: string;
  totalTransactions: number;
  transactions: ParsedTransaction[];
  summary: {
    income: number;
    expenses: number;
    balance: number;
  };
  errors: string[];
}

export type BankType =
  | 'BRADESCO'
  | 'NUBANK'
  | 'BANCO_DO_BRASIL'
  | 'ITAU'
  | 'SANTANDER'
  | 'CAIXA'
  | 'INTER'
  | 'C6_BANK'
  | 'NEXT'
  | 'BTG_PACTUAL'
  | 'GENERIC';

export class ModernBankParser {
  private static readonly SUPPORTED_EXTENSIONS = ['.csv', '.txt', '.pdf', '.xlsx', '.ofx'];

  /**
   * Detecta automaticamente o tipo de banco baseado no conteúdo e nome do arquivo
   */
  static detectBank(content: string, filename: string): BankType {
    const contentUpper = content.toUpperCase();
    const filenameUpper = filename.toUpperCase();

    // Mapeamento de bancos para detecção
    const bankPatterns = [
      { patterns: ['BRADESCO', 'BANCO BRADESCO'], bank: 'BRADESCO' as BankType },
      { patterns: ['NUBANK', 'NU PAGAMENTOS'], bank: 'NUBANK' as BankType },
      { patterns: ['BANCO DO BRASIL', 'BB '], bank: 'BANCO_DO_BRASIL' as BankType },
      { patterns: ['ITAU', 'ITAÚ'], bank: 'ITAU' as BankType },
      { patterns: ['SANTANDER'], bank: 'SANTANDER' as BankType },
      { patterns: ['CAIXA ECONÔMICA', 'CAIXA ECONOMICA'], bank: 'CAIXA' as BankType },
      { patterns: ['INTER', 'BANCO INTER'], bank: 'INTER' as BankType },
      { patterns: ['C6 BANK', 'C6BANK'], bank: 'C6_BANK' as BankType },
      { patterns: ['NEXT'], bank: 'NEXT' as BankType },
      { patterns: ['BTG PACTUAL', 'BTG'], bank: 'BTG_PACTUAL' as BankType },
    ];

    // Verificar no conteúdo do arquivo
    for (const { patterns, bank } of bankPatterns) {
      if (patterns.some((pattern) => contentUpper.includes(pattern))) {
        return bank;
      }
    }

    // Verificar no nome do arquivo
    for (const { patterns, bank } of bankPatterns) {
      if (patterns.some((pattern) => filenameUpper.includes(pattern))) {
        return bank;
      }
    }

    return 'GENERIC';
  }

  /**
   * Parse de arquivo CSV/TXT para qualquer banco
   */
  static parseCSV(content: string, bankType: BankType): ParsedTransaction[] {
    const lines = content
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    const transactions: ParsedTransaction[] = [];

    logger.info(`🏦 Parsing ${bankType} CSV com ${lines.length} linhas`);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Pular cabeçalhos
      if (this.isHeaderLine(line)) {
        logger.debug(`⏭️ Pulando cabeçalho: ${line.substring(0, 50)}...`);
        continue;
      }

      try {
        const transaction = this.parseLineByBank(line, bankType);
        if (transaction) {
          transactions.push(transaction);
          logger.debug(
            `✅ Transação parsed: ${transaction.date} - ${transaction.description} - R$ ${transaction.amount}`
          );
        }
      } catch (error) {
        logger.warn(`⚠️ Erro ao processar linha ${i + 1}: ${error}`);
      }
    }

    logger.info(`📊 Total de ${transactions.length} transações processadas`);
    return transactions;
  }

  /**
   * Verifica se a linha é um cabeçalho
   */
  private static isHeaderLine(line: string): boolean {
    const headerKeywords = [
      'data',
      'date',
      'histórico',
      'historico',
      'description',
      'descrição',
      'descricao',
      'valor',
      'value',
      'amount',
      'débito',
      'debito',
      'crédito',
      'credito',
      'saldo',
      'balance',
      'tipo',
      'type',
      'category',
      'categoria',
    ];

    const lineLower = line.toLowerCase();
    return headerKeywords.some((keyword) => lineLower.includes(keyword));
  }

  /**
   * Parse de linha específica por banco
   */
  private static parseLineByBank(line: string, bankType: BankType): ParsedTransaction | null {
    switch (bankType) {
      case 'BRADESCO':
        return this.parseBradescoLine(line);
      case 'NUBANK':
        return this.parseNubankLine(line);
      case 'BANCO_DO_BRASIL':
        return this.parseBBLine(line);
      case 'ITAU':
        return this.parseItauLine(line);
      default:
        return this.parseGenericLine(line);
    }
  }

  /**
   * Parse específico do Bradesco (CSV padrão)
   */
  private static parseBradescoLine(line: string): ParsedTransaction | null {
    // Formato esperado: Data;Histórico;Débito;Crédito;Saldo
    // ou: Data;Histórico;Valor;Saldo
    const parts = line.split(';').map((p) => p.trim());

    if (parts.length < 3) return null;

    const dateStr = parts[0];
    const description = parts[1];

    // Extrair valor monetário da linha
    const monetaryRegex = /(?:R\$\s*)?([+-]?)(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)/g;
    const matches = Array.from(line.matchAll(monetaryRegex));

    if (matches.length === 0) return null;

    // Primeiro valor encontrado é geralmente a transação
    const valueMatch = matches[0];
    const amountStr = valueMatch[2];
    const amount = this.parseAmount(amountStr);
    const isNegative =
      valueMatch[1] === '-' || line.includes('DÉBITO') || line.includes('PAGAMENTO');

    return {
      date: this.standardizeDate(dateStr),
      description: this.cleanDescription(description),
      amount: Math.abs(amount),
      type: isNegative ? 'EXPENSE' : 'INCOME',
      account: 'Bradesco',
    };
  }

  /**
   * Parse específico do Nubank
   */
  private static parseNubankLine(line: string): ParsedTransaction | null {
    // Formato esperado: date,category,title,amount
    const parts = line.split(',').map((p) => p.trim().replace(/"/g, ''));

    if (parts.length < 4) return null;

    const dateStr = parts[0];
    const category = parts[1];
    const description = parts[2];
    const amountStr = parts[3];

    const amount = this.parseAmount(amountStr);

    return {
      date: this.standardizeDate(dateStr),
      description: this.cleanDescription(description),
      amount: Math.abs(amount),
      type: amount < 0 ? 'EXPENSE' : 'INCOME',
      category,
      account: 'Nubank',
    };
  }

  /**
   * Parse específico do Banco do Brasil
   */
  private static parseBBLine(line: string): ParsedTransaction | null {
    // Similar ao Bradesco, mas com algumas variações
    return this.parseBradescoLine(line.replace(/\t/g, ';'));
  }

  /**
   * Parse específico do Itaú
   */
  private static parseItauLine(line: string): ParsedTransaction | null {
    // Formato similar aos outros bancos
    return this.parseGenericLine(line);
  }

  /**
   * Parse genérico para bancos não específicos
   */
  private static parseGenericLine(line: string): ParsedTransaction | null {
    const separators = [';', ',', '\t'];
    let parts: string[] = [];

    for (const sep of separators) {
      const testParts = line.split(sep).map((p) => p.trim());
      if (testParts.length >= 3) {
        parts = testParts;
        break;
      }
    }

    if (parts.length < 3) return null;

    const { dateIndex, descriptionIndex, amountIndex } = this.findFieldIndices(parts);

    if (dateIndex === -1 || amountIndex === -1) return null;

    const description = descriptionIndex !== -1 ? parts[descriptionIndex] : 'Transação';
    const amount = this.parseAmount(parts[amountIndex]);

    return {
      date: this.standardizeDate(parts[dateIndex]),
      description: this.cleanDescription(description),
      amount: Math.abs(amount),
      type: amount < 0 ? 'EXPENSE' : 'INCOME',
    };
  }

  /**
   * Encontra os índices dos campos na linha
   */
  private static findFieldIndices(parts: string[]): {
    dateIndex: number;
    descriptionIndex: number;
    amountIndex: number;
  } {
    let dateIndex = -1;
    let descriptionIndex = -1;
    let amountIndex = -1;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];

      if (dateIndex === -1 && this.isDateFormat(part)) {
        dateIndex = i;
        continue;
      }

      if (amountIndex === -1 && this.isMonetaryValue(part)) {
        amountIndex = i;
        continue;
      }

      if (descriptionIndex === -1 && dateIndex !== -1 && part.length > 3) {
        descriptionIndex = i;
      }
    }

    return { dateIndex, descriptionIndex, amountIndex };
  }

  /**
   * Verifica se string é formato de data
   */
  private static isDateFormat(str: string): boolean {
    // Padrões de data: DD/MM/YYYY, DD-MM-YYYY, YYYY-MM-DD, etc.
    const datePatterns = [
      /^\d{1,2}\/\d{1,2}\/\d{4}$/,
      /^\d{1,2}-\d{1,2}-\d{4}$/,
      /^\d{4}-\d{1,2}-\d{1,2}$/,
      /^\d{1,2}\/\d{1,2}\/\d{2}$/,
    ];

    return datePatterns.some((pattern) => pattern.test(str.trim()));
  }

  /**
   * Verifica se string é valor monetário
   */
  private static isMonetaryValue(str: string): boolean {
    // Padrões monetários brasileiros
    const monetaryPattern = /(?:R\$\s*)?[+-]?\d{1,3}(?:\.\d{3})*(?:,\d{2})?/;
    return monetaryPattern.test(str.trim());
  }

  /**
   * Converte valor monetário brasileiro para número
   */
  private static parseAmount(amountStr: string): number {
    if (!amountStr) return 0;

    // Remove R$, espaços e outros caracteres
    let cleanAmount = amountStr.replace(/R\$|\s/g, '');

    // Verifica se é negativo
    const isNegative = cleanAmount.startsWith('-');
    cleanAmount = cleanAmount.replace(/^[+-]/, '');

    // Converte formato brasileiro (1.234,56) para americano (1234.56)
    if (cleanAmount.includes(',')) {
      cleanAmount = cleanAmount.replace(/\./g, '').replace(',', '.');
    }

    const amount = parseFloat(cleanAmount) || 0;
    return isNegative ? -amount : amount;
  }

  /**
   * Padroniza formato de data para ISO
   */
  private static standardizeDate(dateStr: string): string {
    if (!dateStr) return new Date().toISOString().split('T')[0];

    // Remove espaços e caracteres especiais
    const cleanDate = dateStr.trim();

    // Detecta formato e converte para YYYY-MM-DD
    const ddmmyyyyRegex = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
    const ddmmyyyyMatch = ddmmyyyyRegex.exec(cleanDate);
    if (ddmmyyyyMatch) {
      // DD/MM/YYYY -> YYYY-MM-DD
      const [day, month, year] = cleanDate.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    const ddmmyyyyDashRegex = /^\d{1,2}-\d{1,2}-\d{4}$/;
    const ddmmyyyyDashMatch = ddmmyyyyDashRegex.exec(cleanDate);
    if (ddmmyyyyDashMatch) {
      // DD-MM-YYYY -> YYYY-MM-DD
      const [day, month, year] = cleanDate.split('-');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    const yyyymmddRegex = /^\d{4}-\d{1,2}-\d{1,2}$/;
    const yyyymmddMatch = yyyymmddRegex.exec(cleanDate);
    if (yyyymmddMatch) {
      // Já está no formato correto
      return cleanDate;
    }

    // Formato padrão se não conseguir converter
    return new Date().toISOString().split('T')[0];
  }

  /**
   * Limpa e padroniza descrição da transação
   */
  private static cleanDescription(description: string): string {
    if (!description) return 'Transação';

    return description
      .trim()
      .replace(/\s+/g, ' ') // Remove espaços extras
      .replace(/["']/g, '') // Remove aspas
      .substring(0, 100); // Limita tamanho
  }

  /**
   * Método principal para parsing de arquivo
   */
  async parseFile(filePath: string, originalName: string): Promise<ParsingResult> {
    try {
      logger.info(`🔍 Iniciando parse do arquivo: ${originalName}`);

      // Verificar se arquivo existe
      if (!fs.existsSync(filePath)) {
        throw new Error('Arquivo não encontrado');
      }

      // Detectar tipo de arquivo e ler conteúdo apropriado
      const fileExtension = this.getFileExtension(originalName);
      let content: string;

      switch (fileExtension) {
        case '.pdf':
          content = await this.parsePDFContent(filePath);
          break;
        case '.xlsx':
        case '.xls':
          content = await this.parseExcelContent(filePath);
          break;
        case '.ofx':
          content = await this.parseOFXContent(filePath);
          break;
        default:
          content = fs.readFileSync(filePath, 'utf-8');
      }

      // Detectar tipo de banco
      const bankDetected = ModernBankParser.detectBank(content, originalName);
      logger.info(`🏦 Banco detectado: ${bankDetected}`);

      // Parse das transações baseado no tipo de arquivo
      let transactions: ParsedTransaction[];
      if (fileExtension === '.ofx') {
        transactions = this.parseOFX(content);
      } else {
        transactions = ModernBankParser.parseCSV(content, bankDetected);
      }

      // Calcular resumo
      const summary = this.calculateSummary(transactions);

      const result: ParsingResult = {
        success: true,
        bankDetected,
        totalTransactions: transactions.length,
        transactions,
        summary,
        errors: [],
      };

      logger.info(`✅ Parse concluído: ${transactions.length} transações processadas`);
      return result;
    } catch (error) {
      logger.error(`❌ Erro no parse: ${error}`);

      return {
        success: false,
        bankDetected: 'UNKNOWN',
        totalTransactions: 0,
        transactions: [],
        summary: { income: 0, expenses: 0, balance: 0 },
        errors: [error instanceof Error ? error.message : 'Erro desconhecido'],
      };
    }
  }

  /**
   * Obtém extensão do arquivo
   */
  private getFileExtension(filename: string): string {
    return filename.toLowerCase().substring(filename.lastIndexOf('.'));
  }

  /**
   * Parse de conteúdo PDF (usando OCR/IA)
   */
  private async parsePDFContent(filePath: string): Promise<string> {
    try {
      // Aqui seria integração com serviço de OCR/IA
      // Por ora, retornar texto extraído básico
      logger.info(`📄 Processando PDF: ${filePath}`);
      
      // Simulação de extração de texto do PDF
      // Em produção, usar pdf-parse ou serviço de OCR
      const pdfParse = require('pdf-parse');
      const pdfBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(pdfBuffer);
      
      return data.text;
    } catch (error) {
      logger.error(`Erro ao processar PDF: ${error}`);
      throw new Error('Falha ao extrair dados do PDF');
    }
  }

  /**
   * Parse de conteúdo Excel
   */
  private async parseExcelContent(filePath: string): Promise<string> {
    try {
      logger.info(`📊 Processando Excel: ${filePath}`);
      
      const XLSX = require('xlsx');
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Converter para CSV
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      return csv;
    } catch (error) {
      logger.error(`Erro ao processar Excel: ${error}`);
      throw new Error('Falha ao extrair dados do Excel');
    }
  }

  /**
   * Parse de conteúdo OFX
   */
  private async parseOFXContent(filePath: string): Promise<string> {
    try {
      logger.info(`🏦 Processando OFX: ${filePath}`);
      return fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
      logger.error(`Erro ao processar OFX: ${error}`);
      throw new Error('Falha ao extrair dados do OFX');
    }
  }

  /**
   * Parse específico para arquivos OFX
   */
  private parseOFX(content: string): ParsedTransaction[] {
    const transactions: ParsedTransaction[] = [];
    
    try {
      // Regex para extrair transações OFX
      const transactionRegex = /<STMTTRN>([\s\S]*?)<\/STMTTRN>/g;
      let match;
      
      while ((match = transactionRegex.exec(content)) !== null) {
        const transactionBlock = match[1];
        
        // Extrair campos específicos
        const dateMatch = transactionBlock.match(/<DTPOSTED>(\d{8})/);
        const amountMatch = transactionBlock.match(/<TRNAMT>([+-]?\d+\.?\d*)/);
        const memoMatch = transactionBlock.match(/<MEMO>(.*?)<\/?\w*>/);
        const nameMatch = transactionBlock.match(/<NAME>(.*?)<\/?\w*>/);
        
        if (dateMatch && amountMatch) {
          const date = this.parseOFXDate(dateMatch[1]);
          const amount = parseFloat(amountMatch[1]);
          const description = (memoMatch?.[1] || nameMatch?.[1] || 'Transação OFX').trim();
          
          transactions.push({
            date: date,
            description: ModernBankParser.cleanDescription(description),
            amount: Math.abs(amount),
            type: amount < 0 ? 'EXPENSE' : 'INCOME',
            account: 'OFX Import',
          });
        }
      }
      
      logger.info(`🏦 Extraídas ${transactions.length} transações do arquivo OFX`);
      return transactions;
    } catch (error) {
      logger.error(`Erro ao processar OFX: ${error}`);
      return [];
    }
  }

  /**
   * Converte data OFX (YYYYMMDD) para formato ISO
   */
  private parseOFXDate(dateStr: string): string {
    if (dateStr.length >= 8) {
      const year = dateStr.substring(0, 4);
      const month = dateStr.substring(4, 6);
      const day = dateStr.substring(6, 8);
      return `${year}-${month}-${day}`;
    }
    return new Date().toISOString().split('T')[0];
  }

  /**
   * Calcula resumo financeiro das transações
   */
  private calculateSummary(transactions: ParsedTransaction[]): {
    income: number;
    expenses: number;
    balance: number;
  } {
    let income = 0;
    let expenses = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === 'INCOME') {
        income += transaction.amount;
      } else {
        expenses += transaction.amount;
      }
    });

    return {
      income,
      expenses,
      balance: income - expenses,
    };
  }
}
