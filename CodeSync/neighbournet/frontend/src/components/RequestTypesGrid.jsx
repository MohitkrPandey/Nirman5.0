import React, { useState } from 'react';

const helpTypes = [
    { id: 'food', label: 'Food', icon: '🍽️' },
    { id: 'medical', label: 'Medical', icon: '🏥' },
    { id: 'rescue', label: 'Rescue', icon: '🚨' },
    { id: 'transport', label: 'Transport', icon: '🚗' },
    { id: 'shelter', label: 'Shelter', icon: '🏠' },
    { id: 'water', label: 'Water', icon: '💧' },
    { id: 'power', label: 'Power', icon: '⚡' },
];

function RequestTypesGrid({ selectedTypes, onTypesChange }) {
    const toggleType = (typeId) => {
        if (selectedTypes.includes(typeId)) {
            onTypesChange(selectedTypes.filter(t => t !== typeId));
        } else {
            onTypesChange([...selectedTypes, typeId]);
        }
    };

    return (
        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
                Help Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {helpTypes.map((type) => (
                    <button
                        key={type.id}
                        type="button"
                        onClick={() => toggleType(type.id)}
                        aria-pressed={selectedTypes.includes(type.id)}
                        className={`p-4 rounded-xl border-2 transition-all ${selectedTypes.includes(type.id)
                                ? 'border-[#1766E0] bg-[#F0F7FF] shadow-md'
                                : 'border-gray-200 hover:border-[#1766E0] hover:bg-gray-50'
                            }`}
                    >
                        <div className="text-3xl mb-2">{type.icon}</div>
                        <div className="text-sm font-medium text-gray-900">{type.label}</div>
                    </button>
                ))}
            </div>
            {selectedTypes.length === 0 && (
                <p className="text-xs text-gray-500 mt-2">Select at least one help type</p>
            )}
        </div>
    );
}

export default RequestTypesGrid;
