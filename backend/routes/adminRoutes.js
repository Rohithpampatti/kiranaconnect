import express from 'express';
import User from '../models/User.js';
import Order from '../models/Order.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Get all users with stats
router.get('/users', protect, adminOnly, async (req, res) => {
    try {
        const users = await User.find({}).select('-password');

        // Get order stats for each user
        const usersWithStats = await Promise.all(users.map(async (user) => {
            const orders = await Order.find({ user: user._id });
            const totalOrders = orders.length;
            const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);

            return {
                ...user.toObject(),
                totalOrders,
                totalSpent
            };
        }));

        res.json(usersWithStats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update user role
router.put('/users/:id/role', protect, adminOnly, async (req, res) => {
    try {
        const { role } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = role;
        await user.save();
        res.json({ message: 'User role updated', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get dashboard stats
router.get('/stats', protect, adminOnly, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalOrders = await Order.countDocuments();
        const totalRevenue = await Order.aggregate([
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        const totalProducts = await Product.countDocuments();

        res.json({
            totalUsers,
            totalOrders,
            totalRevenue: totalRevenue[0]?.total || 0,
            totalProducts
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;