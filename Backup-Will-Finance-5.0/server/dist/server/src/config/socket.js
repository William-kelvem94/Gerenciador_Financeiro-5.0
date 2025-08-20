"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocketIO = setupSocketIO;
function setupSocketIO(io) {
    io.on('connection', (socket) => {
        console.log('Novo cliente conectado ao Socket.IO');
    });
}
//# sourceMappingURL=socket.js.map