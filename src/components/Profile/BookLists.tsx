import { Link } from 'react-router-dom';
import { BookMarked, Lock, Globe, Plus } from 'lucide-react';
import type { ListaSimple } from '../../types';

interface BookListsProps {
  lists: ListaSimple[];
  isOwnProfile: boolean; // ✅ NUEVO
  onCreateListClick?: () => void; // ✅ NUEVO
}

export default function BookLists({ lists, isOwnProfile, onCreateListClick }: BookListsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <BookMarked className="w-6 h-6 text-red-600" />
          Listas de Libros
        </h2>
        
        {/* ✅ NUEVO: Botón para crear lista */}
        {isOwnProfile && onCreateListClick && (
          <button
            onClick={onCreateListClick}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nueva Lista
          </button>
        )}
      </div>

      {lists.length === 0 ? (
        <div className="text-center py-8">
          <BookMarked className="w-16 h-16 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 mb-4">No hay listas creadas</p>
          {isOwnProfile && onCreateListClick && (
            <button
              onClick={onCreateListClick}
              className="text-red-600 font-semibold hover:text-red-700 transition-colors"
            >
              Crear tu primera lista
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lists.map((list) => (
            <Link
              key={list.id}
              to={`/lista/${list.id}`}
              className="block p-4 border-2 border-gray-200 rounded-lg hover:border-red-600 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-1">
                  {list.nombre}
                </h3>
                {list.isPublic ? (
                  <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
                ) : (
                  <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                )}
              </div>

              {list.descripcion && (
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {list.descripcion}
                </p>
              )}

              <p className="text-sm text-gray-500">
                {list.bookCount} {list.bookCount === 1 ? 'libro' : 'libros'}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}