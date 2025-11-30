import React, { useState } from 'react';

function LocationInput({ location, onLocationChange }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleUseMyLocation = () => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            return;
        }

        setLoading(true);
        setError('');

        navigator.geolocation.getCurrentPosition(
            (position) => {
                onLocationChange({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    address: location.address || 'Current location'
                });
                setLoading(false);
            },
            (error) => {
                setError('Unable to get your location. Please enter manually.');
                setLoading(false);
            }
        );
    };

    return (
        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Location <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
                <input
                    type="text"
                    value={location.address || ''}
                    onChange={(e) => onLocationChange({ ...location, address: e.target.value })}
                    placeholder="Enter address or use current location"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1766E0] focus:border-transparent"
                />
                <button
                    type="button"
                    onClick={handleUseMyLocation}
                    disabled={loading}
                    className="w-full bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {loading ? 'Getting location...' : 'Use my location'}
                </button>
                {error && <p className="text-sm text-red-500">{error}</p>}
                {location.lat && location.lng && (
                    <p className="text-xs text-gray-500">
                        📍 {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                    </p>
                )}
            </div>
        </div>
    );
}

export default LocationInput;
