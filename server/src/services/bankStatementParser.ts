import * as fs from 'fs';
import * as path from 'path';
import pdf from 'pdf-parse';
import * as XLSX from 'xlsx';

// Tipos para as transações processadas
export interface ParsedTransaction {
  date: string;
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  category?: string;
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

// Interface para parsers específicos de bancos
interface BankParser {
  name: string;
  detect(content: string, filename: string): boolean;
  parse(content: string): ParsedTransaction[];
}

// Parser base para bancos tradicionais
abstract class TraditionalBankParser implements BankParser {
  abstract name: string;
  abstract detect(content: string, filename: string): boolean;

  parse(content: string): ParsedTransaction[] {
    const transactions: ParsedTransaction[] = [];
    const lines = content.split('\n');

    for (const line of lines) {
      const match = line.match(/(\d{2}\/\d{2}\/\d{4})\s+(.+?)\s+([-+]?\d+[,.]?\d*)/);
      if (match) {
        const [, dateStr, description, amountStr] = match;
        if (!dateStr || !description || !amountStr) continue;
        
        const amount = parseFloat(amountStr.replace(',', '.'));
        if (isNaN(amount)) continue;
        
        transactions.push({
          date: this.convertDate(dateStr),
          description: description.trim(),
          amount: Math.abs(amount),
          type: amount >= 0 ? 'INCOME' : 'EXPENSE',
          originalLine: line
        });
      }
    }

    return transactions;
  }

  protected convertDate(dateStr: string): string {
    if (!dateStr) return new Date().toISOString().split('T')[0];
    const parts = dateStr.split('/');
    if (parts.length !== 3) return new Date().toISOString().split('T')[0];
    
    const [day, month, year] = parts;
    if (!day || !month || !year) return new Date().toISOString().split('T')[0];
    
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
}

// Parser base para bancos digitais
abstract class DigitalBankParser implements BankParser {
  abstract name: string;
  abstract detect(content: string, filename: string): boolean;

  parse(content: string): ParsedTransaction[] {
    const transactions: ParsedTransaction[] = [];
    const lines = content.split('\n');

    for (const line of lines) {
      if (line.includes(',') || line.includes(';')) {
        const parts = line.split(/[;,]/);
        if (parts.length >= 3) {
          const dateStr = parts[0].trim();
          const description = parts[1].trim();
          const amountStr = parts[2].trim();
          
          if (this.isValidDate(dateStr)) {
            const amount = parseFloat(amountStr.replace('R$', '').replace(',', '.').trim());
            
            if (!isNaN(amount)) {
              transactions.push({
                date: this.normalizeDate(dateStr),
                description: description,
                amount: Math.abs(amount),
                type: amount >= 0 ? 'INCOME' : 'EXPENSE',
                originalLine: line
              });
            }
          }
        }
      }
    }

    return transactions;
  }

  protected isValidDate(dateStr: string): boolean {
    return /\d{2}\/\d{2}\/\d{4}/.test(dateStr) || /\d{4}-\d{2}-\d{2}/.test(dateStr);
  }

  protected normalizeDate(dateStr: string): string {
    if (dateStr.includes('/')) {
      const [day, month, year] = dateStr.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return dateStr;
  }
}

class BankStatementParser {
  private parsers: BankParser[] = [];

  constructor() {
    this.initializeParsers();
  }

  private initializeParsers() {
    this.parsers = [
      new NubankParser(),
      new BancoDoBrasilParser(),
      new BradescoParser(),
      new ItauParser(),
      new SantanderParser(),
      new CaixaParser(),
      new InterParser(),
      new C6BankParser(),
      new OriginalParser(),
      new MercadoPagoParser(),
      new PicPayParser(),
      new GenericCSVParser(),
      new GenericOFXParser()
    ];
  }

  async parseFile(filePath: string, filename: string): Promise<ParseResult> {
    try {
      const fileExtension = path.extname(filename).toLowerCase();
      let content: string = '';

      // Ler arquivo baseado na extensão
      switch (fileExtension) {
        case '.pdf':
          content = await this.parsePDF(filePath);
          break;
        case '.csv':
        case '.txt':
          content = await this.parseText(filePath);
          break;
        case '.xlsx':
        case '.xls':
          content = await this.parseExcel(filePath);
          break;
        case '.ofx':
          content = await this.parseOFX(filePath);
          break;
        default:
          throw new Error(`Formato de arquivo não suportado: ${fileExtension}`);
      }

      // Detectar banco e fazer parse
      const detectedParser = this.detectBank(content, filename);
      if (!detectedParser) {
        throw new Error('Não foi possível identificar o banco do extrato');
      }

      const transactions = detectedParser.parse(content);
      const summary = this.calculateSummary(transactions);

      return {
        success: true,
        transactions,
        errors: [],
        bankDetected: detectedParser.name,
        totalTransactions: transactions.length,
        summary
      };

    } catch (error: any) {
      return {
        success: false,
        transactions: [],
        errors: [error.message],
        totalTransactions: 0,
        summary: { income: 0, expenses: 0, balance: 0 }
      };
    }
  }

