import { useEffect, useState, useCallback } from 'react';
import type { Metric } from '../mocks/dashboard';
import { fetchDashboardData } from '../mocks/dashboard';

export default function useDashboardData() {
  const [data, setData] = useState<Metric[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchDashboardData();
      setData(res);
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refresh: load } as const;
}
