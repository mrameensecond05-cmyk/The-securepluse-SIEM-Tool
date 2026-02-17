import axios from 'axios';

// Create an axios instance with a default config
const client = axios.create({
    baseURL: '/api', // Nginx proxies /api to the API Gateway
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the auth token in requests
client.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`; // Use Bearer scheme
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle 401/403 errors (optional but good practice)
client.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Check if it's not a login attempt itself
            if (!error.config.url.includes('/auth/login')) {
                // clear token and redirect to login if token is invalid/expired
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default client;
