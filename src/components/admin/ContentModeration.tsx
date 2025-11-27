import { useState } from 'react';
import { Trash2, MessageSquare, Star, AlertCircle, CheckCircle } from 'lucide-react';
import { adminService } from '../../Service/adminService';

export default function ContentModeration() {
  const [reviewId, setReviewId] = useState('');
  const [commentId, setCommentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleDeleteReview = async () => {
    if (!reviewId.trim()) {
      setMessage({ type: 'error', text: 'Ingresa un ID de review' });
      return;
    }

    if (!confirm(`¿ELIMINAR permanentemente la review #${reviewId}?\n\nEsta acción NO se puede deshacer.`)) {
      return;
    }

    setLoading(true);
    try {
      await adminService.deleteReview(parseInt(reviewId));
      setMessage({ 
        type: 'success', 
        text: `Review #${reviewId} eliminada exitosamente` 
      });
      setReviewId('');
    } catch (error: any) {
      console.error('Error al eliminar review:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Error al eliminar review' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async () => {
    if (!commentId.trim()) {
      setMessage({ type: 'error', text: 'Ingresa un ID de comentario' });
      return;
    }

    if (!confirm(`¿ELIMINAR permanentemente el comentario #${commentId}?\n\nEsta acción NO se puede deshacer.`)) {
      return;
    }

    setLoading(true);
    try {
      await adminService.deleteComment(parseInt(commentId));
      setMessage({ 
        type: 'success', 
        text: `Comentario #${commentId} eliminado exitosamente` 
      });
      setCommentId('');
    } catch (error: any) {
      console.error('Error al eliminar comentario:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Error al eliminar comentario' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6">Moderación de Contenido</h2>

        {/* Mensaje de estado */}
        {message && (
          <div className={`mb-6 rounded-lg p-4 flex items-center gap-3 ${
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

        <div className="space-y-6">
          {/* Eliminar Review */}
          <div className="border-b border-gray-200 pb-6">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-red-600" />
              <h3 className="text-lg font-semibold">Eliminar Review</h3>
            </div>
            
            <div className="flex gap-3">
              <input
                type="number"
                value={reviewId}
                onChange={(e) => setReviewId(e.target.value)}
                placeholder="ID de la review"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                onClick={handleDeleteReview}
                disabled={loading}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                Eliminar Review
              </button>
            </div>
          </div>

          {/* Eliminar Comentario */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-red-600" />
              <h3 className="text-lg font-semibold">Eliminar Comentario</h3>
            </div>
            
            <div className="flex gap-3">
              <input
                type="number"
                value={commentId}
                onChange={(e) => setCommentId(e.target.value)}
                placeholder="ID del comentario"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button
                onClick={handleDeleteComment}
                disabled={loading}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                Eliminar Comentario
              </button>
            </div>
          </div>
        </div>

        {/* Advertencia */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-900 mb-1">Advertencia</h4>
              <p className="text-sm text-yellow-800">
                Las eliminaciones son permanentes y no se pueden deshacer. Usa esta función solo para contenido que viole las políticas de la comunidad.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}