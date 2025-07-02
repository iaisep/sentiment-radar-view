import { Card } from '@/components/ui/card';
import { DashboardMetrics } from '@/types/dashboard';

interface MetricsPanelProps {
  metrics: DashboardMetrics;
}

export function MetricsPanel({ metrics }: MetricsPanelProps) {
  const aiEfficiency = Math.round((metrics.aiHandled / metrics.totalInteractions) * 100);
  const completionRate = Math.round((metrics.completed / metrics.totalInteractions) * 100);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="p-4 bg-gradient-card border-border">
        <div className="text-sm text-muted-foreground">Total</div>
        <div className="text-2xl font-bold text-foreground">{metrics.totalInteractions}</div>
        <div className="text-xs text-muted-foreground">Interacciones</div>
      </Card>

      <Card className="p-4 bg-gradient-card border-border">
        <div className="text-sm text-muted-foreground">IA Manejadas</div>
        <div className="text-2xl font-bold text-sentiment-positive">{metrics.aiHandled}</div>
        <div className="text-xs text-sentiment-positive">{aiEfficiency}% eficiencia</div>
      </Card>

      <Card className="p-4 bg-gradient-card border-border">
        <div className="text-sm text-muted-foreground">Requiere Humano</div>
        <div className="text-2xl font-bold text-sentiment-warning">{metrics.humanRequired}</div>
        <div className="text-xs text-muted-foreground">Pendientes</div>
      </Card>

      <Card className="p-4 bg-gradient-card border-border">
        <div className="text-sm text-muted-foreground">Completadas</div>
        <div className="text-2xl font-bold text-sentiment-neutral">{metrics.completed}</div>
        <div className="text-xs text-sentiment-neutral">{completionRate}% tasa</div>
      </Card>
    </div>
  );
}