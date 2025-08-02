import { Router } from 'express';
import axios from 'axios';
import { logger } from '../utils/logger';
import { authenticateToken } from './auth';

export interface OpenFinanceBankData {
  id: string;
  name: string;
  logo: string;
  supportedFeatures: string[];
  status: 'active' | 'maintenance' | 'inactive';
}

interface ConnectionTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: string;
}

export interface OpenFinanceTransaction {
  bankTransactionId: string;
  date: string;
  amount: number;
  description: string;
  category: string;
  type: 'INCOME' | 'EXPENSE';
  balance?: number;
  merchant?: string;
}

export interface ConnectionData {
  id: string;
  bankId: string;
  userId: string;
  status: 'connected' | 'disconnected' | 'expired';
  permissions: string[];
  createdAt: string;
  expiresAt: string;
}

class OpenFinanceService {
  private readonly API_URL: string;
  private readonly CLIENT_ID: string;
  private readonly CLIENT_SECRET: string;
  private readonly TIMEOUT = 30000;

  constructor() {
    this.API_URL = process.env.OPENFINANCE_API_URL || 'https://api.openfinance.example.com';
    this.CLIENT_ID = process.env.OPENFINANCE_CLIENT_ID || '';
    this.CLIENT_SECRET = process.env.OPENFINANCE_CLIENT_SECRET || '';
  }

  /**
   * Obtém lista de bancos disponíveis
   */
  async getBanks(): Promise<OpenFinanceBankData[]> {
    try {
      logger.info('🏦 Obtendo lista de bancos do Open Finance');

      const response = await axios.get(`${this.API_URL}/banks`, {
        headers: {
          'Authorization': `Bearer ${await this.getAccessToken()}`,
          'Content-Type': 'application/json',
        },
        timeout: this.TIMEOUT,
      });

      const banks: OpenFinanceBankData[] = response.data.banks.map((bank: any) => ({
        id: bank.id,
        name: bank.name,
        logo: bank.logo || '/assets/bank-default.png',
        supportedFeatures: bank.features || ['transactions', 'balance'],
        status: bank.status || 'active',
      }));

      logger.info(`✅ ${banks.length} bancos obtidos com sucesso`);
      return banks;
    } catch (error: any) {
      logger.error(`❌ Erro ao obter bancos: ${error.message}`);
      
      // Retornar bancos mock para desenvolvimento
      return this.getMockBanks();
    }
  }

  /**
   * Inicia processo de conexão com banco
   */
  async initiateConnection(userId: string, bankId: string): Promise<string> {
    try {
      logger.info(`🔗 Iniciando conexão para usuário ${userId} com banco ${bankId}`);

      const response = await axios.post(
        `${this.API_URL}/connections/initiate`,
        {
          userId,
          bankId,
          permissions: ['transactions', 'balance', 'accounts'],
          redirectUri: `${process.env.FRONTEND_URL}/openfinance/callback`,
        },
        {
          headers: {
            'Authorization': `Bearer ${await this.getAccessToken()}`,
            'Content-Type': 'application/json',
          },
          timeout: this.TIMEOUT,
        }
      );

      const authUrl = response.data.authUrl;
      logger.info(`✅ URL de autorização gerada: ${authUrl}`);
      
      return authUrl;
    } catch (error: any) {
      logger.error(`❌ Erro ao iniciar conexão: ${error.message}`);
      throw new Error(`Falha ao conectar com ${bankId}: ${error.message}`);
    }
  }

