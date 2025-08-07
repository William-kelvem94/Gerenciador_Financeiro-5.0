/* eslint-disable no-console */
// Simple logger implementation
interface Logger {
  info: (_message: string, _meta?: Record<string, unknown>) => void;
  error: (_message: string, _meta?: Record<string, unknown>) => void;
  warn: (_message: string, _meta?: Record<string, unknown>) => void;
  debug: (_message: string, _meta?: Record<string, unknown>) => void;
}

export const logger: Logger = {
  info: (message: string, meta?: Record<string, unknown>) => {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
    console.log(`[${timestamp}] INFO: ${message}${metaStr}`);
  },

  error: (message: string, meta?: Record<string, unknown>) => {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
    console.error(`[${timestamp}] ERROR: ${message}${metaStr}`);
  },

  warn: (message: string, meta?: Record<string, unknown>) => {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
    console.warn(`[${timestamp}] WARN: ${message}${metaStr}`);
  },

  debug: (message: string, meta?: Record<string, unknown>) => {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
    console.debug(`[${timestamp}] DEBUG: ${message}${metaStr}`);
  },
};
