
import { useState, useEffect } from 'react';
import { SupabaseConfig } from '@/components/dashboard/SupabaseConfig';

export function useSupabaseConnection() {
  const [config, setConfig] = useState<SupabaseConfig | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Cargar configuración al inicio solo una vez
    const savedConfig = localStorage.getItem('supabase-config');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        setConfig(parsed);
        setIsConnected(true);
        console.log('Configuración de Supabase cargada desde localStorage');
      } catch (error) {
        console.error('Error parsing saved config:', error);
        localStorage.removeItem('supabase-config');
      }
    }
  }, []); // Array vacío para ejecutar solo una vez

  const updateConfig = (newConfig: SupabaseConfig | null) => {
    setConfig(newConfig);
    setIsConnected(!!newConfig);
    
    if (newConfig) {
      localStorage.setItem('supabase-config', JSON.stringify(newConfig));
      console.log('Configuración de Supabase guardada');
    } else {
      localStorage.removeItem('supabase-config');
      console.log('Configuración de Supabase eliminada');
    }
  };

  return {
    config,
    isConnected,
    updateConfig
  };
}