  /**
   * Processa callback de autorização
   */
  async handleCallback(authorizationCode: string, state: string): Promise<ConnectionData> {
    try {
      logger.info(`🔄 Processando callback com código: ${authorizationCode}`);

      const response = await axios.post(
        `${this.API_URL}/oauth/token`,
        {
          grant_type: 'authorization_code',
          code: authorizationCode,
          client_id: this.CLIENT_ID,
          client_secret: this.CLIENT_SECRET,
          redirect_uri: `${process.env.FRONTEND_URL}/openfinance/callback`,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          timeout: this.TIMEOUT,
        }
      );

      const { access_token, refresh_token, expires_in, connection_id } = response.data;

      const connectionData: ConnectionData = {
        id: connection_id,
        bankId: state, // Banco ID passado via state
        userId: '', // Será preenchido pelo contexto da requisição
        status: 'connected',
        permissions: ['transactions', 'balance', 'accounts'],
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + expires_in * 1000).toISOString(),
      };

      // Salvar tokens de forma segura (implementar storage)
      await this.saveConnectionTokens(connection_id, {
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresAt: connectionData.expiresAt,
      });

      logger.info(`✅ Conexão estabelecida: ${connection_id}`);
      return connectionData;
    } catch (error: any) {
      logger.error(`❌ Erro no callback: ${error.message}`);
      throw new Error(`Falha no callback de autorização: ${error.message}`);
    }
  }

  /**
   * Sincroniza transações de uma conexão
   */
  async syncTransactions(connectionId: string, _userId?: string): Promise<OpenFinanceTransaction[]> {
    try {
      logger.info(`🔄 Sincronizando transações da conexão: ${connectionId}`);

      const tokens = await this.getConnectionTokens(connectionId);
      if (!tokens) {
        throw new Error('Conexão não encontrada ou expirada');
      }

      const response = await axios.get(
        `${this.API_URL}/connections/${connectionId}/transactions`,
        {
          headers: {
            'Authorization': `Bearer ${tokens.accessToken}`,
            'Content-Type': 'application/json',
          },
          params: {
            dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dias
            dateTo: new Date().toISOString(),
            limit: 500,
          },
          timeout: this.TIMEOUT,
        }
      );

      const transactions: OpenFinanceTransaction[] = response.data.transactions.map((tx: any) => ({
        bankTransactionId: tx.transactionId,
        date: tx.bookingDate || tx.valueDate,
        amount: Math.abs(tx.amount),
        description: this.cleanDescription(tx.remittanceInformation || tx.additionalInformation),
        category: this.categorizeTransaction(tx),
        type: tx.amount > 0 ? 'INCOME' : 'EXPENSE',
        balance: tx.balance,
        merchant: tx.merchant?.name,
      }));

      logger.info(`✅ ${transactions.length} transações sincronizadas`);
      return transactions;
    } catch (error: any) {
      logger.error(`❌ Erro ao sincronizar transações: ${error.message}`);
      throw new Error(`Falha na sincronização: ${error.message}`);
    }
  }

  /**
   * Obtém saldo atual de uma conexão
   */
  async getBalance(connectionId: string): Promise<{ balance: number; currency: string; lastUpdate: string }> {
    try {
      logger.info(`💰 Obtendo saldo da conexão: ${connectionId}`);

      const tokens = await this.getConnectionTokens(connectionId);
      if (!tokens) {
        throw new Error('Conexão não encontrada ou expirada');
      }

      const response = await axios.get(
        `${this.API_URL}/connections/${connectionId}/balance`,
        {
          headers: {
            'Authorization': `Bearer ${tokens.accessToken}`,
            'Content-Type': 'application/json',
          },
          timeout: this.TIMEOUT,
        }
      );

      const balanceData = {
        balance: response.data.balance,
        currency: response.data.currency || 'BRL',
        lastUpdate: response.data.lastUpdate || new Date().toISOString(),
      };

      logger.info(`✅ Saldo obtido: ${balanceData.balance} ${balanceData.currency}`);
      return balanceData;
    } catch (error: any) {
      logger.error(`❌ Erro ao obter saldo: ${error.message}`);
      throw new Error(`Falha ao obter saldo: ${error.message}`);
    }
  }

  /**
   * Desconecta uma conexão Open Finance
   */
  async disconnectConnection(connectionId: string): Promise<void> {
    try {
      logger.info(`🔌 Desconectando conexão: ${connectionId}`);

      const tokens = await this.getConnectionTokens(connectionId);
      if (tokens) {
        await axios.delete(`${this.API_URL}/connections/${connectionId}`, {
          headers: {
            'Authorization': `Bearer ${tokens.accessToken}`,
          },
          timeout: this.TIMEOUT,
        });
      }

      // Remover tokens do storage
      await this.removeConnectionTokens(connectionId);

      logger.info(`✅ Conexão desconectada: ${connectionId}`);
    } catch (error: any) {
      logger.error(`❌ Erro ao desconectar: ${error.message}`);
      throw new Error(`Falha ao desconectar: ${error.message}`);
    }
  }

  /**
   * Métodos auxiliares privados
   */
  private async getAccessToken(): Promise<string> {
    // Implementar cache de token de aplicação
    const response = await axios.post(`${this.API_URL}/oauth/token`, {
      grant_type: 'client_credentials',
      client_id: this.CLIENT_ID,
      client_secret: this.CLIENT_SECRET,
      scope: 'openfinance',
    });

    return response.data.access_token;
  }

  private cleanDescription(description: string): string {
    if (!description) return 'Transação Open Finance';
    
    return description
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/[^\w\s-.,]/g, '')
      .substring(0, 100);
  }

  private categorizeTransaction(tx: any): string {
    const description = (tx.remittanceInformation || '').toLowerCase();
    
    // Categorização básica baseada na descrição
    if (description.includes('pix') || description.includes('transferencia')) {
      return 'Transferências';
    } else if (description.includes('debito automatico')) {
      return 'Débito Automático';
    } else if (description.includes('saque')) {
      return 'Saques';
    } else if (description.includes('deposito')) {
      return 'Depósitos';
    }
    
    return 'Outros';
  }

  private getMockBanks(): OpenFinanceBankData[] {
    return [
      {
        id: 'banco-brasil',
        name: 'Banco do Brasil',
        logo: '/assets/banks/bb.png',
        supportedFeatures: ['transactions', 'balance', 'accounts'],
        status: 'active',
      },
      {
        id: 'itau',
        name: 'Itaú Unibanco',
        logo: '/assets/banks/itau.png',
        supportedFeatures: ['transactions', 'balance'],
        status: 'active',
      },
      {
        id: 'bradesco',
        name: 'Bradesco',
        logo: '/assets/banks/bradesco.png',
        supportedFeatures: ['transactions', 'balance'],
        status: 'active',
      },
      {
        id: 'santander',
        name: 'Santander',
        logo: '/assets/banks/santander.png',
        supportedFeatures: ['transactions'],
        status: 'maintenance',
      },
    ];
  }

  private async saveConnectionTokens(connectionId: string, _tokens: ConnectionTokens): Promise<void> {
    // Implementar storage seguro (Redis, banco de dados, etc.)
    logger.info(`💾 Salvando tokens para conexão: ${connectionId}`);
  }

  private async getConnectionTokens(connectionId: string): Promise<ConnectionTokens> {
    // Implementar recuperação de tokens
    logger.info(`🔍 Recuperando tokens para conexão: ${connectionId}`);
    return null;
  }

  private async removeConnectionTokens(connectionId: string): Promise<void> {
    // Implementar remoção de tokens
    logger.info(`🗑️ Removendo tokens para conexão: ${connectionId}`);
  }
}

