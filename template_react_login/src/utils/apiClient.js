import axios from 'axios';

// Em produção: /api → Vercel faz proxy para a VM Oracle (sem CORS)
// Em dev: localhost:3002
const API_BASE_URL = import.meta.env.MODE === 'production'
  ? '/api'
  : 'http://localhost:3002/api';

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

export default apiClient;
