import { Link } from 'react-router-dom';
import { MapPin, Users } from 'lucide-react';
import type { UserSearchResult } from '../../types';

interface UserCardProps {
  user: UserSearchResult;
}

export default function UserCard({ user }: UserCardProps) {
  const getAvatarUrl = () => {
    if (!user.profilePicture) {
      return `https://ui-avatars.com/api/?name=${user.nombre}+${user.apellido}&background=dc2626&color=fff&size=200`;
    }
    if (user.profilePicture.startsWith('http')) {
      return user.profilePicture;
    }
    return `http://localhost:8080${user.profilePicture}`;
  };

  return (
    <Link
      to={`/profile/${user.username}`}
      className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <img
            src={getAvatarUrl()}
            alt={user.username}
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
            onError={(e) => {
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${user.nombre}+${user.apellido}&background=dc2626&color=fff&size=200`;
            }}
          />

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 truncate hover:text-red-600 transition-colors">
              {user.nombre} {user.apellido}
            </h3>
            <p className="text-sm text-gray-600 mb-2">@{user.username}</p>

            {user.bio && (
              <p className="text-sm text-gray-700 line-clamp-2 mb-3">
                {user.bio}
              </p>
            )}

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{user.country}</span>
              </div>

              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>
                  <strong className="text-gray-900">{user.numFollowers}</strong> seguidores
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}