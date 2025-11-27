import { useState } from 'react';
import { Search, ExternalLink, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../Service/api';

export default function ModerationPanel() {
  const [searchType, setSearchType] = useState<'user' | 'book' | 'review'>('user');
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      let endpoint = '';
      
      switch (searchType) {
        case 'user':
          endpoint = `/api/usuarios/search?query=${searchQuery}`;
          break;
        case 'book':
          endpoint = `/api/libros/search?query=${searchQuery}`;
          break;
        case 'review':
          endpoint = `/api/resenas/search?query=${searchQuery}`;
          break;
      }

      const { data } = await api.get(endpoint);
      setResults(Array.isArray(data) ? data : [data]);
    } catch (error) {
      console.error('Error al buscar:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, type: string) => {
    if (!confirm(`¿Estás seguro de eliminar este ${type}?`)) return;

    try {
      let endpoint = '';
      switch (type) {
        case 'user':
          endpoint = `/api/usuarios/${id}`;
          break;
        case 'book':
          endpoint = `/libro/${id}`;
          break;
        case 'review':
          endpoint = `/api/resenas/${id}`;
          break;
      }

      await api.delete(endpoint);
      alert(`${type} eliminado exitosamente`);
      handleSearch(); // Recargar resultados
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('Error al eliminar');
    }
  };

  const handleNavigate = (item: any, type: string) => {
    switch (type) {
      case 'user':
        navigate(`/profile/${item.username}`);
        break;
      case 'book':
        navigate(`/books/${item.id}`);
        break;
      case 'review':
        navigate(`/books/${item.libroId}`);
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Buscador */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Panel de Moderación</h2>
        
        <div className="space-y-4">
          {/* Selector de tipo */}
          <div className="flex gap-2">
            <button
              onClick={() => setSearchType('user')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                searchType === 'user'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Usuarios
            </button>
            <button
              onClick={() => setSearchType('book')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                searchType === 'book'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Libros
            </button>
            <button
              onClick={() => setSearchType('review')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                searchType === 'review'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Reseñas
            </button>
          </div>

          {/* Barra de búsqueda */}
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder={`Buscar ${searchType === 'user' ? 'usuario' : searchType === 'book' ? 'libro' : 'reseña'}...`}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
        </div>
      </div>

      {/* Resultados */}
      {results.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-bold mb-4">
              Resultados ({results.length})
            </h3>
            <div className="space-y-3">
              {results.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    {searchType === 'user' && (
                      <div>
                        <p className="font-semibold">{item.nombre} {item.apellido}</p>
                        <p className="text-sm text-gray-600">@{item.username}</p>
                        <p className="text-sm text-gray-500">{item.email}</p>
                      </div>
                    )}
                    {searchType === 'book' && (
                      <div>
                        <p className="font-semibold">{item.titulo}</p>
                        <p className="text-sm text-gray-600">{item.autor}</p>
                        <p className="text-sm text-gray-500">{item.genero} • {item.anioPublicacion}</p>
                      </div>
                    )}
                    {searchType === 'review' && (
                      <div>
                        <p className="font-semibold">Reseña por {item.username}</p>
                        <p className="text-sm text-gray-600">{item.comentario?.substring(0, 100)}...</p>
                        <p className="text-sm text-gray-500">⭐ {item.calificacion}/5</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* ✅ BOTÓN PARA IR AL RECURSO */}
                    <button
                      onClick={() => handleNavigate(item, searchType)}
                      className="flex items-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                      title="Ver detalles"
                    >
                      <Eye className="w-4 h-4" />
                      Ver
                    </button>

                    {/* Botón de eliminar */}
                    <button
                      onClick={() => handleDelete(item.id, searchType)}
                      className="flex items-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}