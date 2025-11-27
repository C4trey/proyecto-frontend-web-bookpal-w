import { useState, useEffect } from "react";
import { bookService } from "../Service/bookService";
import { recommendationService } from "../Service/recommendationService";
import type { Book, RecommendationDTO } from "../types";
import { recommendationToBook } from "../types";

export function useBooks() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newBooks, setNewBooks] = useState<Book[]>([]);
  const [topBooks, setTopBooks] = useState<Book[]>([]);
  const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
  const [popularReviews, setPopularReviews] = useState<any[]>([]); // Mantén tu tipo de Review

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Cargar en paralelo
      const [newBooksRes, topBooksRes, recommendationsRes] = await Promise.all([
        bookService.getRecent(0, 8),
        bookService.getTopRated(0, 8),
        // ✅ Intentar cargar recomendaciones (puede fallar si no está autenticado)
        recommendationService.getRecommendations(8).catch(() => ({ 
          recommendations: [], 
          totalCount: 0 
        }))
      ]);

      setNewBooks(newBooksRes.content);
      setTopBooks(topBooksRes.content);
      
      // ✅ Convertir recomendaciones a Books
      const recommendedBooksData = recommendationsRes.recommendations.map(
        recommendationToBook
      );
      setRecommendedBooks(recommendedBooksData);

      // TODO: Cargar reviews populares si tienes ese endpoint
      // const reviewsRes = await reviewService.getPopular(0, 6);
      // setPopularReviews(reviewsRes.content);

    } catch (err) {
      console.error("Error loading books data:", err);
      setError(err instanceof Error ? err.message : "Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    newBooks,
    topBooks,
    recommendedBooks,
    popularReviews,
  };
}