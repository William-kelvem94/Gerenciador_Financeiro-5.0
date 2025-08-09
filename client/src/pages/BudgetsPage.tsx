import { memo, useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

// 1. Props Schema (for future extensibility)
const BudgetsPagePropsSchema = z.object({
    userId: z.string().uuid().optional(),
});

type BudgetsPageProps = z.infer<typeof BudgetsPagePropsSchema>;

// 2. Main Component
const BudgetsPage = memo((props: BudgetsPageProps) => {
    // 3. Validate props
    const validatedProps = useMemo(() => BudgetsPagePropsSchema.parse(props), [props]);

    // 4. Local state
    const [error, setError] = useState<string | null>(null);

    // 5. Server state (fetch budgets)
    const {
        data: budgets,
        isLoading,
        error: serverError,
        refetch,
    } = useQuery({
        queryKey: ['budgets', validatedProps.userId],
        queryFn: () => fetchBudgets(validatedProps.userId),
        enabled: !!validatedProps.userId,
        staleTime: 5 * 60 * 1000,
        retry: 2,
    });

    // 6. Mutation (create budget)
    const { mutate: createBudget, isPending: isCreating } = useMutation({
        mutationFn: createBudgetApi,
        onSuccess: () => {
            toast.success('Orçamento criado com sucesso!');
            refetch();
        },
        onError: (err: any) => {
            toast.error(`Erro: ${err.message}`);
            setError(err.message);
        },
    });

    // 7. Memoized budgets
    const processedBudgets = useMemo(() => {
        if (!budgets) return [];
        return budgets.map((b: Budget) => ({
            ...b,
            formattedAmount: formatCurrency(b.amount),
            formattedPeriod: formatPeriod(b.period),
        }));
    }, [budgets]);

    // 8. Error effect
    useEffect(() => {
        if (serverError) {
            setError(serverError.message);
            toast.error(`Erro ao carregar orçamentos: ${serverError.message}`);
        }
    }, [serverError]);
    // 9. Loading state
    if (isLoading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center min-h-screen bg-background-primary"
            >
                <div className="animate-pulse text-cyber-primary">Carregando orçamentos...</div>
            </motion.div>
        );
    }

    // 10. Error state
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

    // 11. Main render
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="container mx-auto py-12 min-h-screen bg-background-primary"
            data-testid="budgets-page"
        >
            <header className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-cyber-primary mb-2 text-glow">Orçamentos</h2>
                <p className="text-muted-foreground text-lg">Controle e análise de orçamentos</p>
            </header>

            <main>
                {processedBudgets.length > 0 ? (
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {processedBudgets.map((budget) => (
                            <motion.li
                                key={budget.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                                className="card glass"
                            >
                                <div className="card-header">
                                    <span className="card-title">{budget.name}</span>
                                    <span className="card-description">{budget.description}</span>
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="font-mono text-cyber-accent text-lg">{budget.formattedAmount}</span>
                                    <span className="text-muted-foreground">{budget.formattedPeriod}</span>
                                </div>
                                <div className="mt-4 flex gap-2">
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => toast('Editar orçamento (em breve)')}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="btn btn-ghost"
                                        onClick={() => toast('Excluir orçamento (em breve)')}
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </motion.li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground mb-4">Nenhum orçamento cadastrado.</p>
                        <button
                            className="btn btn-primary"
                            disabled={isCreating}
                            onClick={() => createBudget({ name: 'Novo Orçamento', amount: 0, period: 'monthly' })}
                        >
                            {isCreating ? 'Criando...' : 'Criar Orçamento'}
                        </button>
                    </div>
                )}
            </main>
        </motion.div>
    );
});

BudgetsPage.displayName = 'BudgetsPage';

export default BudgetsPage;

// --- Types & Helpers ---

const BudgetSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1),
    description: z.string().optional(),
    amount: z.number().nonnegative(),
    period: z.enum(['monthly', 'yearly', 'weekly']),
});

type Budget = z.infer<typeof BudgetSchema>;

// Mock para dev
async function fetchBudgets(userId?: string): Promise<Budget[]> {
    return [
        {
            id: '1',
            name: 'Orçamento Exemplo',
            amount: 500,
            period: 'monthly',
            description: 'Orçamento de exemplo',
        },
    ];
}

async function createBudgetApi(data: Partial<Budget>): Promise<Budget> {
    return {
        id: '2',
        name: data.name ?? '',
        amount: data.amount ?? 0,
        period: data.period ?? 'monthly',
        description: data.description ?? '',
    };
}

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function formatPeriod(period: Budget['period']): string {
    switch (period) {
        case 'monthly':
            return 'Mensal';
        case 'yearly':
            return 'Anual';
        case 'weekly':
            return 'Semanal';
        default:
            return '';
    }
}
