import { Interaction } from '@/types/dashboard';
import { InteractionDot } from './InteractionDot';

interface DashboardGridProps {
  interactions: Interaction[];
  onInteractionClick?: (interaction: Interaction) => void;
}

export function DashboardGrid({ interactions, onInteractionClick }: DashboardGridProps) {
  // Create a grid layout with proper spacing
  const gridCols = Math.ceil(Math.sqrt(interactions.length));
  const gridRows = Math.ceil(interactions.length / gridCols);

  return (
    <div className="w-full h-full p-6 bg-gradient-card rounded-lg border shadow-card">
      <div 
        className="grid gap-3 h-full"
        style={{
          gridTemplateColumns: `repeat(${Math.min(gridCols, 20)}, 1fr)`,
          gridTemplateRows: `repeat(${Math.min(gridRows, 15)}, 1fr)`
        }}
      >
        {interactions.map((interaction) => (
          <div 
            key={interaction.id} 
            className="flex items-center justify-center"
          >
            <InteractionDot 
              interaction={interaction} 
              onClick={onInteractionClick}
            />
          </div>
        ))}
      </div>
    </div>
  );
}