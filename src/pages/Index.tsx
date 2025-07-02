import { useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { MetricsPanel } from '@/components/dashboard/MetricsPanel';
import { DashboardGrid } from '@/components/dashboard/DashboardGrid';
import { SentimentLegend } from '@/components/dashboard/SentimentLegend';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Interaction } from '@/types/dashboard';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { interactions, metrics, isLoading, refreshData } = useDashboardData();
  const { toast } = useToast();
  const [selectedInteraction, setSelectedInteraction] = useState<Interaction | null>(null);

  const handleInteractionClick = (interaction: Interaction) => {
    setSelectedInteraction(interaction);
    toast({
      title: `Ticket ${interaction.ticketId}`,
      description: `${interaction.sentiment.toUpperCase()} - Prioridad ${interaction.priority} - ${interaction.aiHandled ? 'IA' : 'Humano'}`,
    });
  };

  const handleRefresh = () => {
    refreshData();
    toast({
      title: "Dashboard actualizado",
      description: "Los datos se han actualizado correctamente",
    });
  };

  if (isLoading || !metrics) {
    return (
      <div className="min-h-screen bg-gradient-dashboard flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dashboard p-6">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader 
          onRefresh={handleRefresh}
          isLoading={isLoading}
          lastUpdated={new Date()}
        />
        
        <MetricsPanel metrics={metrics} />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <DashboardGrid 
              interactions={interactions}
              onInteractionClick={handleInteractionClick}
            />
          </div>
          
          <div className="lg:col-span-1">
            <SentimentLegend metrics={metrics} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
