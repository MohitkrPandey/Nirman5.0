import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/authContext';

function ProtectedRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        console.debug('[ProtectedRoute] Auth state:', { loading, isAuthenticated });

        // Only redirect if not loading and not authenticated
        if (!loading && !isAuthenticated) {
            console.debug('[ProtectedRoute] Not authenticated, redirecting to /auth');
            navigate('/auth', { replace: true });
        }
    }, [loading, isAuthenticated, navigate]);

    // Show loading while checking auth
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gray-600">Loading...</div>
            </div>
        );
    }

    // Only render children if authenticated
    if (!isAuthenticated) {
        return null;
    }

    return children;
}

export default ProtectedRoute;
