import { memo, useMemo, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

// --- Types & Helpers ---

const DashboardSchema = z.object({
    balance: z.number(),
    income: z.number(),
    expense: z.number(),
    goals: z.array(z.object({
        name: z.string(),
        progress: z.number(),
    })).optional(),
    alerts: z.array(z.string()).optional(),
    suggestions: z.array(z.string()).optional(),
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

// Card KPI
interface CardProps {
    title: string;
    value: string;
    color: string;
}
const Card = memo<CardProps>(({ title, value, color }) => (
    <motion.div
        className={`bg-background-secondary rounded-xl p-6 shadow-lg flex flex-col items-center border-2 neon-glow ${color}`}
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 300 }}
    >
        <span className="text-sm font-medium text-muted-foreground mb-2">{title}</span>
        <span className={`text-2xl font-bold drop-shadow-neon`}>{value}</span>
    </motion.div>
));
Card.displayName = 'Card';

export const DashboardPage = memo(() => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const { data } = useQuery({
        queryKey: ['dashboard'],
        queryFn: () => fetchDashboard(),
    });

    // KPIs
    const kpiData = useMemo(() => {
        if (!data) return [];
        return [
            {
                title: 'Saldo',
                value: formatCurrency(data.balance),
                color: 'border-cyber-primary text-cyber-primary',
            },
            {
                title: 'Receita',
                value: formatCurrency(data.income),
                color: 'border-cyber-success text-cyber-success',
            },
            {
                title: 'Despesa',
                value: formatCurrency(data.expense),
                color: 'border-cyber-danger text-cyber-danger',
            },
        ];
    }, [data]);

    // Gráfico
    useEffect(() => {
        if (chartRef.current && data) {
            const chartData = {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                    {
                        label: 'Receita',
                        data: [data.income, data.income * 0.9, data.income * 1.1, data.income * 1.05, data.income * 0.95, data.income],
                        borderColor: '#00ffe7',
                        backgroundColor: 'rgba(0,255,231,0.1)',
                        tension: 0.4,
                    },
                    {
                        label: 'Despesa',
                        data: [data.expense, data.expense * 1.1, data.expense * 0.95, data.expense * 1.05, data.expense * 0.9, data.expense],
                        borderColor: '#ff005c',
                        backgroundColor: 'rgba(255,0,92,0.1)',
                        tension: 0.4,
                    },
                ],
            };
            new Chart(chartRef.current, {
                type: 'line',
                data: chartData,
                options: {
                    plugins: {
                        legend: {
                            labels: {
                                color: '#00ffe7',
                                font: { size: 14 },
                            },
                        },
                    },
                    scales: {
                        x: {
                            ticks: { color: '#fff' },
                            grid: { color: '#333' },
                        },
                        y: {
                            ticks: { color: '#fff' },
                            grid: { color: '#333' },
                        },
                    },
                    responsive: true,
                },
            });
        }
    }, [data]);

    // Alertas e Sugestões
    const alerts = data?.alerts ?? [
        'Você está próximo do limite de despesas este mês.',
        'Meta "Viagem" está 80% concluída.',
        'Receita acima da média nos últimos 3 meses.',
    ];
    const suggestions = data?.suggestions ?? [
        'Considere investir parte do saldo em renda fixa.',
        'Reduza gastos com alimentação para bater a meta.',
        'Automatize pagamentos recorrentes.',
    ];

    // Metas
    const goals = data?.goals ?? [
        { name: 'Viagem', progress: 80 },
        { name: 'Reserva de Emergência', progress: 45 },
    ];

    return (
        <motion.div
            className="flex flex-col items-center w-full py-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
        >
            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl mb-8">
                {kpiData.map((kpi) => (
                    <Card key={kpi.title} {...kpi} />
                ))}
            </div>

            {/* Gráfico */}
            <div className="w-full max-w-3xl bg-background-secondary rounded-2xl p-8 shadow-xl border-2 border-cyber-primary neon-glow mb-8">
                <h2 className="text-xl font-bold text-cyber-primary mb-2">Gráfico de Tendências</h2>
                <p className="text-muted-foreground mb-4">Visualize suas receitas e despesas ao longo do tempo.</p>
                <canvas ref={chartRef} className="w-full h-64" />
            </div>

            {/* Metas */}
            <div className="w-full max-w-3xl bg-background-secondary rounded-2xl p-8 shadow-xl border-2 border-cyber-success neon-glow mb-8">
                <h2 className="text-xl font-bold text-cyber-success mb-2">Metas</h2>
                <ul className="list-disc ml-4 text-muted-foreground">
                    {goals.map((goal) => (
                        <li key={goal.name}>
                            <span className="font-semibold text-cyber-primary">{goal.name}</span> — <span>{goal.progress}% concluída</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Alertas e Sugestões */}
            <motion.div
                className="w-full max-w-4xl flex flex-col md:flex-row gap-6"
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
            >
                <div className="flex-1 bg-background-secondary rounded-xl p-6 shadow-lg border-2 border-cyber-danger neon-glow">
                    <h3 className="text-lg font-bold text-cyber-danger mb-2">Alertas Inteligentes</h3>
                    <ul className="list-disc ml-4 text-muted-foreground">
                        {alerts.map((alert, idx) => (
                            <li key={idx}>{alert}</li>
                        ))}
                    </ul>
                </div>
                <div className="flex-1 bg-background-secondary rounded-xl p-6 shadow-lg border-2 border-cyber-success neon-glow">
                    <h3 className="text-lg font-bold text-cyber-success mb-2">Sugestões de IA</h3>
                    <ul className="list-disc ml-4 text-muted-foreground">
                        {suggestions.map((suggestion, idx) => (
                            <li key={idx}>{suggestion}</li>
                        ))}
                    </ul>
                </div>
            </motion.div>
        </motion.div>
    );
});

DashboardPage.displayName = 'DashboardPage';

export default DashboardPage;
