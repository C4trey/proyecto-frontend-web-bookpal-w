import { useState } from 'react';
import { X, Loader2, Upload } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../Service/api';
import type { ProfileUser } from '../../types';

interface EditProfileModalProps {
  user: ProfileUser;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditProfileModal({ user, onClose, onSuccess }: EditProfileModalProps) {
  const { refreshUser } = useAuth();
  
  const [formData, setFormData] = useState({
    nombre: user.nombre,
    apellido: user.apellido,
    username: user.username,
    bio: user.bio || '',
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const getPreviewUrl = () => {
    if (selectedFile) {
      return URL.createObjectURL(selectedFile);
    }
    
    if (user.profilePicture) {
      if (user.profilePicture.startsWith('http')) {
        return user.profilePicture;
      }
      return `http://localhost:8080${user.profilePicture}`;
    }
    
    return '';
  };

  const [previewUrl, setPreviewUrl] = useState<string>(getPreviewUrl());
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona una imagen válida');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen no puede superar 5MB');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let newProfilePictureUrl = user.profilePicture;

      // ✅ 1. Si hay imagen nueva, subirla PRIMERO
      if (selectedFile) {
        setUploading(true);
        console.log('Subiendo imagen...');
        
        const formDataImage = new FormData();
        formDataImage.append('file', selectedFile);

        const uploadResponse = await api.post(
          '/api/upload/profile-picture',
          formDataImage,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        newProfilePictureUrl = uploadResponse.data.url;
        console.log('Imagen subida:', newProfilePictureUrl);
        setUploading(false);
      }

      // ✅ 2. Actualizar perfil
      const updateData: any = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        username: formData.username,
        bio: formData.bio,
      };

      // Solo incluir profilePicture si se subió una nueva imagen
      if (selectedFile && newProfilePictureUrl) {
        updateData.profilePicture = newProfilePictureUrl;
      }

      console.log('Actualizando perfil con:', updateData);

      await api.put(`/api/usuarios/${user.id}`, updateData);

      // ✅ 3. Refrescar usuario en contexto
      console.log('Refrescando datos del usuario...');
      await refreshUser();

      // ✅ 4. Esperar un poco y luego redirigir con window.location
      // Esto fuerza una recarga completa y actualiza todo
      setTimeout(() => {
        if (formData.username !== user.username) {
          // Si cambió el username, ir al nuevo perfil
          window.location.href = `/profile/${formData.username}`;
        } else {
          // Si no cambió, recargar la página actual
          window.location.reload();
        }
      }, 500);

    } catch (err: any) {
      console.error('Error al actualizar perfil:', err);
      setError(err.response?.data?.message || 'Error al actualizar el perfil');
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Editar Perfil</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={loading || uploading}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Foto de Perfil */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Foto de Perfil
              </label>
              
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-500 to-orange-500 text-white text-3xl font-bold">
                      {formData.nombre.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                    <Upload size={20} />
                    <span>Seleccionar imagen</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      disabled={loading || uploading}
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, PNG o GIF. Máximo 5MB.
                  </p>
                  {selectedFile && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ {selectedFile.name} seleccionado
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Nombre */}
            <div className="mb-4">
              <label htmlFor="nombre" className="block text-sm font-semibold text-gray-900 mb-2">
                Nombre
              </label>
              <input
                type="text"
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
                disabled={loading || uploading}
              />
            </div>

            {/* Apellido */}
            <div className="mb-4">
              <label htmlFor="apellido" className="block text-sm font-semibold text-gray-900 mb-2">
                Apellido
              </label>
              <input
                type="text"
                id="apellido"
                value={formData.apellido}
                onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
                disabled={loading || uploading}
              />
            </div>

            {/* Username */}
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-semibold text-gray-900 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
                disabled={loading || uploading}
              />
            </div>

            {/* Bio */}
            <div className="mb-6">
              <label htmlFor="bio" className="block text-sm font-semibold text-gray-900 mb-2">
                Biografía
              </label>
              <textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
                maxLength={500}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                placeholder="Cuéntanos algo sobre ti..."
                disabled={loading || uploading}
              />
              <p className="text-sm text-gray-500 mt-1">{formData.bio.length}/500</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading || uploading}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || uploading}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {(loading || uploading) && <Loader2 className="w-5 h-5 animate-spin" />}
                {uploading ? 'Subiendo imagen...' : loading ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}