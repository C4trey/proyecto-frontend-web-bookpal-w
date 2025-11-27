import { useBooks } from "../hook/useBooks";
import BookSection from "../components/books/BookSection";
import BookGrid from "../components/books/BookGrid";
import ReviewCard from "../components/reviews/ReviewCard";
import SearchBar from "../components/books/SearchBar";
import { Loader2, TrendingUp, Clock, Star, Sparkles } from "lucide-react";

export default function Home() {
  const {
    loading,
    error,
    newBooks,
    topBooks,
    recommendedBooks,
    popularReviews,
  } = useBooks();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-2">Error al cargar datos</p>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section con búsqueda */}
      <section className="relative bg-gradient-to-br from-gray-900 via-red-900 to-black py-20 px-4">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570')] bg-cover bg-center opacity-10"></div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Descubre tu próxima<br />gran lectura
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Rastrea libros que has leído. Guarda los que quieres leer. Comparte tus opiniones.
          </p>
          
          {/* Barra de búsqueda de libros */}
          <div className="max-w-2xl mx-auto">
            <SearchBar 
              placeholder="Buscar libros, autores, géneros..." 
              showAdvanced={true}
            />
          </div>

          {/* ✅ QUITAR los 3 cuadros blancos */}
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Recomendaciones Personalizadas */}
        {recommendedBooks.length > 0 && (
          <BookSection
            title="Recomendado para ti"
            subtitle="Basado en tus gustos y lecturas previas"
            viewAllLink="/recommendations"
            icon={<Sparkles className="w-6 h-6 text-red-600" />}
          >
            <BookGrid books={recommendedBooks} />
          </BookSection>
        )}

        {/* Libros Nuevos */}
        <BookSection
          title="Recién Agregados"
          subtitle="Los últimos libros añadidos a la colección"
          viewAllLink="/books?sort=new"
          icon={<Clock className="w-6 h-6 text-red-600" />}
        >
          <BookGrid books={newBooks} />
        </BookSection>

        {/* Libros Mejor Rankeados */}
        <BookSection
          title="Mejor Valorados"
          subtitle="Los libros con las mejores calificaciones"
          viewAllLink="/books?sort=rating"
          icon={<Star className="w-6 h-6 text-red-600 fill-red-600" />}
        >
          <BookGrid books={topBooks} />
        </BookSection>

        {/* Reviews Populares */}
        {popularReviews.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Star className="w-6 h-6 text-red-600 fill-red-600" />
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Reseñas Destacadas
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Lo que la comunidad está diciendo
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}