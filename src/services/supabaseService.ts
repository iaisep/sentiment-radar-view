import { SupabaseConfig } from '@/components/dashboard/SupabaseConfig';
import { Interaction, DashboardMetrics, SentimentType, PriorityLevel } from '@/types/dashboard';

export class SupabaseService {
  private config: SupabaseConfig;
  private requestCache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5000; // 5 segundos de cache

  constructor(config: SupabaseConfig) {
    this.config = config;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    // Implementar cache simple para evitar requests duplicados
    const cacheKey = `${endpoint}-${JSON.stringify(options)}`;
    const cached = this.requestCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      console.log('Usando datos del cache para:', endpoint);
      return cached.data;
    }

    const response = await fetch(`${this.config.url}${endpoint}`, {
      ...options,
      headers: {
        'apikey': this.config.anonKey,
        'Authorization': `Bearer ${this.config.anonKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Guardar en cache solo para requests GET
    if (!options.method || options.method === 'GET') {
      this.requestCache.set(cacheKey, { data, timestamp: Date.now() });
    }

    return data;
  }

  // Obtener todas las interacciones
  async getInteractions(): Promise<Interaction[]> {
    try {
      const data = await this.makeRequest('/rest/v1/interactions?select=*');
      
      // Mapear los datos de Supabase al formato de la aplicación
      return data.map((item: any) => ({
        id: item.id,
        sentiment: item.sentiment as SentimentType,
        priority: item.priority as PriorityLevel,
        status: item.status,
        timestamp: new Date(item.timestamp),
        aiHandled: item.ai_handled,
        requiresHuman: item.requires_human,
        completed: item.completed,
        ticketId: item.ticket_id,
        userId: item.user_id,
        lastActivity: new Date(item.last_activity),
        duration: item.duration,
        channel: item.channel
      }));
    } catch (error) {
      console.error('Error fetching interactions:', error);
      throw error;
    }
  }

  // Crear una nueva interacción
  async createInteraction(interaction: Omit<Interaction, 'id'>): Promise<Interaction> {
    try {
      const data = await this.makeRequest('/rest/v1/interactions', {
        method: 'POST',
        body: JSON.stringify({
          sentiment: interaction.sentiment,
          priority: interaction.priority,
          status: interaction.status,
          timestamp: interaction.timestamp.toISOString(),
          ai_handled: interaction.aiHandled,
          requires_human: interaction.requiresHuman,
          completed: interaction.completed,
          ticket_id: interaction.ticketId,
          user_id: interaction.userId,
          last_activity: interaction.lastActivity.toISOString(),
          duration: interaction.duration,
          channel: interaction.channel
        }),
      });

      return {
        ...interaction,
        id: data[0].id
      };
    } catch (error) {
      console.error('Error creating interaction:', error);
      throw error;
    }
  }

  // Actualizar una interacción
  async updateInteraction(id: string, updates: Partial<Interaction>): Promise<void> {
    try {
      const updateData: any = {};
      
      if (updates.sentiment) updateData.sentiment = updates.sentiment;
      if (updates.priority) updateData.priority = updates.priority;
      if (updates.status) updateData.status = updates.status;
      if (updates.aiHandled !== undefined) updateData.ai_handled = updates.aiHandled;
      if (updates.requiresHuman !== undefined) updateData.requires_human = updates.requiresHuman;
      if (updates.completed !== undefined) updateData.completed = updates.completed;
      if (updates.lastActivity) updateData.last_activity = updates.lastActivity.toISOString();
      if (updates.duration) updateData.duration = updates.duration;

      await this.makeRequest(`/rest/v1/interactions?id=eq.${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updateData),
      });
    } catch (error) {
      console.error('Error updating interaction:', error);
      throw error;
    }
  }

  // Calcular métricas basadas en los datos
  calculateMetrics(interactions: Interaction[]): DashboardMetrics {
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

    // Calcular tiempo promedio de respuesta
    const completedInteractions = interactions.filter(i => i.completed);
    const averageResponseTime = completedInteractions.length > 0
      ? Math.round(completedInteractions.reduce((sum, i) => sum + i.duration, 0) / completedInteractions.length)
      : 0;

    return {
      totalInteractions,
      aiHandled,
      humanRequired,
      completed,
      averageResponseTime,
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
  }
}
