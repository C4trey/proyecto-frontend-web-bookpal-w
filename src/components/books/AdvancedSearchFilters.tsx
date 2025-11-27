import { useState, useEffect } from 'react';
import { bookService } from '../../Service/bookService';

interface AdvancedSearchFiltersProps {
  onApplyFilters: (filters: SearchFilters) => void;
  initialFilters?: SearchFilters;
}

export interface SearchFilters {
  query?: string;
  genero?: string;
  anioDesde?: string;
  anioHasta?: string;
  minRating?: number;
}

export default function AdvancedSearchFilters({ 
  onApplyFilters, 
  initialFilters 
}: AdvancedSearchFiltersProps) {
  const [generos, setGeneros] = useState<string[]>([]);
  const [filters, setFilters] = useState<SearchFilters>(initialFilters || {});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadGeneros();
  }, []);

  const loadGeneros = async () => {
    try {
      setLoading(true);
      const data = await bookService.getGenres();
      setGeneros(data);
    } catch (error) {
      console.error('Error al cargar géneros:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    onApplyFilters(filters);
  };

  const handleReset = () => {
    const emptyFilters: SearchFilters = {};
    setFilters(emptyFilters);
    onApplyFilters(emptyFilters);
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Filtros de búsqueda</h3>
        <button
          onClick={handleReset}
          className="text-sm text-gray-600 hover:text-red-600 transition-colors"
        >
          Limpiar filtros
        </button>
      </div>

      {/* Búsqueda por texto */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Buscar
        </label>
        <input
          type="text"
          value={filters.query || ''}
          onChange={(e) => setFilters({ ...filters, query: e.target.value })}
          placeholder="Título, autor..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {/* Género */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Género
        </label>
        {loading ? (
          <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
            Cargando géneros...
          </div>
        ) : (
          <select
            value={filters.genero || ''}
            onChange={(e) => setFilters({ ...filters, genero: e.target.value || undefined })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">Todos los géneros</option>
            {generos.map((genero) => (
              <option key={genero} value={genero}>
                {genero}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Rango de años */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Año de publicación
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <input
              type="number"
              value={filters.anioDesde || ''}
              onChange={(e) => setFilters({ ...filters, anioDesde: e.target.value || undefined })}
              placeholder="Desde"
              min="1900"
              max={currentYear}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <input
              type="number"
              value={filters.anioHasta || ''}
              onChange={(e) => setFilters({ ...filters, anioHasta: e.target.value || undefined })}
              placeholder="Hasta"
              min="1900"
              max={currentYear}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
      </div>

      {/* Rating mínimo */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Valoración mínima
        </label>
        <select
          value={filters.minRating || ''}
          onChange={(e) => setFilters({ 
            ...filters, 
            minRating: e.target.value ? parseFloat(e.target.value) : undefined 
          })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="">Cualquier valoración</option>
          <option value="1">★ 1+ estrellas</option>
          <option value="2">★★ 2+ estrellas</option>
          <option value="3">★★★ 3+ estrellas</option>
          <option value="4">★★★★ 4+ estrellas</option>
          <option value="5">★★★★★ 5 estrellas</option>
        </select>
      </div>

      {/* Botones */}
      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={handleApply}
          className="w-full px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
        >
          Aplicar filtros
        </button>
      </div>
    </div>
  );
}