import { Link } from "react-router-dom";
import { Star, BookOpen, Heart, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { bookService } from "../../Service/bookService";
import type { Book } from "../../types";

interface BookCardProps {
  book: Book;
  size?: 'sm' | 'md' | 'lg';
}

export default function BookCard({ book, size = 'md' }: BookCardProps) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loadingLike, setLoadingLike] = useState(false);

  // Tamaños configurables
  const sizeClasses = {
    sm: 'aspect-[2/3]',
    md: 'aspect-[2/3]',
    lg: 'aspect-[2/3]'
  };

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

    if (loadingLike) return;

    try {
      setLoadingLike(true);
      const status = await bookService.toggleLike(book.id);
      setLiked(status.liked);
      setLikesCount(status.totalLikes);
    } catch (err) {
      console.error("Error toggling like:", err);
    } finally {
      setLoadingLike(false);
    }
  };

  return (
    <div className="group block">
      <Link to={`/books/${book.id}`}>
        <div className={`relative ${sizeClasses[size]} rounded-lg overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:scale-105`}>
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
              <BookOpen className="w-16 h-16 text-white opacity-50" />
            </div>
          )}

          {/* Rating badge - siempre visible */}
          {book.averageRating > 0 && (
            <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-white text-sm font-semibold">
                {book.averageRating.toFixed(1)}
              </span>
            </div>
          )}

          {/* Overlay con información al hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            <h3 className="text-white font-bold text-sm line-clamp-2 mb-1">
              {book.titulo}
            </h3>
            <p className="text-white/90 text-xs line-clamp-1 mb-3">{book.autor}</p>
            
            {/* Estadísticas */}
            <div className="flex items-center gap-4 text-white/90 text-xs">
              {book.averageRating > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{book.averageRating.toFixed(1)}</span>
                </div>
              )}
              
              <div className="flex items-center gap-1">
                <Heart className={`w-3.5 h-3.5 ${liked ? "fill-current" : ""}`} />
                <span>{likesCount}</span>
              </div>
              
              {book.cantidadResenas !== undefined && (
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{book.cantidadResenas}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Información debajo de la portada */}
      <div className="mt-3">
        <div className="flex items-start justify-between gap-2">
          <Link to={`/books/${book.id}`} className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1 group-hover:text-red-600 transition-colors">
              {book.titulo}
            </h3>
            <p className="text-gray-600 text-xs line-clamp-1">{book.autor}</p>
          </Link>
          
          {/* Botón de like */}
          <button
            onClick={handleLike}
            disabled={loadingLike}
            className={`flex-shrink-0 transition-colors disabled:opacity-50 ${
              liked ? "text-red-600" : "text-gray-400 hover:text-red-600"
            }`}
          >
            <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
          </button>
        </div>
      </div>
    </div>
  );
}