  private async parsePDF(filePath: string): Promise<string> {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data.text;
  }

  private async parseText(filePath: string): Promise<string> {
    return fs.readFileSync(filePath, 'utf-8');
  }

  private async parseExcel(filePath: string): Promise<string> {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    // Converter para string CSV-like para processamento
    return jsonData.map((row: any) => (row as any[]).join(';')).join('\n');
  }

  private async parseOFX(filePath: string): Promise<string> {
    return fs.readFileSync(filePath, 'utf-8');
  }

  private detectBank(content: string, filename: string): BankParser | null {
    for (const parser of this.parsers) {
      if (parser.detect(content, filename)) {
        return parser;
      }
    }
    return null;
  }

  private calculateSummary(transactions: ParsedTransaction[]) {
    let income = 0;
    let expenses = 0;

    for (const transaction of transactions) {
      if (transaction.type === 'INCOME') {
        income += transaction.amount;
      } else {
        expenses += Math.abs(transaction.amount);
      }
    }

    return {
      income,
      expenses,
      balance: income - expenses
    };
  }
}

// Parsers específicos para cada banco
class NubankParser implements BankParser {
  name = 'Nubank';

  detect(content: string, filename: string): boolean {
    return content.includes('Nubank') || 
           content.includes('Nu Pagamentos') ||
           filename.toLowerCase().includes('nubank');
  }

  parse(content: string): ParsedTransaction[] {
    const transactions: ParsedTransaction[] = [];
    const lines = content.split('\n');

    for (const line of lines) {
      // Padrão Nubank CSV: date,category,title,amount
      if (line.includes(',') && this.isValidDate(line.split(',')[0])) {
        const parts = line.split(',');
        if (parts.length >= 4) {
          const date = this.normalizeDate(parts[0]);
          const description = parts[2];
          const amount = parseFloat(parts[3].replace('R$', '').replace(',', '.').trim());
          
          transactions.push({
            date,
            description,
            amount: Math.abs(amount),
            type: amount >= 0 ? 'INCOME' : 'EXPENSE',
            category: parts[1],
            originalLine: line
          });
        }
      }
    }

    return transactions;
  }

  private isValidDate(dateStr: string): boolean {
    const date = new Date(dateStr);
    return !isNaN(date.getTime());
  }

  private normalizeDate(dateStr: string): string {
    return new Date(dateStr).toISOString().split('T')[0];
  }
}

class BancoDoBrasilParser implements BankParser {
  name = 'Banco do Brasil';

  detect(content: string, filename: string): boolean {
    return content.includes('Banco do Brasil') || 
           content.includes('001 - BB') ||
           filename.toLowerCase().includes('bb') ||
           filename.toLowerCase().includes('bancodobrasil');
  }

  parse(content: string): ParsedTransaction[] {
    const transactions: ParsedTransaction[] = [];
    const lines = content.split('\n');

    for (const line of lines) {
      // Padrão BB: DD/MM/YYYY DESCRIÇÃO VALOR
      const match = line.match(/(\d{2}\/\d{2}\/\d{4})\s+(.+?)\s+([\-\+]?\d+[,.]?\d*)/);
      if (match) {
        const [, dateStr, description, amountStr] = match;
        const amount = parseFloat(amountStr.replace(',', '.'));
        
        transactions.push({
          date: this.convertDate(dateStr),
          description: description.trim(),
          amount: Math.abs(amount),
          type: amount >= 0 ? 'INCOME' : 'EXPENSE',
          originalLine: line
        });
      }
    }

    return transactions;
  }

  private convertDate(dateStr: string): string {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
}

class BradescoParser implements BankParser {
  name = 'Bradesco';

  detect(content: string, filename: string): boolean {
    return content.includes('Bradesco') || 
           content.includes('237 - BRADESCO') ||
           filename.toLowerCase().includes('bradesco');
  }

