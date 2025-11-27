import { api } from './api';
import type { ProfileResponse, FollowToggleResponse, UserSearchResult, FollowListResponse } from '../types';

export const profileService = {
  /**
   * Obtener perfil completo de un usuario
   */
  async getProfile(username: string): Promise<ProfileResponse> {
    const response = await api.get(`/api/usuarios/${username}/profile`);
    return response.data;
  },

  /**
   * Subir foto de perfil
   */
  async uploadProfilePicture(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/api/upload/profile-picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Actualizar perfil
   */
  async updateProfile(userId: number, data: {
    nombre?: string;
    apellido?: string;
    username?: string;
    bio?: string;
    profilePicture?: string;
  }) {
    const response = await api.put(`/api/usuarios/${userId}`, data);
    return response.data;
  },

  /**
   * Toggle follow/unfollow
   */
  async toggleFollow(username: string): Promise<FollowToggleResponse> {
    const response = await api.post(`/api/seguir/${username}`);
    return response.data;
  },

  /**
   * Verificar si sigo a un usuario
   */
  async getFollowStatus(username: string): Promise<{ siguiendo: boolean }> {
    const response = await api.get(`/api/seguir/status/${username}`);
    return response.data;
  },

  /**
   * Obtener seguidores de un usuario
   */
  async getFollowers(username: string, page: number = 0, size: number = 100): Promise<FollowListResponse> {
    const response = await api.get<FollowListResponse>(`/api/seguir/followers/${username}`, {
      params: { page, size }
    });
    return response.data;
  },

  /**
   * Obtener usuarios que sigue
   * ✅ CORREGIDO: Especificar tipo de retorno explícitamente
   */
  async getFollowing(username: string, page: number = 0, size: number = 100): Promise<FollowListResponse> {
    const response = await api.get<FollowListResponse>(`/api/seguir/following/${username}`, {
      params: { page, size }
    });
    return response.data;
  },
};