import React from 'react';

function MetricsRow({ metrics }) {
    return (
        <section className="py-16 px-4 bg-[#F3F4F6]">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {metrics.map((metric, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl p-6 text-center border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="text-4xl font-bold text-[#1766E0] mb-2">
                                {metric.value}
                            </div>
                            <div className="text-sm text-gray-600">
                                {metric.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default MetricsRow;
