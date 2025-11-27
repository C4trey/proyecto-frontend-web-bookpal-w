import { useEffect, useState } from 'react';
import { X, Loader2, User, UserPlus, UserMinus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { profileService } from '../../Service/profileService';
import { useAuth } from '../../context/AuthContext';
import type { UsuarioFollowDTO } from '../../types';

interface FollowersModalProps {
  username: string;
  onClose: () => void;
}

interface FollowerWithStatus extends UsuarioFollowDTO {
  isFollowing?: boolean;
  isLoadingFollow?: boolean;
}

export default function FollowersModal({ username, onClose }: FollowersModalProps) {
  const { username: currentUsername } = useAuth(); // ✅ CORREGIDO
  const [followers, setFollowers] = useState<FollowerWithStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFollowers();
  }, [username]);

  const loadFollowers = async () => {
    try {
      setLoading(true);
      const response = await profileService.getFollowers(username);
      
      // Cargar el estado de seguimiento para cada usuario
      const followersWithStatus = await Promise.all(
        response.content.map(async (follower) => {
          // No necesitamos el estado si es el usuario actual
          if (follower.username === currentUsername) {
            return { ...follower, isFollowing: false };
          }
          
          try {
            const status = await profileService.getFollowStatus(follower.username);
            return { ...follower, isFollowing: status.siguiendo };
          } catch {
            return { ...follower, isFollowing: false };
          }
        })
      );
      
      setFollowers(followersWithStatus);
    } catch (err: any) {
      console.error('Error al cargar seguidores:', err);
      setError('Error al cargar seguidores');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFollow = async (followerUsername: string) => {
    try {
      setFollowers(prev =>
        prev.map(f =>
          f.username === followerUsername
            ? { ...f, isLoadingFollow: true }
            : f
        )
      );

      const response = await profileService.toggleFollow(followerUsername);

      setFollowers(prev =>
        prev.map(f =>
          f.username === followerUsername
            ? { ...f, isFollowing: response.siguiendo, isLoadingFollow: false }
            : f
        )
      );
    } catch (error) {
      console.error('Error al seguir/dejar de seguir:', error);
      setFollowers(prev =>
        prev.map(f =>
          f.username === followerUsername
            ? { ...f, isLoadingFollow: false }
            : f
        )
      );
    }
  };

  const getAvatarUrl = (user: UsuarioFollowDTO) => {
    if (!user.profilePicture) {
      return `https://ui-avatars.com/api/?name=${user.nombre}+${user.apellido}&background=dc2626&color=fff&size=200`;
    }
    if (user.profilePicture.startsWith('http')) {
      return user.profilePicture;
    }
    return `http://localhost:8080${user.profilePicture}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Seguidores</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(80vh-80px)]">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="w-8 h-8 animate-spin text-red-600" />
            </div>
          ) : error ? (
            <div className="p-8 text-center text-gray-600">{error}</div>
          ) : followers.length === 0 ? (
            <div className="p-8 text-center text-gray-600">
              <User className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>No tiene seguidores aún</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {followers.map((user) => (
                <div key={user.username} className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors">
                  {/* Avatar y nombre - clicables */}
                  <Link
                    to={`/profile/${user.username}`}
                    onClick={onClose}
                    className="flex items-center gap-3 flex-1 min-w-0"
                  >
                    <img
                      src={getAvatarUrl(user)}
                      alt={user.username}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${user.nombre}+${user.apellido}&background=dc2626&color=fff&size=200`;
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate hover:text-red-600 transition-colors">
                        {user.nombre} {user.apellido}
                      </p>
                      <p className="text-sm text-gray-600 truncate">@{user.username}</p>
                    </div>
                  </Link>

                  {/* Botón de seguir - solo si no es el usuario actual */}
                  {currentUsername && user.username !== currentUsername && (
                    <button
                      onClick={() => handleToggleFollow(user.username)}
                      disabled={user.isLoadingFollow}
                      className={`
                        flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium text-sm transition-all flex-shrink-0
                        ${user.isFollowing
                          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          : 'bg-red-600 text-white hover:bg-red-700'
                        }
                        disabled:opacity-50 disabled:cursor-not-allowed
                      `}
                    >
                      {user.isLoadingFollow ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : user.isFollowing ? (
                        <>
                          <UserMinus className="w-4 h-4" />
                          <span>Siguiendo</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4" />
                          <span>Seguir</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}