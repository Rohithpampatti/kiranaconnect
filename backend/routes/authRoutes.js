import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role, phone, address, city, state, pincode } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || 'user',
            phone: phone || '',
            address: address || '',
            city: city || '',
            state: state || '',
            pincode: pincode || '',
            addresses: []
        });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '30d'
        });

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            message: 'User created successfully',
            user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, address: user.address }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '30d'
        });

        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        res.json({
            message: 'Login successful',
            user: { id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, address: user.address }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Logout
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
});

// Get current user
router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update profile
router.put('/update', protect, async (req, res) => {
    try {
        const { name, phone, address, city, state, pincode } = req.body;
        const user = await User.findById(req.user.id);

        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (address) user.address = address;
        if (city) user.city = city;
        if (state) user.state = state;
        if (pincode) user.pincode = pincode;

        await user.save();
        res.json({
            message: 'Profile updated successfully',
            user: { id: user._id, name: user.name, email: user.email, phone: user.phone, address: user.address, city: user.city, state: user.state, pincode: user.pincode }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Change password
router.post('/change-password', protect, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        const isValid = await user.comparePassword(currentPassword);
        if (!isValid) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        user.password = newPassword;
        await user.save();
        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get addresses
router.get('/addresses', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json(user.addresses || []);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add address
router.post('/addresses', protect, async (req, res) => {
    try {
        const { type, address, city, state, pincode, isDefault } = req.body;
        const user = await User.findById(req.user.id);

        if (!user.addresses) user.addresses = [];

        if (isDefault) {
            user.addresses.forEach(addr => addr.isDefault = false);
        }

        const newAddress = {
            id: Date.now().toString(),
            type: type || 'home',
            address,
            city,
            state,
            pincode,
            isDefault: isDefault || false
        };

        user.addresses.push(newAddress);
        await user.save();
        res.json(user.addresses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update address
router.put('/addresses/:id', protect, async (req, res) => {
    try {
        const { type, address, city, state, pincode, isDefault } = req.body;
        const user = await User.findById(req.user.id);

        const addressIndex = user.addresses.findIndex(addr => addr.id === req.params.id);
        if (addressIndex === -1) {
            return res.status(404).json({ message: 'Address not found' });
        }

        if (isDefault) {
            user.addresses.forEach(addr => addr.isDefault = false);
        }

        user.addresses[addressIndex] = {
            ...user.addresses[addressIndex],
            type: type || user.addresses[addressIndex].type,
            address: address || user.addresses[addressIndex].address,
            city: city || user.addresses[addressIndex].city,
            state: state || user.addresses[addressIndex].state,
            pincode: pincode || user.addresses[addressIndex].pincode,
            isDefault: isDefault || false
        };

        await user.save();
        res.json(user.addresses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete address
router.delete('/addresses/:id', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.addresses = user.addresses.filter(addr => addr.id !== req.params.id);
        await user.save();
        res.json(user.addresses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;