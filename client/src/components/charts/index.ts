// Chart Components Export
export { default as BarChart } from './BarChart';
export { default as PieChart } from './PieChart';
export { default as LineChart } from './LineChart';

// Types
export interface ChartData {
  name: string;
  value: number;
  [key: string]: any;
}

export interface ChartProps {
  data: ChartData[];
  title?: string;
  height?: number;
  color?: string;
}