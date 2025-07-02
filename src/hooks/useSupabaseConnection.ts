
import { useState, useEffect } from 'react';
import { SupabaseConfig } from '@/components/dashboard/SupabaseConfig';

export function useSupabaseConnection() {
  const [config, setConfig] = useState<SupabaseConfig | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Cargar configuración al inicio
    const savedConfig = localStorage.getItem('supabase-config');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        setConfig(parsed);
        setIsConnected(true);
      } catch (error) {
        console.error('Error parsing saved config:', error);
        localStorage.removeItem('supabase-config');
      }
    }
  }, []);

  const updateConfig = (newConfig: SupabaseConfig | null) => {
    setConfig(newConfig);
    setIsConnected(!!newConfig);
  };

  return {
    config,
    isConnected,
    updateConfig
  };
}
