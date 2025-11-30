import React from 'react';
import { useNavigate } from 'react-router-dom';

function Hero({ title, subtitle, gradientStart, gradientEnd, onNavigate, onGetHelp, onJoinVolunteer }) {
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

    const handleLearnMore = () => {
        document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section
            id="main-content"
            className="relative py-20 px-4 text-white"
            style={{
                background: `linear-gradient(135deg, ${gradientStart} 0%, ${gradientEnd} 100%)`,
            }}
        >
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                    {title}
                </h1>
                <p className="text-lg md:text-xl mb-10 text-white/90 max-w-2xl mx-auto">
                    {subtitle}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                        onClick={handleGetHelp}
                        className="bg-[#12B981] text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#10A574] transition-all hover:scale-105 shadow-lg"
                        aria-label="Get emergency help now"
                    >
                        Get Help Now
                    </button>
                    <button
                        onClick={handleJoinVolunteer}
                        className="bg-white/20 backdrop-blur-sm text-white border-2 border-white/40 px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/30 transition-all"
                        aria-label="Join as volunteer"
                    >
                        Join as Volunteer
                    </button>
                </div>
            </div>
        </section>
    );
}

export default Hero;
