import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://13.219.208.169:5000',
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
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;