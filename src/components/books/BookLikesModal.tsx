import { useState, useEffect } from "react";
import { X, Users, UserPlus, UserMinus, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { profileService } from "../../Service/profileService";
import { useAuth } from "../../context/AuthContext";
import type { UserLike, BookLikesResponse } from "../../types";

interface BookLikesModalProps {
  bookId: number;
  onClose: () => void;
}

interface UserLikeWithStatus extends UserLike {
  isLoadingFollow?: boolean;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export default function BookLikesModal({ bookId, onClose }: BookLikesModalProps) {
  const { username: currentUsername } = useAuth(); // ✅ Usar username del contexto
  const [users, setUsers] = useState<UserLikeWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(0);

  useEffect(() => {
    fetchLikes();
  }, [bookId, page]);

  const fetchLikes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const response = await fetch(
        `${API_URL}/api/booklikes/${bookId}/likes?page=${page}&size=20`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Error al cargar likes");

      const data: BookLikesResponse = await response.json();
      
      if (page === 0) {
        setUsers(data.usuarios);
      } else {
        setUsers([...users, ...data.usuarios]);
      }
      
      setHasMore(data.hasMore);
    } catch (err) {
      console.error("Error fetching likes:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Implementar toggle follow
  const handleToggleFollow = async (username: string) => {
    try {
      setUsers(prev =>
        prev.map(u =>
          u.username === username
            ? { ...u, isLoadingFollow: true }
            : u
        )
      );

      const response = await profileService.toggleFollow(username);

      setUsers(prev =>
        prev.map(u =>
          u.username === username
            ? { ...u, isFollowing: response.siguiendo, isLoadingFollow: false }
            : u
        )
      );
    } catch (error) {
      console.error('Error al seguir/dejar de seguir:', error);
      setUsers(prev =>
        prev.map(u =>
          u.username === username
            ? { ...u, isLoadingFollow: false }
            : u
        )
      );
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
    return `Hace ${Math.floor(days / 30)} meses`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-bold text-gray-900">Les gusta</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Lista de usuarios */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading && page === 0 ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-red-600" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aún nadie le ha dado like a este libro</p>
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.username} className="flex items-center justify-between gap-3">
                  {/* ✅ Avatar y nombre clicables */}
                  <Link
                    to={`/profile/${user.username}`}
                    onClick={onClose}
                    className="flex items-center gap-3 flex-1 min-w-0"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 hover:text-red-600 transition-colors truncate">
                        @{user.username}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(user.likedAt)}
                      </p>
                    </div>
                  </Link>

                  {/* ✅ Botón de seguir - solo si no es el usuario actual */}
                  {currentUsername && user.username !== currentUsername && (
                    <button
                      onClick={() => handleToggleFollow(user.username)}
                      disabled={user.isLoadingFollow}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-colors flex-shrink-0 ${
                        user.isFollowing
                          ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          : "bg-red-600 text-white hover:bg-red-700"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {user.isLoadingFollow ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : user.isFollowing ? (
                        <>
                          <UserMinus className="w-4 h-4" />
                          Siguiendo
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4" />
                          Seguir
                        </>
                      )}
                    </button>
                  )}
                </div>
              ))}

              {/* Cargar más */}
              {hasMore && (
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={loading}
                  className="w-full py-3 text-red-600 hover:text-red-700 font-semibold text-sm transition-colors disabled:opacity-50"
                >
                  {loading ? "Cargando..." : "Ver más"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}