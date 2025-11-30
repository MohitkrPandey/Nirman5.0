const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();

// Mock OAuth - Google
router.post('/google', async (req, res) => {
    try {
        const { email, name } = req.body;

        if (!email || !name) {
            return res.status(400).json({ error: 'Email and name required' });
        }

        // Check if user exists
        let user = await User.findOne({ email });

        if (!user) {
            // Create new user with mock OAuth
            const passwordHash = await bcrypt.hash('oauth-google-' + Date.now(), 10);
            user = new User({
                name,
                email,
                passwordHash,
                role: 'volunteer',
            });
            await user.save();
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Google OAuth Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Mock OAuth - GitHub
router.post('/github', async (req, res) => {
    try {
        const { email, name } = req.body;

        if (!email || !name) {
            return res.status(400).json({ error: 'Email and name required' });
        }

        // Check if user exists
        let user = await User.findOne({ email });

        if (!user) {
            // Create new user with mock OAuth
            const passwordHash = await bcrypt.hash('oauth-github-' + Date.now(), 10);
            user = new User({
                name,
                email,
                passwordHash,
                role: 'volunteer',
            });
            await user.save();
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('GitHub OAuth Error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
