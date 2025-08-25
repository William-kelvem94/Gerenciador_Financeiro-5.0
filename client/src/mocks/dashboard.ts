import type { IconName } from '../icons/iconRegistry';

export type Metric = {
  id: string;
  icon: IconName;
  title: string;
  value: string;
  description: string;
  color?: string;
};

export const mockDashboardData: Metric[] = [
  { id: 'm1', icon: 'DollarSign', title: 'Saldo Atual', value: 'R$ 12.500,00', description: 'Total de receitas do mês', color: 'text-cyber-success' },
  { id: 'm2', icon: 'TrendingUp', title: 'Receitas do Mês', value: 'R$ 8.000,00', description: 'Total de receitas do mês', color: 'text-cyber-success' },
  { id: 'm3', icon: 'TrendingDown', title: 'Despesas do Mês', value: 'R$ 5.500,00', description: 'Total de despesas do mês', color: 'text-cyber-danger' },
  { id: 'm4', icon: 'FileText', title: 'Orçamentos Ativos', value: '3', description: 'Orçamentos ativos', color: 'text-cyber-accent' },
];

export async function fetchDashboardData(delay = 600): Promise<Metric[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockDashboardData), delay);
  });
}
