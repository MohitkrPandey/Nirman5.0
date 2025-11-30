import React from 'react';

function FeaturesGrid({ features }) {
    return (
        <section className="py-20 px-4 bg-[#F3F4F6]">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] text-center mb-4">
                    Why Choose NeighbourNet
                </h2>
                <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto">
                    Built for safety, designed for community
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl p-6 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 focus-within:outline focus-within:outline-2 focus-within:outline-[#1766E0] focus-within:outline-offset-2"
                            tabIndex={0}
                        >
                            {/* Icon Placeholder */}
                            <div className="w-12 h-12 rounded-lg bg-[#F0F7FF] flex items-center justify-center mb-4">
                                <svg
                                    className="w-6 h-6 text-[#1766E0]"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>

                            <h3 className="text-xl font-bold text-[#0F172A] mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default FeaturesGrid;
