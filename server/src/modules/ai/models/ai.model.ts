/**
 * Modelos de dados para integração de IA
 */
export interface Insight {
  id: string;
  type: 'prediction' | 'suggestion' | 'classification';
  message: string;
  score?: number;
  metadata?: Record<string, unknown>;
}

export interface AIRequest {
  prompt: string;
  context?: Record<string, unknown>;
}

export interface AIResponse {
  insights: Insight[];
  createdAt: Date;
}
