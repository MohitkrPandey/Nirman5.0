import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setAuthToken } from '../lib/api';
import { useAuth } from '../lib/authContext';

function AuthPage() {
    const [activeTab, setActiveTab] = useState('login');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const auth = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const endpoint = activeTab === 'login' ? '/api/auth/login' : '/api/auth/signup';
            const payload = activeTab === 'login'
                ? { email: formData.email, password: formData.password }
                : {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: localStorage.getItem('role') || 'volunteer'
                };

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            // Get response text first
            const responseText = await response.text();

            // Check if response is empty
            if (!responseText) {
                throw new Error('Server returned empty response');
            }

            // Try to parse as JSON
            let data;
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                try {
                    data = JSON.parse(responseText);
                } catch (parseError) {
                    throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}`);
                }
            } else {
                throw new Error(`Non-JSON response: ${responseText.substring(0, 100)}`);
            }

            // Check if request was successful
            if (!response.ok) {
                throw new Error(data.message || data.error || `Request failed with status ${response.status}`);
            }

            // Save token and user data
            if (data.token && data.user) {
                console.debug('[AuthPage] Login successful, setting auth context');

                // Set token in API helper
                setAuthToken(data.token);

                // Update auth context
                await auth.login(data.token, data.user);

                console.debug('[AuthPage] Auth context updated, navigating to /');

                // Navigate to homepage
                navigate('/');
            } else {
                throw new Error('No token received from server');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleOAuth = async (provider) => {
        setError('');
        setLoading(true);

        try {
            // Generate mock user data
            const mockEmail = `${provider}user${Date.now()}@example.com`;
            const mockName = `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`;

            const response = await fetch(`/api/oauth/${provider}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: mockEmail, name: mockName }),
            });

            // Get response text first
            const responseText = await response.text();

            // Check if response is empty
            if (!responseText) {
                throw new Error('Server returned empty response');
            }

            // Try to parse as JSON
            let data;
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                try {
                    data = JSON.parse(responseText);
                } catch (parseError) {
                    throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}`);
                }
            } else {
                throw new Error(`Server error: ${responseText.substring(0, 100)}`);
            }

            // Check if request was successful
            if (!response.ok) {
                throw new Error(data.error || data.message || 'OAuth failed');
            }

            // Save token and user data
            if (data.token && data.user) {
                console.debug('[AuthPage] OAuth successful, setting auth context');

                // Set token in API helper
                setAuthToken(data.token);

                // Update auth context
                await auth.login(data.token, data.user);

                console.debug('[AuthPage] Auth context updated, navigating to /');

                // Navigate to homepage
                navigate('/');
            } else {
                throw new Error('No token received from server');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-[#7B6CF8] to-[#A78BFA] flex items-center justify-center p-4">
            <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-lg p-8">
                {/* Tabs */}
                <div className="flex gap-2 mb-8 bg-gray-50 p-1 rounded-full">
                    <button
                        onClick={() => setActiveTab('login')}
                        className={`flex-1 py-2.5 px-4 rounded-full font-medium transition-all ${activeTab === 'login'
                                ? 'bg-white shadow text-gray-800'
                                : 'bg-transparent text-gray-500 border border-[#E5E7EB]'
                            }`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setActiveTab('signup')}
                        className={`flex-1 py-2.5 px-4 rounded-full font-medium transition-all ${activeTab === 'signup'
                                ? 'bg-white shadow text-gray-800'
                                : 'bg-transparent text-gray-500 border border-[#E5E7EB]'
                            }`}
                    >
                        Sign Up
                    </button>
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold text-[#1F2937] mb-2">
                    {activeTab === 'login' ? 'Welcome back' : 'Create account'}
                </h1>
                <p className="text-[#9CA3AF] mb-6">
                    {activeTab === 'login'
                        ? 'Enter your credentials to continue'
                        : 'Sign up to get started'}
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {activeTab === 'signup' && (
                        <div>
                            <label className="block text-sm font-medium text-[#374151] mb-1.5">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                required={activeTab === 'signup'}
                                className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg text-[#374151] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-[#374151] mb-1.5">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                            className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg text-[#374151] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#374151] mb-1.5">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                            className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg text-[#374151] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#6366F1] text-white py-3 rounded-full font-medium hover:bg-[#5558E3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Please wait...' : 'Continue'}
                    </button>
                </form>

                {/* Divider */}
                <div className="flex items-center my-6">
                    <div className="flex-1 h-px bg-[#E5E7EB]"></div>
                    <span className="px-4 text-sm text-[#9CA3AF]">or</span>
                    <div className="flex-1 h-px bg-[#E5E7EB]"></div>
                </div>

                {/* Social Buttons */}
                <div className="space-y-3">
                    <button
                        type="button"
                        onClick={() => handleOAuth('google')}
                        disabled={loading}
                        className="w-full bg-white border border-[#E5E7EB] py-2.5 rounded-full font-medium text-[#374151] hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continue with Google
                    </button>
                    <button
                        type="button"
                        onClick={() => handleOAuth('github')}
                        disabled={loading}
                        className="w-full bg-white border border-[#E5E7EB] py-2.5 rounded-full font-medium text-[#374151] hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                        </svg>
                        Continue with GitHub
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AuthPage;
