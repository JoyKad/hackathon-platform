import api from './api';
import { jwtDecode } from 'jwt-decode';

const AuthService = {
    // Login user and store tokens
    login: async (email, password) => {
        try {
            console.log('Attempting login with email:', email);
            const response = await api.post('/api/token/', { email, password });
            const { access, refresh } = response.data;

            // Store tokens
            localStorage.setItem('token', access);
            localStorage.setItem('refreshToken', refresh);
            console.log('Login successful, tokens stored');

            return response.data;
        } catch (error) {
            console.error('Login error:', error.message);
            console.error('Login error details:', error.response?.data || 'No response data');
            throw error;
        }
    },

    // Register new user
    register: async (userData) => {
        try {
            console.log('Registering new user with data:', { ...userData, password: '[REDACTED]' });
            const response = await api.post('/api/accounts/register/', userData);
            console.log('Registration successful');
            return response.data;
        } catch (error) {
            console.error('Registration error:', error.message);
            console.error('Registration error details:', error.response?.data || 'No response data');
            throw error;
        }
    },

    // Logout user and remove tokens
    logout: () => {
        console.log('Logging out user, removing tokens');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('No token found, user is not authenticated');
            return false;
        }

        try {
            // Check if token is expired
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            const isTokenValid = decoded.exp > currentTime;
            
            console.log(`Token validation: ${isTokenValid ? 'Valid' : 'Expired'}`);
            return isTokenValid;
        } catch (error) {
            console.error('Error validating token:', error);
            return false;
        }
    },

    // Get current user from API
    getCurrentUser: async () => {
        console.log('Getting current user data');
        try {
            // Попробуем сначала получить данные пользователя по API
            try {
                console.log('Fetching user data from API...');
                const response = await api.get('/api/accounts/me/');
                console.log('User data fetched successfully from API');
                return response.data;
            } catch (apiError) {
                console.warn('Could not fetch user data from API:', apiError.message);
                console.warn('API error details:', apiError.response?.data || 'No response data');

                // Если не получилось, попробуем использовать данные из токена
                console.log('Trying to extract user data from token...');
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('No authentication token found');
                    throw new Error('No authentication token found');
                }

                const decodedToken = jwtDecode(token);
                console.log('Extracted user data from token:', decodedToken);
                return {
                    id: decodedToken.user_id,
                    email: decodedToken.email,
                    full_name: decodedToken.name || decodedToken.full_name || decodedToken.email,
                };
            }
        } catch (error) {
            console.error('Error getting current user:', error);
            throw error;
        }
    }
};

export default AuthService; 