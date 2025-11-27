import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BookOpen, CheckCircle, AlertCircle } from "lucide-react";

export default function OAuth2Callback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  const addDebug = (msg: string) => {
    console.log(msg);
    setDebugInfo(prev => [...prev, msg]);
  };

  useEffect(() => {
    const processOAuth2 = async () => {
      try {
        const token = searchParams.get("token");
        addDebug(`1. Token recibido: ${token ? 'SÍ' : 'NO'}`);

        if (!token) {
          setStatus('error');
          setErrorMessage('No se recibió el token de autenticación');
          setTimeout(() => navigate("/auth/login", { replace: true }), 3000);
          return;
        }

        // Guardar el token
        localStorage.setItem("token", token);
        addDebug('2. Token guardado en localStorage');

        // Hacer petición al backend para obtener datos del usuario
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        addDebug(`3. Haciendo petición a: ${API_URL}/api/usuarios/me`);

        const response = await fetch(`${API_URL}/api/usuarios/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        addDebug(`4. Response status: ${response.status}`);

        if (!response.ok) {
          const errorText = await response.text();
          addDebug(`5. Error response: ${errorText}`);
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const userData = await response.json();
        addDebug(`6. Usuario obtenido: ${userData.email}`);

        // Guardar sesión completa
        const session = {
          userId: userData.id,
          nombre: userData.nombre,
          apellido: userData.apellido,
          username: userData.username,
          email: userData.email,
          country: userData.country,
          bio: userData.bio || "",
          birthDate: userData.birthDate || "",
          profilePicture: userData.profilePicture || "",
          role: userData.role,
          numFollowers: userData.numFollowers || 0,
          numFollowing: userData.numFollowing || 0,
        };

        localStorage.setItem("session", JSON.stringify(session));
        addDebug('7. Sesión guardada en localStorage');

        // Calcular expiración (15 minutos = 900000 ms)
        const expirationTimestamp = new Date().getTime() + (15 * 60 * 1000);
        localStorage.setItem("expiresOn", expirationTimestamp.toString());
        addDebug('8. Expiración calculada y guardada');

        setStatus('success');
        addDebug('9. ✅ Proceso completado, redirigiendo...');

        // Esperar 1 segundo antes de redirigir
        setTimeout(() => {
          navigate("/", { replace: true });
          window.location.reload(); // Recargar para actualizar el contexto
        }, 1000);

      } catch (error: any) {
        console.error('❌ Error en OAuth2Callback:', error);
        addDebug(`❌ ERROR: ${error.message}`);
        setStatus('error');
        setErrorMessage(error.message || 'Error al procesar autenticación');
        
        // Limpiar token inválido
        localStorage.removeItem("token");
        
        setTimeout(() => navigate("/auth/login", { replace: true }), 5000);
      }
    };

    processOAuth2();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 flex items-center justify-center p-4">
      <div className="text-center max-w-2xl w-full">
        {status === 'loading' && (
          <>
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-600 rounded-2xl mb-6 shadow-lg animate-pulse">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Completando inicio de sesión...
            </h2>
            <p className="text-gray-600 mb-4">Espera un momento mientras configuramos tu cuenta</p>
            <div className="mt-6 flex justify-center">
              <div className="w-8 h-8 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
            </div>

            {/* Debug Info */}
            <div className="mt-8 bg-gray-900 text-green-400 p-4 rounded-lg text-left text-xs font-mono max-h-60 overflow-y-auto">
              {debugInfo.map((msg, i) => (
                <div key={i}>{msg}</div>
              ))}
            </div>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-600 rounded-2xl mb-6 shadow-lg">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ¡Inicio de sesión exitoso!
            </h2>
            <p className="text-gray-600">Redirigiendo a BookPal...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-600 rounded-2xl mb-6 shadow-lg">
              <AlertCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Error al iniciar sesión
            </h2>
            <p className="text-red-600 mb-4 font-semibold">{errorMessage}</p>
            <p className="text-sm text-gray-500 mb-4">Redirigiendo al login en 5 segundos...</p>

            {/* Debug Info */}
            <div className="mt-8 bg-gray-900 text-red-400 p-4 rounded-lg text-left text-xs font-mono max-h-60 overflow-y-auto">
              <div className="text-yellow-400 mb-2">🔍 Debug Log:</div>
              {debugInfo.map((msg, i) => (
                <div key={i}>{msg}</div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}