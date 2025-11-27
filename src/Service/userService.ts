import { api } from './api';
import type { UserSearchResult, PageResponse, ProfileResponse } from '../types';

export const userService = {
  /**
   * Buscar usuarios
   */
  searchUsers: async (query: string, page: number = 0, size: number = 20): Promise<PageResponse<UserSearchResult>> => {
    const response = await api.get('/api/usuarios/search', {
      params: { query, page, size }
    });
    return response.data;
  },

  /**
   * Autocompletado de usernames
   */
  getUsernameSuggestions: async (query: string): Promise<string[]> => {
    const response = await api.get('/api/usuarios/search/autocomplete', {
      params: { query }
    });
    return response.data;
  },

  /**
   * Obtener perfil completo de un usuario
   */
  getProfile: async (username: string): Promise<ProfileResponse> => {
    const response = await api.get(`/api/usuarios/${username}/profile`);
    return response.data;
  }
};