  parse(content: string): ParsedTransaction[] {
    const transactions: ParsedTransaction[] = [];
    const lines = content.split('\n');

    for (const line of lines) {
      // Padrão Bradesco: similar ao BB mas com formatação diferente
      const match = line.match(/(\d{2}\/\d{2}\/\d{4})\s+(.+?)\s+([\-\+]?\d+[,.]?\d*)/);
      if (match) {
        const [, dateStr, description, amountStr] = match;
        const amount = parseFloat(amountStr.replace(',', '.'));
        
        transactions.push({
          date: this.convertDate(dateStr),
          description: description.trim(),
          amount: Math.abs(amount),
          type: amount >= 0 ? 'INCOME' : 'EXPENSE',
          originalLine: line
        });
      }
    }

    return transactions;
  }

  private convertDate(dateStr: string): string {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
}

class ItauParser implements BankParser {
  name = 'Itaú';

  detect(content: string, filename: string): boolean {
    return content.includes('Itaú') || 
           content.includes('341 - ITAU') ||
           filename.toLowerCase().includes('itau');
  }

  parse(content: string): ParsedTransaction[] {
    const transactions: ParsedTransaction[] = [];
    const lines = content.split('\n');

    for (const line of lines) {
      // Padrão Itaú: DD/MM/YYYY DESCRIÇÃO VALOR
      const match = line.match(/(\d{2}\/\d{2}\/\d{4})\s+(.+?)\s+([\-\+]?\d+[,.]?\d*)/);
      if (match) {
        const [, dateStr, description, amountStr] = match;
        const amount = parseFloat(amountStr.replace(',', '.'));
        
        transactions.push({
          date: this.convertDate(dateStr),
          description: description.trim(),
          amount: Math.abs(amount),
          type: amount >= 0 ? 'INCOME' : 'EXPENSE',
          originalLine: line
        });
      }
    }

    return transactions;
  }

  private convertDate(dateStr: string): string {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
}

class SantanderParser implements BankParser {
  name = 'Santander';

  detect(content: string, filename: string): boolean {
    return content.includes('Santander') || 
           content.includes('033 - SANTANDER') ||
           filename.toLowerCase().includes('santander');
  }

  parse(content: string): ParsedTransaction[] {
    const transactions: ParsedTransaction[] = [];
    const lines = content.split('\n');

    for (const line of lines) {
      const match = line.match(/(\d{2}\/\d{2}\/\d{4})\s+(.+?)\s+([\-\+]?\d+[,.]?\d*)/);
      if (match) {
        const [, dateStr, description, amountStr] = match;
        const amount = parseFloat(amountStr.replace(',', '.'));
        
        transactions.push({
          date: this.convertDate(dateStr),
          description: description.trim(),
          amount: Math.abs(amount),
          type: amount >= 0 ? 'INCOME' : 'EXPENSE',
          originalLine: line
        });
      }
    }

    return transactions;
  }

  private convertDate(dateStr: string): string {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
}

class CaixaParser implements BankParser {
  name = 'Caixa Econômica Federal';

  detect(content: string, filename: string): boolean {
    return content.includes('CAIXA') || 
           content.includes('104 - CAIXA') ||
           filename.toLowerCase().includes('caixa');
  }

  parse(content: string): ParsedTransaction[] {
    const transactions: ParsedTransaction[] = [];
    const lines = content.split('\n');

    for (const line of lines) {
      const match = line.match(/(\d{2}\/\d{2}\/\d{4})\s+(.+?)\s+([\-\+]?\d+[,.]?\d*)/);
      if (match) {
        const [, dateStr, description, amountStr] = match;
        const amount = parseFloat(amountStr.replace(',', '.'));
        
        transactions.push({
          date: this.convertDate(dateStr),
          description: description.trim(),
          amount: Math.abs(amount),
          type: amount >= 0 ? 'INCOME' : 'EXPENSE',
          originalLine: line
        });
      }
    }

    return transactions;
  }

  private convertDate(dateStr: string): string {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
}

class InterParser implements BankParser {
  name = 'Banco Inter';

  detect(content: string, filename: string): boolean {
    return content.includes('Inter') || 
           content.includes('077 - INTER') ||
           filename.toLowerCase().includes('inter');
  }

  parse(content: string): ParsedTransaction[] {
    const transactions: ParsedTransaction[] = [];
    const lines = content.split('\n');

    for (const line of lines) {
      // Inter usa formato CSV moderno
      if (line.includes(';') || line.includes(',')) {
        const parts = line.split(/[;,]/);
        if (parts.length >= 3) {
          const dateStr = parts[0];
          const description = parts[1];
          const amountStr = parts[2];
          
          if (this.isValidDate(dateStr)) {
            const amount = parseFloat(amountStr.replace('R$', '').replace(',', '.').trim());
            
            transactions.push({
              date: this.normalizeDate(dateStr),
              description: description.trim(),
              amount: Math.abs(amount),
              type: amount >= 0 ? 'INCOME' : 'EXPENSE',
              originalLine: line
            });
          }
        }
      }
    }

    return transactions;
  }

