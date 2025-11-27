import { api } from './api';
import type { Book, PageResponse, SearchFilters, BookLikeStatus } from '../types';

export const bookService = {
  // ==================== LISTADO ====================
  
  /**
   * Obtener todos los libros con paginación
   */
  getAll: async (page: number = 0, size: number = 20): Promise<PageResponse<Book>> => {
    const response = await api.get('/libro', {
      params: { page, size }
    });
    return response.data;
  },

  /**
   * Libros recientes
   */
  getRecent: async (page: number = 0, size: number = 12): Promise<PageResponse<Book>> => {
    const response = await api.get('/libro/recientes', {
      params: { page, size }
    });
    return response.data;
  },

  /**
   * Libros mejor valorados
   */
  getTopRated: async (page: number = 0, size: number = 12): Promise<PageResponse<Book>> => {
    const response = await api.get('/libro/mejor-valorados', {
      params: { page, size }
    });
    return response.data;
  },

  /**
   * Obtener libro por ID
   */
  getById: async (id: number): Promise<Book> => {
    const response = await api.get(`/libro/${id}`);
    return response.data;
  },

  // ==================== BÚSQUEDA ====================

  /**
   * Búsqueda simple por título o autor
   */
  search: async (query: string, page: number = 0, size: number = 24): Promise<PageResponse<Book>> => {
    const response = await api.get('/libro/search', {
      params: { query, page, size }
    });
    return response.data;
  },

  /**
   * Autocompletado para búsqueda
   */
  autocomplete: async (query: string): Promise<string[]> => {
    if (!query || query.trim().length < 2) {
      return [];
    }
    const response = await api.get('/libro/search/autocomplete', {
      params: { query: query.trim() }
    });
    return response.data;
  },

  /**
   * Búsqueda avanzada con filtros
   */
  searchAdvanced: async (
    filters: SearchFilters,
    page: number = 0,
    size: number = 24
  ): Promise<PageResponse<Book>> => {
    const response = await api.get('/libro/search/advanced', {
      params: {
        query: filters.query,
        genero: filters.genero,
        anioDesde: filters.anioDesde,
        anioHasta: filters.anioHasta,
        minRating: filters.minRating,
        page,
        size
      }
    });
    return response.data;
  },

  // ==================== FILTROS ====================

  /**
   * Obtener libros por género
   */
  getByGenre: async (genero: string, page: number = 0, size: number = 20): Promise<PageResponse<Book>> => {
    const response = await api.get(`/libro/genero/${genero}`, {
      params: { page, size }
    });
    return response.data;
  },

  /**
   * Obtener todos los géneros disponibles
   */
  getGenres: async (): Promise<string[]> => {
    const response = await api.get('/libro/generos');
    return response.data;
  },

  // ==================== LIKES ====================

  /**
   * Obtener estado de like del libro
   */
  getLikeStatus: async (bookId: number): Promise<BookLikeStatus> => {
    const [likedResponse, countResponse] = await Promise.all([
      api.get(`/api/booklikes/${bookId}/liked`),
      api.get(`/api/booklikes/${bookId}/likes/count`)
    ]);

    return {
      liked: likedResponse.data.liked,
      totalLikes: countResponse.data.totalLikes
    };
  },

  /**
   * Toggle like en un libro
   */
  toggleLike: async (bookId: number): Promise<BookLikeStatus> => {
    const response = await api.post(`/api/booklikes/${bookId}/like`);
    return response.data;
  },

  // ==================== EXPLORACIÓN ====================

  /**
   * Explorar libros desde OpenLibrary
   */
  explore: async () => {
    const response = await api.get('/libro/explorar');
    return response.data;
  }
};