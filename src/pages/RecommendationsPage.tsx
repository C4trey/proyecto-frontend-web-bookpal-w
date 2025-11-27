import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { recommendationService } from '../Service/recommendationService';
import { recommendationToBook } from '../types';
import type { Book, RecommendationDTO, RecommendationReason } from '../types';
import BookCard from '../components/books/BookCard';
import { Loader2, ArrowLeft, Sparkles, RefreshCw } from 'lucide-react';

export default function RecommendationsPage() {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<RecommendationDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      const response = await recommendationService.getRecommendations(50);
      setRecommendations(response.recommendations);
    } catch (error) {
      console.error('Error al cargar recomendaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await recommendationService.refreshRecommendations();
      
      // Esperar 2 segundos y recargar
      setTimeout(() => {
        loadRecommendations();
        setRefreshing(false);
      }, 2000);
    } catch (error) {
      console.error('Error al refrescar recomendaciones:', error);
      setRefreshing(false);
    }
  };

  const getReasonBadge = (reason: RecommendationReason, reasonMessage: string) => {
    const badges = {
      SAME_GENRE: 'bg-purple-100 text-purple-700',
      HIGH_RATED: 'bg-yellow-100 text-yellow-700',
      TRENDING: 'bg-red-100 text-red-700',
      SIMILAR_USERS: 'bg-blue-100 text-blue-700'
    };

    return (
      <span className={`text-xs px-2 py-1 rounded-full ${badges[reason]}`}>
        {reasonMessage}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-red-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Recomendaciones Personalizadas
                </h1>
                <p className="text-gray-600 mt-1">
                  {recommendations.length} libros seleccionados especialmente para ti
                </p>
              </div>
            </div>

            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Actualizando...' : 'Actualizar'}
            </button>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {recommendations.length > 0 ? (
          <div className="space-y-6">
            {recommendations.map((rec) => {
              const book = recommendationToBook(rec);
              return (
                <div key={rec.libroId} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex gap-6">
                    <div className="flex-shrink-0">
                      <BookCard book={book} size="sm" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {rec.titulo}
                          </h3>
                          <p className="text-gray-600">{rec.autor}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-red-600 mb-1">
                            {rec.recommendationScore.toFixed(0)}%
                          </div>
                          <p className="text-xs text-gray-500">Coincidencia</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mb-4">
                        {getReasonBadge(rec.reason, rec.reasonMessage)}
                        
                        {rec.averageRating > 0 && (
                          <span className="text-sm text-gray-600">
                            ⭐ {rec.averageRating.toFixed(1)}
                          </span>
                        )}
                        
                        <span className="text-sm text-gray-500">{rec.genero}</span>
                      </div>

                      <button
                        onClick={() => navigate(`/books/${rec.libroId}`)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                      >
                        Ver detalles
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No hay recomendaciones disponibles
            </h3>
            <p className="text-gray-600 mb-6">
              Interactúa con libros (reseñas, likes) para obtener recomendaciones personalizadas
            </p>
            <button
              onClick={() => navigate('/books')}
              className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Explorar libros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}