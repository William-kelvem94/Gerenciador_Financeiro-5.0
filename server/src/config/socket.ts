// Socket.IO temporary disabled for Docker build
// TODO: Add socket.io dependency to package.json when needed
// import { Server as SocketIOServer, Socket } from 'socket.io';

// Configuração do Socket.IO
// export function setupSocketIO(io: SocketIOServer): void {
//   // Implemente a configuração real aqui
//   io.on('connection', (socket: Socket) => {
//     // Novo cliente conectado - logging removido para production
//     socket.on('disconnect', () => {
//       // Cliente desconectado
//     });
//   });
// }
