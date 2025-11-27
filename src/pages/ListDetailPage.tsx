import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, BookMarked, Trash2, Edit2, ArrowLeft, X, Save } from 'lucide-react';
import { listaService } from '../Service/listaService';
import { handleApiError } from '../Service/api';
import { useAuth } from '../context/AuthContext';
import type { ListaLibrosDTO } from '../types';
import BookCard from '../components/books/BookCard';

export default function ListDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userId } = useAuth();
  
  const [lista, setLista] = useState<ListaLibrosDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editNombre, setEditNombre] = useState('');
  const [editDescripcion, setEditDescripcion] = useState(''); // ✅ NUEVO
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadLista();
  }, [id]);

  const loadLista = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const data = await listaService.getListaById(parseInt(id));
      setLista(data);
      setEditNombre(data.nombre);
      setEditDescripcion(data.descripcion || ''); // ✅ NUEVO
    } catch (err) {
      console.error('Error al cargar lista:', err);
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!lista || editNombre.trim().length === 0) return;

    try {
      setUpdating(true);
      await listaService.updateLista(lista.id, { 
        nombre: editNombre.trim(),
        descripcion: editDescripcion.trim() || undefined // ✅ NUEVO
      });
      await loadLista();
      setIsEditing(false);
    } catch (err) {
      console.error('Error al actualizar lista:', err);
      alert(handleApiError(err));
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveBook = async (bookId: number) => {
    if (!lista) return;
    if (!confirm('¿Quieres eliminar este libro de la lista?')) return;

    try {
      await listaService.removeBookFromList(lista.id, bookId);
      await loadLista();
    } catch (err) {
      console.error('Error al remover libro:', err);
      alert(handleApiError(err));
    }
  };

  const handleDeleteLista = async () => {
    if (!lista) return;
    if (!confirm('¿Estás seguro de que deseas eliminar esta lista? Esta acción no se puede deshacer.')) return;

    try {
      setDeleting(true);
      await listaService.deleteLista(lista.id);
      navigate(-1);
    } catch (err) {
      console.error('Error al eliminar lista:', err);
      alert(handleApiError(err));
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-red-600" />
      </div>
    );
  }

  if (error || !lista) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Lista no encontrada</h2>
          <p className="text-gray-600 mb-4">{error || 'La lista que buscas no existe'}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  const isOwner = userId === lista.userId;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver</span>
          </button>

          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  {/* Nombre */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1">
                      Nombre
                    </label>
                    <input
                      type="text"
                      value={editNombre}
                      onChange={(e) => setEditNombre(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      disabled={updating}
                      maxLength={100}
                    />
                  </div>
                  
                  {/* ✅ NUEVO: Descripción */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-1">
                      Descripción (opcional)
                    </label>
                    <textarea
                      value={editDescripcion}
                      onChange={(e) => setEditDescripcion(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                      disabled={updating}
                      maxLength={500}
                      rows={3}
                      placeholder="Breve descripción de tu lista"
                    />
                  </div>

                  {/* Botones */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleUpdate}
                      disabled={updating || editNombre.trim().length === 0}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      {updating ? 'Guardando...' : 'Guardar'}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditNombre(lista.nombre);
                        setEditDescripcion(lista.descripcion || '');
                      }}
                      disabled={updating}
                      className="px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-2">
                    <BookMarked className="w-8 h-8 text-red-600" />
                    <h1 className="text-3xl font-bold text-gray-900">{lista.nombre}</h1>
                    {isOwner && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  
                  {/* ✅ NUEVO: Mostrar descripción */}
                  {lista.descripcion && (
                    <p className="text-gray-600 mb-2">{lista.descripcion}</p>
                  )}
                  
                  <p className="text-gray-500">
                    {lista.libros?.length || 0} {lista.libros?.length === 1 ? 'libro' : 'libros'}
                  </p>
                </>
              )}
            </div>

            {isOwner && !isEditing && (
              <button
                onClick={handleDeleteLista}
                disabled={deleting}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-5 h-5" />
                {deleting ? 'Eliminando...' : 'Eliminar lista'}
              </button>
            )}
          </div>
        </div>

        {/* Libros */}
        {lista.libros && lista.libros.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {lista.libros.map((libro) => (
              <div key={libro.id} className="relative group">
                <BookCard book={libro} />
                {isOwner && (
                  <button
                    onClick={() => handleRemoveBook(libro.id)}
                    className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-700"
                    title="Eliminar de la lista"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <BookMarked className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Esta lista está vacía
            </h3>
            <p className="text-gray-600">
              Agrega libros para empezar a construir tu colección
            </p>
          </div>
        )}
      </div>
    </div>
  );
}