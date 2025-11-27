import { useState } from "react";
import { Link } from "react-router-dom"; // ✅ IMPORTAR Link
import { MessageCircle, Heart, Reply } from "lucide-react";
import type { Comment } from "../../types";
import { commentService } from "../../Service/commentService";
import { handleApiError } from "../../Service/api";

interface CommentSectionProps {
  reviewId: number;
  initialComments: Comment[];
  hasMoreComments: boolean;
  commentsCount: number;
}

export default function CommentSection({
  reviewId,
  initialComments,
  hasMoreComments: initialHasMore,
  commentsCount,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [showAll, setShowAll] = useState(false);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchAllComments = async () => {
    try {
      setLoading(true);
      const data = await commentService.getCommentsByReview(reviewId, 0, 50);
      setComments(data.comments);
      setHasMore(data.hasMore);
      setShowAll(true);
    } catch (err) {
      console.error("Error fetching comments:", err);
      alert(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateComment = async () => {
    if (newComment.trim().length === 0) return;

    try {
      setSubmitting(true);
      const newCommentData = await commentService.createComment(reviewId, {
        comentario: newComment,
      });
      
      setComments([newCommentData, ...comments]);
      setNewComment("");
    } catch (err) {
      console.error("Error creating comment:", err);
      alert(handleApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId: number) => {
    try {
      const data = await commentService.toggleLike(commentId);
      
      setComments(
        comments.map((comment) =>
          comment.id === commentId
            ? { ...comment, liked: data.liked, likesCount: data.totalLikes }
            : comment
        )
      );
    } catch (err) {
      console.error("Error liking comment:", err);
      alert(handleApiError(err));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Hoy";
    if (days === 1) return "Ayer";
    if (days < 7) return `Hace ${days} días`;
    if (days < 30) return `Hace ${Math.floor(days / 7)} semanas`;
    if (days < 365) return `Hace ${Math.floor(days / 30)} meses`;
    return `Hace ${Math.floor(days / 365)} años`;
  };

  const getProfilePicture = (comment: Comment) => {
    if (comment.authorProfilePicture) {
      return comment.authorProfilePicture;
    }
    return `https://ui-avatars.com/api/?name=${comment.authorNombre}+${comment.authorApellido}&background=dc2626&color=fff`;
  };

  const displayComments = showAll ? comments : comments.slice(0, 3);

  return (
    <div className="border-t border-gray-200 pt-4 mt-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="w-5 h-5 text-gray-600" />
        <span className="font-semibold text-gray-900">
          {commentsCount} {commentsCount === 1 ? "comentario" : "comentarios"}
        </span>
      </div>

      {/* Nuevo comentario */}
      <div className="mb-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Escribe un comentario..."
            maxLength={500}
            disabled={submitting}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleCreateComment();
              }
            }}
          />
          <button
            onClick={handleCreateComment}
            disabled={newComment.trim().length === 0 || submitting}
            className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "..." : "Comentar"}
          </button>
        </div>
      </div>

      {/* Lista de comentarios */}
      <div className="space-y-3">
        {displayComments.map((comment) => (
          <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              {/* ✅ AVATAR Y NOMBRE CLICABLES */}
              <Link 
                to={`/profile/${comment.authorUsername}`}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <img
                  src={getProfilePicture(comment)}
                  alt={comment.authorUsername}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <span className="font-semibold text-gray-900 text-sm hover:text-red-600 transition-colors">
                    {comment.authorNombre} {comment.authorApellido}
                  </span>
                  <span className="text-gray-500 text-xs ml-2">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
              </Link>
            </div>

            <p className="text-gray-700 text-sm mb-3">{comment.comentario}</p>

            <div className="flex items-center gap-4">
              <button
                onClick={() => handleLikeComment(comment.id)}
                className={`flex items-center gap-1 text-sm transition-colors ${
                  comment.liked
                    ? "text-red-600"
                    : "text-gray-500 hover:text-red-600"
                }`}
              >
                <Heart className={`w-4 h-4 ${comment.liked ? "fill-current" : ""}`} />
                <span>{comment.likesCount}</span>
              </button>

              {comment.repliesCount > 0 && (
                <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                  <Reply className="w-4 h-4" />
                  <span>{comment.repliesCount} respuestas</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Ver más/menos */}
      {!showAll && hasMore && comments.length > 3 && (
        <button
          onClick={fetchAllComments}
          disabled={loading}
          className="w-full mt-4 py-2 text-red-600 hover:text-red-700 font-semibold text-sm transition-colors disabled:opacity-50"
        >
          {loading ? "Cargando..." : `Ver todos los comentarios (${commentsCount})`}
        </button>
      )}

      {showAll && comments.length > 3 && (
        <button
          onClick={() => setShowAll(false)}
          className="w-full mt-4 py-2 text-red-600 hover:text-red-700 font-semibold text-sm transition-colors"
        >
          Mostrar menos
        </button>
      )}
    </div>
  );
}