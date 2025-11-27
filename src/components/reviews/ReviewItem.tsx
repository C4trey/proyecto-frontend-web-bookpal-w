import { useState } from 'react';
import { Link } from 'react-router-dom'; // ✅ IMPORTAR Link
import { Trash2, ThumbsUp, Edit2, MessageCircle } from 'lucide-react';
import { reviewService } from '../../Service/reviewService';
import { handleApiError } from '../../Service/api';
import type { ReviewResponseDTO } from '../../types';
import CommentSection from './CommentSection';

interface ReviewItemProps {
  review: ReviewResponseDTO;
  onDelete: () => void;
  onLike: () => void;
  onEdit?: (reviewId: number) => void;
}

export default function ReviewItem({ review, onDelete, onLike, onEdit }: ReviewItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta reseña?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await reviewService.deleteReview(review.id);
      console.log('✅ Review eliminada exitosamente');
      onDelete();
    } catch (error) {
      console.error('❌ Error al eliminar review:', error);
      alert(handleApiError(error));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLike = async () => {
    setIsLiking(true);
    try {
      await reviewService.toggleLike(review.id);
      console.log('✅ Like actualizado');
      onLike();
    } catch (error) {
      console.error('❌ Error al dar like:', error);
      alert(handleApiError(error));
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-start gap-3 flex-1">
          {/* ✅ Avatar y nombre clicables */}
          <Link 
            to={`/profile/${review.authorUsername}`}
            className="flex items-start gap-3 flex-1 hover:opacity-80 transition-opacity"
          >
            {/* Avatar */}
            {review.authorProfilePicture ? (
              <img
                src={review.authorProfilePicture}
                alt={review.authorUsername}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold text-lg">
                {review.authorNombre?.charAt(0) || 'U'}
              </div>
            )}

            {/* Info del autor */}
            <div className="flex-1">
              <h4 className="font-semibold text-lg text-gray-900 hover:text-red-600 transition-colors">
                {review.authorNombre} {review.authorApellido}
              </h4>
              <p className="text-sm text-gray-500">@{review.authorUsername}</p>
              
              {/* Rating estrellas */}
              <div className="flex items-center gap-1 mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span 
                    key={i} 
                    className={`text-lg ${i < review.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              
              {/* Fecha */}
              <p className="text-xs text-gray-400 mt-1">
                {new Date(review.createdAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </Link>
        </div>

        {/* Botones de acción */}
        {review.canDelete && (
          <div className="flex gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(review.id)}
                className="text-blue-600 hover:text-blue-800 transition-colors p-2 rounded-lg hover:bg-blue-50"
                title="Editar reseña"
              >
                <Edit2 size={20} />
              </button>
            )}
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-red-600 hover:text-red-800 transition-colors p-2 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Eliminar reseña"
            >
              <Trash2 size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Comentario */}
      <p className="text-gray-700 leading-relaxed mb-4">
        {review.comentario}
      </p>

      {/* Footer con likes y comentarios */}
      <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
        {/* Botón Like */}
        <button
          onClick={handleLike}
          disabled={isLiking}
          className={`flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed px-3 py-1.5 rounded-lg ${
            review.liked
              ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
          }`}
        >
          <ThumbsUp 
            size={18} 
            fill={review.liked ? 'currentColor' : 'none'}
            strokeWidth={2}
          />
          <span className="text-sm font-medium">
            {review.likesCount}
          </span>
        </button>

        {/* Botón de comentarios */}
        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <MessageCircle size={18} />
          <span className="text-sm font-medium">
            {review.commentsCount}
          </span>
        </button>
      </div>

      {/* Sección de comentarios */}
      {showComments && (
        <CommentSection
          reviewId={review.id}
          initialComments={review.topComments}
          hasMoreComments={review.hasMoreComments}
          commentsCount={review.commentsCount}
        />
      )}
    </div>
  );
}