  private isValidDate(dateStr: string): boolean {
    return /\d{2}\/\d{2}\/\d{4}/.test(dateStr) || /\d{4}-\d{2}-\d{2}/.test(dateStr);
  }

  private normalizeDate(dateStr: string): string {
    if (dateStr.includes('/')) {
      const [day, month, year] = dateStr.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return dateStr;
  }
}

class C6BankParser implements BankParser {
  name = 'C6 Bank';

  detect(content: string, filename: string): boolean {
    return content.includes('C6 Bank') || 
           content.includes('C6') ||
           filename.toLowerCase().includes('c6');
  }

  parse(content: string): ParsedTransaction[] {
    const transactions: ParsedTransaction[] = [];
    const lines = content.split('\n');

    for (const line of lines) {
      if (line.includes(',')) {
        const parts = line.split(',');
        if (parts.length >= 3) {
          const dateStr = parts[0];
          const description = parts[1];
          const amountStr = parts[2];
          
          if (this.isValidDate(dateStr)) {
            const amount = parseFloat(amountStr.replace('R$', '').replace(',', '.').trim());
            
            transactions.push({
              date: this.normalizeDate(dateStr),
              description: description.trim(),
              amount: Math.abs(amount),
              type: amount >= 0 ? 'INCOME' : 'EXPENSE',
              originalLine: line
            });
          }
        }
      }
    }

    return transactions;
  }

  private isValidDate(dateStr: string): boolean {
    return /\d{2}\/\d{2}\/\d{4}/.test(dateStr) || /\d{4}-\d{2}-\d{2}/.test(dateStr);
  }

  private normalizeDate(dateStr: string): string {
    if (dateStr.includes('/')) {
      const [day, month, year] = dateStr.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return dateStr;
  }
}

class OriginalParser implements BankParser {
  name = 'Banco Original';

  detect(content: string, filename: string): boolean {
    return content.includes('Original') || 
           filename.toLowerCase().includes('original');
  }

  parse(content: string): ParsedTransaction[] {
    const transactions: ParsedTransaction[] = [];
    const lines = content.split('\n');

    for (const line of lines) {
      if (line.includes(',')) {
        const parts = line.split(',');
        if (parts.length >= 3) {
          const dateStr = parts[0];
          const description = parts[1];
          const amountStr = parts[2];
          
          if (this.isValidDate(dateStr)) {
            const amount = parseFloat(amountStr.replace('R$', '').replace(',', '.').trim());
            
            transactions.push({
              date: this.normalizeDate(dateStr),
              description: description.trim(),
              amount: Math.abs(amount),
              type: amount >= 0 ? 'INCOME' : 'EXPENSE',
              originalLine: line
            });
          }
        }
      }
    }

    return transactions;
  }

  private isValidDate(dateStr: string): boolean {
    return /\d{2}\/\d{2}\/\d{4}/.test(dateStr) || /\d{4}-\d{2}-\d{2}/.test(dateStr);
  }

  private normalizeDate(dateStr: string): string {
    if (dateStr.includes('/')) {
      const [day, month, year] = dateStr.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return dateStr;
  }
}

class MercadoPagoParser implements BankParser {
  name = 'Mercado Pago';

  detect(content: string, filename: string): boolean {
    return content.includes('Mercado Pago') || 
           content.includes('MercadoPago') ||
           filename.toLowerCase().includes('mercadopago');
  }

  parse(content: string): ParsedTransaction[] {
    const transactions: ParsedTransaction[] = [];
    const lines = content.split('\n');

    for (const line of lines) {
      if (line.includes(',')) {
        const parts = line.split(',');
        if (parts.length >= 4) {
          const dateStr = parts[0];
          const description = parts[2];
          const amountStr = parts[3];
          
          if (this.isValidDate(dateStr)) {
            const amount = parseFloat(amountStr.replace('R$', '').replace(',', '.').trim());
            
            transactions.push({
              date: this.normalizeDate(dateStr),
              description: description.trim(),
              amount: Math.abs(amount),
              type: amount >= 0 ? 'INCOME' : 'EXPENSE',
              originalLine: line
            });
          }
        }
      }
    }

    return transactions;
  }

  private isValidDate(dateStr: string): boolean {
    return /\d{2}\/\d{2}\/\d{4}/.test(dateStr) || /\d{4}-\d{2}-\d{2}/.test(dateStr);
  }

