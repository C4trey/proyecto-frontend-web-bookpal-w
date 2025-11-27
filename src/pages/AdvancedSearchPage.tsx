import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdvancedSearchFilters, { type SearchFilters } from '../components/books/AdvancedSearchFilters';
import BookSearchResultCard from '../components/books/BookSearchResultCard';
import { bookService } from '../Service/bookService';
import type { Book } from '../types';
import { Loader2, ArrowLeft, BookOpen } from 'lucide-react';

export default function AdvancedSearchPage() {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [currentFilters, setCurrentFilters] = useState<SearchFilters>({});
  const [hasSearched, setHasSearched] = useState(false);

  const handleApplyFilters = async (filters: SearchFilters) => {
    try {
      setLoading(true);
      setCurrentFilters(filters);
      setHasSearched(true);
      
      const response = await bookService.searchAdvanced(filters, 0, 20);
      
      setBooks(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
      setPage(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error en búsqueda avanzada:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = async (newPage: number) => {
    try {
      setLoading(true);
      const response = await bookService.searchAdvanced(currentFilters, newPage, 20);
      
      setBooks(response.content);
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error al cambiar página:', error);
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Búsqueda avanzada
          </h1>
          <p className="text-gray-600">
            Utiliza los filtros para encontrar exactamente lo que buscas
          </p>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar con filtros */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <AdvancedSearchFilters
                onApplyFilters={handleApplyFilters}
                initialFilters={currentFilters}
              />
            </div>
          </div>

          {/* Resultados */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-red-600" />
              </div>
            ) : hasSearched ? (
              books.length > 0 ? (
                <>
                  {/* Header de resultados */}
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900">
                      {totalElements} {totalElements === 1 ? 'resultado encontrado' : 'resultados encontrados'}
                    </h2>
                  </div>

                  {/* Lista de resultados */}
                  <div className="space-y-4 mb-8">
                    {books.map((book) => (
                      <BookSearchResultCard key={book.id} book={book} />
                    ))}
                  </div>

                  {/* Paginación */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 0}
                        className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Anterior
                      </button>

                      <div className="flex gap-2">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNumber;
                          if (totalPages <= 5) {
                            pageNumber = i;
                          } else if (page < 3) {
                            pageNumber = i;
                          } else if (page >= totalPages - 3) {
                            pageNumber = totalPages - 5 + i;
                          } else {
                            pageNumber = page - 2 + i;
                          }

                          return (
                            <button
                              key={pageNumber}
                              onClick={() => handlePageChange(pageNumber)}
                              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                pageNumber === page
                                  ? 'bg-red-600 text-white'
                                  : 'border border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {pageNumber + 1}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page >= totalPages - 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Siguiente
                      </button>
                    </div>
                  )}
                </>
              ) : (
                /* Sin resultados */
                <div className="text-center py-20">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                    <BookOpen className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    No se encontraron resultados
                  </h3>
                  <p className="text-gray-600">
                    Intenta ajustar los filtros de búsqueda
                  </p>
                </div>
              )
            ) : (
              /* Estado inicial */
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-100 to-orange-100 rounded-full mb-6">
                  <BookOpen className="w-10 h-10 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Configura tus filtros
                </h3>
                <p className="text-gray-600">
                  Utiliza el panel de la izquierda para comenzar tu búsqueda
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}