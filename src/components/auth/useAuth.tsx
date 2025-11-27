import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import { api, handleApiError } from "../../Service/api";
import { useLocalStorage } from "../../hook/useLocalStorage";

interface AuthProviderProps {
  children: ReactNode;
}

export interface IAuthContext {
  // User fields
  userId: number;
  nombre: string;
  apellido: string;
  username: string;
  email: string;
  country: string;
  bio: string;
  birthDate: string;
  profilePicture: string;
  role: string;
  numFollowers: number;
  numFollowing: number;
  
  // Auth fields
  token: string;
  expiresOn: number;
  isAuthenticated: boolean;
  
  // Methods
  register: (nombre: string, apellido: string, username: string, email: string, password: string, country: string, bio?: string, birthDate?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<IAuthContext>({
  userId: 0,
  nombre: "",
  apellido: "",
  username: "",
  email: "",
  country: "",
  bio: "",
  birthDate: "",
  profilePicture: "",
  role: "",
  numFollowers: 0,
  numFollowing: 0,
  token: "",
  expiresOn: -1,
  isAuthenticated: false,
  register: async () => {},
  login: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useLocalStorage("session", "");
  const [token, setToken] = useLocalStorage("token", "");
  const [expiresOn, setExpiresOn] = useLocalStorage("expiresOn", "");

  // ======================================
  // REGISTER
  // ======================================
  const register = async (
    nombre: string,
    apellido: string,
    username: string,
    email: string,
    password: string,
    country: string,
    bio?: string,
    birthDate?: string
  ) => {
    try {
      console.debug("Registrando usuario:", username);

      const { data } = await api.post("/auth/register", {
        nombre,
        apellido,
        username,
        email,
        password,
        country,
        bio,
        birthDate,
      });

      console.debug("Usuario registrado:", data);

      // Guardar sesión con todos los datos del usuario
      setSession(
        JSON.stringify({
          userId: data.user.id,
          nombre: data.user.nombre,
          apellido: data.user.apellido,
          username: data.user.username,
          email: data.user.email,
          country: data.user.country,
          bio: data.user.bio || "",
          birthDate: data.user.birthDate || "",
          profilePicture: data.user.profilePicture || "",
          role: data.user.role,
          numFollowers: data.user.numFollowers || 0,
          numFollowing: data.user.numFollowing || 0,
        })
      );

      setToken(data.token);
      
      // Calcular expiración usando el tiempo del backend
      const expirationTimestamp = new Date().getTime() + data.expirationTime;
      setExpiresOn(expirationTimestamp.toString());
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  };

  // ======================================
  // LOGIN
  // ======================================
  const login = async (email: string, password: string) => {
    try {
      console.debug("Autenticando usuario:", email);

      const { data } = await api.post("/auth/login", { email, password });

      console.debug("Usuario autenticado:", data);

      // Guardar sesión con todos los datos del usuario
      setSession(
        JSON.stringify({
          userId: data.user.id,
          nombre: data.user.nombre,
          apellido: data.user.apellido,
          username: data.user.username,
          email: data.user.email,
          country: data.user.country,
          bio: data.user.bio || "",
          birthDate: data.user.birthDate || "",
          profilePicture: data.user.profilePicture || "",
          role: data.user.role,
          numFollowers: data.user.numFollowers || 0,
          numFollowing: data.user.numFollowing || 0,
        })
      );

      setToken(data.token);
      
      // Calcular expiración usando el tiempo del backend
      const expirationTimestamp = new Date().getTime() + data.expirationTime;
      setExpiresOn(expirationTimestamp.toString());
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  };

  // ======================================
  // LOGOUT
  // ======================================
  const logout = () => {
    setSession("");
    setToken("");
    setExpiresOn("");
  };

  // ======================================
  // VALOR MEMOIZADO DEL CONTEXT
  // ======================================
  const value = useMemo(() => {
    let sess: any = null;

    if (session) {
      try {
        sess = JSON.parse(session);
      } catch (err) {
        console.error("Error parsing session:", err);
      }
    }

    return {
      userId: sess?.userId || 0,
      nombre: sess?.nombre || "",
      apellido: sess?.apellido || "",
      username: sess?.username || "",
      email: sess?.email || "",
      country: sess?.country || "",
      bio: sess?.bio || "",
      birthDate: sess?.birthDate || "",
      profilePicture: sess?.profilePicture || "",
      role: sess?.role || "",
      numFollowers: sess?.numFollowers || 0,
      numFollowing: sess?.numFollowing || 0,
      token: token || "",
      expiresOn: expiresOn ? parseInt(expiresOn, 10) : -1,
      isAuthenticated: !!token,
      register,
      login,
      logout,
    };
  }, [session, token, expiresOn]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ======================================
// HOOK PARA USAR EL CONTEXT
// ======================================
export function useAuth() {
  return useContext(AuthContext);
}