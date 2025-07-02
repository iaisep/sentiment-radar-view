import { Button } from '@/components/ui/button';
import { RefreshCw, Filter, Settings } from 'lucide-react';

interface DashboardHeaderProps {
  onRefresh?: () => void;
  isLoading?: boolean;
  lastUpdated?: Date;
}

export function DashboardHeader({ onRefresh, isLoading, lastUpdated }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard IA</h1>
        <p className="text-muted-foreground">
          Monitoreo en tiempo real de tickets y chats
          {lastUpdated && (
            <span className="ml-2 text-xs">
              Actualizado: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
        
        <Button variant="outline" size="sm">
          <Filter className="w-4 h-4 mr-2" />
          Filtros
        </Button>
        
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Config
        </Button>
      </div>
    </div>
  );
}