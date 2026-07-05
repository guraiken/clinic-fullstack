import axios from 'axios';

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL || 'http://localhost'}:5000`,
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

