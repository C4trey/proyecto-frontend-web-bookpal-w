import { useState, useEffect } from 'react';
import { Search, UserCheck, UserX, Trash2, ExternalLink, Shield, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../Service/adminService';
import { useAuth } from '../../context/AuthContext';
import type { UsuarioAdminDTO } from '../../types';

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<UsuarioAdminDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const navigate = useNavigate();
  const { username: currentUsername } = useAuth(); // ✅ Obtener username del contexto

  useEffect(() => {
    loadAllUsers();
  }, []);

  const loadAllUsers = async () => {
    setLoading(true);
    setMessage(null);
    try {
      console.log('🔄 Cargando todos los usuarios...');
      const response = await adminService.getAllUsers(0, 50);
      console.log('📦 Respuesta completa:', response);
      
      const usersArray = response.content || response || [];
      console.log('👥 Usuarios encontrados:', usersArray);
      
      setUsers(usersArray);
      
      if (usersArray.length === 0) {
        setMessage({ type: 'error', text: 'No se encontraron usuarios' });
      }
    } catch (error: any) {
      console.error('❌ Error completo:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Error al cargar usuarios' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadAllUsers();
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const response = await adminService.searchUsers(searchQuery, 0, 50);
      const usersArray = response.content || response || [];
      
      setUsers(usersArray);
      
      if (usersArray.length === 0) {
        setMessage({ type: 'error', text: 'No se encontraron usuarios' });
      }
    } catch (error: any) {
      console.error('Error al buscar usuarios:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Error al buscar usuarios' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePromoteToAdmin = async (userId: number, username: string) => {
    if (!userId) {
      alert('Error: ID de usuario no válido');
      return;
    }

    if (!confirm(`¿Promover a ${username} a ADMIN?`)) return;

    try {
      await adminService.promoteToAdmin(userId);
      
      setMessage({ 
        type: 'success', 
        text: `✅ ${username} ahora es ADMIN` 
      });
      
      setTimeout(() => loadAllUsers(), 1000);
    } catch (error: any) {
      console.error('❌ Error al promover usuario:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Error al promover usuario' 
      });
    }
  };

  const handleDemoteToUser = async (userId: number, username: string) => {
    if (!userId) {
      alert('Error: ID de usuario no válido');
      return;
    }

    if (!confirm(`¿Degradar a ${username} a USER?`)) return;

    try {
      await adminService.demoteToUser(userId);
      
      setMessage({ 
        type: 'success', 
        text: `✅ ${username} ahora es USER` 
      });
      
      setTimeout(() => loadAllUsers(), 1000);
    } catch (error: any) {
      console.error('❌ Error al degradar usuario:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Error al degradar usuario' 
      });
    }
  };

  const handleDeleteUser = async (userId: number, username: string) => {
    if (!userId) {
      alert('Error: ID de usuario no válido');
      return;
    }

    if (!confirm(`⚠️ ¿ELIMINAR permanentemente a ${username}?\n\nEsta acción NO se puede deshacer.`)) return;

    try {
      await adminService.deleteUser(userId);
      
      setMessage({ 
        type: 'success', 
        text: `✅ Usuario ${username} eliminado permanentemente` 
      });
      
      setTimeout(() => loadAllUsers(), 1000);
    } catch (error: any) {
      console.error('❌ Error al eliminar usuario:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Error al eliminar usuario' 
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Buscador */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Gestión de Usuarios</h2>
        
        <div className="flex gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Buscar por nombre, apellido o username..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
          <button
            onClick={loadAllUsers}
            disabled={loading}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            Ver Todos
          </button>
        </div>
      </div>

      {/* Mensaje */}
      {message && (
        <div className={`rounded-lg p-4 ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border-2 border-green-200' 
            : 'bg-red-50 text-red-800 border-2 border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Tabla de usuarios */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estadísticas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    {loading ? 'Cargando...' : 'No se encontraron usuarios. Usa el buscador o carga todos los usuarios.'}
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  console.log(`✅ Usuario ${user.username}:`, { 
                    id: user.id, 
                    role: user.role, 
                    email: user.email 
                  });
                  
                  const isAdmin = user.role === 'ADMIN';
                  const isCurrentUser = currentUsername === user.username; // ✅ COMPARAR USERNAME
                  
                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                              <span className="text-red-600 font-semibold">
                                {user.nombre?.[0]}{user.apellido?.[0]}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.nombre} {user.apellido}
                              {isCurrentUser && (
                                <span className="ml-2 text-xs text-blue-600 font-semibold">(Tú)</span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500">
                              @{user.username}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${
                          isAdmin
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {isAdmin ? (
                            <Shield className="w-3 h-3 mr-1" />
                          ) : (
                            <UserIcon className="w-3 h-3 mr-1" />
                          )}
                          {isAdmin ? 'ADMIN' : 'USER'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>Seguidores: {user.numFollowers || 0}</div>
                        <div>Siguiendo: {user.numFollowing || 0}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => navigate(`/profile/${user.username}`)}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                          title="Ver perfil"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Ver
                        </button>
                        
                        {/* ✅ NO PERMITIR MODIFICAR AL MISMO USUARIO */}
                        {!isCurrentUser && (
                          <>
                            {!isAdmin ? (
                              <button
                                onClick={() => handlePromoteToAdmin(user.id, user.username)}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                                title="Promover a Admin"
                              >
                                <UserCheck className="w-3 h-3" />
                                Promover
                              </button>
                            ) : (
                              <button
                                onClick={() => handleDemoteToUser(user.id, user.username)}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors"
                                title="Degradar a User"
                              >
                                <UserX className="w-3 h-3" />
                                Degradar
                              </button>
                            )}
                            
                            <button
                              onClick={() => handleDeleteUser(user.id, user.username)}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                              title="Eliminar usuario"
                            >
                              <Trash2 className="w-3 h-3" />
                              Eliminar
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}