import { useState, useEffect, useCallback, useRef } from 'react';
import { notificationService } from '../Service/notificationService';
import type { NotificacionDTO } from '../types';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificacionDTO[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Cargar notificaciones iniciales
  const fetchNotifications = useCallback(async () => {
    try {
      const [allNotifications, count] = await Promise.all([
        notificationService.getAllNotifications(),
        notificationService.getUnreadCount(),
      ]);
      
      setNotifications(allNotifications);
      setUnreadCount(count);
      setError(null);
    } catch (err) {
      console.error('Error al cargar notificaciones:', err);
      setError('Error al cargar notificaciones');
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Conectar a SSE con token en query parameter
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No hay token, no se conecta al SSE');
      setLoading(false);
      return;
    }

    // Cargar notificaciones iniciales
    fetchNotifications();

    // ✅ Conectar a SSE con token en la URL
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    const eventSource = new EventSource(
      `${API_URL}/api/notificaciones/stream?token=${encodeURIComponent(token)}`
    );

    eventSourceRef.current = eventSource;

    // Evento: Conexión establecida
    eventSource.onopen = () => {
      console.log('✅ Conectado al stream de notificaciones SSE');
      setConnected(true);
      setError(null);
    };

    // Evento: Mensaje de conexión inicial
    eventSource.addEventListener('connected', (event) => {
      console.log('📡 SSE:', event.data);
    });

    // ✅ Evento: Nueva notificación en tiempo real
    eventSource.addEventListener('nueva-notificacion', (event) => {
      try {
        const nuevaNotificacion: NotificacionDTO = JSON.parse(event.data);
        console.log('🔔 Nueva notificación recibida:', nuevaNotificacion);
        
        // Agregar al inicio de la lista
        setNotifications(prev => [nuevaNotificacion, ...prev]);
        
        // Incrementar contador si no está leída
        if (!nuevaNotificacion.leida) {
          setUnreadCount(prev => prev + 1);
        }

        // Opcional: Mostrar notificación del navegador
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('BookPal', {
            body: nuevaNotificacion.mensaje,
            icon: '/logo.png',
          });
        }
      } catch (err) {
        console.error('Error al procesar notificación SSE:', err);
      }
    });

    // Evento: Error en la conexión
    eventSource.onerror = (error) => {
      console.error('❌ Error en conexión SSE:', error);
      setConnected(false);
      
      // Solo mostrar error si no es por cierre normal
      if (eventSource.readyState !== EventSource.CLOSED) {
        setError('Error en la conexión de notificaciones');
      }
      
      // EventSource reconecta automáticamente, pero podemos logearlo
      if (eventSource.readyState === EventSource.CONNECTING) {
        console.log('🔄 Reconectando SSE...');
      }
    };

    // Cleanup: Cerrar conexión al desmontar
    return () => {
      console.log('🔌 Cerrando conexión SSE');
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [fetchNotifications]);

  // Marcar como leída
  const markAsRead = async (notificationId: number) => {
    try {
      await notificationService.markAsRead(notificationId);
      
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId
            ? { ...notif, leida: true, fechaLectura: new Date().toISOString() }
            : notif
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error al marcar como leída:', err);
    }
  };

  // Marcar todas como leídas
  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      
      setNotifications(prev =>
        prev.map(notif => ({
          ...notif,
          leida: true,
          fechaLectura: notif.leida ? notif.fechaLectura : new Date().toISOString()
        }))
      );
      
      setUnreadCount(0);
    } catch (err) {
      console.error('Error al marcar todas como leídas:', err);
    }
  };

  // Eliminar notificación
  const deleteNotification = async (notificationId: number) => {
    try {
      await notificationService.deleteNotification(notificationId);
      
      const notifToDelete = notifications.find(n => n.id === notificationId);
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
      
      if (notifToDelete && !notifToDelete.leida) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Error al eliminar notificación:', err);
    }
  };

  // Solicitar permiso para notificaciones del navegador
  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    error,
    connected,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refetch: fetchNotifications,
    requestNotificationPermission,
  };
};
