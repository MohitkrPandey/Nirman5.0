import React from 'react';
import { useNavigate } from 'react-router-dom';

function Header({ onNavigate, onGetHelp, onJoinVolunteer }) {
    const navigate = useNavigate();

    const handleGetHelp = () => {
        if (onGetHelp) {
            onGetHelp();
        } else {
            localStorage.setItem('role', 'requester');
            if (navigate) {
                navigate('/signup');
            } else if (onNavigate) {
                onNavigate('/signup');
            }
        }
    };

    const handleJoinVolunteer = () => {
        if (onJoinVolunteer) {
            onJoinVolunteer();
        } else {
            localStorage.setItem('role', 'volunteer');
            if (navigate) {
                navigate('/signup');
            } else if (onNavigate) {
                onNavigate('/signup');
            }
        }
    };

    return (
        <header role="banner">
            {/* Top Info Bar */}
            <div className="bg-[#0EA5A4] text-white text-xs py-1.5 px-4 text-center">
                <p>NeighbourNet — Instant emergency response through neighbors</p>
            </div>

            {/* Main Navigation */}
            <nav role="navigation" className="bg-white border-b border-gray-100 px-4 py-3">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#1766E0] flex items-center justify-center">
                            <span className="text-white font-bold text-lg" aria-label="NeighbourNet Logo">NN</span>
                        </div>
                        <span className="text-[#0F172A] font-bold text-xl">NeighbourNet</span>
                    </div>

                    {/* Desktop CTAs */}
                    <div className="hidden md:flex items-center gap-3">
                        <button
                            onClick={handleGetHelp}
                            className="bg-[#1766E0] text-white px-6 py-2.5 rounded-full font-medium hover:bg-[#1557C0] transition-colors"
                            aria-label="Get emergency help"
                        >
                            Get Help
                        </button>
                        <button
                            onClick={handleJoinVolunteer}
                            className="bg-white text-[#1766E0] border-2 border-[#1766E0] px-6 py-2.5 rounded-full font-medium hover:bg-[#F0F7FF] transition-colors"
                            aria-label="Join as volunteer"
                        >
                            Join as Volunteer
                        </button>
                    </div>

                    {/* Mobile CTA */}
                    <div className="md:hidden">
                        <button
                            onClick={handleGetHelp}
                            className="bg-[#1766E0] text-white px-5 py-2 rounded-full font-medium text-sm hover:bg-[#1557C0] transition-colors"
                            aria-label="Get started"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* Skip Link for Accessibility */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-white focus:text-[#1766E0]"
            >
                Skip to main content
            </a>
        </header>
    );
}

export default Header;
