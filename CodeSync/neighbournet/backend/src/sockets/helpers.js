const User = require('../models/user');

async function notifyNearbyVolunteers(io, userSocketMap, requestDoc, radiusMeters = 5000) {
    try {
        // Find volunteers within radius using geo query
        const volunteers = await User.find({
            role: 'volunteer',
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: requestDoc.location.coordinates
                    },
                    $maxDistance: radiusMeters
                }
            }
        });

        console.log(`Found ${volunteers.length} volunteers within ${radiusMeters}m`);

        // Emit to each volunteer's socket
        volunteers.forEach(volunteer => {
            const socketId = userSocketMap.get(volunteer._id.toString());
            if (socketId) {
                io.to(socketId).emit('request:nearby', requestDoc);
                console.log(`Notified volunteer ${volunteer._id} via socket ${socketId}`);
            }
        });

        return volunteers.length;
    } catch (error) {
        console.error('Error notifying nearby volunteers:', error);
        return 0;
    }
}

module.exports = { notifyNearbyVolunteers };
