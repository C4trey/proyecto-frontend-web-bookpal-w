import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { countries } from "../data/countries";
import { BookOpen, Globe, Calendar, FileText, AlertCircle } from "lucide-react";

export default function CompleteProfile() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    country: "",
    bio: "",
    birthDate: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.country) {
      setError("Debes seleccionar un país");
      return;
    }

    if (!token) {
      setError("Token inválido. Por favor, inicia sesión nuevamente.");
      setTimeout(() => navigate("/auth/login"), 2000);
      return;
    }

    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      
      // Actualizar perfil
      const response = await fetch(`${API_URL}/api/usuarios/me/complete-profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          country: formData.country,
          bio: formData.bio || null,
          birthDate: formData.birthDate || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al completar el perfil');
      }

      const userData = await response.json();

      // Guardar token y sesión
      localStorage.setItem("token", token);
      localStorage.setItem("session", JSON.stringify({
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
      }));

      const expirationTimestamp = new Date().getTime() + (15 * 60 * 1000);
      localStorage.setItem("expiresOn", expirationTimestamp.toString());

      // Redirigir al dashboard
      navigate("/", { replace: true });
      window.location.reload();
    } catch (err: any) {
      setError(err.message || "Error al completar el perfil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-2xl mb-4 shadow-lg">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">¡Bienvenido a BookPal!</h1>
          <p className="text-gray-600 mt-2">Completa tu perfil para continuar</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Country - REQUERIDO */}
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                País *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Globe className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none appearance-none bg-white"
                >
                  <option value="">Selecciona tu país</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Birth Date - OPCIONAL */}
            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Nacimiento (opcional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none"
                />
              </div>
            </div>

            {/* Bio - OPCIONAL */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                Biografía (opcional)
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={3}
                  maxLength={500}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none resize-none"
                  placeholder="Cuéntanos un poco sobre ti y tus gustos literarios..."
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Máximo 500 caracteres</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {loading ? "Guardando..." : "Completar Perfil"}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-gray-500">
            * Campo requerido
          </p>
        </div>
      </div>
    </div>
  );
}