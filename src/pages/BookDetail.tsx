import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import type { BookDetail } from "../types";
import BookDetailHeader from "../components/books/BookDetailHeader";
import RatingDistribution from "../components/books/RatingDistribution";
import ReviewList from "../components/reviews/ReviewList";
import AdminBookActions from "../components/admin/AdminBookActions";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { role } = useAuth(); // ✅ OBTENER ROL
  
  const [book, setBook] = useState<BookDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBookDetail();
  }, [id]);

  const fetchBookDetail = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/auth/login");
        return;
      }

      const response = await fetch(`${API_URL}/libro/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: No se pudo cargar el libro`);
      }

      const data = await response.json();
      setBook(data);
    } catch (err: any) {
      console.error("Error fetching book:", err);
      setError(err.message || "Error al cargar el libro");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-red-600 font-semibold">{error || "Libro no encontrado"}</p>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Atrás
        </button>

        {/* ✅ MOSTRAR SOLO PARA ADMINS */}
        {role === 'ADMIN' && (
          <AdminBookActions
            bookId={Number(id)}
            currentData={{
              titulo: book.titulo,
              autor: book.autor,
              sinopsis: book.sinopsis,
              genero: book.genero,
              anioPublicacion: book.anioPublicacion,
            }}
            onUpdate={fetchBookDetail}
          />
        )}

        <BookDetailHeader 
          book={book}
          onReviewCreated={fetchBookDetail}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-1">
            <RatingDistribution
              averageRating={book.averageRating}
              totalReviews={book.cantidadResenas}
              distribution={{
                1: book.oneStarCount,
                2: book.twoStarCount,
                3: book.threeStarCount,
                4: book.fourStarCount,
                5: book.fiveStarCount,
              }}
            />
          </div>

          <div className="lg:col-span-2">
            <ReviewList 
              bookId={book.id}
              bookTitle={book.titulo}
              initialReviews={book.reviews}
              onReviewCreated={fetchBookDetail}
            />
          </div>
        </div>
      </div>
    </div>
  );
}