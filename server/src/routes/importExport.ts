import { Router } from 'express';
import multer from 'multer';
import { authenticateToken } from '@/middleware/auth';
import { asyncHandler } from '@/middleware/errorHandler';
import { modernBankParser } from '@/services/modernBankParser';
import { prisma } from '@/config/database';
import * as fs from 'fs';
import * as path from 'path';

const router = Router();

// Configuração do multer para upload de arquivos
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limite
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.csv', '.txt', '.pdf', '.xlsx', '.xls', '.ofx'];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    if (allowedTypes.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error(`Tipo de arquivo não suportado: ${fileExtension}. Tipos aceitos: ${allowedTypes.join(', ')}`));
    }
  }
});

// Rota temporária de debug sem autenticação
router.post('/debug-preview', upload.single('file'), asyncHandler(async (req: any, res: any) => {
  console.log('🔍 Debug preview chamado');
  const file = req.file;

  if (!file) {
    console.log('❌ Nenhum arquivo enviado');
    return res.status(400).json({
      success: false,
      message: 'Nenhum arquivo enviado'
    });
  }

  try {
    console.log('📁 Arquivo recebido:', file.originalname, 'Size:', file.size);
    
    // Fazer apenas o parse, sem salvar no banco
    console.log('🔧 Iniciando parser...');
    
    const result = await modernBankParser.parseFile(file.path, file.originalname);
    console.log('✅ Parser concluído:', result.success);

    // Limpar arquivo temporário
    fs.unlinkSync(file.path);

    if (!result.success) {
      console.log('❌ Falha no parser:', result.errors);
      return res.status(400).json({
        success: false,
        message: 'Erro ao processar o arquivo',
        errors: result.errors
      });
    }

    // Retornar apenas preview (primeiras 5 transações)
    const preview = result.transactions.slice(0, 5);
    console.log('📊 Preview gerado com', preview.length, 'transações');

    res.json({
      success: true,
      debug: true,
      preview: {
        bankDetected: result.bankDetected,
        totalTransactions: result.totalTransactions,
        summary: result.summary,
        sampleTransactions: preview
      }
    });

  } catch (error: any) {
    console.log('❌ Erro no debug preview:', error.message);
    // Limpar arquivo temporário em caso de erro
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    res.status(500).json({
      success: false,
      message: 'Erro ao processar preview',
      error: error.message,
      stack: error.stack
    });
  }
}));

// Aplicar autenticação nas outras rotas
router.use(authenticateToken);

// Importar extrato bancário
router.post('/import', upload.single('file'), asyncHandler(async (req: any, res: any) => {
  const userId = req.user.id;
  const file = req.file;

  if (!file) {
    return res.status(400).json({
      success: false,
      message: 'Nenhum arquivo enviado'
    });
  }

  try {
    // Fazer parse do arquivo
    const result = await modernBankParser.parseFile(file.path, file.originalname);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Erro ao processar o arquivo',
        errors: result.errors
      });
    }

    // Obter conta padrão do usuário ou criar uma
    let defaultAccount = await prisma.account.findFirst({
      where: { userId }
    });

    if (!defaultAccount) {
      defaultAccount = await prisma.account.create({
        data: {
          userId,
          name: result.bankDetected || 'Conta Importada',
          description: 'Conta criada automaticamente na importação',
          type: 'CHECKING',
          balance: 0
        }
      });
    }

    // Salvar transações no banco
    const savedTransactions = [];
    const errors = [];
    const skipped = [];

    for (const transaction of result.transactions) {
      try {
        // Verificar se a transação já existe (evitar duplicatas)
        const existingTransaction = await prisma.transaction.findFirst({
          where: {
            userId,
            date: new Date(transaction.date),
            description: transaction.description,
            amount: transaction.amount
          }
        });

        if (existingTransaction) {
          skipped.push(transaction);
          continue;
        }

        // Buscar ou criar categoria
        let categoryId = '';
        if (transaction.category) {
          let category = await prisma.category.findFirst({
            where: {
              userId,
              name: transaction.category
            }
          });

          if (!category) {
            category = await prisma.category.create({
              data: {
                userId,
                name: transaction.category,
                type: transaction.type,
                color: transaction.type === 'INCOME' ? '#10B981' : '#EF4444',
                icon: transaction.type === 'INCOME' ? 'trending-up' : 'trending-down',
                description: `Categoria criada automaticamente da importação`
              }
            });
          }
          categoryId = category.id;
        } else {
          // Usar categoria padrão
          let defaultCategory = await prisma.category.findFirst({
            where: {
              userId,
              name: 'Geral'
            }
          });

          if (!defaultCategory) {
            defaultCategory = await prisma.category.create({
              data: {
                userId,
                name: 'Geral',
                type: transaction.type,
                color: '#6B7280',
                icon: 'tag',
                description: 'Categoria geral'
              }
            });
          }
          categoryId = defaultCategory.id;
        }

        // Criar transação
        const savedTransaction = await prisma.transaction.create({
          data: {
            userId,
            description: transaction.description,
            amount: transaction.amount,
            type: transaction.type,
            date: new Date(transaction.date),
            categoryId,
            accountId: defaultAccount.id,
            notes: `Importado de: ${result.bankDetected || 'Arquivo'}\nLinha original: ${transaction.originalLine || ''}`
          },
          include: {
            category: true,
            account: true
          }
        });

        savedTransactions.push(savedTransaction);
      } catch (error: any) {
        errors.push(`Erro ao salvar transação "${transaction.description}": ${error.message}`);
      }
    }

    // Limpar arquivo temporário
    fs.unlinkSync(file.path);

    res.json({
      success: true,
      message: `Importação concluída! ${savedTransactions.length} transações importadas de ${result.totalTransactions} encontradas.`,
      data: {
        bankDetected: result.bankDetected,
        totalFound: result.totalTransactions,
        totalImported: savedTransactions.length,
        duplicatesSkipped: skipped.length,
        errors: errors,
        summary: result.summary,
        transactions: savedTransactions.slice(0, 5) // Retornar apenas primeiras 5 para não sobrecarregar
      }
    });

  } catch (error: any) {
    // Limpar arquivo temporário em caso de erro
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    return res.status(500).json({
      success: false,
      message: 'Erro interno ao processar importação',
      error: error.message
    });
  }
}));

