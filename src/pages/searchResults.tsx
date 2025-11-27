import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Book, PageResponse } from "../types/index.ts";
import { searchBooks } from "../Service/searchService.ts";
import BookGridVertical from "../components/books/BookGridVertical.tsx";

export default function SearchResult() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const response: PageResponse<Book> = await searchBooks(query, page, 20);
      setBooks(response.content || []);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      console.error(err);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(0);     // Reset page when query changes
  }, [query]);

  useEffect(() => {
    if (query.trim()) {
      fetchBooks();
    }
  }, [query, page]);

  if (!query.trim()) {
    return (
      <div className="text-center mt-10 text-gray-500">
        Escribe algo para buscar libros...
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-500">
        Buscando libros...
      </div>
    );
  }

  return (
    <div className="px-4 py-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">
        Resultados para: <span className="text-red-600">{query}</span>
      </h2>

      {books.length === 0 ? (
        <p className="text-center text-gray-500">
          No se encontraron resultados.
        </p>
      ) : (
        <BookGridVertical books={books} />
      )}

      {/* PAGINACIÓN */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-6">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Anterior
          </button>

          <button
            disabled={page + 1 >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}