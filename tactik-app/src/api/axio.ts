import axios from 'axios';

// 1. Configuramos el campo base usando la variable de entorno de Vite
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
  (config) => {
    // Busca el token en el navegador
    const token = localStorage.getItem('tactik_token');

    // Si lo encuentra, se lo pega a la cabecera
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