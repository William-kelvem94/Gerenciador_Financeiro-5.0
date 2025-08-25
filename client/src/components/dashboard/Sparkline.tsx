import React from 'react';

type SparkProps = { points: number[]; width?: number; height?: number; color?: string };

export const Sparkline: React.FC<SparkProps> = ({ points, width = 140, height = 40, color = 'var(--cyber-primary)' }) => {
  if (!points || points.length === 0) return null;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const step = width / (points.length - 1);
  const pts = points.map((p, i) => `${i * step},${height - ((p - min) / range) * height}`).join(' ');
  const lastIndex = points.length - 1;
  const last = points[lastIndex] ?? points[0] ?? 0;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" opacity={0.95} />
      <circle cx={(points.length - 1) * step} cy={height - ((last - min) / range) * height} r={3} fill={color} />
    </svg>
  );
};

export default Sparkline;
