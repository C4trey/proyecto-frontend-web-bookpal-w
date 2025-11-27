import { Link } from "react-router-dom";
import { Star, BookOpen, Heart, MessageSquare } from "lucide-react";
import type { Book } from "../../types";
import { useState, useEffect } from "react";

interface BookCardVerticalProps {
  book: Book;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export default function BookCardVertical({ book }: BookCardVerticalProps) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    fetchLikeStatus();
  }, [book.id]);

  const fetchLikeStatus = async () => {
    try {
      const token = localStorage.getItem("token");

      const likedResponse = await fetch(
        `${API_URL}/api/booklikes/${book.id}/liked`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const countResponse = await fetch(
        `${API_URL}/api/booklikes/${book.id}/likes/count`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (likedResponse.ok && countResponse.ok) {
        const likedData = await likedResponse.json();
        const countData = await countResponse.json();
        setLiked(likedData.liked);
        setLikesCount(countData.totalLikes);
      }
    } catch (err) {
      console.error("Error fetching like status:", err);
    }
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_URL}/api/booklikes/${book.id}/like`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setLiked(data.liked);
        setLikesCount(data.totalLikes);
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  return (
    <Link
      to={`/books/${book.id}`}
      className="flex gap-4 p-3 w-full bg-white shadow-sm rounded-md hover:shadow-md transition"
    >
      {/* Imagen */}
      <div className="w-20 h-28 rounded overflow-hidden shrink-0">
        {book.portadaUrl ? (
          <img
            src={book.portadaUrl}
            alt={book.titulo}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-red-50 to-red-100 flex items-center justify-center">
            <BookOpen className="w-10 h-10 text-red-300" />
          </div>
        )}
      </div>

      {/* Información */}
      <div className="flex flex-col justify-between flex-1">
        <div>
          <h3 className="font-semibold text-sm text-gray-900 line-clamp-2">
            {book.titulo}
          </h3>
          <p className="text-xs text-gray-600 line-clamp-1">{book.autor}</p>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-600 mt-2">

          {/* Rating */}
          {book.averageRating > 0 && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{book.averageRating.toFixed(1)}</span>
            </div>
          )}

          {/* Likes */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 transition-colors ${
              liked ? "text-red-500" : "text-gray-400 hover:text-red-500"
            }`}
          >
            <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
            <span>{likesCount}</span>
          </button>

          {/* Reseñas */}
          {book.cantidadResenas !== undefined && (
            <div className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              <span>{book.cantidadResenas}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
