import axios from 'axios';

// 1. Configuramos el campo base
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

api.interceptors.request.use(
  (config) => {
    // Busca el token en el navegador
    const token = localStorage.getItem('tactik_token');
    
    // Si la encuentra, se la pega a la cabecera 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;