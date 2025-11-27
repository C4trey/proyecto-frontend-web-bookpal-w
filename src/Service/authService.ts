import type { AuthResponse, LoginDTO, RegisterDTO, User } from '../types';
import { api } from './api';

export const authService = {
  async login(credentials: LoginDTO): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  async register(data: RegisterDTO): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  // ✅ RUTA CORREGIDA
  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/api/usuarios/me');
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  setToken(token: string): void {
    localStorage.setItem('token', token);
  },

  setUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  },

  getStoredUser(): User | null {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  },
};