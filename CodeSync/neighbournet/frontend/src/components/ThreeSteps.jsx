import React from 'react';

function ThreeSteps({ steps }) {
    return (
        <section id="how-it-works" className="py-20 px-4 bg-white">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] text-center mb-4">
                    How It Works
                </h2>
                <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto">
                    Getting help from your neighbors is simple and fast
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {steps.map((step, index) => (
                        <div key={index} className="text-center">
                            {/* Icon Placeholder */}
                            <div className="relative inline-block mb-6">
                                <div className="w-20 h-20 rounded-full bg-[#F0F7FF] flex items-center justify-center">
                                    <svg
                                        className="w-10 h-10 text-[#1766E0]"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 10V3L4 14h7v7l9-11h-7z"
                                        />
                                    </svg>
                                </div>
                                {/* Numbered Badge */}
                                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#12B981] text-white flex items-center justify-center font-bold text-sm">
                                    {index + 1}
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-[#0F172A] mb-3">
                                {step.title}
                            </h3>
                            <p className="text-gray-600">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default ThreeSteps;
