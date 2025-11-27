import { useState } from 'react';
import { Edit, Save, X } from 'lucide-react';
import { adminService } from '../../Service/adminService';
import type { UpdateBookRequest } from '../../Service/adminService';

interface AdminBookActionsProps {
  bookId: number;
  currentData: {
    titulo: string;
    autor: string;
    sinopsis: string;
    genero: string;
    anioPublicacion: string;
  };
  onUpdate: () => void;
}

// ✅ Lista de géneros comunes
const GENEROS = [
  'Fiction', 'Non-Fiction', 'Mystery', 'Thriller', 'Romance', 'Science Fiction',
  'Fantasy', 'Horror', 'Biography', 'History', 'Self-Help', 'Business',
  'Poetry', 'Drama', 'Adventure', 'Children', 'Young Adult', 'Graphic Novel',
  'Cookbooks', 'Art', 'Travel', 'Religion', 'Philosophy', 'Psychology',
  'True Crime', 'Humor', 'Comics', 'Education', 'Health', 'Sports'
];

export default function AdminBookActions({ bookId, currentData, onUpdate }: AdminBookActionsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(currentData);
  const [loading, setLoading] = useState(false);

  // ✅ Generar años (desde 1900 hasta año actual)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1899 }, (_, i) => (currentYear - i).toString());

  const handleSave = async () => {
    setLoading(true);
    try {
      const updates: UpdateBookRequest = {};

      if (formData.titulo !== currentData.titulo) updates.titulo = formData.titulo;
      if (formData.autor !== currentData.autor) updates.autor = formData.autor;
      if (formData.sinopsis !== currentData.sinopsis) updates.sinopsis = formData.sinopsis;
      if (formData.genero !== currentData.genero) updates.genero = formData.genero;
      if (formData.anioPublicacion !== currentData.anioPublicacion) {
        updates.anioPublicacion = formData.anioPublicacion;
      }

      console.log('📤 Enviando actualizaciones:', updates);

      await adminService.updateBook(bookId, updates);
      alert('✅ Libro actualizado exitosamente');
      setIsEditing(false);
      onUpdate();
    } catch (error: any) {
      console.error('❌ Error al actualizar libro:', error);
      alert(`Error: ${error.response?.data?.message || 'No se pudo actualizar el libro'}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isEditing) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Edit className="w-5 h-5 text-red-600" />
            <span className="font-semibold text-red-800">Acciones de Administrador</span>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Editar Libro
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-red-800">Editando Libro</h3>
        <button
          onClick={() => {
            setIsEditing(false);
            setFormData(currentData);
          }}
          className="text-gray-600 hover:text-gray-900"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
          <input
            type="text"
            value={formData.titulo}
            onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Autor</label>
          <input
            type="text"
            value={formData.autor}
            onChange={(e) => setFormData({ ...formData, autor: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>

        {/* ✅ SELECTOR DE GÉNERO */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Género</label>
          <select
            value={formData.genero}
            onChange={(e) => setFormData({ ...formData, genero: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="">Seleccionar género</option>
            {GENEROS.map((genero) => (
              <option key={genero} value={genero}>
                {genero}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={formData.genero}
            onChange={(e) => setFormData({ ...formData, genero: e.target.value })}
            placeholder="O escribe un género personalizado"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent mt-2"
          />
        </div>

        {/* ✅ SELECTOR DE AÑO */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Año de Publicación</label>
          <select
            value={formData.anioPublicacion}
            onChange={(e) => setFormData({ ...formData, anioPublicacion: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="">Seleccionar año</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sinopsis</label>
          <textarea
            value={formData.sinopsis}
            onChange={(e) => setFormData({ ...formData, sinopsis: e.target.value })}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
          <button
            onClick={() => {
              setIsEditing(false);
              setFormData(currentData);
            }}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}