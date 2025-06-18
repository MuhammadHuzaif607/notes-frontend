// src/api/authAPI.js
import axiosInstance from './axiosInstance';

export const authAPI = {
  signup: (data) => axiosInstance.post('/auth/signup', data),
  signin: (data) => axiosInstance.post('/auth/signin', data),
  logout: () => axiosInstance.post('/auth/logout'),
  requestPasswordReset: (email) =>
    axiosInstance.post('/auth/request-password-reset', { email }),
  getProfileDetails: () => axiosInstance.get('/user/me'),
  resetPassword: (data) => axiosInstance.post('/auth/reset-password', data),
  updateProfile: (data) => axiosInstance.put('/user/profile', data),
  updatePassword: (data) => axiosInstance.patch('/user/update-password', data),
  uploadAvatar: (formData) =>
    axiosInstance.post('/user/profile/picture', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};
