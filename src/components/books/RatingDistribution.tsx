import { Star } from "lucide-react";
import type { RatingDistribution as RatingDist } from "../../types";

interface RatingDistributionProps {
  averageRating: number;
  totalReviews: number;
  distribution: RatingDist;
}

export default function RatingDistribution({
  averageRating,
  totalReviews,
  distribution,
}: RatingDistributionProps) {
  const maxCount = Math.max(...Object.values(distribution));

  const getBarColor = (rating: number) => {
    if (rating === 5) return "bg-green-500";
    if (rating === 4) return "bg-green-400";
    if (rating === 3) return "bg-yellow-400";
    if (rating === 2) return "bg-orange-400";
    return "bg-red-500";
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
      <div className="text-center mb-6">
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">
          Calificación
        </h3>
        <div className="text-5xl font-bold text-gray-900 mb-2">
          {averageRating > 0 ? averageRating.toFixed(1) : "—"}
        </div>
        <p className="text-gray-500 text-sm">
          {totalReviews} {totalReviews === 1 ? "reseña" : "reseñas"}
        </p>
      </div>

      {/* Distribución de ratings */}
      <div className="space-y-3">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = distribution[rating as keyof RatingDist];
          const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;

          return (
            <div key={rating} className="flex items-center gap-3">
              {/* Estrellas */}
              <div className="flex items-center gap-0.5 w-20">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              {/* Barra de progreso */}
              <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getBarColor(rating)} transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {/* Contador */}
              <div className="w-12 text-right text-sm font-medium text-gray-600">
                {count}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}