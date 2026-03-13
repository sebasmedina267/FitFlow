import { create } from 'zustand';
import { authService } from '../services/api';

const useAuthStore = create((set) => ({
  admin: JSON.parse(localStorage.getItem('admin')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,

  loginAsync: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const response = await authService.login(credentials);
      const { token, admin } = response.data.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('admin', JSON.stringify(admin));
      
      set({ admin, token, isAuthenticated: true, loading: false });
      return { success: true, admin, token };
    } catch (error) {
      const message = error.response?.data?.message || 'Error al iniciar sesión';
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  login: (admin, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('admin', JSON.stringify(admin));
    set({ admin, token, isAuthenticated: true });
  },

  register: async (data) => {
    set({ loading: true, error: null });
    try {
      await authService.register(data);
      set({ loading: false });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Error al registrar';
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    set({ admin: null, token: null, isAuthenticated: false });
  },

  updateAdmin: (adminData) => {
    localStorage.setItem('admin', JSON.stringify(adminData));
    set({ admin: adminData });
  },

  clearError: () => set({ error: null })
}));

export default useAuthStore;
