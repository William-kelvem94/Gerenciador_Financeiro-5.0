import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';

class SocketService {
  private socket: Socket | null = null;

  connect() {
    if (this.socket?.connected) return;

    const authStore = useAuthStore.getState();
    const token = authStore.accessToken;

    if (!token) {
      console.warn('No authentication token available for socket connection');
      return;
    }

    this.socket = io(import.meta.env.VITE_API_URL || window.location.origin, {
      auth: {
        token
      },
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('🔌 Socket.IO connected');
      if (authStore.user?.id) {
        this.socket?.emit('join-user-room', authStore.user.id);
      }
    });

    this.socket.on('disconnect', () => {
      console.log('🔌 Socket.IO disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('🔌 Socket.IO connection error:', error);
    });

    // Listen for real-time notifications
    this.socket.on('notification', (data) => {
      console.log('📨 New notification:', data);
      // TODO: Trigger notification toast or update notifications store
    });

    this.socket.on('transaction-updated', (data) => {
      console.log('💳 Transaction updated:', data);
      // TODO: Update transactions store
    });

    this.socket.on('budget-alert', (data) => {
      console.log('💰 Budget alert:', data);
      // TODO: Show budget alert notification
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emit(event: string, data: any) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket not connected. Cannot emit event:', event);
    }
  }

  on(event: string, callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  off(event: string, callback?: (data: any) => void) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }
}

export const socketService = new SocketService();
