import { Settings, UserPlus, UserMinus } from 'lucide-react';
import { useState } from 'react';
import { followService } from '../../Service/followService';
import type { ProfileUser } from '../../types';

interface ProfileHeaderProps {
  usuario: ProfileUser;
  isFollowing: boolean | null;
  isOwnProfile: boolean;
  onFollowChange: () => void;
  onEditClick: () => void;
  onFollowersClick: () => void;
  onFollowingClick: () => void;
  // ✅ ELIMINAR: onCreateListClick
}

export default function ProfileHeader({
  usuario,
  isFollowing,
  isOwnProfile,
  onFollowChange,
  onEditClick,
  onFollowersClick,
  onFollowingClick,
}: ProfileHeaderProps) {
  const [followLoading, setFollowLoading] = useState(false);

  const handleFollowToggle = async () => {
    try {
      setFollowLoading(true);
      await followService.toggleFollow(usuario.username);
      onFollowChange();
    } catch (error) {
      console.error('Error al seguir/dejar de seguir:', error);
    } finally {
      setFollowLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {usuario.profilePicture ? (
            <img
              src={usuario.profilePicture}
              alt={usuario.username}
              className="w-32 h-32 rounded-full object-cover"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-red-600 flex items-center justify-center">
              <span className="text-4xl font-bold text-white">
                {usuario.nombre?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {usuario.nombre} {usuario.apellido}
              </h1>
              <p className="text-gray-600">@{usuario.username}</p>
            </div>

            {/* Botones */}
            <div className="flex gap-2">
              {isOwnProfile ? (
                <button
                  onClick={onEditClick}
                  className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  <Settings className="w-5 h-5" />
                  Editar perfil
                </button>
              ) : (
                <button
                  onClick={handleFollowToggle}
                  disabled={followLoading}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 ${
                    isFollowing
                      ? 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserMinus className="w-5 h-5" />
                      Dejar de seguir
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      Seguir
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Bio */}
          {usuario.bio && (
            <p className="text-gray-700 mb-4">{usuario.bio}</p>
          )}

          {/* Stats */}
          <div className="flex gap-6 text-sm">
            <button
              onClick={onFollowersClick}
              className="hover:text-red-600 transition-colors"
            >
              <span className="font-bold text-gray-900">{usuario.numFollowers}</span>
              <span className="text-gray-600 ml-1">Seguidores</span>
            </button>
            <button
              onClick={onFollowingClick}
              className="hover:text-red-600 transition-colors"
            >
              <span className="font-bold text-gray-900">{usuario.numFollowing}</span>
              <span className="text-gray-600 ml-1">Siguiendo</span>
            </button>
            <div>
              <span className="font-bold text-gray-900">{usuario.totalReviews}</span>
              <span className="text-gray-600 ml-1">Reseñas</span>
            </div>
            <div>
              <span className="font-bold text-gray-900">{usuario.totalLists}</span>
              <span className="text-gray-600 ml-1">Listas</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}