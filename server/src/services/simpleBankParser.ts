import * as fs from 'fs';
import * as path from 'path';

// Tipos para as transações processadas
export interface ParsedTransaction {
  date: string;
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  category?: string | undefined;
  balance?: number;
  originalLine?: string;
}

export interface ParseResult {
  success: boolean;
  transactions: ParsedTransaction[];
  errors: string[];
  bankDetected?: string;
  totalTransactions: number;
  summary: {
    income: number;
    expenses: number;
    balance: number;
  };
}

class BankStatementParser {
  async parseFile(filePath: string, filename: string): Promise<ParseResult> {
    try {
      const fileExtension = path.extname(filename).toLowerCase();
      let content = '';

      // Ler arquivo baseado na extensão
      if (fileExtension === '.csv' || fileExtension === '.txt') {
        content = fs.readFileSync(filePath, 'utf-8');
      } else if (fileExtension === '.pdf') {
        content = await this.parsePDF(filePath);
      } else {
        throw new Error(`Formato de arquivo não suportado: ${fileExtension}. Suportados: CSV, TXT, PDF`);
      }

      // Detectar banco
      const bankDetected = this.detectBank(content, filename);
      
      // Fazer parse das transações
      const transactions = this.parseTransactions(content, bankDetected);
      const summary = this.calculateSummary(transactions);

      return {
        success: true,
        transactions,
        errors: [],
        bankDetected,
        totalTransactions: transactions.length,
        summary
      };

    } catch (error: any) {
      return {
        success: false,
        transactions: [],
        errors: [error?.message || 'Erro desconhecido'],
        totalTransactions: 0,
        summary: { income: 0, expenses: 0, balance: 0 }
      };
    }
  }

