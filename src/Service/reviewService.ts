import { api } from './api';
import type { 
  ReviewResponseDTO, 
  CreateReviewDTO, 
  ReviewLikeResponseDTO, 
  ReviewsListResponseDTO 
} from '../types';

export const reviewService = {
  // ✅ Crear review
  async createReview(libroId: number, data: CreateReviewDTO): Promise<ReviewResponseDTO> {
    const response = await api.post<ReviewResponseDTO>(`/review/libro/${libroId}`, data);
    return response.data;
  },

  // ✅ Obtener reviews de un libro
  async getReviewsByBook(libroId: number, page = 0, size = 20): Promise<ReviewsListResponseDTO> {
    const response = await api.get<ReviewsListResponseDTO>(`/review/libro/${libroId}`, {
      params: { page, size },
    });
    return response.data;
  },

  // ✅ Obtener mi review para un libro
  async getMyReviewForBook(libroId: number): Promise<ReviewResponseDTO> {
    const response = await api.get<ReviewResponseDTO>(`/review/libro/${libroId}/mine`);
    return response.data;
  },

  // ✅ Obtener mis reviews
  async getMyReviews(page = 0, size = 20): Promise<ReviewsListResponseDTO> {
    const response = await api.get<ReviewsListResponseDTO>('/review/me', {
      params: { page, size },
    });
    return response.data;
  },

  // ✅ Obtener reviews de un usuario
  async getUserReviews(userId: number, page = 0, size = 20): Promise<ReviewsListResponseDTO> {
    const response = await api.get<ReviewsListResponseDTO>(`/review/usuario/${userId}`, {
      params: { page, size },
    });
    return response.data;
  },

  // ✅ Actualizar review
  async updateReview(reviewId: number, data: CreateReviewDTO): Promise<ReviewResponseDTO> {
    const response = await api.patch<ReviewResponseDTO>(`/review/${reviewId}`, data);
    return response.data;
  },

  // ✅ Eliminar review
  async deleteReview(reviewId: number): Promise<void> {
    await api.delete(`/review/${reviewId}`);
  },

  // ✅ Toggle like en review
  async toggleLike(reviewId: number): Promise<ReviewLikeResponseDTO> {
    const response = await api.post<ReviewLikeResponseDTO>(`/review/${reviewId}/like`);
    return response.data;
  },
};