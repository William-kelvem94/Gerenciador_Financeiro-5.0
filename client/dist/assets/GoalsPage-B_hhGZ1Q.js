// GoalsPage.tsx

import React, { memo, useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { z } from "zod";

// Schemas
const goalsFilterSchema = z.object({
    userId: z.string().uuid().optional(),
});

const goalSchema = z.object({
    id: z.string(),
    title: z.string(),
    amount: z.number(),
    progress: z.number(),
    deadline: z.string().optional(),
    description: z.string().optional(),
});

// Helpers
function formatCurrency(value) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(value);
}

function formatDate(date) {
    return new Date(date).toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "short",
        day: "2-digit",
    });
}

// Mock API
async function fetchGoals(userId) {
    // TODO: Replace with real API call
    return [
        {
            id: "1",
            title: "Meta Exemplo",
            amount: 1000,
            progress: 50,
            deadline: new Date().toISOString(),
            description: "Meta de exemplo",
        },
    ];
}

async function createGoal(data) {
    // TODO: Replace with real API call
    return {
        id: "2",
        title: data.title ?? "",
        amount: data.amount ?? 0,
        progress: data.progress ?? 0,
        deadline: data.deadline ?? new Date().toISOString(),
        description: data.description ?? "",
    };
}

// Component
const GoalsPage = memo((props) => {
    const filter = useMemo(() => goalsFilterSchema.parse(props), [props]);
    const [errorMsg, setErrorMsg] = useState(null);

    const {
        data: goals,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ["goals", filter.userId],
        queryFn: () => fetchGoals(filter.userId),
        enabled: true,
        staleTime: 300_000,
        retry: 2,
    });

    const {
        mutate: createGoalMutation,
        isPending,
    } = useMutation({
        mutationFn: createGoal,
        onSuccess: () => {
            toast.success("Meta criada com sucesso!");
            refetch();
        },
        onError: (err) => {
            toast.error(`Erro: ${err.message}`);
            setErrorMsg(err.message);
        },
    });

    useEffect(() => {
        if (error) {
            setErrorMsg(error.message);
            toast.error(`Erro ao carregar metas: ${error.message}`);
        }
    }, [error]);

    if (isLoading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center min-h-screen"
            >
                <div className="animate-pulse text-cyber-primary">
                    Carregando metas...
                </div>
            </motion.div>
        );
    }

    if (errorMsg) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg m-8"
            >
                <p className="text-red-400">{errorMsg}</p>
                <button
                    onClick={() => {
                        setErrorMsg(null);
                        refetch();
                    }}
                    className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
                >
                    Tentar Novamente
                </button>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="container mx-auto py-12"
            data-testid="goals-page"
        >
            <header className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-cyber-primary mb-2">
                    Metas Financeiras
                </h2>
                <p className="text-muted-foreground">
                    Defina e acompanhe suas metas financeiras
                </p>
            </header>
            <main>
                {goals && goals.length > 0 ? (
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {goals.map((goal) => (
                            <motion.li
                                key={goal.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                                className="card shadow-lg"
                            >
                                <div className="card-header">
                                    <h4 className="card-title text-xl font-semibold text-cyber-primary">
                                        {goal.title}
                                    </h4>
                                    <span className="card-description">{goal.description}</span>
                                </div>
                                <div className="card-content flex flex-col gap-2">
                                    <span className="text-glow text-lg">
                                        Valor: {formatCurrency(goal.amount)}
                                    </span>
                                    <span className="text-muted-foreground">
                                        Prazo: {goal.deadline ? formatDate(goal.deadline) : "Sem prazo"}
                                    </span>
                                    <div className="w-full bg-background-tertiary rounded-full h-3 mt-2">
                                        <div
                                            className="bg-cyber-accent h-3 rounded-full"
                                            style={{ width: `${goal.progress}%` }}
                                        />
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        Progresso: {goal.progress}%
                                    </span>
                                </div>
                            </motion.li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground mb-4">
                            Nenhuma meta cadastrada.
                        </p>
                        <button
                            onClick={() =>
                                createGoalMutation({
                                    title: "Nova Meta",
                                    amount: 1000,
                                    progress: 0,
                                    description: "Exemplo de meta",
                                })
                            }
                            disabled={isPending}
                            className="btn btn-primary"
                        >
                            {isPending ? "Criando..." : "Criar Meta Exemplo"}
                        </button>
                    </div>
                )}
            </main>
        </motion.div>
    );
});

GoalsPage.displayName = "GoalsPage";
export default GoalsPage;
