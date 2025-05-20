import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ redirectPath = '/login', children }) => {
    const { isAuthenticated, loading, user } = useAuth();

    useEffect(() => {
        console.log('ProtectedRoute - Auth state:', { isAuthenticated, loading, user });
    }, [isAuthenticated, loading, user]);

    // Show loading state or spinner while checking authentication
    if (loading) {
        console.log('ProtectedRoute - Still loading authentication state');
        return <div>Loading...</div>;
    }

    // If not authenticated, redirect to login page
    if (!isAuthenticated) {
        console.log('ProtectedRoute - Not authenticated, redirecting to login');
        return <Navigate to={redirectPath} replace />;
    }

    // Render children or outlet
    console.log('ProtectedRoute - Authenticated, rendering content');
    return children ? children : <Outlet />;
};

export default ProtectedRoute; 