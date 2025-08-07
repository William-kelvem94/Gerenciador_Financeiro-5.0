/**
 * 🔧 Express Types Extension - Will Finance 5.0
 * 
 * Extensões de tipos para o Express
 */

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: string;
      };
    }
  }
}

export {};