  /**
   * Parse específico para arquivos PDF
   */
  private async parsePDF(filePath: string): Promise<string> {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const pdf = await import('pdf-parse');
      const pdfData = await pdf.default(dataBuffer);
      
      console.log('🔍 PDF parseado, texto extraído:', pdfData.text.substring(0, 500));
      
      // Processar texto do PDF para formato estruturado
      return this.processPDFText(pdfData.text);
      
    } catch (error) {
      console.error('❌ Erro ao parsear PDF:', error);
      throw new Error('Falha ao processar arquivo PDF: ' + error);
    }
  }

  /**
   * Processa texto extraído do PDF e converte para formato CSV-like
   */
  private processPDFText(pdfText: string): string {
    // Normalizar quebras de linha e remover espaços extras
    const normalizedText = pdfText
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\s+/g, ' ')
      .trim();

    console.log('📄 Texto normalizado (início):', normalizedText.substring(0, 300));

    // Detectar padrões específicos dos bancos
    if (this.isBradescoPattern(normalizedText)) {
      return this.processBradescoPDF(normalizedText);
    } else if (this.isBancoBrasilPattern(normalizedText)) {
      return this.processBancoBrasilPDF(normalizedText);
    } else {
      // Parser genérico para outros bancos
      return this.processGenericPDF(normalizedText);
    }
  }

  /**
   * Detecta se é extrato do Bradesco
   */
  private isBradescoPattern(text: string): boolean {
    return text.toLowerCase().includes('bradesco') && 
           (text.includes('Débito') || text.includes('Crédito'));
  }

  /**
   * Detecta se é extrato do Banco do Brasil
   */
  private isBancoBrasilPattern(text: string): boolean {
    return text.toLowerCase().includes('banco do brasil') || 
           text.toLowerCase().includes('extrato de conta corrente');
  }

  /**
   * Processa PDF do Bradesco
   */
  private processBradescoPDF(text: string): string {
    const lines = text.split('\n');
    const csvLines = ['Data;Histórico;Débito;Crédito;Saldo'];
    
    console.log('🔍 Processando PDF Bradesco...');
    
    // Padrão Bradesco: buscar linhas com datas e valores
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Ignorar cabeçalhos e linhas vazias
      if (!trimmedLine || 
          trimmedLine.includes('Data') || 
          trimmedLine.includes('Histórico') ||
          trimmedLine.includes('Bradesco') ||
          trimmedLine.includes('Nome:') ||
          trimmedLine.includes('Extrato')) {
        continue;
      }
      
      // Buscar padrão: DD/MM/YYYY seguido de descrição e valores
      const dateMatch = trimmedLine.match(/(\d{2}\/\d{2}\/\d{4})/);
      if (dateMatch && dateMatch[1]) {
        const dateStr = dateMatch[1];
        
        // Extrair todos os valores numéricos (incluindo vírgulas decimais)
        const allNumbers = trimmedLine.match(/\d{1,3}(?:[.,]\d{2,3})*(?:[.,]\d{2})?/g) || [];
        
        // Filtrar apenas valores monetários (excluir a data)
        const monetaryValues = allNumbers.filter(num => {
          const cleanNum = parseFloat(num.replace(/[.,]/g, '.'));
          return cleanNum > 0 && !num.includes('/');
        });
        
        console.log(`📊 Linha: "${trimmedLine}"`);
        console.log(`💰 Valores encontrados: ${JSON.stringify(monetaryValues)}`);
        
        if (monetaryValues.length > 0) {
          // Extrair descrição (texto entre data e primeiro número)
          const afterDate = trimmedLine.substring(trimmedLine.indexOf(dateStr) + dateStr.length).trim();
          const firstNumberPos = afterDate.search(/\d/);
          const description = firstNumberPos > 0 ? 
            afterDate.substring(0, firstNumberPos).trim() : 
            (afterDate.split(/\d/)[0]?.trim() || 'Transação');
          
          // Para Bradesco: normalmente temos débito, saldo (às vezes crédito)
          let debit = '';
          let credit = '';
          let saldo = '';
          
          if (monetaryValues.length === 1) {
            // Apenas um valor - pode ser débito ou saldo
            if (description.toLowerCase().includes('pix') || 
                description.toLowerCase().includes('transferencia')) {
              debit = monetaryValues[0] || '';
            } else {
              saldo = monetaryValues[0] || '';
            }
          } else if (monetaryValues.length === 2) {
            // Dois valores - débito/crédito e saldo
            debit = monetaryValues[0] || '';
            saldo = monetaryValues[1] || '';
          } else if (monetaryValues.length >= 3) {
            // Três ou mais valores - débito, crédito, saldo
            debit = monetaryValues[0] || '';
            credit = monetaryValues[1] || '';
            saldo = monetaryValues[2] || '';
          }
          
          console.log(`✅ Transação: ${dateStr} | ${description} | D:${debit} | C:${credit} | S:${saldo}`);
          csvLines.push(`${dateStr};${description};${debit};${credit};${saldo}`);
        }
      }
    }
    
    console.log(`📝 CSV gerado com ${csvLines.length - 1} transações`);
    return csvLines.join('\n');
  }

  /**
   * Processa PDF do Banco do Brasil
   */
  private processBancoBrasilPDF(text: string): string {
    const lines = text.split('\n');
    const csvLines = ['Dia;Histórico;Valor'];
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Buscar padrão: DD/MM/YYYY seguido de descrição e valor
      const dateMatch = trimmedLine.match(/(\d{2}\/\d{2}\/\d{4})/);
      if (dateMatch) {
        const dateStr = dateMatch[1];
        
        // Extrair valores monetários
        const values = trimmedLine.match(/[\d.,]+/g) || [];
        
        if (values.length > 0) {
          // Extrair descrição
          const afterDate = trimmedLine.substring(trimmedLine.indexOf(dateStr) + dateStr.length).trim();
          const firstNumberIndex = afterDate.search(/[\d.,]/);
          const description = firstNumberIndex > 0 ? 
            afterDate.substring(0, firstNumberIndex).trim() : 
            'Transação';
          
          const value = values[values.length - 1]; // Último valor é geralmente o valor da transação
          
          csvLines.push(`${dateStr};${description};${value}`);
        }
      }
    }
    
    return csvLines.join('\n');
  }

  /**
   * Processa PDF genérico
   */
  private processGenericPDF(text: string): string {
    const lines = text.split('\n');
    const csvLines = ['Data;Descrição;Valor'];
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Buscar qualquer padrão de data
      const dateMatch = trimmedLine.match(/(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/);
      if (dateMatch) {
        const dateStr = dateMatch[1];
        
        // Extrair valores monetários
        const valueMatch = trimmedLine.match(/([\d.,]+)/);
        if (valueMatch) {
          const value = valueMatch[1];
          
          // Extrair descrição (texto entre data e valor)
          let description = trimmedLine
            .replace(dateStr, '')
            .replace(value, '')
            .trim();
          
          if (description.length > 0) {
            csvLines.push(`${dateStr};${description};${value}`);
          }
        }
      }
    }
    
    return csvLines.join('\n');
  }

  private detectBank(content: string, filename: string): string {
    const lower = content.toLowerCase();
    const lowerFilename = filename.toLowerCase();

    // Detecção específica baseada nos PDFs mostrados
    if (lower.includes('bradesco celular') || lower.includes('bradesco') || lowerFilename.includes('bradesco')) {
      return 'Bradesco';
    }
    if (lower.includes('extrato de conta corrente') && (lower.includes('banco do brasil') || lower.includes('william k sousa pereira'))) {
      return 'Banco do Brasil';
    }
    if (lower.includes('nubank') || lower.includes('nu pagamentos') || lowerFilename.includes('nubank')) {
      return 'Nubank';
    }
    if (lower.includes('banco do brasil') || lower.includes('001 - bb') || lowerFilename.includes('bb')) {
      return 'Banco do Brasil';
    }
    if (lower.includes('itaú') || lower.includes('itau') || lowerFilename.includes('itau')) {
      return 'Itaú';
    }
    if (lower.includes('santander') || lowerFilename.includes('santander')) {
      return 'Santander';
    }
    if (lower.includes('caixa') || lowerFilename.includes('caixa')) {
      return 'Caixa Econômica Federal';
    }
    if (lower.includes('inter') || lowerFilename.includes('inter')) {
      return 'Banco Inter';
    }
    if (lower.includes('c6 bank') || lower.includes('c6') || lowerFilename.includes('c6')) {
      return 'C6 Bank';
    }
    if (lower.includes('mercado pago') || lowerFilename.includes('mercadopago')) {
      return 'Mercado Pago';
    }
    if (lower.includes('picpay') || lowerFilename.includes('picpay')) {
      return 'PicPay';
    }

    return 'Banco Genérico';
  }

  private parseTransactions(content: string, bankName: string): ParsedTransaction[] {
    const transactions: ParsedTransaction[] = [];
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      try {
        const transaction = this.parseLine(line, bankName);
        if (transaction) {
          transactions.push(transaction);
        }
      } catch (error) {
        // Ignora linhas que não conseguem ser parseadas
        console.warn(`Erro ao processar linha ${i + 1}: ${error}`);
      }
    }

    return transactions;
  }

  private parseLine(line: string, bankName: string): ParsedTransaction | null {
    // Remove aspas e espaços extras
    const cleanLine = line.replace(/"/g, '').trim();
    
    // Se for CSV (contém vírgulas ou ponto e vírgula)
    if (cleanLine.includes(',') || cleanLine.includes(';')) {
      return this.parseCSVLine(cleanLine, bankName);
    }

    // Se for texto formatado (bancos tradicionais)
    return this.parseTextLine(cleanLine, bankName);
  }

  private parseCSVLine(line: string, bankName: string): ParsedTransaction | null {
    const separator = line.includes(';') ? ';' : ',';
    const parts = line.split(separator).map(p => p.trim());

    if (parts.length < 3) return null;

    // Padrões mais comuns: Data, Descrição, Valor
    // ou Data, Categoria, Descrição, Valor (Nubank)
    let dateStr = '';
    let description = '';
    let amountStr = '';
    let category: string | undefined = undefined;

    if (bankName === 'Nubank' && parts.length >= 4) {
      dateStr = parts[0] || '';
      category = parts[1] || '';
      description = parts[2] || '';
      amountStr = parts[3] || '';
    } else {
      // Formato padrão: Data, Descrição, Valor
      dateStr = parts[0] || '';
      description = parts[1] || '';
      amountStr = parts[2] || '';
    }

    // Validar e converter data
    const date = this.parseDate(dateStr || '');
    if (!date) return null;

    // Converter valor
    const amount = this.parseAmount(amountStr || '');
    if (isNaN(amount)) return null;

    return {
      date,
      description: (description || '').trim() || 'Transação sem descrição',
      amount: Math.abs(amount),
      type: amount >= 0 ? 'INCOME' : 'EXPENSE',
      category,
      originalLine: line
    };
  }

  private parseTextLine(line: string, bankName: string): ParsedTransaction | null {
    // Padrão para bancos tradicionais: DD/MM/YYYY DESCRIÇÃO VALOR
    const match = line.match(/(\d{2}\/\d{2}\/\d{4})\s+(.+?)\s+([-+]?\d+[,.]\d*|\d+)/);
    
    if (!match) return null;

    const [, dateStr, description, amountStr] = match;
    
    const date = this.parseDate(dateStr);
    if (!date) return null;

    const amount = this.parseAmount(amountStr);
    if (isNaN(amount)) return null;

    return {
      date,
      description: description.trim(),
      amount: Math.abs(amount),
      type: amount >= 0 ? 'INCOME' : 'EXPENSE',
      originalLine: line
    };
  }

  private parseDate(dateStr: string): string | null {
    if (!dateStr) return null;

    // Formato DD/MM/YYYY
    const ddmmyyyy = dateStr.match(/(\d{2})\/(\d{2})\/(\d{4})/);
    if (ddmmyyyy) {
      const [, day, month, year] = ddmmyyyy;
      return `${year}-${month}-${day}`;
    }

    // Formato YYYY-MM-DD
    const yyyymmdd = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (yyyymmdd) {
      return dateStr;
    }

    // Formato DD-MM-YYYY
    const ddmmyyyy2 = dateStr.match(/(\d{2})-(\d{2})-(\d{4})/);
    if (ddmmyyyy2) {
      const [, day, month, year] = ddmmyyyy2;
      return `${year}-${month}-${day}`;
    }

    return null;
  }

  private parseAmount(amountStr: string): number {
    if (!amountStr) return NaN;

    // Remove símbolos de moeda e espaços
    let cleanAmount = amountStr
      .replace(/R\$/, '')
      .replace(/\s/g, '')
      .trim();

    // Trata valores negativos em parênteses: (100,50) -> -100.50
    if (cleanAmount.startsWith('(') && cleanAmount.endsWith(')')) {
      cleanAmount = '-' + cleanAmount.slice(1, -1);
    }

    // Converte vírgula para ponto decimal
    cleanAmount = cleanAmount.replace(',', '.');

    return parseFloat(cleanAmount);
  }

  private calculateSummary(transactions: ParsedTransaction[]) {
    let income = 0;
    let expenses = 0;

    for (const transaction of transactions) {
      if (transaction.type === 'INCOME') {
        income += transaction.amount;
      } else {
        expenses += transaction.amount;
      }
    }

    return {
      income,
      expenses,
      balance: income - expenses
    };
  }
}

export { BankStatementParser };
