import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import ProfileHeader from '../components/Profile/ProfileHeader';
import EditProfileModal from '../components/Profile/EditProfileModal';
import FollowersModal from '../components/Profile/FollowersModal';
import FollowingModal from '../components/Profile/FollowingModal';
import CreateListModal from '../components/Lista/CreateListModal';
import FavoriteBooks from '../components/Profile/FavoriteBooks';
import RecentLikes from '../components/Profile/RecentLikes';
import RecentReviews from '../components/Profile/RecentReviews';
import BookLists from '../components/Profile/BookLists';
import { profileService } from '../Service/profileService';
import type { ProfileResponse } from '../types';

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [showCreateListModal, setShowCreateListModal] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [username]);

  const loadProfile = async () => {
    if (!username) return;

    setLoading(true);
    setError(null);

    try {
      const data = await profileService.getProfile(username);
      setProfile(data);
    } catch (err: any) {
      console.error('Error al cargar perfil:', err);
      setError(err.response?.data?.message || 'Error al cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-red-600" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Usuario no encontrado</h2>
          <p className="text-gray-600">{error || 'El perfil que buscas no existe'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header - SIN botón de crear lista */}
        <ProfileHeader
          usuario={profile.usuario}
          isFollowing={profile.isFollowing}
          isOwnProfile={profile.isOwnProfile}
          onFollowChange={loadProfile}
          onEditClick={() => setShowEditModal(true)}
          onFollowersClick={() => setShowFollowersModal(true)}
          onFollowingClick={() => setShowFollowingModal(true)}
        />

        {/* Contenido */}
        <div className="space-y-6">
          <FavoriteBooks books={profile.favoriteBooks} />
          <RecentLikes books={profile.recentLikes} />
          <RecentReviews reviews={profile.recentReviews} />
          
          {/* ✅ Pasar props para crear lista */}
          <BookLists 
            lists={profile.publicLists}
            isOwnProfile={profile.isOwnProfile}
            onCreateListClick={() => setShowCreateListModal(true)}
          />
        </div>

        {/* Modales */}
        {showEditModal && profile.isOwnProfile && (
          <EditProfileModal
            user={profile.usuario}
            onClose={() => setShowEditModal(false)}
            onSuccess={loadProfile}
          />
        )}

        {showFollowersModal && (
          <FollowersModal
            username={profile.usuario.username}
            onClose={() => setShowFollowersModal(false)}
          />
        )}

        {showFollowingModal && (
          <FollowingModal
            username={profile.usuario.username}
            onClose={() => setShowFollowingModal(false)}
          />
        )}

        {showCreateListModal && profile.isOwnProfile && (
          <CreateListModal
            onClose={() => setShowCreateListModal(false)}
            onSuccess={() => {
              setShowCreateListModal(false);
              loadProfile();
            }}
          />
        )}
      </div>
    </div>
  );
}