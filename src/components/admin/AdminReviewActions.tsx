import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { api } from '../../Service/api';

interface AdminReviewActionsProps {
  reviewId: number;
  username: string;
  onDelete: () => void;
}

export default function AdminReviewActions({ reviewId, username, onDelete }: AdminReviewActionsProps) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`¿Estás seguro de eliminar la reseña de ${username}?`)) return;

    setDeleting(true);
    try {
      await api.delete(`/api/resenas/${reviewId}`);
      alert('Reseña eliminada exitosamente');
      onDelete();
    } catch (error) {
      console.error('Error al eliminar reseña:', error);
      alert('Error al eliminar la reseña');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="flex items-center gap-1 px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50 transition-colors"
      title="Eliminar reseña (Admin)"
    >
      <Trash2 className="w-3 h-3" />
      {deleting ? 'Eliminando...' : 'Eliminar'}
    </button>
  );
}