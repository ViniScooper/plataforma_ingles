import axios from 'axios';

// Em produção: /api → Vercel faz proxy para a VM Oracle (sem CORS)
// Em dev: localhost:3002
const API_BASE_URL = import.meta.env.MODE === 'production'
  ? '/api'
  : `http://${window.location.hostname}:3002/api`;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle session expiration globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const data = error.response.data;
      if (data && data.code === 'SESSION_EXPIRED') {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        window.location.href = '/login?reason=session_expired';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
