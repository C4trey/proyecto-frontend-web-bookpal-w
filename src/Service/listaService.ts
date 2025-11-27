import axios from 'axios';
import type { Lista, CreateListaDTO, UpdateListaDTO, ListaLibrosDTO } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const listaService = {
  /**
   * ✅ Obtener todas las listas del usuario actual (sin libros completos)
   */
  async getMyLists(): Promise<Lista[]> {
    const response = await axios.get(`${API_URL}/api/lista/my-lists`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  /**
   * ✅ Obtener lista por ID (con libros completos)
   */
  async getListaById(id: number): Promise<ListaLibrosDTO> {
    const response = await axios.get(`${API_URL}/api/lista/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  /**
   * ✅ Crear nueva lista
   */
  async createLista(data: CreateListaDTO): Promise<Lista> {
    const response = await axios.post(`${API_URL}/api/lista`, data, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  /**
   * ✅ Actualizar lista (nombre y/o descripción)
   */
  async updateLista(id: number, data: UpdateListaDTO): Promise<Lista> {
    const response = await axios.put(`${API_URL}/api/lista/${id}`, data, {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  /**
   * ✅ Eliminar lista
   */
  async deleteLista(id: number): Promise<void> {
    await axios.delete(`${API_URL}/api/lista/${id}`, {
      headers: getAuthHeaders(),
    });
  },

  /**
   * ✅ Agregar libro a lista
   */
  async addBookToList(listaId: number, bookId: number): Promise<void> {
    await axios.post(
      `${API_URL}/api/lista/${listaId}/books/${bookId}`,
      {},
      { headers: getAuthHeaders() }
    );
  },

  /**
   * ✅ Eliminar libro de lista
   */
  async removeBookFromList(listaId: number, bookId: number): Promise<void> {
    await axios.delete(`${API_URL}/api/lista/${listaId}/books/${bookId}`, {
      headers: getAuthHeaders(),
    });
  },
};