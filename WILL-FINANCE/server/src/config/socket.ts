import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { logger } from '@/utils/logger';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  username?: string;
}

interface TransactionData {
  id: string;
  amount: number;
  description: string;
  type: string;
}

interface BudgetData {
  id: string;
  name: string;
  amount: number;
  spent: number;
}

interface AIInsightData {
  id: string;
  title: string;
  description: string;
  type: string;
}

interface GoalData {
  id: string;
  name: string;
  progress: number;
  target: number;
}

interface ChatMessage {
  message: string;
  timestamp: Date;
}

export const setupSocketIO = (io: Server) => {
  // Authentication middleware for Socket.IO
  io.use(async (socket: Socket, next) => {
    try {
      const token = socket.handshake.auth.token ?? socket.handshake.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return next(new Error('Authentication token required'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; username: string };
      (socket as AuthenticatedSocket).userId = decoded.userId;
      (socket as AuthenticatedSocket).username = decoded.username;
      
      logger.info(`Socket authenticated for user: ${decoded.username}`);
      next();
    } catch (error) {
      logger.error('Socket authentication error:', error);
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const authSocket = socket as AuthenticatedSocket;
    logger.info(`User connected: ${authSocket.username} (${authSocket.userId})`);

    // Join user to their personal room
    socket.join(`user_${authSocket.userId}`);

    // Handle real-time events
    socket.on('transaction_created', (data: TransactionData) => {
      // Broadcast to user's room
      socket.to(`user_${authSocket.userId}`).emit('transaction_update', data);
    });

    socket.on('budget_alert', (data: BudgetData) => {
      socket.to(`user_${authSocket.userId}`).emit('budget_notification', data);
    });

    socket.on('ai_insight', (data: AIInsightData) => {
      socket.to(`user_${authSocket.userId}`).emit('new_ai_insight', data);
    });

    socket.on('goal_progress', (data: GoalData) => {
      socket.to(`user_${authSocket.userId}`).emit('goal_update', data);
    });

    // Handle chat messages (if implementing chat support)
    socket.on('chat_message', (data: ChatMessage) => {
      // Broadcast to support team or handle chat logic
      socket.to('support_team').emit('user_message', {
        userId: authSocket.userId,
        username: authSocket.username,
        message: data.message,
        timestamp: new Date(),
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${authSocket.username} (${authSocket.userId})`);
    });

    // Handle errors
    socket.on('error', (error: Error) => {
      logger.error(`Socket error for user ${authSocket.username}:`, error);
    });
  });

  // Utility functions for emitting events
  return {
    emitToUser: (userId: string, event: string, data: unknown) => {
      io.to(`user_${userId}`).emit(event, data);
    },

    emitToAll: (event: string, data: any) => {
      io.emit(event, data);
    },

    emitToRoom: (room: string, event: string, data: any) => {
      io.to(room).emit(event, data);
    },
  };
};
