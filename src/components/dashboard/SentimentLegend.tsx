import { DashboardMetrics } from '@/types/dashboard';

interface SentimentLegendProps {
  metrics: DashboardMetrics;
}

export function SentimentLegend({ metrics }: SentimentLegendProps) {
  const legendItems = [
    { 
      sentiment: 'positive', 
      label: 'Positivo', 
      color: 'bg-sentiment-positive',
      count: metrics.sentimentBreakdown.positive,
      percentage: Math.round((metrics.sentimentBreakdown.positive / metrics.totalInteractions) * 100)
    },
    { 
      sentiment: 'neutral', 
      label: 'Neutral', 
      color: 'bg-sentiment-neutral',
      count: metrics.sentimentBreakdown.neutral,
      percentage: Math.round((metrics.sentimentBreakdown.neutral / metrics.totalInteractions) * 100)
    },
    { 
      sentiment: 'warning', 
      label: 'Consulta', 
      color: 'bg-sentiment-warning',
      count: metrics.sentimentBreakdown.warning,
      percentage: Math.round((metrics.sentimentBreakdown.warning / metrics.totalInteractions) * 100)
    },
    { 
      sentiment: 'negative', 
      label: 'Problema', 
      color: 'bg-sentiment-negative',
      count: metrics.sentimentBreakdown.negative,
      percentage: Math.round((metrics.sentimentBreakdown.negative / metrics.totalInteractions) * 100)
    }
  ];

  return (
    <div className="bg-gradient-card rounded-lg border p-4">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Distribución de Sentimientos</h3>
      <div className="grid grid-cols-2 gap-4">
        {legendItems.map((item) => (
          <div key={item.sentiment} className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
            <div className="flex-1">
              <div className="text-sm font-medium text-foreground">{item.label}</div>
              <div className="text-xs text-muted-foreground">
                {item.count} ({item.percentage}%)
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-border">
        <div className="text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Intensidad del color = Prioridad</span>
            <span>✓ = Completado</span>
          </div>
        </div>
      </div>
    </div>
  );
}