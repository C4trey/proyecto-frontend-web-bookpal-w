import { useState } from 'react';
import { Plus, Edit, Search, AlertCircle, CheckCircle } from 'lucide-react';
import { adminService } from '../../Service/adminService';
import type { UpdateBookRequest } from '../../Service/adminService';

export default function BookManagement() {
  const [googleVolumeId, setGoogleVolumeId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Para editar libro
  const [editingBook, setEditingBook] = useState<{ id: number; data: UpdateBookRequest } | null>(null);

  const handleAddFromGoogle = async () => {
    if (!googleVolumeId.trim()) {
      setMessage({ type: 'error', text: 'Ingresa un Volume ID de Google Books' });
      return;
    }

    setLoading(true);
    try {
      const book = await adminService.addBookFromGoogle({ volumeId: googleVolumeId });
      setMessage({ 
        type: 'success', 
        text: `Libro "${book.titulo}" agregado exitosamente` 
      });
      setGoogleVolumeId('');
    } catch (error: any) {
      console.error('Error al agregar libro:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Error al agregar libro desde Google Books' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBook = async () => {
    if (!editingBook) return;

    setLoading(true);
    try {
      // Filtrar solo los campos que tienen valor
      const updates: UpdateBookRequest = {};
      if (editingBook.data.titulo) updates.titulo = editingBook.data.titulo;
      if (editingBook.data.autor) updates.autor = editingBook.data.autor;
      if (editingBook.data.sinopsis) updates.sinopsis = editingBook.data.sinopsis;
      if (editingBook.data.genero) updates.genero = editingBook.data.genero;
      if (editingBook.data.anioPublicacion) updates.anioPublicacion = editingBook.data.anioPublicacion;

      const book = await adminService.updateBook(editingBook.id, updates);
      setMessage({ 
        type: 'success', 
        text: `Libro "${book.titulo}" actualizado exitosamente` 
      });
      setEditingBook(null);
    } catch (error: any) {
      console.error('Error al actualizar libro:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Error al actualizar libro' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Agregar libro desde Google Books */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Plus className="w-6 h-6" />
          Agregar Libro desde Google Books
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Volume ID de Google Books
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={googleVolumeId}
                onChange={(e) => setGoogleVolumeId(e.target.value)}
                placeholder="Ej: zyTCAlFPjgYC"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                onClick={handleAddFromGoogle}
                disabled={loading}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Agregando...' : 'Agregar Libro'}
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              💡 Encuentra el Volume ID en la URL de Google Books: 
              <code className="ml-1 bg-gray-100 px-2 py-1 rounded">
                https://books.google.com/books?id=<strong>zyTCAlFPjgYC</strong>
              </code>
            </p>
          </div>
        </div>
      </div>

      {/* Mensaje de estado */}
      {message && (
        <div className={`rounded-lg p-4 flex items-center gap-3 ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Editar libro */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Edit className="w-6 h-6" />
          Editar Libro
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID del Libro
            </label>
            <input
              type="number"
              value={editingBook?.id || ''}
              onChange={(e) => setEditingBook({ 
                id: parseInt(e.target.value), 
                data: editingBook?.data || {} 
              })}
              placeholder="ID del libro a editar"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {editingBook && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título
                  </label>
                  <input
                    type="text"
                    value={editingBook.data.titulo || ''}
                    onChange={(e) => setEditingBook({
                      ...editingBook,
                      data: { ...editingBook.data, titulo: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Autor
                  </label>
                  <input
                    type="text"
                    value={editingBook.data.autor || ''}
                    onChange={(e) => setEditingBook({
                      ...editingBook,
                      data: { ...editingBook.data, autor: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Género
                  </label>
                  <input
                    type="text"
                    value={editingBook.data.genero || ''}
                    onChange={(e) => setEditingBook({
                      ...editingBook,
                      data: { ...editingBook.data, genero: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Año de Publicación
                  </label>
                  <input
                    type="text"
                    value={editingBook.data.anioPublicacion || ''}
                    onChange={(e) => setEditingBook({
                      ...editingBook,
                      data: { ...editingBook.data, anioPublicacion: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sinopsis
                </label>
                <textarea
                  value={editingBook.data.sinopsis || ''}
                  onChange={(e) => setEditingBook({
                    ...editingBook,
                    data: { ...editingBook.data, sinopsis: e.target.value }
                  })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <button
                onClick={handleUpdateBook}
                disabled={loading}
                className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors font-semibold"
              >
                {loading ? 'Actualizando...' : 'Actualizar Libro'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}