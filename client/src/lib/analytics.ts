export function logEvent(event: string, data?: Record<string, any>) {
  // Integrar com sistema de analytics
  console.log(`[Analytics] ${event}`, data);
}
