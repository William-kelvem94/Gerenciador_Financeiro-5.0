/**
 * Sistema de autenticação robusto para dados reais
 */

import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/config/database';
import { authenticateToken } from '@/middleware/auth';
import { asyncHandler } from '@/middleware/errorHandler';

const router = Router();

// Admin padrão
const ADMIN_CREDENTIALS = {
  email: 'admin@willfinance.com',
  password: 'admin123',
  role: 'ADMIN'
};

// Registrar usuário
router.post('/register', asyncHandler(async (req: any, res: any) => {
  const { email, password, firstName, lastName, username } = req.body;

  // Validações
  if (!email || !password || !firstName || !lastName || !username) {
    return res.status(400).json({
      success: false,
      message: 'Todos os campos são obrigatórios'
    });
  }

  // Verificar se usuário já existe
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email },
        { username }
      ]
    }
  });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'Email ou username já cadastrado'
    });
  }

  // Hash da senha
  const hashedPassword = await bcrypt.hash(password, 12);

  // Criar usuário
  const user = await prisma.user.create({
    data: {
      email,
      username,
      firstName,
      lastName,
      password: hashedPassword,
      emailVerified: false,
      lastLoginAt: new Date()
    }
  });

  // Gerar token
  const token = jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.email === ADMIN_CREDENTIALS.email ? 'ADMIN' : 'USER' 
    },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: '7d' }
  );

  res.json({
    success: true,
    message: 'Usuário criado com sucesso',
    data: {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.email === ADMIN_CREDENTIALS.email ? 'ADMIN' : 'USER'
      },
      token
    }
  });
}));

// Login
router.post('/login', asyncHandler(async (req: any, res: any) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email e senha são obrigatórios'
    });
  }

  // Verificar se é admin
  if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    // Criar ou buscar usuário admin
    let adminUser = await prisma.user.findUnique({
      where: { email: ADMIN_CREDENTIALS.email }
    });

    if (!adminUser) {
      adminUser = await prisma.user.create({
        data: {
          email: ADMIN_CREDENTIALS.email,
          username: 'admin',
          firstName: 'Admin',
          lastName: 'System',
          password: await bcrypt.hash(ADMIN_CREDENTIALS.password, 12),
          emailVerified: true,
          lastLoginAt: new Date()
        }
      });
    } else {
      // Atualizar último login
      await prisma.user.update({
        where: { id: adminUser.id },
        data: { lastLoginAt: new Date() }
      });
    }

    const token = jwt.sign(
      { 
        id: adminUser.id, 
        email: adminUser.email, 
        role: 'ADMIN'
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      message: 'Login admin realizado com sucesso',
      data: {
        user: {
          id: adminUser.id,
          email: adminUser.email,
          username: adminUser.username,
          firstName: adminUser.firstName,
          lastName: adminUser.lastName,
          role: 'ADMIN'
        },
        token
      }
    });
  }

  // Login normal
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Email ou senha incorretos'
    });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({
      success: false,
      message: 'Email ou senha incorretos'
    });
  }

  // Atualizar último login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() }
  });

  const token = jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.email === ADMIN_CREDENTIALS.email ? 'ADMIN' : 'USER'
    },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: '7d' }
  );

  res.json({
    success: true,
    message: 'Login realizado com sucesso',
    data: {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.email === ADMIN_CREDENTIALS.email ? 'ADMIN' : 'USER'
      },
      token
    }
  });
}));

// Verificar token
router.get('/verify', authenticateToken, asyncHandler(async (req: any, res: any) => {
  const userId = req.user.id;
  
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      username: true,
      firstName: true,
      lastName: true,
      avatar: true,
      lastLoginAt: true,
      emailVerified: true
    }
  });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido'
    });
  }

  res.json({
    success: true,
    data: {
      user: {
        ...user,
        role: user.email === ADMIN_CREDENTIALS.email ? 'ADMIN' : 'USER'
      }
    }
  });
}));

// Listar todos os usuários (apenas admin)
router.get('/users', authenticateToken, asyncHandler(async (req: any, res: any) => {
  const userEmail = req.user.email;
  
  if (userEmail !== ADMIN_CREDENTIALS.email) {
    return res.status(403).json({
      success: false,
      message: 'Acesso negado. Apenas administradores.'
    });
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      username: true,
      firstName: true,
      lastName: true,
      avatar: true,
      lastLoginAt: true,
      emailVerified: true,
      createdAt: true,
      _count: {
        select: {
          transactions: true,
          accounts: true,
          categories: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  res.json({
    success: true,
    data: {
      users: users.map(user => ({
        ...user,
        role: user.email === ADMIN_CREDENTIALS.email ? 'ADMIN' : 'USER'
      }))
    }
  });
}));

// Estatísticas do sistema (apenas admin)
router.get('/system-stats', authenticateToken, asyncHandler(async (req: any, res: any) => {
  const userEmail = req.user.email;
  
  if (userEmail !== ADMIN_CREDENTIALS.email) {
    return res.status(403).json({
      success: false,
      message: 'Acesso negado. Apenas administradores.'
    });
  }

  const [totalUsers, totalTransactions, totalAccounts, totalCategories] = await Promise.all([
    prisma.user.count(),
    prisma.transaction.count(),
    prisma.account.count(),
    prisma.category.count()
  ]);

  // Transações por usuário
  const transactionsByUser = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      _count: {
        select: {
          transactions: true
        }
      }
    }
  });

  res.json({
    success: true,
    data: {
      totalUsers,
      totalTransactions,
      totalAccounts,
      totalCategories,
      transactionsByUser: transactionsByUser.map(user => ({
        userId: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        transactionCount: user._count.transactions
      }))
    }
  });
}));

export default router;
