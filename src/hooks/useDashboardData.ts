import { useState, useEffect } from 'react';
import { Interaction, DashboardMetrics, SentimentType, PriorityLevel, InteractionStatus } from '@/types/dashboard';

// Simulated data generation (to be replaced with NocoDB integration)
const generateMockInteraction = (id: string): Interaction => {
  const sentiments: SentimentType[] = ['positive', 'neutral', 'warning', 'negative'];
  const priorities: PriorityLevel[] = ['low', 'medium', 'high', 'critical'];
  const statuses: InteractionStatus[] = ['active', 'pending', 'completed', 'escalated'];
  const channels = ['chat', 'email', 'phone', 'web'] as const;

  const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
  const priority = priorities[Math.floor(Math.random() * priorities.length)];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const completed = Math.random() > 0.7; // 30% completion rate
  const aiHandled = Math.random() > 0.3; // 70% AI handled
  const requiresHuman = !aiHandled || (sentiment === 'negative' && priority === 'critical');

  return {
    id,
    sentiment,
    priority,
    status: completed ? 'completed' : status,
    timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
    aiHandled,
    requiresHuman,
    completed,
    ticketId: `TKT-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
    userId: `USR-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    lastActivity: new Date(Date.now() - Math.random() * 2 * 60 * 60 * 1000),
    duration: Math.floor(Math.random() * 120) + 5,
    channel: channels[Math.floor(Math.random() * channels.length)]
  };
};

const calculateMetrics = (interactions: Interaction[]): DashboardMetrics => {
  const totalInteractions = interactions.length;
  const aiHandled = interactions.filter(i => i.aiHandled).length;
  const humanRequired = interactions.filter(i => i.requiresHuman && !i.completed).length;
  const completed = interactions.filter(i => i.completed).length;
  
  const sentimentBreakdown = interactions.reduce((acc, interaction) => {
    acc[interaction.sentiment] = (acc[interaction.sentiment] || 0) + 1;
    return acc;
  }, {} as Record<SentimentType, number>);

  const priorityBreakdown = interactions.reduce((acc, interaction) => {
    acc[interaction.priority] = (acc[interaction.priority] || 0) + 1;
    return acc;
  }, {} as Record<PriorityLevel, number>);

  return {
    totalInteractions,
    aiHandled,
    humanRequired,
    completed,
    averageResponseTime: Math.floor(Math.random() * 30) + 15, // 15-45 minutes
    sentimentBreakdown: {
      positive: 0,
      neutral: 0,
      warning: 0,
      negative: 0,
      ...sentimentBreakdown
    },
    priorityBreakdown: {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
      ...priorityBreakdown
    }
  };
};

export function useDashboardData() {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial data load
    const loadInitialData = () => {
      const mockInteractions = Array.from({ length: 250 }, (_, i) => 
        generateMockInteraction(`interaction-${i}`)
      );
      
      setInteractions(mockInteractions);
      setMetrics(calculateMetrics(mockInteractions));
      setIsLoading(false);
    };

    // Simulate loading delay
    const timer = setTimeout(loadInitialData, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Simulate real-time updates every 10 seconds
    const interval = setInterval(() => {
      if (interactions.length > 0) {
        // Randomly update some interactions
        const updatedInteractions = interactions.map(interaction => {
          if (Math.random() > 0.95) { // 5% chance of update
            return {
              ...interaction,
              lastActivity: new Date(),
              completed: interaction.completed || Math.random() > 0.8
            };
          }
          return interaction;
        });

        // Occasionally add new interactions
        if (Math.random() > 0.7) {
          const newInteraction = generateMockInteraction(`interaction-${Date.now()}`);
          updatedInteractions.push(newInteraction);
        }

        setInteractions(updatedInteractions);
        setMetrics(calculateMetrics(updatedInteractions));
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [interactions]);

  return {
    interactions,
    metrics,
    isLoading,
    // Future: Methods to integrate with NocoDB
    refreshData: () => {
      setIsLoading(true);
      // This will be replaced with actual NocoDB API calls
      setTimeout(() => {
        const newData = Array.from({ length: 250 }, (_, i) => 
          generateMockInteraction(`refresh-${i}`)
        );
        setInteractions(newData);
        setMetrics(calculateMetrics(newData));
        setIsLoading(false);
      }, 500);
    }
  };
}