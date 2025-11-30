const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    requesterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    types: {
        type: [String],
        enum: ['food', 'medical', 'rescue', 'transport', 'shelter', 'water', 'power', 'other'],
        required: true,
        validate: {
            validator: function (v) {
                return v && v.length > 0;
            },
            message: 'At least one type is required'
        }
    },
    description: {
        type: String,
        required: true,
        maxlength: 500,
    },
    contact: {
        type: String,
        required: true,
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    },
    address: {
        type: String,
    },
    status: {
        type: String,
        enum: ['open', 'assigned', 'completed'],
        default: 'open',
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    assignedAt: {
        type: Date,
    },
    completedAt: {
        type: Date,
    },
}, { timestamps: true });

requestSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Request', requestSchema);
