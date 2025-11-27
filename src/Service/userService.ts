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
  ,
  /**
   * Actualizar datos del usuario autenticado (me)
   */
  updateMyProfile: async (data: { country?: string; bio?: string; birthDate?: string | null }) => {
    const response = await api.put('/api/usuarios/me', data);
    return response.data;
  },

  /**
   * Obtener stats de followers/following del usuario autenticado
   */
  getMyFollowStats: async (): Promise<{ followers: number; following: number }> => {
    const response = await api.get('/api/usuarios/me');
    return {
      followers: response.data.numFollowers ?? response.data.num_Followers ?? 0,
      following: response.data.numFollowing ?? response.data.num_Following ?? 0,
    };
  }
};