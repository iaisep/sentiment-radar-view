export type SentimentType = 'positive' | 'neutral' | 'warning' | 'negative';

export type PriorityLevel = 'low' | 'medium' | 'high' | 'critical';

export type InteractionStatus = 'active' | 'pending' | 'completed' | 'escalated';

export interface Interaction {
  id: string;
  sentiment: SentimentType;
  priority: PriorityLevel;
  status: InteractionStatus;
  timestamp: Date;
  aiHandled: boolean;
  requiresHuman: boolean;
  completed: boolean;
  ticketId: string;
  userId: string;
  lastActivity: Date;
  duration: number; // in minutes
  channel: 'chat' | 'email' | 'phone' | 'web';
}

export interface DashboardMetrics {
  totalInteractions: number;
  aiHandled: number;
  humanRequired: number;
  completed: number;
  averageResponseTime: number;
  sentimentBreakdown: Record<SentimentType, number>;
  priorityBreakdown: Record<PriorityLevel, number>;
}