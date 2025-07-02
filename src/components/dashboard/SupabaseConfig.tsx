
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Eye, EyeOff, Database, Save, TestTube } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SupabaseConfigProps {
  onConfigChange: (config: SupabaseConfig | null) => void;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  serviceKey?: string;
}

export function SupabaseConfig({ onConfigChange }: SupabaseConfigProps) {
  const [config, setConfig] = useState<SupabaseConfig>({
    url: '',
    anonKey: '',
    serviceKey: ''
  });
  const [showKeys, setShowKeys] = useState(false);
  const [testing, setTesting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Cargar configuración guardada
    const savedConfig = localStorage.getItem('supabase-config');
    if (savedConfig) {
      const parsed = JSON.parse(savedConfig);
      setConfig(parsed);
      onConfigChange(parsed);
    }
  }, [onConfigChange]);

  const handleSave = () => {
    if (!config.url || !config.anonKey) {
      toast({
        title: "Error",
        description: "URL y Anon Key son requeridos",
        variant: "destructive"
      });
      return;
    }

    localStorage.setItem('supabase-config', JSON.stringify(config));
    onConfigChange(config);
    toast({
      title: "Configuración guardada",
      description: "La configuración de Supabase se ha guardado correctamente"
    });
  };

  const handleTest = async () => {
    if (!config.url || !config.anonKey) {
      toast({
        title: "Error",
        description: "Completa la configuración antes de probar",
        variant: "destructive"
      });
      return;
    }

    setTesting(true);
    try {
      const response = await fetch(`${config.url}/rest/v1/`, {
        headers: {
          'apikey': config.anonKey,
          'Authorization': `Bearer ${config.anonKey}`
        }
      });

      if (response.ok) {
        toast({
          title: "Conexión exitosa",
          description: "La conexión a Supabase funciona correctamente"
        });
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      toast({
        title: "Error de conexión",
        description: "No se pudo conectar a Supabase. Verifica la configuración.",
        variant: "destructive"
      });
    } finally {
      setTesting(false);
    }
  };

  const handleClear = () => {
    localStorage.removeItem('supabase-config');
    setConfig({ url: '', anonKey: '', serviceKey: '' });
    onConfigChange(null);
    toast({
      title: "Configuración limpiada",
      description: "Se ha eliminado la configuración de Supabase"
    });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Database className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Configuración Supabase Self-Hosted</h3>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="supabase-url">URL de Supabase *</Label>
          <Input
            id="supabase-url"
            placeholder="https://tu-supabase-instance.com"
            value={config.url}
            onChange={(e) => setConfig({ ...config, url: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="anon-key">Anon Key *</Label>
          <div className="relative">
            <Input
              id="anon-key"
              type={showKeys ? "text" : "password"}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={config.anonKey}
              onChange={(e) => setConfig({ ...config, anonKey: e.target.value })}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() => setShowKeys(!showKeys)}
            >
              {showKeys ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <div>
          <Label htmlFor="service-key">Service Key (Opcional)</Label>
          <Input
            id="service-key"
            type={showKeys ? "text" : "password"}
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            value={config.serviceKey}
            onChange={(e) => setConfig({ ...config, serviceKey: e.target.value })}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Solo necesario para operaciones administrativas
          </p>
        </div>

        <div className="flex gap-2 pt-4">
          <Button onClick={handleSave} className="flex-1">
            <Save className="w-4 h-4 mr-2" />
            Guardar
          </Button>
          <Button 
            onClick={handleTest} 
            variant="outline" 
            disabled={testing}
            className="flex-1"
          >
            <TestTube className={`w-4 h-4 mr-2 ${testing ? 'animate-spin' : ''}`} />
            Probar
          </Button>
          <Button onClick={handleClear} variant="destructive">
            Limpiar
          </Button>
        </div>
      </div>
    </Card>
  );
}
