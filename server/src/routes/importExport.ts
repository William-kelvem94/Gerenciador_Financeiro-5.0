import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import process from 'process';
import { prisma } from '../db/client';
import { authenticateToken } from './auth';
import { ModernBankParser } from '../services/bankParser';
import { logger } from '../utils/logger';
import { AuthenticatedRequest } from '../types/auth';

const router = express.Router();

// Configuração do multer para upload de arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${Date.now()}-${sanitizedFilename}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedExtensions = ['.csv', '.txt', '.pdf', '.xlsx', '.ofx'];
    const fileExtension = path.extname(file.originalname).toLowerCase();

    if (allowedExtensions.includes(fileExtension) || !fileExtension) {
      cb(null, true);
    } else {
      cb(new Error(`Tipo de arquivo não suportado. Use: ${allowedExtensions.join(', ')}`));
    }
  },
});

/**
 * POST /api/import-export/preview
 * Faz preview do arquivo antes da importação
 */
router.post('/preview', authenticateToken, upload.single('file'), async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Nenhum arquivo foi enviado',
      });
    }

    logger.info(`📁 Preview solicitado para: ${req.file.originalname} por usuário ${req.user.id}`);

    const parser = new ModernBankParser();
    const result = await parser.parseFile(req.file.path, req.file.originalname);

    // Limpar arquivo temporário
    fs.unlink(req.file.path, (err) => {
      if (err) logger.warn(`⚠️ Erro ao remover arquivo temporário: ${err.message}`);
    });

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: 'Erro ao processar arquivo',
        details: result.errors,
      });
    }

    // Retornar preview das transações
    res.json({
      success: true,
      preview: {
        bankDetected: result.bankDetected,
        totalTransactions: result.totalTransactions,
        summary: result.summary,
        sampleTransactions: result.transactions.slice(0, 5), // Primeiras 5 para preview
        filename: req.file.originalname,
      },
    });
  } catch (error) {
    logger.error(`❌ Erro no preview: ${error}`);

    // Limpar arquivo em caso de erro
    if (req.file?.path) {
      fs.unlink(req.file.path, () => {});
    }

    res.status(500).json({
      success: false,
      error: 'Erro interno no processamento do arquivo',
      message: error instanceof Error ? error.message : 'Erro desconhecido',
    });
  }
});

/**
 * POST /api/import-export/import
 * Importa transações para o banco de dados
 */
router.post('/import', authenticateToken, upload.single('file'), async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Nenhum arquivo foi enviado',
      });
    }

    const { accountName } = req.body;
    if (!accountName) {
      return res.status(400).json({
        success: false,
        error: 'Nome da conta é obrigatório',
      });
    }

    logger.info(`📥 Importação iniciada para: ${req.file.originalname} por usuário ${req.user.id}`);

    const parser = new ModernBankParser();
    const result = await parser.parseFile(req.file.path, req.file.originalname);

    // Limpar arquivo temporário
    fs.unlink(req.file.path, (err) => {
      if (err) logger.warn(`⚠️ Erro ao remover arquivo temporário: ${err.message}`);
    });

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: 'Erro ao processar arquivo',
        details: result.errors,
      });
    }

    // Iniciar transação no banco de dados
    const importResult = await prisma.$transaction(async (tx) => {
      // 1. Verificar/criar conta
      let account = await tx.account.findFirst({
        where: {
          name: accountName,
          userId: req.user.id,
        },
      });

      if (!account) {
        account = await tx.account.create({
          data: {
            name: accountName,
            type: 'BANK',
            balance: 0,
            userId: req.user.id,
            bankName: result.bankDetected,
          },
        });
        logger.info(`🏦 Nova conta criada: ${accountName} (${result.bankDetected})`);
      }

      // 2. Processar transações
      let importedCount = 0;
      let duplicateCount = 0;
      const createdTransactions = [];

      for (const transaction of result.transactions) {
        // Verificar duplicatas baseado em data, descrição e valor
        const existingTransaction = await tx.transaction.findFirst({
          where: {
            userId: req.user.id,
            accountId: account.id,
            date: new Date(transaction.date),
            description: transaction.description,
            amount: transaction.amount,
          },
        });

        if (existingTransaction) {
          duplicateCount++;
          logger.debug(`⏭️ Transação duplicada ignorada: ${transaction.description}`);
          continue;
        }

        // 3. Criar/buscar categoria
        let category = await tx.category.findFirst({
          where: {
            name: transaction.category || 'Geral',
            userId: req.user.id,
          },
        });

        if (!category) {
          category = await tx.category.create({
            data: {
              name: transaction.category || 'Geral',
              type: transaction.type,
              userId: req.user.id,
            },
          });
        }

        // 4. Criar transação
        const newTransaction = await tx.transaction.create({
          data: {
            description: transaction.description,
            amount: transaction.amount,
            type: transaction.type,
            date: new Date(transaction.date),
            userId: req.user.id,
            accountId: account.id,
            categoryId: category.id,
            notes: `Importado de ${req.file.originalname} (${result.bankDetected})`,
          },
        });

        createdTransactions.push(newTransaction);
        importedCount++;

        // 5. Atualizar saldo da conta
        const balanceChange =
          transaction.type === 'INCOME' ? transaction.amount : -transaction.amount;
        await tx.account.update({
          where: { id: account.id },
          data: {
            balance: {
              increment: balanceChange,
            },
          },
        });
      }

      return {
        importedCount,
        duplicateCount,
        totalProcessed: result.totalTransactions,
        accountName: account.name,
        bankDetected: result.bankDetected,
        transactions: createdTransactions,
      };
    });

    logger.info(
      `✅ Importação concluída: ${importResult.importedCount} transações importadas, ${importResult.duplicateCount} duplicatas ignoradas`
    );

    res.json({
      success: true,
      import: importResult,
      summary: result.summary,
    });
  } catch (error) {
    logger.error(`❌ Erro na importação: ${error}`);

    // Limpar arquivo em caso de erro
    if (req.file?.path) {
      fs.unlink(req.file.path, () => {});
    }

    res.status(500).json({
      success: false,
      error: 'Erro interno na importação',
      message: error instanceof Error ? error.message : 'Erro desconhecido',
    });
  }
});

