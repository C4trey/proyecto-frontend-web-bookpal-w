// ===== AUTH TYPES =====
export interface RegisterDTO {
  nombre: string;
  apellido: string;
  username: string;
  email: string;
  password: string;
  country: string;
  bio?: string;
  birthDate?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  expirationTime: number;
  user: User;
}

// ===== USER TYPES =====
export interface User {
  id: number;
  nombre: string;
  apellido: string;
  username: string;
  email: string;
  country: string;
  bio?: string;
  birthDate?: string;
  profilePicture?: string;
  role: 'USER' | 'ADMIN';
  numFollowers: number;
  numFollowing: number;
  createdAt: string;
}

// ===== API ERROR =====
export interface ApiError {
  error: string;
  message: string;
  timestamp: string;
  status: number;
}

// ===== COUNTRY =====
export interface Country {
  code: string;
  name: string;
  flag: string;
}

// ===== BOOK TYPES =====
export interface Book {
  id: number;
  titulo: string;
  autor: string;
  genero: string;
  anioPublicacion: string;
  portadaUrl: string | null;
  averageRating: number;
  cantidadResenas?: number;
}

export interface BookDetail extends Book {
  sinopsis: string;
  oneStarCount: number;
  twoStarCount: number;
  threeStarCount: number;
  fourStarCount: number;
  fiveStarCount: number;
  cantidadResenas: number;
  createdAt: string;
  reviews: ReviewResponseDTO[];
}

export interface RatingDistribution {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
}

// ===== SEARCH TYPES ===== ✅ NUEVO
export interface SearchFilters {
  query?: string;
  genero?: string;
  anioDesde?: string;
  anioHasta?: string;
  minRating?: number;
}

export interface SearchSuggestion {
  titulo: string;
  tipo: 'libro' | 'autor' | 'genero';
}

// ===== REVIEW TYPES =====

// DTO para crear una review
export interface CreateReviewDTO {
  rating: number;
  comentario: string;
}

// Respuesta completa de una review (usada en páginas de detalle)
export interface ReviewResponseDTO {
  id: number;
  rating: number;
  comentario: string;
  authorUsername: string;
  authorNombre: string;
  authorApellido: string;
  authorProfilePicture: string | null;
  liked: boolean;
  libroTitulo: string;
  likesCount: number;
  commentsCount: number;
  canDelete: boolean;
  createdAt: string;
  topComments: CommentResponseDTO[];
  hasMoreComments: boolean;
}

// Review simplificada (usada en listas y cards)
export interface Review {
  id: number;
  rating: number;
  comentario: string;
  createdAt: string;
  likesCount: number;
  author: {
    id: number;
    username: string;
    nombre: string;
    apellido: string;
    profilePicture: string | null;
  };
  libro: {
    id: number;
    titulo: string;
    portadaUrl: string | null;
  };
}

// Respuesta de like en review
export interface ReviewLikeResponseDTO {
  liked: boolean;
  totalLikes: number;
}

// Lista de reviews con paginación
export interface ReviewsListResponseDTO {
  reviews: ReviewResponseDTO[];
  hasMore: boolean;
  totalCount: number;
  averageRating: number | null;
}

// ===== COMMENT TYPES =====

// DTO para crear un comentario
export interface CreateCommentDTO {
  comentario: string;
}

// Respuesta de un comentario
export interface CommentResponseDTO {
  id: number;
  comentario: string;
  authorUsername: string;
  authorNombre: string;
  authorApellido: string;
  authorProfilePicture: string | null;
  likesCount: number;
  liked: boolean;
  repliesCount: number;
  createdAt: string;
}

// Alias para compatibilidad con componentes existentes
export type Comment = CommentResponseDTO;

// Lista de comentarios con paginación
export interface CommentsListResponse {
  comments: CommentResponseDTO[];
  hasMore: boolean;
  totalCount: number;
}

// Respuesta de like en comentario
export interface CommentLikeResponseDTO {
  liked: boolean;
  totalLikes: number;
}

// ===== PAGINATION =====
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// ===== LIKES =====
export interface UserLike {
  username: string;
  isFollowing: boolean;
  likedAt: string;
}

export interface BookLikesResponse {
  usuarios: UserLike[];
  hasMore: boolean;
}

// ===== BOOK LIKE STATUS ===== ✅ NUEVO
export interface BookLikeStatus {
  liked: boolean;
  totalLikes: number;
}

// ===== AUTHOR TYPES (para compatibilidad) =====
export interface ReviewAuthor {
  id: number;
  nombre: string;
  apellido: string;
  username: string;
  profilePicture?: string;
}

export interface ReviewBook {
  id: number;
  titulo: string;
  portadaUrl?: string;
}

export interface ProfileUser {
  id: number;
  nombre: string;
  apellido: string;
  username: string;
  email?: string;
  role: string;
  bio?: string;
  country: string;
  birthDate?: string;
  profilePicture?: string;
  numFollowers: number;
  numFollowing: number;
  createdAt: string;
  totalReviews: number;
  totalLists: number;
  totalFavorites: number;
}

export interface LibroSimple {
  id: number;
  titulo: string;
  portadaUrl: string;
  autor: string;
  avgRating?: number;
}

