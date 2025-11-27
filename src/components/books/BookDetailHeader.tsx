import { useState, useEffect } from "react";
import { Star, BookOpen, Calendar, Tag, Heart, Users, BookmarkPlus } from "lucide-react";
import type { BookDetail } from "../../types";
import ReviewForm from "../reviews/ReviewForm";
import BookLikesModal from "../books/BookLikesModal";
import AddToListModal from "../Lista/AddToListModal"; // ✅ IMPORTAR

interface BookDetailHeaderProps {
  book: BookDetail;
  onReviewCreated: () => void;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export default function BookDetailHeader({ book, onReviewCreated }: BookDetailHeaderProps) {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [showAddToListModal, setShowAddToListModal] = useState(false); // ✅ NUEVO
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    fetchLikeStatus();
  }, [book.id]);

  const fetchLikeStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      
      const likedResponse = await fetch(`${API_URL}/api/booklikes/${book.id}/liked`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const countResponse = await fetch(`${API_URL}/api/booklikes/${book.id}/likes/count`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

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

  const handleLike = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/booklikes/${book.id}/like`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

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
    <>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
          {/* Portada */}
          <div className="md:col-span-1">
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-xl">
              {book.portadaUrl ? (
                <img
                  src={book.portadaUrl}
                  alt={book.titulo}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
                  <BookOpen className="w-24 h-24 text-red-300" />
                </div>
              )}
            </div>

            {/* Sección de likes debajo de la portada */}
            <div className="mt-4 space-y-2">
              <button
                onClick={handleLike}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-colors ${
                  liked
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "border-2 border-red-600 text-red-600 hover:bg-red-50"
                }`}
              >
                <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
                {liked ? "Te gusta" : "Me gusta"}
              </button>

              {likesCount > 0 && (
                <button
                  onClick={() => setShowLikesModal(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 text-sm transition-colors"
                >
                  <Users className="w-4 h-4" />
                  <span>
                    {likesCount} {likesCount === 1 ? "persona" : "personas"} le dio like
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Información */}
          <div className="md:col-span-2 flex flex-col">
            {/* Título y Rating */}
            <div className="mb-4">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {book.titulo}
              </h1>
              
              <p className="text-xl text-gray-600 mb-4">
                por {book.autor}
              </p>

              {/* Rating promedio */}
              {book.averageRating > 0 && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-6 h-6 ${
                          star <= Math.round(book.averageRating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-2xl font-bold text-gray-900">
                    {book.averageRating.toFixed(1)}
                  </span>
                  <span className="text-gray-500">
                    ({book.cantidadResenas} {book.cantidadResenas === 1 ? "reseña" : "reseñas"})
                  </span>
                </div>
              )}
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap gap-4 mb-6">
              {book.anioPublicacion && book.anioPublicacion !== "Desconocido" && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-5 h-5" />
                  <span>{book.anioPublicacion}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2 text-gray-600">
                <Tag className="w-5 h-5" />
                <span>{book.genero}</span>
              </div>
            </div>

            {/* Sinopsis */}
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Sinopsis</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {book.sinopsis}
              </p>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-3 mt-6">
              {/* ✅ ACTUALIZADO: Ahora abre el modal */}
              <button 
                onClick={() => setShowAddToListModal(true)}
                className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                <BookmarkPlus className="w-5 h-5" />
                Agregar a mi lista
              </button>
              <button
                onClick={() => setShowReviewForm(true)}
                className="flex-1 border-2 border-red-600 text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors"
              >
                Escribir reseña
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de review */}
      {showReviewForm && (
        <ReviewForm
          bookId={book.id}
          bookTitle={book.titulo}
          onSuccess={() => {
            setShowReviewForm(false);
            onReviewCreated();
          }}
          onCancel={() => setShowReviewForm(false)}
        />
      )}

      {/* Modal de usuarios que dieron like */}
      {showLikesModal && (
        <BookLikesModal
          bookId={book.id}
          onClose={() => setShowLikesModal(false)}
        />
      )}

      {/* ✅ NUEVO: Modal para agregar a lista */}
      {showAddToListModal && (
        <AddToListModal
          bookId={book.id}
          bookTitle={book.titulo}
          onClose={() => setShowAddToListModal(false)}
        />
      )}
    </>
  );
}