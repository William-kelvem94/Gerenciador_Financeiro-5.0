import { memo, useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

// 1. Props Schema (future extensibility)
const DashboardPagePropsSchema = z.object({
    userId: z.string().uuid().optional(),
});
type DashboardPageProps = z.infer<typeof DashboardPagePropsSchema>;

// 2. Main Component
export const DashboardPage = memo((props: DashboardPageProps) => {
    // 3. Validate props
    const validatedProps = useMemo(() => DashboardPagePropsSchema.parse(props), [props]);

    // 4. Local state
    const [error, setError] = useState<string | null>(null);

    // 5. Server state (fetch dashboard data)
    const {
        data: dashboard,
        isLoading,
        error: serverError,
        refetch,
    } = useQuery({
        queryKey: ['dashboard', validatedProps.userId],
        queryFn: () => fetchDashboard(validatedProps.userId),
        enabled: !!validatedProps.userId,
        staleTime: 5 * 60 * 1000,
        retry: 2,
    });

    // 6. Error effect
    useEffect(() => {
        if (serverError) {
            setError(serverError.message);
            toast.error(`Erro ao carregar dashboard: ${serverError.message}`);
        }
    }, [serverError]);

    // 7. Loading state
    if (isLoading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center min-h-screen bg-background-primary"
            >
                <div className="animate-pulse text-cyber-primary">Carregando dashboard...</div>
            </motion.div>
        );
    }

    // 8. Error state
    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 bg-red-500/10 border border-red-500/20 rounded-lg max-w-md mx-auto mt-16"
            >
                <p className="text-red-400">{error}</p>
                <button
                    onClick={() => {
                        setError(null);
                        refetch();
                    }}
                    className="mt-4 btn btn-primary"
                >
                    Tentar Novamente
                </button>
            </motion.div>
        );
    }

    // 9. Main render
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="container mx-auto py-12 min-h-screen bg-background-primary"
            data-testid="dashboard-page"
        >
            <header className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-cyber-primary mb-2 text-glow">Dashboard</h2>
                <p className="text-muted-foreground text-lg">Resumo financeiro e métricas principais</p>
            </header>

            <main>
                {dashboard ? (
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        <Card
                            title="Saldo Atual"
                            value={formatCurrency(dashboard.balance)}
                            variant="primary"
                        />
                        <Card
                            title="Receitas"
                            value={formatCurrency(dashboard.income)}
                            variant="success"
                        />
                        <Card
                            title="Despesas"
                            value={formatCurrency(dashboard.expense)}
                            variant="danger"
                        />
                    </section>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground mb-4">Nenhum dado disponível.</p>
                    </div>
                )}

                {/* Placeholder for charts and widgets */}
                <section className="mt-8">
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Gráfico de tendências</h3>
                            <p className="card-description">Visualize suas receitas e despesas ao longo do tempo.</p>
                        </div>
                        <div className="card-content">
                            {/* TODO: Integrar componente Chart.js/D3.js */}
                            <div className="h-64 flex items-center justify-center text-muted-foreground">
                                [Gráfico de tendências aqui]
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </motion.div>
    );
});

DashboardPage.displayName = 'DashboardPage';

export default DashboardPage;

// --- Types & Helpers ---

const DashboardSchema = z.object({
    balance: z.number(),
    income: z.number(),
    expense: z.number(),
    // Add more fields as needed
});
type DashboardData = z.infer<typeof DashboardSchema>;

async function fetchDashboard(userId?: string): Promise<DashboardData> {
    const url = userId ? `/api/dashboard?userId=${userId}` : '/api/dashboard';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Falha ao buscar dados do dashboard');
    const data = await res.json();
    return DashboardSchema.parse(data);
}

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

// Card component for metrics
interface CardProps {
    title: string;
    value: string;
    variant?: 'primary' | 'success' | 'danger';
}
const Card = memo<CardProps>(({ title, value, variant = 'primary' }) => (
    <div
        className={`
            card
            ${variant === 'primary' ? 'bg-cyber-primary/10 border-cyber-primary' : ''}
            ${variant === 'success' ? 'bg-cyber-success/10 border-cyber-success' : ''}
            ${variant === 'danger' ? 'bg-cyber-danger/10 border-cyber-danger' : ''}
            shadow-lg
        `}
    >
        <div className="card-header">
            <h4 className="card-title text-xl font-semibold text-cyber-primary">{title}</h4>
        </div>
        <div className="card-content text-2xl font-bold text-glow">{value}</div>
    </div>
));
Card.displayName = 'Card';
