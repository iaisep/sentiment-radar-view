import { useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { MetricsPanel } from '@/components/dashboard/MetricsPanel';
import { DashboardGrid } from '@/components/dashboard/DashboardGrid';
import { SentimentLegend } from '@/components/dashboard/SentimentLegend';
import { CasesTable } from '@/components/dashboard/CasesTable';
import { SupabaseConfig } from '@/components/dashboard/SupabaseConfig';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useSupabaseConnection } from '@/hooks/useSupabaseConnection';
import { Interaction } from '@/types/dashboard';
import { useToast } from '@/hooks/use-toast';
import { Settings, Database, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { config, isConnected, updateConfig } = useSupabaseConnection();
  const { interactions, metrics, isLoading, refreshData } = useDashboardData(config);
  const { toast } = useToast();
  const [selectedInteraction, setSelectedInteraction] = useState<string | null>(null);
  const [showConfig, setShowConfig] = useState(!isConnected);

  const handleInteractionClick = (interaction: Interaction) => {
    setSelectedInteraction(interaction.id);
    toast({
      title: `Ticket ${interaction.ticketId}`,
      description: `${interaction.sentiment.toUpperCase()} - Prioridad ${interaction.priority} - ${interaction.aiHandled ? 'IA' : 'Humano'}`,
    });
    
    // Scroll a la tabla de casos
    setTimeout(() => {
      const casesSection = document.getElementById('cases-table');
      if (casesSection) {
        casesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleCaseClick = (interaction: Interaction) => {
    setSelectedInteraction(interaction.id);
    toast({
      title: `Revisando caso ${interaction.ticketId}`,
      description: `Abriendo detalles del caso para resolución...`,
    });
    
    // Aquí se puede implementar la navegación a una página de detalles
    // Por ahora solo mostramos un toast
    console.log('Navegando a detalles del caso:', interaction);
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
          <p className="text-muted-foreground">
            {isConnected ? 'Cargando datos desde Supabase...' : 'Cargando dashboard...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dashboard p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              Dashboard IA
              {isConnected && <Database className="w-6 h-6 text-green-500" />}
            </h1>
            <p className="text-muted-foreground">
              Monitoreo en tiempo real de tickets y chats
              {isConnected ? ' - Conectado a Supabase' : ' - Datos simulados'}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowConfig(!showConfig)}
            >
              <Settings className="w-4 h-4 mr-2" />
              {showConfig ? 'Ocultar Config' : 'Configuración'}
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          </div>
        </div>

        {showConfig && (
          <div className="mb-6">
            <SupabaseConfig onConfigChange={updateConfig} />
          </div>
        )}
        
        <MetricsPanel metrics={metrics} />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
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

        <div id="cases-table">
          <CasesTable 
            interactions={interactions}
            onCaseClick={handleCaseClick}
            selectedCase={selectedInteraction}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
