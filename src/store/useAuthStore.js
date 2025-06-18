import { create } from 'zustand';
import { authAPI } from '../api/authAPI';
import { jwtDecode } from 'jwt-decode';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authAPI.signin({ email, password });
      const { accessToken, refreshToken } = res.data;

      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);

      const decoded = jwtDecode(accessToken);
      set({
        user: {
          id: decoded.sub,
          email: decoded.email,
          name: decoded.name || '',
          role: decoded.role,
        },
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || 'Login failed',
      });
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authAPI.signup({ name, email, password });
      const { accessToken, refreshToken } = res.data;

      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);

      const decoded = jwtDecode(accessToken);
      set({
        user: {
          id: decoded.sub,
          email: decoded.email,
          name: decoded.name || name,
          role: decoded.role,
        },
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || 'Signup failed',
      });
    }
  },

  logout: async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        await authAPI.logout(token);
      } catch (err) {
        console.error('Logout failed:', err);
      }
    }
    localStorage.clear();
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const isExpired = decoded.exp * 1000 < Date.now();

      if (isExpired) {
        localStorage.clear();
        set({ user: null, isAuthenticated: false });
        return;
      }

      set({
        user: {
          id: decoded.sub,
          email: decoded.email,
          name: decoded.name || '',
          role: decoded.role,
        },
        isAuthenticated: true,
      });
    } catch (err) {
      console.error('Auth check failed:', err);
      localStorage.clear();
      set({ user: null, isAuthenticated: false });
    }
  },
  getProfile: async () => {
    const res = await authAPI.getProfileDetails();
    // set((state) => ({ user: { ...state.user, ...data } }));
    // return res.data;
    const { id, name, email, phone, profilePicture } = res.data;

    set((state) => ({
      user: { ...state.user, id, name, email, phone, profilePicture },
    }));
  },
  updateProfile: async (data) => {
    const res = await authAPI.updateProfile(data);
    set((state) => ({ user: { ...state.user, ...data } }));
    return res.data;
  },
  updatePassword: async (data) => {
    const res = await authAPI.updatePassword(data);
    return res.data;
  },

  updateAvatar: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await authAPI.uploadAvatar(formData);
    set((state) => ({
      user: { ...state.user, avatarUrl: res.data.avatarUrl },
    }));
  },
}));