/**
 * GET /api/import-export/export
 * Exporta dados financeiros do usuário
 */
router.get('/export', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { format = 'json', startDate, endDate } = req.query;

    logger.info(`📤 Exportação solicitada por usuário ${req.user.id} (formato: ${typeof format === 'string' ? format : 'json'})`);

    // Construir filtros de data
    const dateFilter: { gte?: Date; lte?: Date } = {};
    if (startDate) {
      dateFilter.gte = new Date(startDate as string);
    }
    if (endDate) {
      dateFilter.lte = new Date(endDate as string);
    }

    // Buscar dados do usuário
    const [transactions, accounts, categories, budgets] = await Promise.all([
      prisma.transaction.findMany({
        where: {
          userId: req.user.id,
          ...(Object.keys(dateFilter).length > 0 && { date: dateFilter }),
        },
        include: {
          account: true,
          category: true,
        },
        orderBy: { date: 'desc' },
      }),
      prisma.account.findMany({
        where: { userId: req.user.id },
      }),
      prisma.category.findMany({
        where: { userId: req.user.id },
      }),
      prisma.budget.findMany({
        where: { userId: req.user.id },
        include: { category: true },
      }),
    ]);

    const exportData = {
      exportedAt: new Date().toISOString(),
      user: {
        id: req.user.id,
        email: req.user.email,
      },
      summary: {
        totalTransactions: transactions.length,
        totalAccounts: accounts.length,
        totalCategories: categories.length,
        totalBudgets: budgets.length,
        dateRange: {
          start: startDate || null,
          end: endDate || null,
        },
      },
      data: {
        transactions: transactions.map((t) => ({
          id: t.id,
          description: t.description,
          amount: t.amount,
          type: t.type,
          date: t.date.toISOString(),
          account: t.account.name,
          category: t.category.name,
          notes: t.notes,
        })),
        accounts: accounts.map((a) => ({
          id: a.id,
          name: a.name,
          type: a.type,
          balance: a.balance,
          bankName: a.bankName,
        })),
        categories: categories.map((c) => ({
          id: c.id,
          name: c.name,
          type: c.type,
        })),
        budgets: budgets.map((b) => ({
          id: b.id,
          name: b.name,
          amount: b.amount,
          spent: b.spent,
          category: b.category.name,
          startDate: b.startDate.toISOString(),
          endDate: b.endDate.toISOString(),
        })),
      },
    };

    if (format === 'csv') {
      // Exportar como CSV (apenas transações)
      const csvHeader = 'Data,Descrição,Valor,Tipo,Conta,Categoria,Observações\n';
      const csvRows = transactions
        .map((t) => {
          const date = t.date.toISOString().split('T')[0];
          const description = `"${t.description.replace(/"/g, '""')}"`;
          const amount = t.amount.toString();
          const type = t.type;
          const account = `"${t.account.name.replace(/"/g, '""')}"`;
          const category = `"${t.category.name.replace(/"/g, '""')}"`;
          const notes = `"${(t.notes || '').replace(/"/g, '""')}"`;

          return `${date},${description},${amount},${type},${account},${category},${notes}`;
        })
        .join('\n');

      const csvContent = csvHeader + csvRows;

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="will-finance-export-${Date.now()}.csv"`
      );
      res.send(csvContent);
    } else {
      // Exportar como JSON
      res.setHeader('Content-Type', 'application/json');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="will-finance-export-${Date.now()}.json"`
      );
      res.json(exportData);
    }

    logger.info(`✅ Exportação concluída para usuário ${req.user.id}`);
  } catch (error) {
    logger.error(`❌ Erro na exportação: ${error}`);
    res.status(500).json({
      success: false,
      error: 'Erro interno na exportação',
      message: error instanceof Error ? error.message : 'Erro desconhecido',
    });
  }
});

