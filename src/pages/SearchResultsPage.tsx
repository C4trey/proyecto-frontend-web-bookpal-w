import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import SearchBar from '../components/books/SearchBar';
import BookSearchResultCard from '../components/books/BookSearchResultCard';
import { bookService } from '../Service/bookService';
import type { Book } from '../types';
import { Loader2, SlidersHorizontal, BookOpen } from 'lucide-react';

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    if (query) {
      searchBooks(query, 0);
    }
  }, [query]);

  const searchBooks = async (searchQuery: string, pageNum: number) => {
    try {
      setLoading(true);
      const response = await bookService.search(searchQuery, pageNum, 20);
      setBooks(response.content);
      setTotalPages(response.totalPages);
      setTotalElements(response.totalElements);
      setPage(pageNum);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error al buscar libros:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    searchBooks(query, newPage);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con búsqueda */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <SearchBar showAdvanced={false} />
            </div>
            <button
              onClick={() => navigate('/search/advanced')}
              className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:border-red-600 hover:text-red-600 transition-colors"
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span className="hidden sm:inline">Filtros</span>
            </button>
          </div>
        </div>
      </div>

      {/* Resultados */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-red-600" />
          </div>
        ) : (
          <>
            {/* Header de resultados */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Mostrando resultados para "{query}"
              </h2>
              <p className="text-gray-600 mt-1">
                {totalElements} {totalElements === 1 ? 'resultado encontrado' : 'resultados encontrados'}
              </p>
            </div>

            {books.length > 0 ? (
              <>
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

                    {/* Números de página */}
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
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  No se encontraron resultados
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  No encontramos libros que coincidan con "{query}". 
                  Intenta con otras palabras clave o usa la búsqueda avanzada.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={() => navigate('/')}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                  >
                    Volver al inicio
                  </button>
                  <button
                    onClick={() => navigate('/search/advanced')}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-red-600 hover:text-red-600 transition-colors"
                  >
                    Búsqueda avanzada
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}