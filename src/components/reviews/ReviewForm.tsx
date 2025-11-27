import { useState } from "react";
import { Star, X } from "lucide-react";

interface ReviewFormProps {
  bookId: number;
  bookTitle: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export default function ReviewForm({ bookId, bookTitle, onSuccess, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comentario, setComentario] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      setError("Por favor, selecciona una calificación");
      return;
    }

    if (comentario.trim().length === 0) {
      setError("Por favor, escribe tu reseña");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/review/libro/${bookId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating, comentario }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear la reseña");
      }

      onSuccess();
    } catch (err: any) {
      console.error("Error creating review:", err);
      setError(err.message || "Error al crear la reseña");
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar click en estrella (permite media estrella)
  const handleStarClick = (starIndex: number, isHalf: boolean) => {
    const newRating = isHalf ? starIndex - 0.5 : starIndex;
    setRating(newRating);
  };

  // Función para determinar cómo mostrar cada estrella
  const getStarFill = (starIndex: number, currentRating: number) => {
    if (currentRating >= starIndex) {
      return "full";
    } else if (currentRating >= starIndex - 0.5) {
      return "half";
    }
    return "empty";
  };

  const displayRating = hoverRating || rating;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Escribe tu reseña</h2>
              <p className="text-gray-600 mt-1">{bookTitle}</p>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Rating con media estrella */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Calificación *
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const fillType = getStarFill(star, displayRating);
                  
                  return (
                    <div
                      key={star}
                      className="relative cursor-pointer transition-transform hover:scale-110"
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      {/* Mitad izquierda de la estrella (media estrella) */}
                      <div
                        className="absolute inset-0 w-1/2 z-10"
                        onClick={() => handleStarClick(star, true)}
                        onMouseEnter={() => setHoverRating(star - 0.5)}
                      />
                      
                      {/* Mitad derecha de la estrella (estrella completa) */}
                      <div
                        className="absolute inset-0 left-1/2 w-1/2 z-10"
                        onClick={() => handleStarClick(star, false)}
                        onMouseEnter={() => setHoverRating(star)}
                      />

                      {/* Estrella visual */}
                      <div className="relative">
                        {fillType === "full" && (
                          <Star className="w-10 h-10 fill-yellow-400 text-yellow-400" />
                        )}
                        {fillType === "half" && (
                          <div className="relative">
                            <Star className="w-10 h-10 text-gray-300" />
                            <div className="absolute inset-0 overflow-hidden w-1/2">
                              <Star className="w-10 h-10 fill-yellow-400 text-yellow-400" />
                            </div>
                          </div>
                        )}
                        {fillType === "empty" && (
                          <Star className="w-10 h-10 text-gray-300" />
                        )}
                      </div>
                    </div>
                  );
                })}
                {rating > 0 && (
                  <span className="ml-3 text-lg font-semibold text-gray-900">
                    {rating.toFixed(1)}
                  </span>
                )}
              </div>
            </div>

            {/* Comentario */}
            <div className="mb-6">
              <label htmlFor="comentario" className="block text-sm font-semibold text-gray-900 mb-3">
                Tu reseña *
              </label>
              <textarea
                id="comentario"
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="¿Qué te pareció este libro? Comparte tu opinión..."
                maxLength={500}
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm text-gray-500">
                  Máximo 500 caracteres
                </p>
                <p className={`text-sm ${comentario.length > 450 ? "text-red-600" : "text-gray-500"}`}>
                  {comentario.length}/500
                </p>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Botones */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || rating === 0 || comentario.trim().length === 0}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Publicando..." : "Publicar reseña"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}