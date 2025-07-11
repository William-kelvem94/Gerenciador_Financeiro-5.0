import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface PieChartComponentProps {
  data: Array<{
    name: string;
    value: number;
    color?: string;
  }>;
  title?: string;
  height?: number;
  showLegend?: boolean;
}

const COLORS = ['#00D4AA', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA726', '#AB47BC', '#26A69A'];

const PieChartComponent: React.FC<PieChartComponentProps> = ({
  data,
  title,
  height = 300,
  showLegend = true
}) => {
  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-cyber-blue">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color || COLORS[index % COLORS.length]} 
              />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{
              backgroundColor: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: '8px',
              color: '#fff'
            }}
          />
          {showLegend && (
            <Legend 
              wrapperStyle={{ color: '#fff' }}
            />
          )}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartComponent;