declare module 'react-chartjs-2' {
  export const Bar: any;
  export const Pie: any;
  export const Line: any;
  export const Doughnut: any;
}

declare module 'chart.js' {
  export const Chart: any;
  export const CategoryScale: any;
  export const LinearScale: any;
  export const BarElement: any;
  export const Title: any;
  export const Tooltip: any;
  export const Legend: any;
  export const ArcElement: any;
}

// Extensão para Express Request no backend
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
      };
    }
  }
}

export {};
