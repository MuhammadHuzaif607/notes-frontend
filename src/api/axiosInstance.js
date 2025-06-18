// src/api/axiosInstance.js
import axios from 'axios';

const API_BASE_URL = 'https://gymconnect.muhammadhuzaif.me';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Attach access token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 and refresh logic
axiosInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (
      err.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== '/auth/refresh'
    ) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        localStorage.clear();
        window.location.href = '/signin';
        return Promise.reject(err);
      }

      try {
        const res = await axios.post(`${API_BASE_URL}/auth/refresh`, null, {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        });

        const { accessToken, refreshToken: newRefreshToken } = res.data;
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('refresh_token', newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshErr) {
        localStorage.clear();
        window.location.href = '/signin';
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(err);
  }
);

export default axiosInstance;
