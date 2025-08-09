/**
 * Helper enterprise para respostas padronizadas de API
 */
export class ResponseHelper {
  static success<T>(data: T, message?: string, meta?: any) {
    return {
      success: true,
      data,
      message,
      meta,
      timestamp: new Date().toISOString(),
      requestId: ResponseHelper.generateRequestId(),
    };
  }

  static error(code: string, message: string, details?: string[], field?: string) {
    return {
      success: false,
      error: {
        code,
        message,
        details,
        field,
      },
      timestamp: new Date().toISOString(),
      requestId: ResponseHelper.generateRequestId(),
    };
  }

  private static generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
