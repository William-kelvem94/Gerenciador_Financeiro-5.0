/**
 * Logger enterprise para auditoria e debug
 */
export const logger = {
  info: (msg: string, ctx?: any) => {
    console.info(`[INFO] ${msg}`, ctx);
  },
  warn: (msg: string, ctx?: any) => {
    console.warn(`[WARN] ${msg}`, ctx);
  },
  error: (msg: string, ctx?: any) => {
    console.error(`[ERROR] ${msg}`, ctx);
  },
  debug: (msg: string, ctx?: any) => {
    console.debug(`[DEBUG] ${msg}`, ctx);
  },
};
