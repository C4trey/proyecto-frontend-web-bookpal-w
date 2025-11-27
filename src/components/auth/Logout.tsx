import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { BookOpen } from "lucide-react";

export default function Logout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    console.debug("Cerrando sesión del usuario");
    
    // Hacer logout
    logout();

    // Redirigir al login después de un breve delay
    setTimeout(() => {
      console.debug("Redirigiendo a la página de inicio");
      navigate("/auth/login", { replace: true });
    }, 1000);
  }, [logout, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-600 rounded-2xl mb-6 shadow-lg animate-pulse">
          <BookOpen className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Cerrando sesión...</h2>
        <p className="text-gray-600">Hasta pronto en BookPal</p>
      </div>
    </div>
  );
}