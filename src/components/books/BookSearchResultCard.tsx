import { Link } from "react-router-dom";
import { Star, BookOpen, Heart, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { bookService } from "../../Service/bookService";
import type { Book } from "../../types";

interface BookSearchResultCardProps {
  book: Book;
}

export default function BookSearchResultCard({ book }: BookSearchResultCardProps) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    fetchLikeStatus();
  }, [book.id]);

  const fetchLikeStatus = async () => {
    try {
      const status = await bookService.getLikeStatus(book.id);
      setLiked(status.liked);
      setLikesCount(status.totalLikes);
    } catch (err) {
      console.error("Error fetching like status:", err);
    }
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const status = await bookService.toggleLike(book.id);
      setLiked(status.liked);
      setLikesCount(status.totalLikes);
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  return (
    <Link
      to={`/books/${book.id}`}
      className="group block bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
    >
      <div className="flex gap-4 p-4">
        {/* Portada del libro */}
        <div className="flex-shrink-0">
          <div className="relative w-24 h-36 sm:w-32 sm:h-48 rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-shadow">
            {book.portadaUrl ? (
              <img
                src={book.portadaUrl}
                alt={book.titulo}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(book.titulo)}&background=dc2626&color=fff&size=400`;
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-white opacity-50" />
              </div>
            )}

            {/* Rating badge */}
            {book.averageRating > 0 && (
              <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm px-1.5 py-0.5 rounded-full flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-white text-xs font-semibold">
                  {book.averageRating.toFixed(1)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Información del libro */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Título y autor */}
          <div className="mb-3">
            <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-red-600 transition-colors mb-1">
              {book.titulo}
            </h3>
            <p className="text-sm text-gray-600">
              por {book.autor}
            </p>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-3 mb-auto text-xs text-gray-500">
            {book.anioPublicacion && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{book.anioPublicacion}</span>
              </div>
            )}

            {book.genero && (
              <span className="px-2 py-1 bg-gray-100 rounded-full">
                {book.genero.split(',')[0].trim()}
              </span>
            )}

            {book.cantidadResenas !== undefined && book.cantidadResenas > 0 && (
              <span>{book.cantidadResenas} reseña{book.cantidadResenas !== 1 ? 's' : ''}</span>
            )}
          </div>

          {/* Acciones */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-4">
              {book.averageRating > 0 && (
                <div className="flex items-center gap-1 text-sm">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-gray-900">
                    {book.averageRating.toFixed(1)}
                  </span>
                  {book.cantidadResenas !== undefined && (
                    <span className="text-gray-500">
                      ({book.cantidadResenas})
                    </span>
                  )}
                </div>
              )}

              <button
                onClick={handleLike}
                className={`flex items-center gap-1 text-sm transition-colors ${
                  liked ? "text-red-600" : "text-gray-500 hover:text-red-600"
                }`}
              >
                <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
                <span>{likesCount}</span>
              </button>
            </div>

            <span className="text-sm text-red-600 font-medium group-hover:underline">
              Ver detalles →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}