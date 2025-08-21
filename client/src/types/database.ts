export interface DatabaseConnection {
  url: string;
  status: 'connected' | 'disconnected' | 'error';
  lastChecked: string;
}