/**
 * GET /api/import-export/stats
 * Estatísticas de importação/exportação
 */
router.get('/stats', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    logger.info(`📊 Estatísticas solicitadas por usuário ${req.user.id}`);

    const [
      totalTransactions,
      totalAccounts,
      totalCategories,
      importedTransactions,
      accountsByBank,
    ] = await Promise.all([
      prisma.transaction.count({
        where: { userId: req.user.id },
      }),
      prisma.account.count({
        where: { userId: req.user.id },
      }),
      prisma.category.count({
        where: { userId: req.user.id },
      }),
      prisma.transaction.count({
        where: {
          userId: req.user.id,
          notes: { contains: 'Importado de' },
        },
      }),
      prisma.account.groupBy({
        by: ['bankName'],
        where: { userId: req.user.id },
        _count: true,
      }),
    ]);

    const stats = {
      user: {
        totalTransactions,
        totalAccounts,
        totalCategories,
        importedTransactions,
        manualTransactions: totalTransactions - importedTransactions,
      },
      banks: accountsByBank.map((bank) => ({
        name: bank.bankName || 'Não especificado',
        accountCount: bank._count,
      })),
      system: {
        supportedBanks: [
          'BRADESCO',
          'NUBANK',
          'BANCO_DO_BRASIL',
          'ITAU',
          'SANTANDER',
          'CAIXA',
          'INTER',
          'C6_BANK',
          'NEXT',
          'BTG_PACTUAL',
        ],
        supportedFormats: ['.csv', '.txt', '.pdf', '.xlsx', '.ofx'],
      },
    };

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    logger.error(`❌ Erro nas estatísticas: ${error}`);
    res.status(500).json({
      success: false,
      error: 'Erro interno ao buscar estatísticas',
      message: error instanceof Error ? error.message : 'Erro desconhecido',
    });
  }
});

/**
 * DELETE /api/import-export/clear-imported
 * Remove todas as transações importadas do usuário
 */
router.delete('/clear-imported', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    logger.info(`🗑️ Limpeza de dados importados solicitada por usuário ${req.user.id}`);

    const result = await prisma.$transaction(async (tx) => {
      // Buscar transações importadas
      const importedTransactions = await tx.transaction.findMany({
        where: {
          userId: req.user.id,
          notes: { contains: 'Importado de' },
        },
        include: { account: true },
      });

      if (importedTransactions.length === 0) {
        return { deletedCount: 0, affectedAccounts: [] };
      }

      // Reverter saldos das contas
      const accountUpdates: Record<string, number> = {};

      for (const transaction of importedTransactions) {
        const balanceChange =
          transaction.type === 'INCOME' ? -transaction.amount : transaction.amount;
        accountUpdates[transaction.accountId] =
          (accountUpdates[transaction.accountId] || 0) + balanceChange;
      }

      // Atualizar saldos
      for (const [accountId, balanceChange] of Object.entries(accountUpdates)) {
        await tx.account.update({
          where: { id: accountId },
          data: {
            balance: { increment: balanceChange },
          },
        });
      }

      // Deletar transações importadas
      const deleteResult = await tx.transaction.deleteMany({
        where: {
          userId: req.user.id,
          notes: { contains: 'Importado de' },
        },
      });

      return {
        deletedCount: deleteResult.count,
        affectedAccounts: Object.keys(accountUpdates).length,
      };
    });

    logger.info(`✅ Limpeza concluída: ${result.deletedCount} transações removidas`);

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    logger.error(`❌ Erro na limpeza: ${error}`);
    res.status(500).json({
      success: false,
      error: 'Erro interno na limpeza de dados',
      message: error instanceof Error ? error.message : 'Erro desconhecido',
    });
  }
});

export { router as importExportRoutes };
