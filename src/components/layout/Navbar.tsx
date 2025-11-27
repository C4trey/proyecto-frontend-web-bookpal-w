import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { BookOpen, Search, LogOut, User as UserIcon, Settings, Shield } from "lucide-react";
import { useState } from "react";
import type { KeyboardEvent } from "react";
import NotificationBell from "../notificaciones/NotificationBell";

interface NavbarProps {
  showMenu?: boolean;
}

export default function Navbar({ showMenu = true }: NavbarProps) {
  const { 
    nombre, 
    apellido, 
    username, 
    profilePicture, 
    isAuthenticated,
    role, // ✅ AGREGAR role
    logout 
  } = useAuth();
  
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/members/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (!isAuthenticated) return null;

  const getAvatarUrl = () => {
    if (!profilePicture) {
      return `https://ui-avatars.com/api/?name=${nombre}+${apellido}&background=dc2626&color=fff`;
    }
    if (profilePicture.startsWith('http')) {
      return profilePicture;
    }
    return `http://localhost:8080${profilePicture}`;
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-red-600 p-2 rounded-lg group-hover:bg-red-700 transition-colors">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">BookPal</span>
          </Link>

          {/* Links de navegación */}
          {showMenu && (
            <div className="hidden md:flex items-center gap-6">
              <Link
                to="/books"
                className="text-gray-700 hover:text-red-600 font-medium transition-colors"
              >
                Libros
              </Link>
              <Link
                to="/lists"
                className="text-gray-700 hover:text-red-600 font-medium transition-colors"
              >
                Listas
              </Link>
              <Link
                to="/members"
                className="text-gray-700 hover:text-red-600 font-medium transition-colors"
              >
                Miembros
              </Link>
            </div>
          )}

          {/* Búsqueda y usuario */}
          <div className="flex items-center gap-4">
            {/* Buscador de usuarios */}
            {showMenu && (
              <div className="hidden sm:flex items-center">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Buscar usuarios..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent w-64"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
            )}

            {/* Campanita de notificaciones */}
            {showMenu && <NotificationBell />}

            {/* Menú de usuario */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <img
                  src={getAvatarUrl()}
                  alt={username}
                  className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${nombre}+${apellido}&background=dc2626&color=fff`;
                  }}
                />
              </button>

              {/* Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="font-semibold text-gray-900">
                      {nombre} {apellido}
                    </p>
                    <p className="text-sm text-gray-500">@{username}</p>
                  </div>

                  <Link
                    to={`/profile/${username}`}
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-gray-700"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <UserIcon className="w-4 h-4" />
                    Mi Perfil
                  </Link>

                  <Link
                    to="/settings"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-gray-700"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings className="w-4 h-4" />
                    Configuración
                  </Link>

                  {/* ✅ NUEVO: Link de admin (solo visible para ADMIN) */}
                  {role === 'ADMIN' && (
                    <>
                      <div className="border-t border-gray-200 my-2"></div>
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-purple-50 text-purple-600 font-semibold"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Shield className="w-4 h-4" />
                        Panel de Admin
                      </Link>
                    </>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-red-600 border-t border-gray-200 mt-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}