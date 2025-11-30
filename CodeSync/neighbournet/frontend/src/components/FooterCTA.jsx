import React from 'react';
import { useNavigate } from 'react-router-dom';

function FooterCTA({ onNavigate }) {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        localStorage.setItem('role', 'requester');
        if (navigate) {
            navigate('/signup');
        } else if (onNavigate) {
            onNavigate('/signup');
        }
    };

    return (
        <section
            className="py-20 px-4 text-white"
            style={{
                background: 'linear-gradient(90deg, #1766E0 0%, #2FA1FF 100%)',
            }}
        >
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Real Neighbors, Real Safety
                </h2>
                <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                    Join thousands of communities building safer neighborhoods together
                </p>
                <button
                    onClick={handleGetStarted}
                    className="bg-white text-[#1766E0] px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-50 transition-all hover:scale-105 shadow-lg"
                    aria-label="Get started with NeighbourNet"
                >
                    Get Started Today
                </button>
            </div>
        </section>
    );
}

export default FooterCTA;
