import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import type { ReviewSimple } from '../../types';

interface RecentReviewsProps {
  reviews: ReviewSimple[];
}

export default function RecentReviews({ reviews }: RecentReviewsProps) {
  if (reviews.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-600">Aún no hay reseñas</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Reseñas Recientes</h2>
      
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
          >
            <div className="flex items-center gap-2 mb-2">
              {/* Rating */}
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
              
              <Link
                to={`/books/${review.id}`}
                className="font-semibold text-gray-900 hover:text-red-600 transition-colors"
              >
                {review.libroTitulo}
              </Link>
              
              <span className="text-sm text-gray-500">
                {new Date(review.createdAt).toLocaleDateString('es-ES')}
              </span>
            </div>
            
            <p className="text-gray-700 line-clamp-3">{review.comentario}</p>
            
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <span>{review.likesCount} likes</span>
              <span>{review.commentsCount} comentarios</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}