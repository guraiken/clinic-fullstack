import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://3.231.161.64:5000';

const apiClient = axios.create({
  baseURL: BASE_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    config.headers.set('Accept', 'application/json');
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;