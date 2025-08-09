// TransactionsPage.tsx
import React, { useEffect } from "react";
import { useQuery } from "./useQuery-NbZskVYw.js";
import { object as zObject, string as zString, number as zNumber, array as zArray } from "zod";
import { create } from "zustand";
import axios from "axios";

// Zod Schemas
const transactionSchema = zObject({
    id: zString(),
    amount: zNumber(),
    date: zString(),
    description: zString(),
    category: zString(),
});
const transactionsResponseSchema = zObject({
    transactions: zArray(transactionSchema),
});

// Zustand Store
const useTransactionsStore = create((set) => ({
    transactions: [],
    setTransactions: (txs) => set({ transactions: txs }),
    isModalOpen: false,
    openModal: () => set({ isModalOpen: true }),
    closeModal: () => set({ isModalOpen: false }),
}));

// API Service
async function fetchTransactions() {
    const res = await axios.get("/api/transactions");
    return transactionsResponseSchema.parse(res.data);
}

// Table Component
// Table Component
const TransactionsTable = ({ transactions }) => (
    <table className="min-w-full bg-white rounded shadow">
        <thead>
            <tr>
                <th className="px-4 py-2">Data</th>
                <th className="px-4 py-2">Descrição</th>
                <th className="px-4 py-2">Categoria</th>
                <th className="px-4 py-2">Valor</th>
            </tr>
        </thead>
        <tbody>
            {transactions.map((tx) => (
                <tr key={tx.id}>
                    <td className="border px-4 py-2">{tx.date}</td>
                    <td className="border px-4 py-2">{tx.description}</td>
                    <td className="border px-4 py-2">{tx.category}</td>
                    <td className="border px-4 py-2">R$ {tx.amount.toFixed(2)}</td>
                </tr>
            ))}
        </tbody>
    </table>
);
// Modal Component
const TransactionModal = ({ onClose }) => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">Nova Transação</h3>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    // TODO: Implementar lógica de criação de transação
                    onClose();
                }}
            >
                <input className="w-full mb-2 p-2 border rounded" placeholder="Descrição" required />
                <input className="w-full mb-2 p-2 border rounded" placeholder="Valor" type="number" required />
                <input className="w-full mb-2 p-2 border rounded" placeholder="Categoria" required />
                <button className="w-full bg-cyber-primary text-white py-2 rounded mt-2" type="submit">
                    Salvar
                </button>
            </form>
        </div>
    </div>
);
// Main Page Component
const TransactionsPage = () => {
    const {
        data,
        error,
        isLoading,
    } = useQuery({
        queryKey: ["transactions"],
        queryFn: fetchTransactions,
        staleTime: 60_000,
    });

    useEffect(() => {
        if (data) setTransactions(data.transactions);
    }, [data, setTransactions]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background-primary px-4">
            <h2 className="text-2xl font-bold text-cyber-primary mb-4">Transações</h2>
            <p className="text-muted-foreground mb-6">Lista e gestão de transações financeiras</p>
            <button
                className="mb-4 px-4 py-2 bg-cyber-primary text-white rounded hover:bg-cyber-secondary transition"
                onClick={openModal}
            >
                Nova Transação
            </button>
            {isLoading && <span className="text-cyber-primary">Carregando...</span>}
            {error && (
                <span className="text-red-500">
                    Erro ao carregar transações: {error instanceof Error ? error.message : "Erro inesperado"}
                </span>
            )}
            <TransactionsTable transactions={transactions} />
            {isModalOpen && <TransactionModal onClose={closeModal} />}
        </div>
    );
};

export default TransactionsPage;
