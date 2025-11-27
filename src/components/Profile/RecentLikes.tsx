import { Link } from 'react-router-dom';
import type { LibroSimple } from '../../types';

interface RecentLikesProps {
  books: LibroSimple[];
}

export default function RecentLikes({ books }: RecentLikesProps) {
  if (books.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Me Gusta Recientes</h2>
      
      <div className="grid grid-cols-6 gap-3">
        {books.map((book) => (
          <Link
            key={book.id}
            to={`/books/${book.id}`}
            className="group"
          >
            <div className="relative overflow-hidden rounded-lg shadow-sm group-hover:shadow-lg transition-shadow">
              {book.portadaUrl ? (
                <img
                  src={book.portadaUrl}
                  alt={book.titulo}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-40 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <p className="text-gray-500 text-xs text-center px-2">{book.titulo}</p>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}