import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import Navbar from "../layout/Navbar";
import { useAuth } from "../../context/AuthContext";
import { profileService } from "../../Service/profileService";
import { reviewService } from "../../Service/reviewService";
import type { ReviewResponseDTO } from "../../types";
import { countries } from "../../data/countries";

export default function OtherProfile() {
  const { username } = useParams();
  const { username: myUsername } = useAuth();

  const safeUsername: string = username ?? "";

  if (!safeUsername) return <div>Usuario inválido</div>;
  if (safeUsername === myUsername) return <Navigate to="/me" replace />;

  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ followers: 0, following: 0 });
  const [reviews, setReviews] = useState<ReviewResponseDTO[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);


  useEffect(() => {
    async function load() {
      try {
        // 1. Obtener perfil completo (viene con usuario + stats)
        const profile = await profileService.getProfile(safeUsername);
        console.log("Perfil cargado:", profile);

        const u = profile.usuario;
        setUser(u);

        setStats({
          followers: u.numFollowers ?? 0,
          following: u.numFollowing ?? 0,
        });

        // Reviews (intentamos cargar desde el servicio de reseñas)
        const r = await reviewService.getUserReviews(u.id, 0, 20);
        console.log("Reviews backend:", r);
        setReviews(r.reviews ?? profile.recentReviews ?? []);

        // Estado follow
        const f = await profileService.getFollowStatus(safeUsername);
        setIsFollowing(!!f?.siguiendo);

      } catch (err) {
        console.error("Error cargando perfil:", err);
      }
    }

    load();
  }, [safeUsername]);

  const toggleFollowClick = async () => {
    try {
      const res = await profileService.toggleFollow(safeUsername);

      setIsFollowing(res.siguiendo);

      setStats(prev => ({
        ...prev,
        followers: res.totalFollowers,
      }));
    } catch (err) {
      console.error("Error toggling follow:", err);
    }
  };

  if (!user) return <div>Cargando...</div>;

  const countryInfo =
    countries.find(
      c =>
        c.name.toLowerCase() === (user.country || "").toLowerCase() ||
        c.code.toLowerCase() === (user.country || "").toLowerCase()
    ) || { flag: "", name: user.country || "" };

  return (
    <div className="bg-gray-100 min-h-screen pb-20">
      <Navbar />

      <div className="max-w-4xl mx-auto mt-10 px-4">

        {/* HEADER */}
        <div className="bg-white rounded-xl shadow p-8 border border-gray-200 text-center">
          <img
            src={
              user.profilePicture ||
              `https://ui-avatars.com/api/?name=${user.nombre}+${user.apellido}&background=dc2626&color=fff&size=200`
            }
            className="w-32 h-32 rounded-xl border-4 border-red-500 shadow-md mx-auto"
          />

          <h2 className="text-3xl font-semibold mt-4">
            {user.nombre} {user.apellido}
          </h2>
          <p className="text-gray-500">@{user.username}</p>

          <button
            onClick={toggleFollowClick}
            className={`mt-5 px-6 py-2 rounded-lg shadow-md text-white ${
              isFollowing
                ? "bg-gray-600 hover:bg-gray-700"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {isFollowing ? "Siguiendo" : "Seguir"}
          </button>
        </div>

        {/* MÉTRICAS */}
        <div className="grid grid-cols-3 gap-6 mt-10">
          {[
            { label: "Followers", value: stats.followers },
            { label: "Following", value: stats.following },
            { label: "Reseñas", value: reviews.length },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-white rounded-xl p-6 text-center border border-gray-200 shadow"
            >
              <p className="text-3xl font-bold text-gray-900">{item.value}</p>
              <p className="text-gray-500 text-sm mt-1 uppercase">{item.label}</p>
            </div>
          ))}
        </div>

        {/* INFORMACIÓN */}
        <div className="mt-10 bg-white rounded-xl shadow p-6 border border-gray-200">
          <h3 className="text-xl font-semibold mb-5">Información General</h3>

          <div className="space-y-4">
            <div className="flex gap-3">
              <span className="w-32 text-gray-500">Usuario:</span>
              <p className="font-medium">@{user.username}</p>
            </div>

            <div className="flex gap-3">
              <span className="w-32 text-gray-500">País:</span>
              <p className="font-medium">
                {countryInfo.flag
                  ? `${countryInfo.flag} ${countryInfo.name}`
                  : "—"}
              </p>
            </div>

            <div className="flex gap-3">
              <span className="w-32 text-gray-500">Cumpleaños:</span>
              <p className="font-medium">{user.birthDate || "No registrado"}</p>
            </div>

            <div className="flex gap-3">
              <span className="w-32 text-gray-500">Descripción:</span>
              <p className="font-medium text-gray-700 whitespace-pre-line">
                {user.bio?.trim() || "Sin descripción"}
              </p>
            </div>
          </div>
        </div>

        {/* RESEÑAS */}
        <div className="mt-10 bg-white rounded-xl shadow p-6 border border-gray-200">
          <h3 className="text-xl font-semibold mb-6">Reseñas</h3>

          {reviews.length === 0 && (
            <p className="text-gray-500 text-center">
              Este usuario no tiene reseñas.
            </p>
          )}

          <div className="space-y-6">
            {reviews.map((r) => (
              <div key={r.id} className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900">{r.libroTitulo}</h4>
                
                <div className="flex items-center gap-1 mt-2 text-red-600">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`text-lg ${
                        i < Math.floor(r.rating)
                          ? "text-red-600"
                          : i < r.rating
                          ? "text-red-600 opacity-40"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                  <span className="ml-1 text-sm text-gray-600 font-semibold">
                    {r.rating}
                  </span>
                </div>

                <p className="text-gray-700 mt-2">{r.comentario}</p>

                <p className="text-xs text-gray-400 mt-4 border-t pt-3">
                  Publicado el{" "}
                  {new Date(r.createdAt).toLocaleDateString("es-PE")}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
