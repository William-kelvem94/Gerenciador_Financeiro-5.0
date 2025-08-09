/**
 * Template de notificação (mensagem, email, push)
 */
export function buildNotificationTemplate(type: 'email' | 'push', message: string): string {
  if (type === 'email') {
    return `<h1>Notificação</h1><p>${message}</p>`;
  }
  return `🔔 ${message}`;
}
