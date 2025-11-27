import { useState } from 'react';
import { X, Loader2, BookmarkPlus } from 'lucide-react';
import { listaService } from '../../Service/listaService';
import { handleApiError } from '../../Service/api';

interface CreateListModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateListModal({ onClose, onSuccess }: CreateListModalProps) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState(''); // ✅ NUEVO
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (nombre.trim().length === 0) {
      setError('El nombre de la lista es obligatorio');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await listaService.createLista({ 
        nombre: nombre.trim(),
        descripcion: descripcion.trim() || undefined // ✅ Solo enviar si no está vacío
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error al crear lista:', err);
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <BookmarkPlus className="w-6 h-6 text-red-600" />
            <h2 className="text-xl font-bold text-gray-900">Crear Nueva Lista</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Nombre */}
          <div className="mb-4">
            <label htmlFor="listName" className="block text-sm font-semibold text-gray-900 mb-2">
              Nombre de la lista *
            </label>
            <input
              type="text"
              id="listName"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Mis favoritos de 2025"
              maxLength={100}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              disabled={loading}
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-1">{nombre.length}/100</p>
          </div>

          {/* ✅ NUEVO: Descripción */}
          <div className="mb-4">
            <label htmlFor="listDescription" className="block text-sm font-semibold text-gray-900 mb-2">
              Descripción (opcional)
            </label>
            <textarea
              id="listDescription"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Ej: Libros que quiero leer este año"
              maxLength={500}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">{descripcion.length}/500</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Footer */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || nombre.trim().length === 0}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Creando...' : 'Crear Lista'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}