import type { Book, User, PageResponse } from "../types";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const searchBooks = async (query: string): Promise<Book[]> => {

  if (!query.trim()) {
    return [];
  }

  try {
    const res = await fetch(
      `${API_URL}/libro/search?query=${query}&page=0&size=20`
    );

    if (!res.ok) {
      throw new Error("Error al buscar libros");
    }

    const data = await res.json();

    return data.content || [];
  } catch (error) {
    console.error("Error en searchBooks:", error);
    return [];
  }
};



export async function searchUsers(query: string): Promise<User[]> {
  const res = await fetch(`${API_URL}/api/usuarios/search?query=${query}`);
  if (!res.ok) return [];
  return res.json();
}


export const getAllGeneros = async (): Promise<string[]> => {
    try {
        const res = await fetch(`${API_URL}/libro/generos`);
        if (!res.ok) throw new Error("Error al obtener géneros");

        return await res.json();
    } catch (err){
        console.error(err);
        return [];
    }
};

export const getBooksByGenero = async (
  genero: string,
  page: number = 0,
  size: number = 20
): Promise<PageResponse<Book>> => {
  try {
    const res = await fetch(
      `${API_URL}/libro/genero/${genero}?page=${page}&size=${size}`
    );

    if (!res.ok) {
      throw new Error("Error al consultar libros por género");
    }

    const data = await res.json();
    return data as PageResponse<Book>;
  } catch (err) {
    console.error(err);

    // Devuelve un PageResponse vacío para evitar que la app crashee
    return {
      content: [],
      totalElements: 0,
      totalPages: 0,
      size,
      number: page,
      first: page === 0,
      last: true,
      empty: true
    };
  }
};
