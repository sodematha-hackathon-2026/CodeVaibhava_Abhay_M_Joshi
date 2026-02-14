import axios from 'axios';
import { auth } from '@/utils/firebase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http:
export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
            auth.signOut();
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
