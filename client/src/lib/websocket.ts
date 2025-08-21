import { io, Socket } from 'socket.io-client';

// @ts-ignore
const SOCKET_URL = (import.meta as any).env?.VITE_SOCKET_URL || 'http://localhost:8080';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: true,
    });
  }
  return socket;
}
