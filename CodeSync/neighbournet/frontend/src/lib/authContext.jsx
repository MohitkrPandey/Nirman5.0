import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, setAuthToken as setApiToken, getAuthToken, clearAuthToken as clearApiToken } from './api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Initialize auth state on mount
    useEffect(() => {
        const initAuth = async () => {
            console.debug('[AuthContext] Initializing auth...');
            const existingToken = getAuthToken();

            if (existingToken) {
                console.debug('[AuthContext] Token found, validating...');
                try {
                    const data = await getCurrentUser();
                    console.debug('[AuthContext] User validated:', data.user);
                    setToken(existingToken);
                    setUser(data.user);
                    setIsAuthenticated(true);
                } catch (error) {
                    console.debug('[AuthContext] Token invalid, clearing:', error.message);
                    clearApiToken();
                    setToken(null);
                    setUser(null);
                    setIsAuthenticated(false);
                }
            } else {
                console.debug('[AuthContext] No token found');
            }

            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (authToken, userData) => {
        console.debug('[AuthContext] Login called', { token: authToken, user: userData });
        setApiToken(authToken);
        setToken(authToken);
        setUser(userData);
        setIsAuthenticated(true);
    };

    const logout = () => {
        console.debug('[AuthContext] Logout called');
        clearApiToken();
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
    };

    const updateUser = (userData) => {
        console.debug('[AuthContext] Updating user:', userData);
        setUser(userData);
    };

    const value = {
        user,
        token,
        isAuthenticated,
        loading,
        login,
        logout,
        updateUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
