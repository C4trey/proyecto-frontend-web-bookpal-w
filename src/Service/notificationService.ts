import axios from 'axios';
import type { NotificacionDTO, NotificationCountResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const notificationService = {
  /**
   * Obtener todas las notificaciones
   */
  async getAllNotifications(): Promise<NotificacionDTO[]> {
    const response = await axios.get(`${API_URL}/api/notificaciones`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  /**
   * Obtener solo notificaciones no leídas
   */
  async getUnreadNotifications(): Promise<NotificacionDTO[]> {
    const response = await axios.get(`${API_URL}/api/notificaciones/no-leidas`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  /**
   * Obtener contador de notificaciones no leídas
   */
  async getUnreadCount(): Promise<number> {
    const response = await axios.get<NotificationCountResponse>(
      `${API_URL}/api/notificaciones/contador`,
      { headers: getAuthHeaders() }
    );
    return response.data.noLeidas;
  },

  /**
   * Marcar una notificación como leída
   */
  async markAsRead(notificationId: number): Promise<void> {
    await axios.patch(
      `${API_URL}/api/notificaciones/${notificationId}/leer`,
      {},
      { headers: getAuthHeaders() }
    );
  },

  /**
   * Marcar todas las notificaciones como leídas
   */
  async markAllAsRead(): Promise<void> {
    await axios.patch(
      `${API_URL}/api/notificaciones/leer-todas`,
      {},
      { headers: getAuthHeaders() }
    );
  },

  /**
   * Eliminar una notificación
   */
  async deleteNotification(notificationId: number): Promise<void> {
    await axios.delete(`${API_URL}/api/notificaciones/${notificationId}`, {
      headers: getAuthHeaders(),
    });
  },
};