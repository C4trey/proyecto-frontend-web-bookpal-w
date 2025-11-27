import { api } from './api';
import type { RecommendationsResponseDTO } from '../types';

export const recommendationService = {
  /**
   * Obtener recomendaciones para el usuario actual
   */
  getRecommendations: async (limit: number = 10): Promise<RecommendationsResponseDTO> => {
    const response = await api.get('/api/recomendacion', {
      params: { limit }
    });
    return response.data;
  },

  /**
   * Refrescar recomendaciones del usuario actual
   */
  refreshRecommendations: async (): Promise<string> => {
    const response = await api.post('/api/recomendacion/refresh');
    return response.data;
  }
};