import { Link } from "react-router-dom";
import { Star, Heart } from "lucide-react";
import type { Review } from "../../types";

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      {/* Header con usuario */}
      <div className="flex items-center gap-3 mb-4">
        <img
          src={
            review.author.profilePicture ||
            `https://ui-avatars.com/api/?name=${review.author.nombre}+${review.author.apellido}&background=dc2626&color=fff`
          }
          alt={review.author.username}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <Link
            to={`/profile/${review.author.username}`}
            className="font-semibold text-gray-900 hover:text-red-600 transition-colors"
          >
            {review.author.nombre} {review.author.apellido}
          </Link>
          <p className="text-sm text-gray-500">@{review.author.username}</p>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
          <span className="font-bold text-gray-900">{review.rating}</span>
        </div>
      </div>

      {/* Libro asociado */}
      <Link
        to={`/books/${review.libro.id}`}
        className="flex items-center gap-3 mb-3 group"
      >
        {review.libro.portadaUrl && (
          <img
            src={review.libro.portadaUrl}
            alt={review.libro.titulo}
            className="w-12 h-16 object-cover rounded shadow-sm"
          />
        )}
        <p className="text-sm font-medium text-gray-700 group-hover:text-red-600 transition-colors line-clamp-2">
          {review.libro.titulo}
        </p>
      </Link>

      {/* Comentario */}
      <p className="text-gray-700 text-sm line-clamp-4 mb-4">
        {review.comentario}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t border-gray-100">
        <span>{new Date(review.createdAt).toLocaleDateString('es-ES')}</span>
        
        <div className="flex items-center gap-3">
          {/* Likes (solo lectura) */}
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            <span>{review.likesCount}</span>
          </div>
          
          {/* Link a ver más */}
          <Link
            to={`/books/${review.libro.id}`}
            className="text-red-600 hover:text-red-700 font-medium transition-colors"
          >
            Ver más
          </Link>
        </div>
      </div>
    </div>
  );
}