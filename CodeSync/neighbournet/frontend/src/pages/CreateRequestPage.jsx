import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RequestTypesGrid from '../components/RequestTypesGrid';
import LocationInput from '../components/LocationInput';
import { createRequest } from '../lib/api';

function CreateRequestPage() {
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [description, setDescription] = useState('');
    const [contact, setContact] = useState('');
    const [location, setLocation] = useState({ lat: null, lng: null, address: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const isFormValid = () => {
        return (
            selectedTypes.length > 0 &&
            description.trim().length > 0 &&
            description.length <= 500 &&
            contact.trim().length > 0 &&
            location.lat !== null &&
            location.lng !== null
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isFormValid()) {
            setError('Please fill in all required fields');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await createRequest(
                selectedTypes,
                description,
                contact,
                location.lat,
                location.lng,
                location.address
            );

            // Show success message
            alert('Help request created successfully! Nearby volunteers have been notified.');

            // Navigate to map
            navigate('/map');
        } catch (err) {
            setError(err.message || 'Failed to create request');
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen py-12 px-4"
            style={{
                background: 'linear-gradient(135deg, #1766E0 0%, #2FA1FF 100%)'
            }}
        >
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-3xl shadow-2xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-[#0F172A] mb-2">
                            Create Help Request
                        </h1>
                        <p className="text-gray-600">
                            Connect with your community during emergencies
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        {/* Help Types */}
                        <RequestTypesGrid
                            selectedTypes={selectedTypes}
                            onTypesChange={setSelectedTypes}
                        />

                        {/* Description */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe what help you need..."
                                maxLength={500}
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1766E0] focus:border-transparent resize-none"
                            />
                            <div className="text-right text-xs text-gray-500 mt-1">
                                {description.length}/500
                            </div>
                        </div>

                        {/* Contact */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Contact <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={contact}
                                onChange={(e) => setContact(e.target.value)}
                                placeholder="Phone number or email"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1766E0] focus:border-transparent"
                            />
                        </div>

                        {/* Location */}
                        <LocationInput
                            location={location}
                            onLocationChange={setLocation}
                        />

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={!isFormValid() || loading}
                            className="w-full py-4 rounded-full font-bold text-lg text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{
                                background: isFormValid() && !loading
                                    ? 'linear-gradient(90deg, var(--nn-cta-grad-start), var(--nn-cta-grad-end))'
                                    : '#9CA3AF'
                            }}
                        >
                            {loading ? 'Creating Request...' : 'Submit Request'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateRequestPage;
