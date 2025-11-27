import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type { ApiError } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // ✅ 30 segundos para evitar 504
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de request
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptor de response
api.interceptors.response.use(
  (response: any) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('session');
      localStorage.removeItem('expiresOn');
      
      window.location.href = '/auth/login';
    }
    
    return Promise.reject(error);
  }
);

export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;
    
    if (axiosError.response) {
      const { status, data } = axiosError.response;
      
      switch (status) {
        case 400:
          return data.message || 'Datos inválidos. Verifica la información ingresada.';
        case 401:
          return 'No autorizado. Por favor inicia sesión nuevamente.';
        case 403:
          return 'No tienes permiso para realizar esta acción.';
        case 404:
          return data.message || 'Recurso no encontrado.';
        case 409:
          return data.message || 'El recurso ya existe. Por favor verifica los datos.';
        case 422:
          return data.message || 'No se puede procesar la solicitud. Datos inválidos.';
        case 500:
          return 'Error del servidor. Por favor intenta más tarde.';
        case 504:
          return 'Tiempo de espera agotado. El servidor tardó demasiado en responder.';
        default:
          return data.message || 'Ha ocurrido un error inesperado.';
      }
    }
    
    if (axiosError.request) {
      return 'Sin conexión al servidor. Verifica tu conexión a internet.';
    }
  }
  
  return 'Ha ocurrido un error inesperado. Por favor intenta nuevamente.';
};