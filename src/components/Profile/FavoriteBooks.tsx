import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import type { LibroSimple } from '../../types';

interface FavoriteBooksProps {
  books: LibroSimple[];
}

export default function FavoriteBooks({ books }: FavoriteBooksProps) {
  if (books.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-600">Aún no hay libros favoritos</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Libros Favoritos</h2>
      
      <div className="grid grid-cols-4 gap-4">
        {books.map((book) => (
          <Link
            key={book.id}
            to={`/books/${book.id}`}
            className="group"
          >
            <div className="relative overflow-hidden rounded-lg shadow-md group-hover:shadow-xl transition-shadow">
              {book.portadaUrl ? (
                <img
                  src={book.portadaUrl}
                  alt={book.titulo}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-64 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <p className="text-gray-500 text-sm text-center px-4">{book.titulo}</p>
                </div>
              )}
              
              {/* Rating overlay */}
              {book.avgRating && (
                <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-lg flex items-center gap-1 text-sm">
                  <Star size={14} className="fill-yellow-400 text-yellow-400" />
                  <span>{book.avgRating.toFixed(1)}</span>
                </div>
              )}
            </div>
            
            <h3 className="mt-2 font-semibold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2">
              {book.titulo}
            </h3>
            <p className="text-sm text-gray-600">{book.autor}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}