/**
 * Rotas para gerenciamento de dados (real vs demo)
 */

import { Router } from 'express';
import { authenticateToken } from '@/middleware/auth';
import { asyncHandler } from '@/middleware/errorHandler';
import { dataModeService } from '@/services/dataMode';

const router = Router();
router.use(authenticateToken);

// Obter configuração atual de dados
router.get('/mode', asyncHandler(async (req: any, res: any) => {
  const userId = req.user.id;
  
  const [mode, stats] = await Promise.all([
    dataModeService.getUserDataMode(userId),
    dataModeService.getDataStats(userId)
  ]);
  
  res.json({
    success: true,
    data: {
      currentMode: mode,
      stats,
      canSwitchToDemo: !stats.hasRealData || stats.hasDemoData,
      canSwitchToReal: true
    }
  });
}));

// Definir modo de dados
router.post('/mode', asyncHandler(async (req: any, res: any) => {
  const userId = req.user.id;
  const { mode } = req.body;
  
  if (!['REAL', 'DEMO', 'TEST'].includes(mode)) {
    return res.status(400).json({
      success: false,
      message: 'Modo inválido. Use: REAL, DEMO ou TEST'
    });
  }
  
  const success = await dataModeService.setUserDataMode(userId, mode);
  
  if (!success) {
    return res.status(500).json({
      success: false,
      message: 'Erro ao definir modo de dados'
    });
  }
  
  res.json({
    success: true,
    message: `Modo alterado para ${mode}`,
    data: { mode }
  });
}));

// Limpar dados fictícios
router.delete('/fictional-data', asyncHandler(async (req: any, res: any) => {
  const userId = req.user.id;
  
  const success = await dataModeService.clearFictionalData(userId);
  
  if (!success) {
    return res.status(500).json({
      success: false,
      message: 'Erro ao limpar dados fictícios'
    });
  }
  
  res.json({
    success: true,
    message: 'Dados fictícios removidos com sucesso'
  });
}));

// Criar dados de demonstração
router.post('/demo-data', asyncHandler(async (req: any, res: any) => {
  const userId = req.user.id;
  
  const success = await dataModeService.createDemoData(userId);
  
  if (!success) {
    return res.status(500).json({
      success: false,
      message: 'Erro ao criar dados de demonstração'
    });
  }
  
  res.json({
    success: true,
    message: 'Dados de demonstração criados com sucesso'
  });
}));

// Estatísticas de dados
router.get('/stats', asyncHandler(async (req: any, res: any) => {
  const userId = req.user.id;
  
  const stats = await dataModeService.getDataStats(userId);
  
  res.json({
    success: true,
    data: stats
  });
}));

// Reset completo dos dados (apenas para admins)
router.delete('/reset-all', asyncHandler(async (req: any, res: any) => {
  const userId = req.user.id;
  const user = req.user;
  
  // Verificar se é admin (você pode ajustar esta lógica)
  if (user.email !== 'admin@willfinance.com') {
    return res.status(403).json({
      success: false,
      message: 'Acesso negado. Apenas administradores podem resetar dados.'
    });
  }
  
  try {
    // Reset completo (cuidado!)
    await Promise.all([
      dataModeService.clearFictionalData(userId),
      // Adicionar outras limpezas se necessário
    ]);
    
    res.json({
      success: true,
      message: 'Dados resetados com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao resetar dados'
    });
  }
}));

export default router;
