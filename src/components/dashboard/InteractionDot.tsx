import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Interaction, SentimentType, PriorityLevel } from '@/types/dashboard';

interface InteractionDotProps {
  interaction: Interaction;
  onClick?: (interaction: Interaction) => void;
}

const getSentimentColor = (sentiment: SentimentType, priority: PriorityLevel) => {
  const intensity = priority === 'critical' ? '' : priority === 'high' ? '-light' : '-light';
  
  switch (sentiment) {
    case 'positive':
      return `bg-sentiment-positive${intensity}`;
    case 'neutral':
      return `bg-sentiment-neutral${intensity}`;
    case 'warning':
      return `bg-sentiment-warning${intensity}`;
    case 'negative':
      return `bg-sentiment-negative${intensity}`;
    default:
      return 'bg-muted';
  }
};

const getPriorityOpacity = (priority: PriorityLevel) => {
  switch (priority) {
    case 'critical':
      return 'opacity-100';
    case 'high':
      return 'opacity-90';
    case 'medium':
      return 'opacity-70';
    case 'low':
      return 'opacity-50';
    default:
      return 'opacity-50';
  }
};

const getStatusRing = (interaction: Interaction) => {
  if (interaction.requiresHuman && !interaction.completed) {
    return 'ring-2 ring-destructive ring-opacity-60';
  }
  if (interaction.status === 'escalated') {
    return 'ring-2 ring-warning ring-opacity-60';
  }
  return '';
};

export function InteractionDot({ interaction, onClick }: InteractionDotProps) {
  const baseClasses = cn(
    'relative w-8 h-8 rounded-full cursor-pointer transition-all duration-300 hover:scale-110',
    'flex items-center justify-center',
    getSentimentColor(interaction.sentiment, interaction.priority),
    getPriorityOpacity(interaction.priority),
    getStatusRing(interaction),
    'hover:shadow-glow'
  );

  return (
    <div
      className={baseClasses}
      onClick={() => onClick?.(interaction)}
      title={`${interaction.ticketId} - ${interaction.sentiment} - ${interaction.priority} priority`}
    >
      {interaction.completed && (
        <Check className="w-4 h-4 text-background font-bold" />
      )}
      
      {/* Pulsing animation for active high-priority items */}
      {interaction.status === 'active' && interaction.priority === 'critical' && !interaction.completed && (
        <div className="absolute inset-0 rounded-full animate-ping opacity-30 bg-current"></div>
      )}
    </div>
  );
}