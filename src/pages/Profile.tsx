import { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar"; // <--- AGREGA ESTO
import { useAuth } from "../context/AuthContext";
import { countries } from "../data/countries";
import { updateMyProfile } from "../Service/userService";
import { getMyFollowers, getMyFollowing } from "../Service/followService";
import { reviewService } from "../Service/reviewService";
import type { ReviewResponseDTO } from "../types";
import { getMyFollowStats } from "../Service/userService";


export default function Profile() {
  const {
    nombre,
    apellido,
    username,
    country,
    bio,
    birthDate,
    profilePicture,
    numFollowers,
    numFollowing,
    updateSession,
  } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [stats, setStats] = useState({ followers: numFollowers, following: numFollowing });
  const [myReviews, setMyReviews] = useState<ReviewResponseDTO[]>([]);
  const [reviewCount, setReviewCount] = useState(0);

  const [form, setForm] = useState({
    nombre,
    apellido,
    country: country || "",
    bio: bio || "",
    birthDate: birthDate || "",
  });

  // LOAD REVIEW COUNT
  useEffect(() => {
    async function loadData() {
      try {
        const res = await reviewService.getMyReviews(0, 20);
        const safe: any = res;

        const count =
          res.totalCount ??
          safe.totalElements ??
          (res.reviews?.length ?? safe.content?.length ?? 0);

        setReviewCount(count);
      } catch (err) {
        console.error("Error cargando reseñas:", err);
      }
    }
    loadData();
  }, []);

  // LOAD REVIEWS
  useEffect(() => {
    async function loadMyReviews() {
      try {
        const res = await reviewService.getMyReviews(0, 20);
        setMyReviews(res.reviews || []);
        setReviewCount(res.totalCount ?? res.reviews?.length ?? 0);
      } catch (err) {
        console.error("Error cargando mis reseñas:", err);
      }
    }
    loadMyReviews();
  }, []);

  // LOAD FOLLOW DATA
  useEffect(() => {
    async function loadFollowData() {
      try {
        const f1 = await getMyFollowers();
        const f2 = await getMyFollowing();

        setFollowers(f1.content || []);
        setFollowing(f2.content || []);
      } catch (err) {
        console.error("Error loading followers:", err);
      }
    }
    loadFollowData();
  }, []);

  useEffect(() => {
  async function loadStats() {
    try {
      const s = await getMyFollowStats();
      setStats({
        followers: s.followers,
        following: s.following,
      });
    } catch (err) {
      console.error("Error cargando mis stats:", err);
    }
  }

  loadStats();
  }, []);

  const countryInfo =
    countries.find(
      (c) =>
        c.name.toLowerCase() === form.country.toLowerCase() ||
        c.code.toLowerCase() === form.country.toLowerCase()
    ) || { flag: "", name: "" };

  // SAVE PROFILE
  const handleSave = async () => {
    try {
      const updated = await updateMyProfile({
        country: form.country,
        bio: form.bio,
        birthDate: form.birthDate === "" ? null : form.birthDate,
      });

      updateSession({
        country: updated.country,
        bio: updated.bio,
        birthDate: updated.birthDate || "",
      });

      setIsEditing(false);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen pb-20">
      {/* NAVBAR */}
      <Navbar />

      {/* CONTENEDOR */}
      <div className="max-w-4xl mx-auto mt-10 px-4">
        
        {/* HEADER */}
        <div className="bg-white rounded-xl shadow p-8 border border-gray-200">
          <div className="flex flex-col items-center text-center">
            <img
              src={
                profilePicture ||
                `https://ui-avatars.com/api/?name=${nombre}+${apellido}&background=dc2626&color=fff&size=200`
              }
              alt="Avatar"
              className="w-32 h-32 rounded-xl border-4 border-red-500 shadow-md object-cover"
            />

            {!isEditing ? (
              <>
                <h2 className="text-3xl font-semibold mt-4">
                  {nombre} {apellido}
                </h2>

                <p className="text-gray-500">@{username}</p>

                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-5 px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-md"
                >
                  Editar Perfil
                </button>
              </>
            ) : (
              <div className="mt-6 w-full max-w-lg">
                {/* EDIT FORM */}
                <div className="flex gap-4">
                  <input
                    type="text"
                    className="w-1/2 border p-2 rounded"
                    value={form.nombre}
                    onChange={(e) =>
                      setForm({ ...form, nombre: e.target.value })
                    }
                    placeholder="Nombre"
                  />
                  <input
                    type="text"
                    className="w-1/2 border p-2 rounded"
                    value={form.apellido}
                    onChange={(e) =>
                      setForm({ ...form, apellido: e.target.value })
                    }
                    placeholder="Apellido"
                  />
                </div>

                <input
                  type="text"
                  className="mt-4 w-full border p-2 rounded"
                  value={form.country}
                  onChange={(e) =>
                    setForm({ ...form, country: e.target.value })
                  }
                  placeholder="País (Ej: Perú)"
                />

                <textarea
                  className="mt-4 w-full border p-2 rounded h-24"
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  placeholder="Descripción"
                />

                <div className="mt-4">
                  <label className="text-sm text-gray-600">
                    Fecha de nacimiento
                  </label>
                  <input
                    type="date"
                    className="w-full border p-2 rounded mt-1"
                    value={form.birthDate || ""}
                    onChange={(e) =>
                      setForm({ ...form, birthDate: e.target.value })
                    }
                  />
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
                  >
                    Cancelar
                  </button>

                  <button
                    onClick={handleSave}
                    className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-md"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MÉTRICAS - NUEVO ESTILO */}
        {!isEditing && (
          <div className="grid grid-cols-3 gap-6 mt-10">
            {[ 
              { label: "Followers", value: stats.followers },
              { label: "Following", value: stats.following },

              { label: "Reseñas", value: reviewCount }
            ].map((item) => (
              <div
                key={item.label}
                className="bg-white rounded-xl p-6 text-center border border-gray-200 shadow hover:shadow-md transition"
              >
                <p className="text-3xl font-bold text-gray-900">
                  {item.value}
                </p>
                <p className="text-gray-500 text-sm mt-1 uppercase tracking-wide">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* INFORMACIÓN */}
        {!isEditing && (
          <div className="mt-10 bg-white rounded-xl shadow p-6 border border-gray-200">
            <h3 className="text-xl font-semibold mb-5">Información General</h3>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-32 text-gray-500">Usuario:</span>
                <p className="font-medium">@{username}</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-32 text-gray-500">País:</span>
                <p className="font-medium">
                  {countryInfo.flag
                    ? `${countryInfo.flag} ${countryInfo.name}`
                    : "—"}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-32 text-gray-500">Cumpleaños:</span>
                <p className="font-medium">
                  {birthDate ? birthDate : "No registrado"}
                </p>
              </div>
            <div className="flex gap-3">
              <span className="w-32 text-gray-500">Descripción:</span>
              <p className="font-medium whitespace-pre-line text-gray-700">
                {bio && bio.trim() !== "" ? bio : "Sin descripción"}
              </p>
            </div>
            </div>
          </div>
        )}

        {/* RESEÑAS - NUEVAS TARJETAS */}
        {!isEditing && myReviews.length >= 0 && (
          <div className="mt-10 bg-white rounded-xl shadow p-6 border border-gray-200">
            <h3 className="text-xl font-semibold mb-6">Mis Reseñas</h3>

            <div className="space-y-6">
              {myReviews.map((r) => (
                <div
                  key={r.id}
                  className="bg-gray-50 border border-gray-200 rounded-xl p-6 hover:shadow-md transition"
                >
                  {/* Título */}
                  <h4 className="text-lg font-semibold text-gray-900">
                    {r.libroTitulo}
                  </h4>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mt-2 text-red-600">
                    {[...Array(5)].map((_, i) => (
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

                  {/* Comentario */}
                  <p className="text-gray-700 mt-2 leading-relaxed">
                    {r.comentario}
                  </p>

                  {/* Fecha */}
                  <p className="text-xs text-gray-400 mt-4 border-t pt-3">
                    Publicado el{" "}
                    {new Date(r.createdAt).toLocaleDateString("es-PE", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
