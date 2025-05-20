import React, { createContext, useState, useEffect, useContext } from 'react';
import AuthService from '../services/auth';

// Create context
const AuthContext = createContext(null);

// Provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load user on mount
    useEffect(() => {
        const loadUser = async () => {
            if (AuthService.isAuthenticated()) {
                try {
                    const userData = await AuthService.getCurrentUser();
                    setUser(userData);
                } catch (err) {
                    console.error('Failed to load user:', err);
                    setError('Failed to authenticate user');
                    AuthService.logout();
                }
            }
            setLoading(false);
        };

        loadUser();
    }, []);

    // Login function
    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const authResponse = await AuthService.login(email, password);
            console.log('Auth response:', authResponse);

            // Get user data after successful login
            const userData = await AuthService.getCurrentUser();
            console.log('User data after login:', userData);

            setUser(userData);
            setLoading(false);
            return true;
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.detail || 'Failed to login');
            setLoading(false);
            return false;
        }
    };

    // Register function
    const register = async (userData) => {
        setLoading(true);
        setError(null);
        try {
            await AuthService.register(userData);
            return true;
        } catch (err) {
            setError(err.response?.data?.detail || 'Registration failed');
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Logout function
    const logout = () => {
        AuthService.logout();
        setUser(null);
    };

    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext; 