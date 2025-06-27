import { Server } from 'socket.io';

let ioInstance;

export function setupRealtime(server) {
  ioInstance = new Server(server, { cors: { origin: '*' } });
  ioInstance.on('connection', (socket) => {
    // Exemplo: notificar sobre nova transação
    socket.on('subscribe', (room) => {
      socket.join(room);
    });
  });
}

export function emitRealtimeEvent(event, data) {
  if (ioInstance) {
    ioInstance.emit(event, data);
  }
}
