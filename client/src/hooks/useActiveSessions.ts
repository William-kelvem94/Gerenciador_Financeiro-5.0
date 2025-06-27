import { useState, useEffect } from 'react';

export interface ActiveSession {
  id: string;
  deviceName: string;
  deviceType: string;
  browser: string;
  location: string;
  ip: string;
  lastActivity: string;
  isCurrent: boolean;
  isActive: boolean;
}

export function useActiveSessions() {
  const [sessions, setSessions] = useState<ActiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token não encontrado');

      const response = await fetch('/api/auth/sessions', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar sessões');
      }

      const data = await response.json();
      setSessions(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const terminateSession = async (sessionId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token não encontrado');

      const response = await fetch(`/api/auth/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao encerrar sessão');
      }

      // Atualizar lista de sessões
      await fetchSessions();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erro ao encerrar sessão');
    }
  };

  const terminateAllOtherSessions = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token não encontrado');

      const response = await fetch('/api/auth/sessions/terminate-others', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao encerrar outras sessões');
      }

      // Atualizar lista de sessões
      await fetchSessions();
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erro ao encerrar outras sessões');
    }
  };

  useEffect(() => {
    fetchSessions();

    // Atualizar sessões a cada 30 segundos
    const interval = setInterval(fetchSessions, 30000);
    return () => clearInterval(interval);
  }, []);

  return {
    sessions,
    loading,
    error,
    refreshSessions: fetchSessions,
    terminateSession,
    terminateAllOtherSessions,
  };
}
