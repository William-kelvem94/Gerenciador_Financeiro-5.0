import React from 'react';

type Props = { revenue: number; expenses: number; size?: number };

export const RevenueChart: React.FC<Props> = ({ revenue, expenses, size = 140 }) => {
  const total = Math.max(1, revenue + expenses);
  const revPct = Math.round((revenue / total) * 100);
  const expPct = 100 - revPct;
  const radius = (size / 2) - 8;
  const circumference = 2 * Math.PI * radius;
  const revDash = (revPct / 100) * circumference;
  return (
    <div className="revenue-chart" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g transform={`translate(${size / 2}, ${size / 2})`}>
          <circle r={radius} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={14} />
          <circle r={radius} fill="none" stroke="var(--cyber-primary)" strokeWidth={14} strokeDasharray={`${revDash} ${circumference - revDash}`} strokeLinecap="round" transform="rotate(-90)" />
          <circle r={radius} fill="none" stroke="var(--cyber-secondary)" strokeWidth={14} strokeDasharray={`${circumference - revDash} ${revDash}`} strokeLinecap="round" transform={`rotate(${-90 + (revPct/100)*360})`} opacity={0.3} />
        </g>
      </svg>
      <div className="revenue-center">
        <div className="revenue-amount">R$ {revenue.toLocaleString('pt-BR')}</div>
        <div className="revenue-sub">+{revPct}% / -{expPct}%</div>
      </div>
    </div>
  );
};

export default RevenueChart;
