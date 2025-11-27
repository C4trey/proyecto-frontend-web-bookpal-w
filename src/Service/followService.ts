import { api } from './api';
import type { FollowToggleResponse, FollowStatus, PageResponse } from '../types';

export interface UsuarioFollowDTO {
  username: string;
  nombre: string;
  apellido: string;
  profilePicture?: string;
}

export const followService = {
  /**
   * Toggle follow/unfollow
   * ✅ CORREGIDO: Usar username, no ID
   */
 toggleFollow: async (username: string): Promise<FollowToggleResponse> => {
  const response = await api.post(`/api/seguir/${username}`);  // ✅ username, no ID
  return response.data;
},
  /**
   * Verificar si sigo a un usuario
   */
  getFollowStatus: async (username: string): Promise<FollowStatus> => {
    const response = await api.get(`/api/seguir/status/${username}`);
    return response.data;
  },

  /**
   * Obtener usuarios que sigo
   */
  getFollowing: async (page: number = 0, size: number = 20): Promise<PageResponse<UsuarioFollowDTO>> => {
    const response = await api.get('/api/seguir/following', {
      params: { page, size }
    });
    return response.data;
  },

  /**
   * Obtener mis seguidores
   */
  getFollowers: async (page: number = 0, size: number = 20): Promise<PageResponse<UsuarioFollowDTO>> => {
    const response = await api.get('/api/seguir/followers', {
      params: { page, size }
    });
    return response.data;
  },

  /**
   * Obtener seguidores de un usuario específico
   */
  getUserFollowers: async (username: string, page: number = 0, size: number = 20): Promise<PageResponse<UsuarioFollowDTO>> => {
    const response = await api.get(`/api/seguir/followers/${username}`, {
      params: { page, size }
    });
    return response.data;
  },

  /**
   * Obtener following de un usuario específico
   */
  getUserFollowing: async (username: string, page: number = 0, size: number = 20): Promise<PageResponse<UsuarioFollowDTO>> => {
    const response = await api.get(`/api/seguir/following/${username}`, {
      params: { page, size }
    });
    return response.data;
  }
};