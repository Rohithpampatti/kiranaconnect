import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { protect, adminOnly, deliveryOnly } from '../middleware/auth.js';

const router = express.Router();

// Create order
router.post('/', protect, async (req, res) => {
    try {
        const { items, deliveryAddress, paymentMethod } = req.body;

        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({ message: `Product ${item.productId} not found` });
            }

            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity
            });

            totalAmount += product.price * item.quantity;
        }

        const order = await Order.create({
            user: req.user.id,
            items: orderItems,
            totalAmount,
            deliveryAddress,
            paymentMethod
        });

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get user orders
router.get('/my-orders', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort('-createdAt');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all orders (admin)
router.get('/', protect, adminOnly, async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'name email').sort('-createdAt');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get delivery orders
router.get('/delivery/assigned', protect, deliveryOnly, async (req, res) => {
    try {
        const orders = await Order.find({
            deliveryPartner: req.user.id,
            status: { $in: ['out-for-delivery'] }
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update order status
router.put('/:id/status', protect, async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) return res.status(404).json({ message: 'Order not found' });

        // Check permissions
        if (req.user.role === 'delivery' && status === 'delivered') {
            order.status = status;
        } else if (req.user.role === 'admin') {
            order.status = status;
            if (status === 'out-for-delivery') {
                order.deliveryPartner = req.body.deliveryPartner;
            }
        } else {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await order.save();
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;