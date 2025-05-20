import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
    baseURL: window.location.origin,  // Use the current origin
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include auth token in requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
            // Don't log full body for privacy/security reasons
            if (config.data && !(config.data instanceof FormData)) {
                console.log('Request data keys:', Object.keys(config.data));
            } else if (config.data instanceof FormData) {
                console.log('Request contains FormData');
            }
        } else {
            console.warn(`API Request without token: ${config.method?.toUpperCase()} ${config.url}`);
        }
        return config;
    },
    (error) => {
        console.error('API Request error interceptor:', error);
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle token refresh or logout on 401
api.interceptors.response.use(
    (response) => {
        console.log(`API Response: ${response.status} from ${response.config.url}`);
        return response;
    },
    async (error) => {
        console.error('API Response error:', error.message);
        if (error.response) {
            console.error(`Status: ${error.response.status}, URL: ${error.config?.url}`);
        }

        const originalRequest = error.config;

        // If unauthorized and not already retrying
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            console.log('Attempting to refresh token...');

            try {
                // Try to refresh token
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    // No refresh token, force logout
                    console.error('No refresh token available, forcing logout');
                    localStorage.removeItem('token');
                    localStorage.removeItem('refreshToken');
                    window.location.href = '/login';
                    return Promise.reject(new Error('No refresh token available'));
                }

                // Request new access token
                const response = await axios.post(
                    `${window.location.origin}/api/token/refresh/`,
                    { refresh: refreshToken }
                );

                const { access } = response.data;
                localStorage.setItem('token', access);
                console.log('Token refreshed successfully');

                // Update authorization header for the original request
                originalRequest.headers.Authorization = `Bearer ${access}`;
                return axios(originalRequest);
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                console.error('Refresh error details:', refreshError.response?.data || 'No response data');
                // If refresh fails, log out
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api; 