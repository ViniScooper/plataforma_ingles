import axios from 'axios';

const isProd = import.meta.env.MODE === 'production';
const API_BASE_URL = isProd 
  ? 'https://plataforma-ingles-1djx.onrender.com/api' 
  : 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
