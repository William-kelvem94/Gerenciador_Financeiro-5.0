import React, { useMemo, useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { z } from "zod";

// Validação dos parâmetros
const budgetParamsSchema = z.object({
    userId: z.string().uuid().optional(),
});

// Helpers
function formatAmount(amount) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(amount);
}

function formatPeriod(period) {
    switch (period) {
        case "monthly":
            return "Mensal";
        case "yearly":
            return "Anual";
        case "weekly":
            return "Semanal";
        default:
            return "";
    }
}

// Mock API
async function fetchBudgets(userId) {
    // Substitua por chamada real à API
    return [
        {
            id: "1e2d3c4b-5a6f-7e8d-9c0b-1a2b3c4d5e6f",
            name: "Orçamento Exemplo",
            amount: 500,
            period: "monthly",
            description: "Orçamento de exemplo",
        },
    ];
}

async function createBudget(data) {
    // Substitua por chamada real à API
    return {
        id: "2e2d3c4b-5a6f-7e8d-9c0b-1a2b3c4d5e6f",
        ...data,
    };
}

function showSuccess(msg) {
    alert(msg);
}

function showError(msg) {
    alert(msg);
}

const BudgetsPage = React.memo((props) => {
    const params = useMemo(() => budgetParamsSchema.parse(props), [props]);
    const [errorMsg, setErrorMsg] = useState(null);

    const {
        data,
        error,
        isPending,
        refetch,
    } = useQuery({
        queryKey: ["budgets", params.userId],
        queryFn: () => fetchBudgets(params.userId),
        retry: 2,
        onError: (err) => {
            showError(`Erro: ${err.message}`);
            setErrorMsg(err.message);
        },
    });

    const { mutate } = useMutation({
        mutationFn: createBudget,
        onSuccess: () => {
            showSuccess("Orçamento criado com sucesso!");
            refetch();
        },
        onError: (err) => {
            showError(`Erro: ${err.message}`);
            setErrorMsg(err.message);
        },
    });

    const budgets =
        data?.map((b) => ({
            ...b,
            formattedAmount: formatAmount(b.amount),
            formattedPeriod: formatPeriod(b.period),
        })) ?? [];

    useEffect(() => {
        if (error) {
            setErrorMsg(error.message);
            showError(`Erro ao carregar orçamentos: ${error.message}`);
        }
    }, [error]);

    if (errorMsg)
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 bg-red-500/10 border border-red-500/20 rounded-lg max-w-md mx-auto mt-16"
            >
                <p className="text-red-400">{errorMsg}</p>
                <button
                    onClick={() => {
                        setErrorMsg(null);
                        refetch();
                    }}
                    className="mt-4 btn btn-primary"
                >
                    Tentar Novamente
                </button>
            </motion.div>
        );

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
                <h2 className="text-3xl font-bold text-cyber-primary mb-2 text-glow">
                    Orçamentos
                </h2>
                <p className="text-muted-foreground text-lg">
                    Controle e análise de orçamentos
                </p>
            </header>
            <main>
                {budgets.length > 0 ? (
                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {budgets.map((b) => (
                            <motion.li
                                key={b.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                                className="card glass"
                            >
                                <div className="card-header">
                                    <span className="card-title">{b.name}</span>
                                    <span className="card-description">{b.description}</span>
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="font-mono text-cyber-accent text-lg">
                                        {b.formattedAmount}
                                    </span>
                                    <span className="text-muted-foreground">
                                        {b.formattedPeriod}
                                    </span>
                                </div>
                                <div className="mt-4 flex gap-2">
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => showSuccess("Editar orçamento (em breve)")}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="btn btn-ghost"
                                        onClick={() => showSuccess("Excluir orçamento (em breve)")}
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </motion.li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground mb-4">
                            Nenhum orçamento cadastrado.
                        </p>
                        <button
                            className="btn btn-primary"
                            disabled={isPending}
                            onClick={() =>
                                mutate({
                                    name: "Novo Orçamento",
                                    amount: 0,
                                    period: "monthly",
                                })
                            }
                        >
                            {isPending ? "Criando..." : "Criar Orçamento"}
                        </button>
                    </div>
                )}
            </main>
        </motion.div>
    );
});

BudgetsPage.displayName = "BudgetsPage";
export default BudgetsPage;
