import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Hero from '../components/Hero';
import MetricsRow from '../components/MetricsRow';
import ThreeSteps from '../components/ThreeSteps';
import FeaturesGrid from '../components/FeaturesGrid';
import FooterCTA from '../components/FooterCTA';
import { updateRole } from '../lib/api';
import { useAuth } from '../lib/authContext';

const metrics = [
    { value: '10,000+', label: 'Active Users' },
    { value: '5,000+', label: 'Volunteers' },
    { value: '<3 min', label: 'Avg Response Time' },
    { value: '300+', label: 'Communities' },
];

const steps = [
    { title: 'Request Help', description: 'Tap once to alert nearby volunteers instantly' },
    { title: 'Get Matched', description: 'Our system finds the closest available neighbor' },
    { title: 'Receive Support', description: 'Help arrives within minutes, not hours' },
];

const features = [
    { title: 'Real-Time Alerts', description: 'Instant notifications to nearby volunteers when help is needed' },
    { title: 'Verified Volunteers', description: 'All helpers are background-checked and community-verified' },
    { title: 'GPS Tracking', description: 'Track volunteer location and estimated arrival time' },
    { title: 'Emergency Contacts', description: 'Automatic notification to your emergency contacts' },
    { title: 'Community Network', description: 'Build trust with neighbors before emergencies happen' },
    { title: '24/7 Availability', description: 'Round-the-clock coverage from your local community' },
];

function HomePage() {
    const { user, isAuthenticated, loading, updateUser } = useAuth();
    const [showRoleModal, setShowRoleModal] = useState(false);
    const navigate = useNavigate();

    const handleGetHelp = () => {
        console.debug('[HomePage] Get Help clicked', { isAuthenticated, loading });
        if (loading) return;

        if (isAuthenticated) {
            navigate('/request/create');
        } else {
            localStorage.setItem('role', 'requester');
            navigate('/signup');
        }
    };

    const handleJoinVolunteer = () => {
        console.debug('[HomePage] Join Volunteer clicked', { isAuthenticated, loading });
        if (loading) return;

        if (isAuthenticated) {
            if (user?.role === 'volunteer') {
                navigate('/map');
            } else {
                handleSwitchRole('volunteer');
            }
        } else {
            localStorage.setItem('role', 'volunteer');
            navigate('/signup');
        }
    };

    const handleContinueToMap = () => {
        navigate('/map');
    };

    const handleSwitchRole = async (newRole) => {
        try {
            const data = await updateRole(newRole);
            updateUser(data.user);
            localStorage.setItem('role', newRole);
            setShowRoleModal(false);
        } catch (error) {
            console.error('Failed to update role:', error);
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-white">
            <Header onGetHelp={handleGetHelp} onJoinVolunteer={handleJoinVolunteer} />

            {/* Authenticated User Banner */}
            {isAuthenticated && user && (
                <div className="bg-blue-50 border-b border-blue-100 py-3 px-4">
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#1766E0] flex items-center justify-center text-white font-bold">
                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">
                                    Signed in as <span className="font-bold capitalize">{user.role || 'User'}</span>
                                </p>
                                <p className="text-xs text-gray-600">{user.email}</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleContinueToMap}
                                className="bg-[#1766E0] text-white px-6 py-2 rounded-full font-medium hover:bg-[#1557C0] transition-colors text-sm"
                            >
                                Continue to Map
                            </button>
                            <button
                                onClick={() => setShowRoleModal(true)}
                                className="bg-white text-[#1766E0] border-2 border-[#1766E0] px-6 py-2 rounded-full font-medium hover:bg-[#F0F7FF] transition-colors text-sm"
                            >
                                Switch Role
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Role Switch Modal */}
            {showRoleModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
                        <h3 className="text-2xl font-bold text-[#0F172A] mb-4">Choose Your Role</h3>
                        <p className="text-gray-600 mb-6">Select how you want to use NeighbourNet</p>
                        <div className="space-y-3">
                            <button
                                onClick={() => handleSwitchRole('volunteer')}
                                className={`w-full p-4 rounded-xl border-2 transition-all ${user?.role === 'volunteer'
                                        ? 'border-[#1766E0] bg-[#F0F7FF]'
                                        : 'border-gray-200 hover:border-[#1766E0]'
                                    }`}
                            >
                                <div className="font-bold text-lg text-[#0F172A]">Volunteer</div>
                                <div className="text-sm text-gray-600">Help neighbors in need</div>
                            </button>
                            <button
                                onClick={() => handleSwitchRole('requester')}
                                className={`w-full p-4 rounded-xl border-2 transition-all ${user?.role === 'requester'
                                        ? 'border-[#1766E0] bg-[#F0F7FF]'
                                        : 'border-gray-200 hover:border-[#1766E0]'
                                    }`}
                            >
                                <div className="font-bold text-lg text-[#0F172A]">Requester</div>
                                <div className="text-sm text-gray-600">Get help when you need it</div>
                            </button>
                        </div>
                        <button
                            onClick={() => setShowRoleModal(false)}
                            className="w-full mt-4 py-2 text-gray-600 hover:text-gray-900"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <Hero
                title="One Tap. Neighbors Respond."
                subtitle="Instant help from your community during emergencies."
                gradientStart="#1766E0"
                gradientEnd="#2FA1FF"
                onGetHelp={handleGetHelp}
                onJoinVolunteer={handleJoinVolunteer}
            />
            <MetricsRow metrics={metrics} />
            <ThreeSteps steps={steps} />
            <FeaturesGrid features={features} />
            <FooterCTA />
        </div>
    );
}

export default HomePage;
