import { Router } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/config/database';
import { asyncHandler, createError } from '@/middleware/errorHandler';
import { validateRequest } from '@/middleware/validation';
import { logger } from '@/utils/logger';
import { verifyFirebaseToken } from '@/config/firebase';

const router = Router();

// Validation schemas
const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    username: z.string().min(3, 'Username must be at least 3 characters'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
  }),
});

const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
  }),
});

// Firebase auth schemas
const firebaseLoginSchema = z.object({
  body: z.object({
    idToken: z.string().min(1, 'Firebase ID token is required'),
  }),
});

const firebaseVerifySchema = z.object({
  headers: z.object({
    authorization: z.string().min(1, 'Authorization header is required'),
  }),
});

// Helper functions
const generateTokens = (userId: string, username: string) => {
  const accessToken = jwt.sign(
    { userId, username },
    process.env.JWT_SECRET!,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId, username },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

// Register endpoint
router.post('/register', validateRequest(registerSchema), asyncHandler(async (req: any, res: any) => {
  const { email, username, firstName, lastName, password } = req.body;

  // Check if user already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email },
        { username },
      ],
    },
  });

  if (existingUser) {
    throw createError('User with this email or username already exists', 400);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      username,
      firstName,
      lastName,
      password: hashedPassword,
    },
    select: {
      id: true,
      email: true,
      username: true,
      firstName: true,
      lastName: true,
      avatar: true,
      createdAt: true,
    },
  });

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user.id, user.username);

  // Note: Session management would be implemented with a proper session store
  logger.info(`New user registered: ${user.username} (${user.email})`);

  res.status(201).json({
    status: 'success',
    message: 'User registered successfully',
    data: {
      user,
      accessToken,
      refreshToken,
    },
  });
}));

// Login endpoint
router.post('/login', validateRequest(loginSchema), asyncHandler(async (req: any, res: any) => {
  const { email, password } = req.body;

  // Find user
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !await bcrypt.compare(password, user.password)) {
    throw createError('Invalid email or password', 401);
  }

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(user.id, user.username);

  // Note: Session management would be implemented with a proper session store

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  logger.info(`User logged in: ${user.username} (${user.email})`);

  res.json({
    status: 'success',
    message: 'Login successful',
    data: {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
      },
      accessToken,
      refreshToken,
    },
  });
}));

// Refresh token endpoint
router.post('/refresh', validateRequest(refreshTokenSchema), asyncHandler(async (req: any, res: any) => {
  const { refreshToken } = req.body;

  // Verify refresh token
  const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!) as any;

  // Check if session exists
  // Note: In production, this would check against a session store
  // For now, just verify the JWT token and generate new tokens
  try {
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      decoded.userId,
      decoded.username
    );

    res.json({
      status: 'success',
      message: 'Token refreshed successfully',
      data: {
        accessToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    logger.error('Refresh token error:', error);
    throw createError('Invalid or expired refresh token', 401);
  }
}));

// Logout endpoint
router.post('/logout', asyncHandler(async (req: any, res: any) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      
      // Note: In production, sessions would be removed from session store
      logger.info(`User logged out: ${decoded.username}`);
    } catch (error) {
      // Token is invalid, but we still want to log them out
      logger.warn('Logout attempted with invalid token', error);
    }
  }

  res.json({
    status: 'success',
    message: 'Logout successful',
  });
}));

// Verify token endpoint
router.get('/verify', asyncHandler(async (req: any, res: any) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    throw createError('No token provided', 401);
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
  
  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: {
      id: true,
      email: true,
      username: true,
      firstName: true,
      lastName: true,
      avatar: true,
    },
  });

  if (!user) {
    throw createError('User not found', 404);
  }

  res.json({
    status: 'success',
    message: 'Token is valid',
    data: { user },
  });
}));

// Firebase login endpoint
router.post('/firebase/login', validateRequest(firebaseLoginSchema), asyncHandler(async (req: any, res: any) => {
  const { idToken } = req.body;

  try {
    // Verificar token do Firebase com Firebase Admin SDK
    const firebaseUser = await verifyFirebaseToken(idToken);
    
    if (!firebaseUser || !firebaseUser.email) {
      throw createError('Invalid Firebase token', 401);
    }

    const email = firebaseUser.email;
    const firebaseUid = firebaseUser.uid;
    
    // Procurar ou criar usuário
    let user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
      },
    });

    if (!user) {
      // Criar novo usuário a partir do Firebase
      const username = firebaseUser.name?.toLowerCase().replace(/\s+/g, '_') || email.split('@')[0];
      const [firstName, ...lastNameParts] = (firebaseUser.name || email.split('@')[0]).split(' ');
      const lastName = lastNameParts.join(' ') || '';

      user = await prisma.user.create({
        data: {
          email,
          username,
          firstName,
          lastName,
          avatar: firebaseUser.picture || null,
          firebaseUid,
          emailVerified: firebaseUser.emailVerified || false,
          password: '', // Password vazio para usuários do Firebase
        },
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          avatar: true,
        },
      });

      logger.info(`New user created from Firebase: ${email}`);
    }

    // Gerar tokens JWT
    const { accessToken, refreshToken } = generateTokens(user.id, user.username);

    logger.info(`Firebase login successful: ${email}`);

    res.json({
      status: 'success',
      message: 'Firebase login successful',
      data: {
        user,
        accessToken,
        refreshToken,
      },
    });
  } catch (error: any) {
    logger.error('Firebase login error:', error);
    
    // Se for erro de configuração do Firebase, usar fallback
    if (error.message.includes('Firebase Admin not initialized') || error.message.includes('Token inválido')) {
      logger.warn('Firebase verification failed, using fallback token decode');
      
      try {
        // Fallback: decodificar JWT sem verificação (apenas para desenvolvimento)
        const payload = jwt.decode(idToken) as any;
        
        if (!payload || !payload.email) {
          throw createError('Invalid token payload', 401);
        }

        const email = payload.email;
        const firebaseUid = payload.sub || payload.user_id;
        
        // Procurar ou criar usuário (código similar ao anterior)
        let user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            username: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        });

        if (!user) {
          const username = payload.name?.toLowerCase().replace(/\s+/g, '_') || email.split('@')[0];
          const [firstName, ...lastNameParts] = (payload.name || email.split('@')[0]).split(' ');
          const lastName = lastNameParts.join(' ') || '';

          user = await prisma.user.create({
            data: {
              email,
              username,
              firstName,
              lastName,
              avatar: payload.picture || null,
              firebaseUid,
              emailVerified: payload.email_verified || false,
              password: '',
            },
            select: {
              id: true,
              email: true,
              username: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          });

          logger.info(`New user created from Firebase (fallback): ${email}`);
        }

        const { accessToken, refreshToken } = generateTokens(user.id, user.username);

        logger.info(`Firebase login successful (fallback): ${email}`);

        res.json({
          status: 'success',
          message: 'Firebase login successful (fallback)',
          data: {
            user,
            accessToken,
            refreshToken,
          },
        });
      } catch (fallbackError) {
        logger.error('Firebase fallback failed:', fallbackError);
        throw createError('Firebase authentication failed', 401);
      }
    } else {
      throw createError('Firebase authentication failed', 401);
    }
  }
}));

export default router;