// Exportar dados do usuário
router.get('/export', asyncHandler(async (req: any, res: any) => {
  const userId = req.user.id;
  const format = req.query.format || 'json'; // json, csv

  try {
    // Buscar todos os dados do usuário
    const [user, transactions, categories, accounts, budgets, goals] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      prisma.transaction.findMany({
        where: { userId },
        include: {
          category: true,
          account: true
        },
        orderBy: { date: 'desc' }
      }),
      prisma.category.findMany({
        where: { userId }
      }),
      prisma.account.findMany({
        where: { userId }
      }),
      prisma.budget.findMany({
        where: { userId },
        include: {
          category: true
        }
      }),
      prisma.goal.findMany({
        where: { userId }
      })
    ]);

    const exportData = {
      user,
      transactions,
      categories,
      accounts,
      budgets,
      goals,
      exportInfo: {
        exportedAt: new Date().toISOString(),
        version: '1.0',
        format
      }
    };

    if (format === 'csv') {
      // Exportar apenas transações em CSV
      const csvHeaders = 'Data,Descrição,Valor,Tipo,Categoria,Conta\n';
      const csvRows = transactions.map(t => 
        `${t.date.toISOString().split('T')[0]},${t.description},${t.amount},${t.type},${t.category?.name || ''},${t.account?.name || ''}`
      ).join('\n');
      
      const csvContent = csvHeaders + csvRows;
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=will-finance-export.csv');
      return res.send(csvContent);
    }

    // Exportar em JSON (padrão)
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=will-finance-export.json');
    res.json(exportData);

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Erro ao exportar dados',
      error: error.message
    });
  }
}));

// Obter estatísticas de importação
router.get('/stats', asyncHandler(async (req: any, res: any) => {
  const userId = req.user.id;

  try {
    const [
      totalTransactions,
      importedTransactions,
      categoriesCreated,
      lastImport
    ] = await Promise.all([
      prisma.transaction.count({
        where: { userId }
      }),
      prisma.transaction.count({
        where: {
          userId,
          notes: {
            contains: 'Importado de:'
          }
        }
      }),
      prisma.category.count({
        where: {
          userId,
          description: {
            contains: 'criada automaticamente'
          }
        }
      }),
      prisma.transaction.findFirst({
        where: {
          userId,
          notes: {
            contains: 'Importado de:'
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        select: {
          createdAt: true,
          notes: true
        }
      })
    ]);

    let lastImportBank = 'Desconhecido';
    if (lastImport && lastImport.notes) {
      const match = lastImport.notes.match(/Importado de: (.+)/);
      if (match && match[1]) {
        const bankMatch = match[1].split('\n')[0];
        if (bankMatch) {
          lastImportBank = bankMatch;
        }
      }
    }

    res.json({
      success: true,
      stats: {
        totalTransactions,
        importedTransactions,
        categoriesCreated,
        lastImport: lastImport ? {
          date: lastImport.createdAt,
          bank: lastImportBank
        } : null,
        importedPercentage: totalTransactions > 0 ? 
          Math.round((importedTransactions / totalTransactions) * 100) : 0
      }
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Erro ao obter estatísticas',
      error: error.message
    });
  }
}));

// Preview do arquivo antes da importação
router.post('/preview', upload.single('file'), asyncHandler(async (req: any, res: any) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({
      success: false,
      message: 'Nenhum arquivo enviado'
    });
  }

  try {
    // Fazer apenas o parse, sem salvar no banco
    const result = await modernBankParser.parseFile(file.path, file.originalname);

    // Limpar arquivo temporário
    fs.unlinkSync(file.path);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Erro ao processar o arquivo',
        errors: result.errors
      });
    }

    // Retornar apenas preview (primeiras 10 transações)
    const preview = result.transactions.slice(0, 10);

    res.json({
      success: true,
      preview: {
        bankDetected: result.bankDetected,
        totalTransactions: result.totalTransactions,
        summary: result.summary,
        sampleTransactions: preview
      }
    });

  } catch (error: any) {
    // Limpar arquivo temporário em caso de erro
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    res.status(500).json({
      success: false,
      message: 'Erro ao processar preview',
      error: error.message
    });
  }
}));

export default router;
