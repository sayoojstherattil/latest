const { UserModel } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthController {
    static async register(req, res) {
        try {
            const { email, password } = req.body;

            // Check if user already exists
            const existingUser = await UserModel.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({ error: 'User already exists' });
            }

            // Create user
            const userId = await UserModel.create(email, password);

            // Generate token
            const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

            res.status(201).json({ token, userId });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async login(req, res) {
        try {
            const { email, password } = req.body;

            // Find user
            const user = await UserModel.findByEmail(email);
            if (!user) {
                return res.status(400).json({ error: 'Invalid credentials' });
            }

            // Check password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ error: 'Invalid credentials' });
            }

            // Generate token
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

            res.json({ token, userId: user.id });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = {
    authMiddleware,
    AuthController
};