import { useState, useEffect } from "react";
import type { ReviewResponseDTO } from "../../types";
import ReviewItem from "./ReviewItem";
import { MessageSquare, Loader2 } from "lucide-react";
import ReviewForm from "./ReviewForm";
import { reviewService } from "../../Service/reviewService";
import { handleApiError } from "../../Service/api";

interface ReviewListProps {
  bookId: number;
  bookTitle: string;
  initialReviews: ReviewResponseDTO[];
  onReviewCreated: () => void;
}

export default function ReviewList({ 
  bookId, 
  bookTitle, 
  initialReviews, 
  onReviewCreated 
}: ReviewListProps) {
  const [reviews, setReviews] = useState<ReviewResponseDTO[]>(initialReviews);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Actualizar reviews cuando cambian las iniciales
  useEffect(() => {
    setReviews(initialReviews);
  }, [initialReviews]);

  // ✅ Recargar reviews después de una acción
  const handleReloadReviews = async () => {
    setIsLoading(true);
    try {
      console.log('🔄 Recargando reviews...');
      const response = await reviewService.getReviewsByBook(bookId, 0, 20);
      setReviews(response.reviews);
      onReviewCreated(); // Notificar al padre para actualizar stats del libro
    } catch (error) {
      console.error('❌ Error al recargar reviews:', error);
      alert(handleApiError(error));
    } finally {
      setIsLoading(false);
    }
  };

  if (reviews.length === 0 && !isLoading) {
    return (
      <>
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Aún no hay reseñas
          </h3>
          <p className="text-gray-600 mb-6">
            Sé el primero en compartir tu opinión sobre este libro
          </p>
          <button
            onClick={() => setShowReviewForm(true)}
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Escribir la primera reseña
          </button>
        </div>

        {showReviewForm && (
          <ReviewForm
            bookId={bookId}
            bookTitle={bookTitle}
            onSuccess={() => {
              setShowReviewForm(false);
              handleReloadReviews();
            }}
            onCancel={() => setShowReviewForm(false)}
          />
        )}
      </>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Reseñas Populares
        </h2>
        <button 
          onClick={handleReloadReviews}
          disabled={isLoading}
          className="text-red-600 hover:text-red-700 font-semibold text-sm disabled:opacity-50 flex items-center gap-2"
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          {isLoading ? 'CARGANDO...' : 'ACTUALIZAR'}
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-red-600" />
        </div>
      )}

      {/* Lista de reviews */}
      {!isLoading && (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewItem 
              key={review.id} 
              review={review} 
              onDelete={handleReloadReviews} // ✅ Recargar al eliminar
              onLike={handleReloadReviews}   // ✅ Recargar al dar like
            />
          ))}
        </div>
      )}

      {/* Botón para agregar review */}
      {!showReviewForm && !isLoading && (
        <button
          onClick={() => setShowReviewForm(true)}
          className="w-full bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
        >
          Escribir una reseña
        </button>
      )}

      {/* Formulario de review */}
      {showReviewForm && (
        <ReviewForm
          bookId={bookId}
          bookTitle={bookTitle}
          onSuccess={() => {
            setShowReviewForm(false);
            handleReloadReviews();
          }}
          onCancel={() => setShowReviewForm(false)}
        />
      )}
    </div>
  );
}