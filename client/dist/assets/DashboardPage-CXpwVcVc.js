// src/pages/dashboardPage.tsx
import React, { useRef, useEffect, memo } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import Chart from "chart.js/auto";
import { z } from "zod";

// Zod schema para validação dos dados recebidos
const dashboardSchema = z.object({
    summaryCards: z.array(
        z.object({
            label: z.string(),
            value: z.string(),
            color: z.string(),
        })
    ),
    chartData: z.object({
        labels: z.array(z.string()),
        datasets: z.array(
            z.object({
                label: z.string(),
                data: z.array(z.number()),
                borderColor: z.string(),
                backgroundColor: z.string(),
                tension: z.number(),
            })
        ),
    }),
    alerts: z.array(z.string()),
    suggestions: z.array(z.string()),
});

const fetchDashboard = async () => {
    const res = await fetch("/api/dashboard/summary");
    const json = await res.json();
    return dashboardSchema.parse(json.data);
};

const chartOptions = {
    plugins: {
        legend: {
            labels: { color: "#00ffe7", font: { size: 14 } },
        },
    },
    scales: {
        x: { ticks: { color: "#fff" }, grid: { color: "#222" } },
        y: { ticks: { color: "#fff" }, grid: { color: "#222" } },
    },
};

const DashboardPage = memo(() => {
    const chartRef = useRef<HTMLCanvasElement>(null);
const DashboardPage = memo(() => {
    const chartRef = useRef(null);
    const { data, isLoading, error } = useQuery({
        queryKey: ["dashboard"],
        queryFn: fetchDashboard,
    });
        if (data && chartRef.current) {
            new Chart(chartRef.current, {
                type: "line",
                data: data.chartData,
                options: chartOptions,
            });
        }
    }, [data]);

    if (isLoading) return <div>Carregando...</div>;
    if (error) return <div>Erro ao carregar dados.</div>;

    return (
        <motion.div
            className="min-h-screen bg-background-primary flex flex-col items-center py-8 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            data-testid="dashboard-page"
        >
            <h1 className="text-4xl font-extrabold text-cyber-primary mb-2 tracking-wide drop-shadow-neon">
                Dashboard
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
                Resumo financeiro e métricas principais
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl mb-8">
                {data.summaryCards.map((card) => (
                    <motion.div
                        key={card.label}
                        className="bg-background-secondary rounded-xl p-6 shadow-lg flex flex-col items-center border-2 border-cyber-primary neon-glow"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <span className="text-sm font-medium text-muted-foreground mb-2">
                            {card.label}
                        </span>
                        <span className={`text-2xl font-bold ${card.color} drop-shadow-neon`}>
                            {card.value}
                        </span>
                    </motion.div>
                ))}
            </div>
            <div className="w-full max-w-3xl bg-background-secondary rounded-2xl p-8 shadow-xl border-2 border-cyber-primary neon-glow mb-8">
                <h2 className="text-xl font-bold text-cyber-primary mb-2">Gráfico de Tendências</h2>
                <p className="text-muted-foreground mb-4">
                    Visualize suas receitas e despesas ao longo do tempo.
                </p>
                <canvas ref={chartRef} className="w-full h-64" />
            </div>
            <motion.div
                className="w-full max-w-4xl flex flex-col md:flex-row gap-6"
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
            >
                <div className="flex-1 bg-background-secondary rounded-xl p-6 shadow-lg border-2 border-cyber-primary neon-glow">
                    <h3 className="text-lg font-bold text-cyber-primary mb-2">Alertas Inteligentes</h3>
                    <ul className="list-disc ml-4 text-muted-foreground">
                        {data.alerts.map((alert, i) => <li key={i}>{alert}</li>)}
                    </ul>
                </div>
                <div className="flex-1 bg-background-secondary rounded-xl p-6 shadow-lg border-2 border-cyber-primary neon-glow">
                    <h3 className="text-lg font-bold text-cyber-primary mb-2">Sugestões de IA</h3>
                    <ul className="list-disc ml-4 text-muted-foreground">
                        {data.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                </div>
            </motion.div>
        </motion.div>
    );
});

DashboardPage.displayName = "DashboardPage";
export default DashboardPage;