// Criar instância do serviço
const openFinanceService = new OpenFinanceService();

// Rotas da API
const router = Router();

/**
 * GET /api/openfinance/banks
 * Obter lista de bancos disponíveis
 */
router.get('/banks', async (req, res) => {
  try {
    const banks = await openFinanceService.getBanks();
    res.json({ success: true, banks });
  } catch (error: any) {
    logger.error(`Erro ao obter bancos: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/openfinance/connect
 * Iniciar conexão com banco
 */
router.post('/connect', authenticateToken, async (req, res) => {
  try {
    const { bankId } = req.body;
    const userId = req.user?.id;

    if (!bankId) {
      return res.status(400).json({ success: false, message: 'bankId é obrigatório' });
    }

    const authUrl = await openFinanceService.initiateConnection(userId, bankId);
    res.json({ success: true, authUrl });
  } catch (error: any) {
    logger.error(`Erro ao conectar banco: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /api/openfinance/callback
 * Processar callback de autorização
 */
router.post('/callback', async (req, res) => {
  try {
    const { code, state } = req.body;

    if (!code || !state) {
      return res.status(400).json({ success: false, message: 'Código e state são obrigatórios' });
    }

    const connection = await openFinanceService.handleCallback(code, state);
    res.json({ success: true, connection });
  } catch (error: any) {
    logger.error(`Erro no callback: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/openfinance/sync/:connectionId
 * Sincronizar transações
 */
router.get('/sync/:connectionId', authenticateToken, async (req, res) => {
  try {
    const { connectionId } = req.params;
    const userId = req.user?.id;

    const transactions = await openFinanceService.syncTransactions(connectionId, userId);
    res.json({ success: true, transactions });
  } catch (error: any) {
    logger.error(`Erro ao sincronizar: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * GET /api/openfinance/balance/:connectionId
 * Obter saldo atual
 */
router.get('/balance/:connectionId', authenticateToken, async (req, res) => {
  try {
    const { connectionId } = req.params;

    const balance = await openFinanceService.getBalance(connectionId);
    res.json({ success: true, balance });
  } catch (error: any) {
    logger.error(`Erro ao obter saldo: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * DELETE /api/openfinance/disconnect/:connectionId
 * Desconectar banco
 */
router.delete('/disconnect/:connectionId', authenticateToken, async (req, res) => {
  try {
    const { connectionId } = req.params;

    await openFinanceService.disconnectConnection(connectionId);
    res.json({ success: true, message: 'Conexão desconectada com sucesso' });
  } catch (error: any) {
    logger.error(`Erro ao desconectar: ${error.message}`);
    res.status(500).json({ success: false, message: error.message });
  }
});

export { openFinanceService };
export default router;
