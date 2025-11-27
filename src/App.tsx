import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import LayoutAuth from './layouts/LayoutAuth';
import LayoutProtected from './layouts/LayoutProtected';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Logout from './components/auth/Logout';
import OAuth2Callback from './pages/OAuth2Callback';
import CompleteProfile from './pages/CompleteProfile';
import AdminRoute from './components/auth/AdminRoute'; // ✅ IMPORTAR

// Pages
import Home from './components/home';

// Books
import BookDetailPage from "./pages/BookDetail";
import SearchResultsPage from './pages/SearchResultsPage';
import AdvancedSearchPage from './pages/AdvancedSearchPage';

// Profile
import ProfilePage from './pages/ProfilePage';
import RecommendationsPage from './pages/RecommendationsPage';

import MembersPage from './pages/MembersPage';
import UserSearchPage from './pages/UserSearchPage';
import ListDetailPage from './pages/ListDetailPage';

// Admin
import AdminDashboard from './components/admin/AdminDashboard'; // ✅ Asegúrate de que esta ruta sea correcta

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rutas de autenticación */}
          <Route element={<LayoutAuth />}>
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
          </Route>

          {/* Complete Profile */}
          <Route path="/auth/complete-profile" element={<CompleteProfile />} />
          
          {/* OAuth2 Callback */}
          <Route path="/auth/oauth2/callback" element={<OAuth2Callback />} />

          {/* Logout */}
          <Route path="/auth/logout" element={<Logout />} />

          {/* Rutas protegidas */}
          <Route element={<LayoutProtected />}>
            <Route path="/" element={<Home />} />
            <Route path="/books/:id" element={<BookDetailPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/search/advanced" element={<AdvancedSearchPage />} />
            <Route path="/profile/:username" element={<ProfilePage />} />
            <Route path="/recommendations" element={<RecommendationsPage />} />
            <Route path="/members" element={<MembersPage />} />
            <Route path="/members/search" element={<UserSearchPage />} />
            <Route path="/lista/:id" element={<ListDetailPage />} />
          </Route>

          {/* ✅ NUEVA RUTA PROTEGIDA SOLO PARA ADMIN */}
          <Route 
            path="/admin/*" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />

          {/* Ruta por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
