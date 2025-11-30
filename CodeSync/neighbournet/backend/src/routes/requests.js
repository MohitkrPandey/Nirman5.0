const express = require('express');
const Request = require('../models/request');
const authenticateToken = require('../middlewares/auth');
const { notifyNearbyVolunteers } = require('../sockets/helpers');

const router = express.Router();

// GET /requests (nearby)
router.get('/', async (req, res) => {
    try {
        const { lat, lng, radiusKm = 5 } = req.query;

        if (!lat || !lng) {
            return res.status(400).json({ error: 'Latitude and longitude are required' });
        }

        const radiusMeters = parseFloat(radiusKm) * 1000;

        const requests = await Request.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(lng), parseFloat(lat)]
                    },
                    $maxDistance: radiusMeters
                }
            }
        }).populate('requesterId', 'name email');

        res.json(requests);
    } catch (error) {
        console.error('Get Requests Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST /requests
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { types, description, contact, lat, lng, address } = req.body;

        // Validation
        if (!types || !Array.isArray(types) || types.length === 0) {
            return res.status(400).json({ error: 'At least one type is required' });
        }

        if (!description || description.length > 500) {
            return res.status(400).json({ error: 'Description is required and must be 500 characters or less' });
        }

        if (!contact) {
            return res.status(400).json({ error: 'Contact information is required' });
        }

        if (!lat || !lng) {
            return res.status(400).json({ error: 'Location (lat/lng) is required' });
        }

        // Create request
        const request = new Request({
            requesterId: req.user.userId,
            types,
            description,
            contact,
            location: {
                type: 'Point',
                coordinates: [parseFloat(lng), parseFloat(lat)]
            },
            address: address || '',
            status: 'open'
        });

        await request.save();

        // Notify nearby volunteers
        const io = req.app.get('io');
        const userSocketMap = req.app.get('userSocketMap');

        if (io && userSocketMap) {
            await notifyNearbyVolunteers(io, userSocketMap, request, 5000);
        }

        res.status(201).json(request);
    } catch (error) {
        console.error('Create Request Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST /requests/:id/assign
router.post('/:id/assign', authenticateToken, async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }

        if (request.status !== 'open') {
            return res.status(400).json({ error: 'Request is already assigned or completed' });
        }

        if (request.requesterId.toString() === req.user.userId) {
            return res.status(400).json({ error: 'You cannot assign yourself to your own request' });
        }

        request.assignedTo = req.user.userId;
        request.status = 'assigned';
        request.assignedAt = new Date();
        await request.save();

        // Emit request:update
        const io = req.app.get('io');
        const userSocketMap = req.app.get('userSocketMap');

        if (io && userSocketMap) {
            const requesterSocketId = userSocketMap.get(request.requesterId.toString());
            if (requesterSocketId) {
                io.to(requesterSocketId).emit('request:update', request);
            }
        }

        res.json(request);
    } catch (error) {
        console.error('Assign Request Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// POST /requests/:id/complete
router.post('/:id/complete', authenticateToken, async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }

        const isAssignedVolunteer = request.assignedTo && request.assignedTo.toString() === req.user.userId;
        const isRequester = request.requesterId.toString() === req.user.userId;

        if (!isAssignedVolunteer && !isRequester) {
            return res.status(403).json({ error: 'Not authorized to complete this request' });
        }

        if (request.status === 'completed') {
            return res.status(400).json({ error: 'Request is already completed' });
        }

        request.status = 'completed';
        request.completedAt = new Date();
        await request.save();

        // Emit request:update
        const io = req.app.get('io');
        const userSocketMap = req.app.get('userSocketMap');

        if (io && userSocketMap) {
            const requesterSocketId = userSocketMap.get(request.requesterId.toString());
            if (requesterSocketId) {
                io.to(requesterSocketId).emit('request:update', request);
            }

            if (request.assignedTo) {
                const volunteerSocketId = userSocketMap.get(request.assignedTo.toString());
                if (volunteerSocketId) {
                    io.to(volunteerSocketId).emit('request:update', request);
                }
            }
        }

        res.json(request);
    } catch (error) {
        console.error('Complete Request Error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
