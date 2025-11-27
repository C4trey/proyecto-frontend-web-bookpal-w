import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, Shield, LogOut, Home } from 'lucide-react';
import BookManagement from './BookManagement';
import UserManagement from './UserManagement';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'users' | 'books'>('books');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-red-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Panel de Administrador</h1>
                <p className="text-sm text-gray-600">BookPal Admin Dashboard</p>
              </div>
            </div>
            
            {/* Botones de navegación */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border border-gray-300"
              >
                <Home className="w-4 h-4" />
                Ir al Inicio
              </button>
              <button
                onClick={() => navigate('/auth/logout')}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </button>
            </div>
          </div>

          {/* Tabs - SOLO LIBROS Y USUARIOS */}
          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('books')}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors border-b-2 ${
                activeTab === 'books'
                  ? 'text-red-600 border-red-600'
                  : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              Libros
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors border-b-2 ${
                activeTab === 'users'
                  ? 'text-red-600 border-red-600'
                  : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <Users className="w-5 h-5" />
              Usuarios
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'books' && <BookManagement />}
        {activeTab === 'users' && <UserManagement />}
      </div>
    </div>
  );
}