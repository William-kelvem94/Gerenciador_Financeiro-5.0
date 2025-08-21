export function trackEvent(event: string, data?: Record<string, any>) {
  // Integrar com sistema de analytics (ex: Google Analytics, custom)
  console.log(`[Analytics] Evento: ${event}`, data);
}
