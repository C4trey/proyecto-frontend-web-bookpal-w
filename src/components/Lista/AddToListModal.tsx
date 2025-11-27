import { useState, useEffect } from 'react';
import { X, BookmarkPlus, Loader2, Check, Plus } from 'lucide-react';
import { listaService } from '../../Service/listaService';
import type { Lista } from '../../types';

interface AddToListModalProps {
  bookId: number;
  bookTitle: string;
  onClose: () => void;
}

export default function AddToListModal({ bookId, bookTitle, onClose }: AddToListModalProps) {
  const [listas, setListas] = useState<Lista[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingListId, setProcessingListId] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newListNombre, setNewListNombre] = useState('');
  const [newListDescripcion, setNewListDescripcion] = useState('');
  const [creatingList, setCreatingList] = useState(false);

  useEffect(() => {
    fetchListas();
  }, []);

  const fetchListas = async () => {
    try {
      setLoading(true);
      const data = await listaService.getMyLists();
      setListas(data);
    } catch (error) {
      console.error('Error al cargar listas:', error);
      setMessage({ type: 'error', text: 'Error al cargar tus listas' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToList = async (listaId: number) => {
    try {
      setProcessingListId(listaId);
      setMessage(null);

      await listaService.addBookToList(listaId, bookId);
      
      setMessage({ type: 'success', text: '¡Libro agregado a la lista!' });
      
      // ✅ Recargar listas en vez de actualizar estado local
      await fetchListas();

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error: any) {
      console.error('Error al agregar libro a lista:', error);
      let errorMsg = 'Error al agregar el libro';
      
      if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setProcessingListId(null);
    }
  };

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newListNombre.trim()) {
      setMessage({ type: 'error', text: 'El nombre de la lista no puede estar vacío' });
      return;
    }

    try {
      setCreatingList(true);
      setMessage(null);

      const newLista = await listaService.createLista({ 
        nombre: newListNombre.trim(),
        descripcion: newListDescripcion.trim() || undefined
      });
      
      await listaService.addBookToList(newLista.id, bookId);
      
      setMessage({ type: 'success', text: '¡Lista creada y libro agregado!' });
      
      // ✅ Recargar listas para mostrar la nueva
      await fetchListas();
      
      // ✅ Ocultar formulario
      setShowCreateForm(false);
      setNewListNombre('');
      setNewListDescripcion('');
      
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error: any) {
      console.error('Error al crear lista:', error);
      let errorMsg = 'Error al crear la lista';
      
      if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setCreatingList(false);
    }
  };

  const isBookInList = (lista: Lista) => {
    return lista.bookIds?.includes(bookId) || false;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-200">
          <div className="flex-1 pr-4">
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              Agregar a lista
            </h2>
            <p className="text-sm text-gray-600 line-clamp-2">
              {bookTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-red-600" />
            </div>
          )}

          {message && (
            <div
              className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {message.type === 'success' && <Check className="w-5 h-5 flex-shrink-0" />}
              <span className="text-sm font-medium">{message.text}</span>
            </div>
          )}

          {!loading && listas.length > 0 && (
            <div className="space-y-2 mb-4">
              {listas.map((lista) => {
                const inList = isBookInList(lista);
                const isProcessing = processingListId === lista.id;

                return (
                  <button
                    key={lista.id}
                    onClick={() => !inList && !isProcessing && handleAddToList(lista.id)}
                    disabled={inList || isProcessing}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      inList
                        ? 'border-green-500 bg-green-50 cursor-default'
                        : isProcessing
                        ? 'border-gray-300 bg-gray-50 cursor-wait'
                        : 'border-gray-200 hover:border-red-500 hover:bg-red-50 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {lista.nombre}
                        </h3>
                        {lista.descripcion && (
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                            {lista.descripcion}
                          </p>
                        )}
                        <p className="text-sm text-gray-600 mt-1">
                          {lista.bookIds?.length || 0} {lista.bookIds?.length === 1 ? 'libro' : 'libros'}
                        </p>
                      </div>
                      <div className="ml-3 flex-shrink-0">
                        {isProcessing ? (
                          <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                        ) : inList ? (
                          <div className="bg-green-500 rounded-full p-1">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        ) : (
                          <BookmarkPlus className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {!loading && listas.length === 0 && !showCreateForm && (
            <div className="text-center py-8">
              <BookmarkPlus className="w-16 h-16 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 mb-4">No tienes listas creadas</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="text-red-600 font-semibold hover:text-red-700 transition-colors"
              >
                Crear tu primera lista
              </button>
            </div>
          )}

          {!showCreateForm && listas.length > 0 && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="w-full p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-red-500 hover:bg-red-50 transition-all flex items-center justify-center gap-2 text-gray-600 hover:text-red-600"
            >
              <Plus className="w-5 h-5" />
              <span className="font-semibold">Crear nueva lista</span>
            </button>
          )}

          {showCreateForm && (
            <form onSubmit={handleCreateList} className="mt-4 p-4 bg-gray-50 rounded-lg">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Nombre de la nueva lista *
              </label>
              <input
                type="text"
                value={newListNombre}
                onChange={(e) => setNewListNombre(e.target.value)}
                placeholder="Ej: Mis favoritos de fantasía"
                maxLength={100}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent mb-3"
                autoFocus
              />
              
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Descripción (opcional)
              </label>
              <textarea
                value={newListDescripcion}
                onChange={(e) => setNewListDescripcion(e.target.value)}
                placeholder="Breve descripción de tu lista"
                maxLength={500}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent mb-3 resize-none"
              />
              
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={creatingList || !newListNombre.trim()}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {creatingList ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creando...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Crear y agregar
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewListNombre('');
                    setNewListDescripcion('');
                  }}
                  disabled={creatingList}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}