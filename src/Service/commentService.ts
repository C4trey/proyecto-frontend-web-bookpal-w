import { api } from './api';
import type { 
  CommentResponseDTO, 
  CreateCommentDTO, 
  CommentLikeResponseDTO, 
  CommentsListResponse 
} from '../types';

export const commentService = {
  // ✅ Obtener comentarios de una review
  async getCommentsByReview(
    reviewId: number, 
    page = 0, 
    size = 20
  ): Promise<CommentsListResponse> {
    const response = await api.get<CommentsListResponse>(
      `/comentar/reviews/${reviewId}/comments`,
      { params: { page, size } }
    );
    return response.data;
  },

  // ✅ Crear comentario en una review
  async createComment(
    reviewId: number, 
    data: CreateCommentDTO
  ): Promise<CommentResponseDTO> {
    const response = await api.post<CommentResponseDTO>(
      `/comentar/reviews/${reviewId}/comments`,
      data
    );
    return response.data;
  },

  // ✅ Toggle like en comentario
  async toggleLike(commentId: number): Promise<CommentLikeResponseDTO> {
    const response = await api.post<CommentLikeResponseDTO>(
      `/comentar/comments/${commentId}/like`
    );
    return response.data;
  },

  // ✅ Eliminar comentario (CORREGIDO)
  async deleteComment(commentId: number): Promise<void> {
    await api.delete(`/comentar/comments/${commentId}`);
  },
};