  private normalizeDate(dateStr: string): string {
    if (dateStr.includes('/')) {
      const [day, month, year] = dateStr.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return dateStr;
  }
}

class PicPayParser implements BankParser {
  name = 'PicPay';

  detect(content: string, filename: string): boolean {
    return content.includes('PicPay') || 
           filename.toLowerCase().includes('picpay');
  }

  parse(content: string): ParsedTransaction[] {
    const transactions: ParsedTransaction[] = [];
    const lines = content.split('\n');

    for (const line of lines) {
      if (line.includes(',')) {
        const parts = line.split(',');
        if (parts.length >= 3) {
          const dateStr = parts[0];
          const description = parts[1];
          const amountStr = parts[2];
          
          if (this.isValidDate(dateStr)) {
            const amount = parseFloat(amountStr.replace('R$', '').replace(',', '.').trim());
            
            transactions.push({
              date: this.normalizeDate(dateStr),
              description: description.trim(),
              amount: Math.abs(amount),
              type: amount >= 0 ? 'INCOME' : 'EXPENSE',
              originalLine: line
            });
          }
        }
      }
    }

    return transactions;
  }

  private isValidDate(dateStr: string): boolean {
    return /\d{2}\/\d{2}\/\d{4}/.test(dateStr) || /\d{4}-\d{2}-\d{2}/.test(dateStr);
  }

  private normalizeDate(dateStr: string): string {
    if (dateStr.includes('/')) {
      const [day, month, year] = dateStr.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return dateStr;
  }
}

class GenericCSVParser implements BankParser {
  name = 'CSV Genérico';

  detect(content: string, filename: string): boolean {
    return filename.endsWith('.csv') && content.includes(',');
  }

  parse(content: string): ParsedTransaction[] {
    const transactions: ParsedTransaction[] = [];
    const lines = content.split('\n');

    for (const line of lines) {
      if (line.includes(',')) {
        const parts = line.split(',');
        if (parts.length >= 3) {
          // Tenta identificar colunas por posição comum: data, descrição, valor
          const potentialDate = parts[0].trim();
          const potentialDescription = parts[1].trim();
          const potentialAmount = parts[2].trim();
          
          if (this.isValidDate(potentialDate) && potentialAmount) {
            const amount = parseFloat(potentialAmount.replace('R$', '').replace(',', '.').trim());
            
            if (!isNaN(amount)) {
              transactions.push({
                date: this.normalizeDate(potentialDate),
                description: potentialDescription,
                amount: Math.abs(amount),
                type: amount >= 0 ? 'INCOME' : 'EXPENSE',
                originalLine: line
              });
            }
          }
        }
      }
    }

    return transactions;
  }

  private isValidDate(dateStr: string): boolean {
    return /\d{2}\/\d{2}\/\d{4}/.test(dateStr) || /\d{4}-\d{2}-\d{2}/.test(dateStr);
  }

  private normalizeDate(dateStr: string): string {
    if (dateStr.includes('/')) {
      const [day, month, year] = dateStr.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return dateStr;
  }
}

class GenericOFXParser implements BankParser {
  name = 'OFX Genérico';

  detect(content: string, filename: string): boolean {
    return filename.endsWith('.ofx') || content.includes('<OFX>');
  }

  parse(content: string): ParsedTransaction[] {
    const transactions: ParsedTransaction[] = [];
    
    // Parse básico de OFX - pegar transações entre <STMTTRN> e </STMTTRN>
    const transactionRegex = /<STMTTRN>(.*?)<\/STMTTRN>/gs;
    const matches = content.match(transactionRegex);

    if (matches) {
      for (const match of matches) {
        const dateMatch = match.match(/<DTPOSTED>(\d{8})/);
        const amountMatch = match.match(/<TRNAMT>([\-\d\.]+)/);
        const memoMatch = match.match(/<MEMO>(.*?)</);

        if (dateMatch && amountMatch) {
          const dateStr = dateMatch[1];
          const amount = parseFloat(amountMatch[1]);
          const description = memoMatch ? memoMatch[1] : 'Transação OFX';

          // Converter data YYYYMMDD para YYYY-MM-DD
          const formattedDate = `${dateStr.substr(0, 4)}-${dateStr.substr(4, 2)}-${dateStr.substr(6, 2)}`;

          transactions.push({
            date: formattedDate,
            description: description.trim(),
            amount: Math.abs(amount),
            type: amount >= 0 ? 'INCOME' : 'EXPENSE',
            originalLine: match
          });
        }
      }
    }

    return transactions;
  }
}

export { BankStatementParser };