export interface ListaSimple {
  id: number;
  nombre: string;
  descripcion?: string;
  bookCount: number;
  isPublic: boolean;
}

export interface ReviewSimple {
  id: number;
  rating: number;
  comentario: string;
  createdAt: string;
  authorUsername: string;
  authorNombre: string;
  authorApellido: string;
  authorProfilePicture?: string;
  libroTitulo: string;
  likesCount: number;
  commentsCount: number;
  liked: boolean;
  canDelete: boolean;
}

export interface ProfileResponse {
  usuario: ProfileUser;
  recentReviews: ReviewSimple[];
  favoriteBooks: LibroSimple[];
  recentLikes: LibroSimple[];
  publicLists: ListaSimple[];
  isFollowing: boolean | null;
  isOwnProfile: boolean;
}

// ===== RECOMMENDATION TYPES ===== ✅ NUEVO
export const RecommendationReason = {
  SAME_GENRE: 'SAME_GENRE',
  HIGH_RATED: 'HIGH_RATED',
  TRENDING: 'TRENDING',
  SIMILAR_USERS: 'SIMILAR_USERS'
} as const;

export type RecommendationReason = typeof RecommendationReason[keyof typeof RecommendationReason];


export interface RecommendationDTO {
  libroId: number;
  titulo: string;
  autor: string;
  genero: string;
  portada?: string; // En el backend es "portada", no "portadaUrl"
  averageRating: number;
  recommendationScore: number;
  reason: RecommendationReason;
  reasonMessage: string;
}

export interface RecommendationsResponseDTO {
  recommendations: RecommendationDTO[];
  totalCount: number;
}

// Helper para convertir RecommendationDTO a Book
export const recommendationToBook = (rec: RecommendationDTO): Book => ({
  id: rec.libroId,
  titulo: rec.titulo,
  autor: rec.autor,
  genero: rec.genero,
  anioPublicacion: '',
  portadaUrl: rec.portada || null,
  averageRating: rec.averageRating || 0,
  cantidadResenas: 0
});

// ===== USER SEARCH TYPES ===== ✅ NUEVO
export interface UserSearchResult {
  username: string;
  nombre: string;
  apellido: string;
  bio?: string;
  country: string;
  profilePicture?: string;
  numFollowers: number;
  numFollowing: number;
}

export interface UserSearchSuggestion {
  username: string;
  displayName: string; // nombre + apellido
}

// ===== FOLLOW TYPES ===== ✅ NUEVO
export interface FollowToggleResponse {
  siguiendo: boolean;
  totalFollowers: number;
  mensaje: string;
}

export interface FollowStatus {
  siguiendo: boolean;
}

// ===== FOLLOW TYPES =====
export interface UsuarioFollowDTO {
  username: string;
  nombre: string;
  apellido: string;
  profilePicture?: string;  // Solo estos 4 campos
}

export interface FollowListResponse {
  content: UsuarioFollowDTO[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// ===== LISTA LIBROS TYPES =====
// ===== LISTA LIBROS TYPES =====
export interface Lista {
  id: number;
  nombre: string; // ✅ Backend usa "nombre"
  descripcion?: string;
  userId: number;
  username?: string;
  bookIds?: number[];
  createdAt: string;
  updatedAt?: string;
}

export interface CreateListaDTO {
  nombre: string; // ✅ Backend usa "nombre"
  descripcion?: string;
}

export interface UpdateListaDTO {
  nombre?: string; // ✅ Backend usa "nombre"
  descripcion?: string;
}

// ✅ DTO para cuando la lista viene con libros completos
export interface ListaLibrosDTO {
  id: number;
  nombre: string; // ✅ Cambiado de "name" a "nombre"
  descripcion?: string;
  isPublic: boolean;
  userId: number;
  username?: string;
  libros: Book[];
  createdAt: string;
}

export interface ListaLibrosSimpleDTO {
  id: number;
  nombre: string; // ✅ Consistencia
  descripcion?: string;
  bookCount: number;
  isPublic: boolean;
}

// ===== NOTIFICATION TYPES =====
export const TipoNotificacion = {
  NUEVO_SEGUIDOR: 'NUEVO_SEGUIDOR',
  NUEVO_LIKE_REVIEW: 'NUEVO_LIKE_REVIEW',
  NUEVO_COMENTARIO: 'NUEVO_COMENTARIO',
  CONTENIDO_MODERADO: 'CONTENIDO_MODERADO'
} as const;

export type TipoNotificacion = typeof TipoNotificacion[keyof typeof TipoNotificacion];

export interface UsuarioOrigenDTO {
  username: string;
  nombre: string;
  apellido: string;
  profilePicture?: string;
}

export interface NotificacionDTO {
  id: number;
  tipo: TipoNotificacion;
  mensaje: string;
  leida: boolean;
  fechaCreacion: string;
  fechaLectura?: string;
  usuarioOrigen?: UsuarioOrigenDTO;
  entidadId?: number;
  tipoEntidad?: string; // "REVIEW", "LIBRO", "LISTA"
}

export interface NotificationCountResponse {
  noLeidas: number;
}

export interface UserSearchResult {
  id: number;
  username: string;
  nombre: string;
  apellido: string;
  email: string;
  role: 'USER' | 'ADMIN';
  numFollowers: number;
  numFollowing: number;
  createdAt: string;
}