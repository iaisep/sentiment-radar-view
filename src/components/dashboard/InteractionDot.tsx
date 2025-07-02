
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Interaction, SentimentType, PriorityLevel } from '@/types/dashboard';

interface InteractionDotProps {
  interaction: Interaction;
  onClick?: (interaction: Interaction) => void;
}

const getSentimentColor = (sentiment: SentimentType, priority: PriorityLevel) => {
  // Colores más oscuros y visibles para tema claro
  switch (sentiment) {
    case 'positive':
      return priority === 'critical' ? 'bg-green-600' : 
             priority === 'high' ? 'bg-green-500' : 'bg-green-400';
    case 'neutral':
      return priority === 'critical' ? 'bg-blue-600' : 
             priority === 'high' ? 'bg-blue-500' : 'bg-blue-400';
    case 'warning':
      return priority === 'critical' ? 'bg-orange-600' : 
             priority === 'high' ? 'bg-orange-500' : 'bg-orange-400';
    case 'negative':
      return priority === 'critical' ? 'bg-red-600' : 
             priority === 'high' ? 'bg-red-500' : 'bg-red-400';
    default:
      return 'bg-gray-400';
  }
};

const getPriorityOpacity = (priority: PriorityLevel) => {
  switch (priority) {
    case 'critical':
      return 'opacity-100';
    case 'high':
      return 'opacity-90';
    case 'medium':
      return 'opacity-75';
    case 'low':
      return 'opacity-60';
    default:
      return 'opacity-60';
  }
};

const getStatusRing = (interaction: Interaction) => {
  if (interaction.requiresHuman && !interaction.completed) {
    return 'ring-2 ring-red-500 ring-opacity-80';
  }
  if (interaction.status === 'escalated') {
    return 'ring-2 ring-orange-500 ring-opacity-80';
  }
  return '';
};

export function InteractionDot({ interaction, onClick }: InteractionDotProps) {
  const baseClasses = cn(
    'relative w-8 h-8 rounded-full cursor-pointer transition-all duration-300 hover:scale-110',
    'flex items-center justify-center border border-gray-200',
    getSentimentColor(interaction.sentiment, interaction.priority),
    getPriorityOpacity(interaction.priority),
    getStatusRing(interaction),
    'hover:shadow-lg'
  );

  return (
    <div
      className={baseClasses}
      onClick={() => onClick?.(interaction)}
      title={`${interaction.ticketId} - ${interaction.sentiment} - ${interaction.priority} priority`}
    >
      {interaction.completed && (
        <Check className="w-4 h-4 text-white font-bold drop-shadow" />
      )}
      
      {/* Pulsing animation for active high-priority items */}
      {interaction.status === 'active' && interaction.priority === 'critical' && !interaction.completed && (
        <div className="absolute inset-0 rounded-full animate-ping opacity-40 bg-current"></div>
      )}
    </div>
  );
}
