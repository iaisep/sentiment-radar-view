
import { useState, useEffect, useCallback, useRef } from 'react';
import { Interaction, DashboardMetrics, SentimentType, PriorityLevel, InteractionStatus } from '@/types/dashboard';
import { SupabaseService } from '@/services/supabaseService';
import { SupabaseConfig } from '@/components/dashboard/SupabaseConfig';

// Simulated data generation (to be replaced with NocoDB integration)
const generateMockInteraction = (id: string): Interaction => {
  const sentiments: SentimentType[] = ['positive', 'neutral', 'warning', 'negative'];
  const priorities: PriorityLevel[] = ['low', 'medium', 'high', 'critical'];
  const statuses: InteractionStatus[] = ['active', 'pending', 'completed', 'escalated'];
  const channels = ['chat', 'email', 'phone', 'web'] as const;

  const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
  const priority = priorities[Math.floor(Math.random() * priorities.length)];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const completed = Math.random() > 0.7; // 30% completion rate
  const aiHandled = Math.random() > 0.3; // 70% AI handled
  const requiresHuman = !aiHandled || (sentiment === 'negative' && priority === 'critical');

  return {
    id,
    sentiment,
    priority,
    status: completed ? 'completed' : status,
    timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
    aiHandled,
    requiresHuman,
    completed,
    ticketId: `TKT-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
    userId: `USR-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    lastActivity: new Date(Date.now() - Math.random() * 2 * 60 * 60 * 1000),
    duration: Math.floor(Math.random() * 120) + 5,
    channel: channels[Math.floor(Math.random() * channels.length)]
  };
};

const calculateMetrics = (interactions: Interaction[]): DashboardMetrics => {
  const totalInteractions = interactions.length;
  const aiHandled = interactions.filter(i => i.aiHandled).length;
  const humanRequired = interactions.filter(i => i.requiresHuman && !i.completed).length;
  const completed = interactions.filter(i => i.completed).length;
  
  const sentimentBreakdown = interactions.reduce((acc, interaction) => {
    acc[interaction.sentiment] = (acc[interaction.sentiment] || 0) + 1;
    return acc;
  }, {} as Record<SentimentType, number>);

  const priorityBreakdown = interactions.reduce((acc, interaction) => {
    acc[interaction.priority] = (acc[interaction.priority] || 0) + 1;
    return acc;
  }, {} as Record<PriorityLevel, number>);

  return {
    totalInteractions,
    aiHandled,
    humanRequired,
    completed,
    averageResponseTime: Math.floor(Math.random() * 30) + 15, // 15-45 minutes
    sentimentBreakdown: {
      positive: 0,
      neutral: 0,
      warning: 0,
      negative: 0,
      ...sentimentBreakdown
    },
    priorityBreakdown: {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
      ...priorityBreakdown
    }
  };
};

export function useDashboardData(supabaseConfig?: SupabaseConfig | null) {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [supabaseService, setSupabaseService] = useState<SupabaseService | null>(null);
  
  // Usar ref para evitar múltiples requests simultáneos
  const loadingRef = useRef(false);
  const configRef = useRef<SupabaseConfig | null>(null);

  // Inicializar servicio de Supabase solo cuando cambie la configuración
  useEffect(() => {
    // Evitar recrear el servicio si la configuración es la misma
    if (JSON.stringify(supabaseConfig) === JSON.stringify(configRef.current)) {
      return;
    }

    configRef.current = supabaseConfig || null;
    
    if (supabaseConfig) {
      setSupabaseService(new SupabaseService(supabaseConfig));
    } else {
      setSupabaseService(null);
    }
  }, [supabaseConfig]);

  // Función para cargar datos con control de concurrencia
  const loadData = useCallback(async () => {
    // Evitar múltiples requests simultáneos
    if (loadingRef.current) {
      console.log('Request ya en progreso, evitando duplicado');
      return;
    }

    loadingRef.current = true;
    setIsLoading(true);
    
    try {
      let loadedInteractions: Interaction[];

      if (supabaseService) {
        // Cargar datos reales de Supabase
        console.log('Cargando datos desde Supabase...');
        loadedInteractions = await supabaseService.getInteractions();
        console.log('Datos cargados:', loadedInteractions.length, 'interacciones');
      } else {
        // Usar datos simulados si no hay configuración de Supabase
        console.log('Usando datos simulados...');
        loadedInteractions = Array.from({ length: 250 }, (_, i) => 
          generateMockInteraction(`interaction-${i}`)
        );
      }

      setInteractions(loadedInteractions);
      
      if (supabaseService) {
        setMetrics(supabaseService.calculateMetrics(loadedInteractions));
      } else {
        setMetrics(calculateMetrics(loadedInteractions));
      }
    } catch (error) {
      console.error('Error loading data:', error);
      // Fallback a datos simulados en caso de error
      const fallbackInteractions = Array.from({ length: 250 }, (_, i) => 
        generateMockInteraction(`fallback-${i}`)
      );
      setInteractions(fallbackInteractions);
      setMetrics(calculateMetrics(fallbackInteractions));
    } finally {
      setIsLoading(false);
      loadingRef.current = false;
    }
  }, [supabaseService]);

  // Cargar datos iniciales solo cuando cambie el servicio
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Configurar actualizaciones en tiempo real solo si no estamos usando Supabase
  useEffect(() => {
    if (!supabaseService && interactions.length > 0) {
      const interval = setInterval(() => {
        // Evitar actualizaciones si hay un request en progreso
        if (loadingRef.current) {
          return;
        }

        // Simulate real-time updates every 10 seconds
        const updatedInteractions = interactions.map(interaction => {
          if (Math.random() > 0.95) { // 5% chance of update
            return {
              ...interaction,
              lastActivity: new Date(),
              completed: interaction.completed || Math.random() > 0.8
            };
          }
          return interaction;
        });

        // Occasionally add new interactions
        if (Math.random() > 0.7) {
          const newInteraction = generateMockInteraction(`interaction-${Date.now()}`);
          updatedInteractions.push(newInteraction);
        }

        setInteractions(updatedInteractions);
        setMetrics(calculateMetrics(updatedInteractions));
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [interactions, supabaseService]);

  return {
    interactions,
    metrics,
    isLoading,
    refreshData: loadData,
    // Exponer el servicio para operaciones adicionales
    supabaseService
  };
}
